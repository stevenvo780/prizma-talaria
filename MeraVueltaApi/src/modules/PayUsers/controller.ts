import { EntityManager } from 'typeorm';
import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { ErrorMessages } from '../../utils/errors';
import { Wompi } from '../../entities/wompi';
import { WompiLog } from '../../entities/wompiLog';
import axios from 'axios';
import config from '../../config';
import { User } from '../../entities/users';
import { v4 as uuidv4 } from 'uuid';
import { encrypt } from '../../utils/encrypt';

/**
 * Wompi
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<any>}
 */
export async function payUsers(req: Hapi.request): Promise<{
  plan: string;
  validatePay: string;
}> {
  try {
    const manager: EntityManager = req.server.app.connection.manager;
    const userId = req.auth.credentials.id;
    const user = await manager.findOne(User, { where: { id: userId } });
    if (!user) {
      throw Boom.notFound(ErrorMessages.ERROR_USER_NOT_FOUND);
    }

    const referenceCode = uuidv4();
    const payData = req.payload;
    const typePlan = payData.typePlan;
    const findPlanInConfig = config.payValues.plans.find((plan) => plan.id === typePlan);
    if (!findPlanInConfig) {
      throw Boom.notFound(ErrorMessages.ERROR_PLAN_NOT_FOUND);
    }

    const creditCardData = {
      number: payData.creditCard.number,
      exp_month: payData.creditCard.expirationDate.split('/')[1],
      exp_year: payData.creditCard.expirationDate.split('/')[0].slice(-2),
      cvc: payData.creditCard.securityCode,
      card_holder: payData.creditCard.name,
    };

    const creditCardTokenResponse = await axios.post(
      `${process.env.WOMPI_URL}/tokens/cards`,
      creditCardData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.WOMPI_PUBLIC_KEY}`
        }
      }
    );
    if (creditCardTokenResponse.data.errors) {
      throw Boom.badRequest(creditCardTokenResponse.data.errors);
    }

    const creditCardToken = creditCardTokenResponse.data.data;

    const creditCardRePayData = {
      type: 'CARD',
      token: creditCardToken.id,
      customer_email: payData.emailAddress,
      acceptance_token: payData.token,
    };

    const creditCardTokenRePayResponse = await axios.post(
      `${process.env.WOMPI_URL}/payment_sources`,
      creditCardRePayData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.WOMPI_PRIVATE_KEY}`
        }
      }
    );

    if (creditCardTokenRePayResponse.data.errors) {
      throw Boom.badRequest(creditCardTokenRePayResponse.data.errors);
    }

    const creditCardRePayToken = creditCardTokenRePayResponse.data.data;
    const wompiData = {
      acceptance_token: payData.token,
      amount_in_cents: findPlanInConfig.count * findPlanInConfig.transaction * 100,
      currency: 'COP',
      customer_email: payData.emailAddress,
      payment_method: {
        installments: 1,
      },
      payment_source_id: creditCardRePayToken.id,
      reference: referenceCode,
    };
    const response = await axios.post(
      `${process.env.WOMPI_URL}/transactions`,
      wompiData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.WOMPI_PRIVATE_KEY}`
        }
      }
    );
    if (response.data.errors) {
      throw Boom.badRequest(response.data.errors);
    }

    const transaction = response.data.data;
    const encryptTransaction = encrypt(JSON.stringify(transaction), process.env.WOMPI_TOKEN_SECRET);
    const wompiLog = new WompiLog();
    wompiLog.jsonResponse = encryptTransaction;
    wompiLog.user = user;
    try {
      await manager.save(wompiLog);
    } catch (error) {
      console.error('WompiLog', error);
      throw Boom.badGateway(ErrorMessages.ERROR_WOMPI_ERROR);
    }

    let wompi = await manager.findOne(Wompi, { where: { user: userId } });
    if (!wompi) {
      wompi = new Wompi();
      wompi.createdAt = new Date();
    }
    if (transaction.status === 'APPROVED' || transaction.status === 'PENDING') {
      delete payData.creditCard;
      const tokenEncrypt = encrypt(creditCardRePayToken.id.toString(), process.env.WOMPI_TOKEN_SECRET);
      const dataUserEncrypt = encrypt(JSON.stringify(payData), process.env.WOMPI_TOKEN_SECRET);
      const currentDate = new Date();
      const creationDate = new Date(wompi.createdAt);
      const differenceInTime = currentDate.getTime() - creationDate.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      if (differenceInDays > 30) {
        wompi.createdAt = currentDate;
      }
      wompi.user = user;
      wompi.dataUser = dataUserEncrypt;
      wompi.tokenPay = tokenEncrypt;
      wompi.transactionId = transaction.id;
      wompi.plan = typePlan;
      wompi.status = transaction.status;
      await manager.save(wompi);
      return {
        plan: wompi.plan,
        validatePay: transaction.status
      };
    }
    throw Boom.badGateway(ErrorMessages.ERROR_WOMPI_ERROR);
  } catch (error) {
    console.error('wompi', JSON.parse(JSON.stringify(error)));
    throw Boom.badGateway(ErrorMessages.ERROR_WOMPI_ERROR);
  }
}

export async function validatePay(req: Hapi.request): Promise<string> {
  try {
    const manager: EntityManager = req.server.app.connection.manager;
    const payload = req.payload.data;
    let wompi = await manager.findOne(Wompi, { where: { transactionId: payload.transaction.id }, relations: ['user'] });
    if (!wompi) {
      const tokenDecrypt = encrypt(payload.payment_source.id.toString(), process.env.WOMPI_TOKEN_SECRET);
      wompi = await manager.findOne(Wompi, { where: { tokenPay: tokenDecrypt } });
      if (!wompi) {
        throw Boom.notFound(ErrorMessages.ERROR_WOMPI_NOT_FOUND);
      }
    }
    const user = await manager.findOne(User, { where: { id: wompi.user.id } });
    if (!user) {
      throw Boom.notFound(ErrorMessages.ERROR_USER_NOT_FOUND);
    }
    const transaction = payload;
    const encryptTransaction = encrypt(JSON.stringify(transaction), process.env.WOMPI_TOKEN_SECRET);
    const wompiLog = new WompiLog();
    wompiLog.jsonResponse = encryptTransaction;
    wompiLog.user = user;
    try {
      await manager.save(wompiLog);
    } catch (error) {
      console.error('WompiLog', error);
      throw Boom.badGateway(ErrorMessages.ERROR_WOMPI_ERROR);
    }
    if (payload.transaction) {
      if (payload.transaction.status === 'APPROVED') {
        wompi.valid = true;
        wompi.transactionId = payload.transaction.id;
        const currentDate = new Date();
        const creationDate = new Date(wompi.createdAt);
        const differenceInTime = currentDate.getTime() - creationDate.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        if (differenceInDays > 30) {
          wompi.createdAt = currentDate;
        }
        wompi.status = 'APPROVED';
        await manager.save(wompi);
        return 'APPROVED';
      } else if (payload.transaction.status === 'PENDING') {
        wompi.valid = false;
        wompi.transactionId = payload.transaction.id;
        wompi.status = 'PENDING';
        await manager.save(wompi);
        return 'PENDING';
      } else if (payload.transaction.status === 'DECLINED') {
        const currentDate = new Date();
        const creationDate = new Date(wompi.createdAt);
        const differenceInTime = currentDate.getTime() - creationDate.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        if (differenceInDays > 30) {
          wompi.valid = false;
          wompi.transactionId = payload.transaction.id;
          wompi.status = 'DECLINED';
          await manager.save(wompi);
        }
      }
    }
    return 'DECLINED';
  } catch (error) {
    console.error('get all Wompi Error', error);
    throw Boom.badGateway(ErrorMessages.ERROR_WOMPI_ERROR);
  }
}

export async function cancelSubscription(req: Hapi.request): Promise<boolean> {
  try {
    const manager: EntityManager = req.server.app.connection.manager;
    const userId = req.auth.credentials.id;
    const user = await manager.findOne(User, { where: { id: userId } });
    if (!user) {
      throw Boom.notFound(ErrorMessages.ERROR_USER_NOT_FOUND);
    }
    const wompi = await manager.findOne(Wompi, { where: { user: userId } });
    if (wompi) {
      await manager.remove(wompi);
      return true;
    }
    return false;
  } catch (error) {
    console.error('get all Wompi Error', error);
    throw Boom.badGateway(ErrorMessages.ERROR_WOMPI_ERROR);
  }
}
