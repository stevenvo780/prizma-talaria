import { EntityManager, MoreThanOrEqual, Between } from 'typeorm';
import Boom from '@hapi/boom';
import { ErrorMessages } from '../../utils/errors';
import axios from 'axios';
import { User } from '../../entities/users';
import { Order } from '../../entities/order';
import { DomiciliaryCompany } from '../../entities/domiciliaryCompany';
import config from '../../config';
import { Wompi } from '../../entities/wompi';
import { v4 as uuidv4 } from 'uuid';
import { WompiLog } from '../../entities/wompiLog';
import { encrypt, decrypt } from '../../utils/encrypt';

/**
 * Get transaction status
 * @param {string} transactionId Transaction id.
 * @returns {Promise<string>}
 *
 */
export async function getTransactionStatus(transactionId: any): Promise<string> {
  const responseToken = await axios.get(
    `${process.env.WOMPI_URL}/transactions/${transactionId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.WOMPI_PRIVATE_KEY}`
      }
    }
  );
  const jsonValidate = responseToken.data;
  const transactionStatus = jsonValidate?.data?.status;
  return transactionStatus;
}


/**
 * Validate payment
 * @param {Hapi.request} req Request.
 * @returns {Promise<PositionUser[]>}
 *
 */
export async function validatePayment(user: User, manager: EntityManager): Promise<boolean> {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const orders = await manager.createQueryBuilder(Order, 'order')
    .where('order.createdAt >= :lastMonth', { lastMonth })
    .andWhere('order.company = :company', { company: user.id })
    .getMany();
  if (orders.length <= config.payValues.free) {
    return true;
  }
  const payUser = await manager.findOne(Wompi, { where: { user: user.id } });
  if (!payUser) {
    return false;
  }
  const dataToken = await getTransactionStatus(payUser.transactionId);

  if (dataToken === 'APPROVED') {
    payUser.valid = true;
    payUser.status = 'APPROVED';
    await manager.save(payUser);
    return true;
  } else if (dataToken === 'DECLINED') {
    payUser.valid = false;
    payUser.status = 'DECLINED';
    await manager.save(payUser);
    return false;
  } else {
    payUser.valid = false;
    payUser.status = 'PENDING';
    await manager.save(payUser);
  }
  return false;
}

export const validatePayInUser = async (manager: EntityManager, user: User, ordersCreate = 0): Promise<boolean> => {
  const now = new Date();
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const payUser = await manager.findOne(Wompi, { where: { user: user.id } });
  const domiciliaryCompany = await manager.find(DomiciliaryCompany, { where: { company: user.id } });
  const orders = await manager.find(Order, {
    where: {
      company: user.id,
      createdAt: MoreThanOrEqual(oneMonthAgo)
    }
  });
  if (!payUser) {
    if (orders.length + ordersCreate <= config.payValues.free) {
      return true;
    } else {
      if (domiciliaryCompany.length <= config.payValues.freeDomiciliary) {
        return true;
      } else if (domiciliaryCompany.length >= config.payValues.freeDomiciliary) {
        throw Boom.notFound(ErrorMessages.ERROR_USER_NOT_PAY_DOMICILIARY);
      }
      throw Boom.notFound(ErrorMessages.ERROR_USER_NOT_PAY);
    }
  }

  await validatePayment(user, manager);

  const payUserMonth = await manager.createQueryBuilder(Wompi, 'payUsers')
    .where('payUsers.user = :user', { user: user.id })
    .andWhere('payUsers.createdAt >= :oneMonthAgo', { oneMonthAgo })
    .orderBy('payUsers.createdAt', 'DESC')
    .getOne();

  if (!payUserMonth) {
    if (orders.length + ordersCreate <= config.payValues.free) {
      return true;
    } else {
      rePay(manager, user.id);
      throw Boom.notFound(ErrorMessages.ERROR_USER_NOT_PAY);
    }
  }
  if (payUserMonth.valid === false && payUserMonth.status === 'DECLINED') {
    throw Boom.notFound(ErrorMessages.ERROR_USER_NOT_PAY);
  }
  if (payUserMonth.valid === false && payUserMonth.status === 'PENDING') {
    throw Boom.notFound('Su pago se encuentra en proceso de validación.');
  } else if (payUserMonth.valid === false) {
    throw Boom.notFound(ErrorMessages.ERROR_USER_NOT_PAY);
  }

  const typePlan = payUserMonth.plan;
  const findPlanInConfig = config.payValues.plans.find((plan) => plan.id === typePlan);
  if (!findPlanInConfig) {
    throw Boom.notFound(ErrorMessages.ERROR_PLAN_NOT_FOUND);
  }

  if (domiciliaryCompany.length > findPlanInConfig.domiciliarys) {
    throw Boom.badRequest(ErrorMessages.ERROR_USER_NOT_PAY_DOMICILIARY);
  }

  const validatePay = payUserMonth.valid;

  return validatePay;
};


/**
 * Wompi rePay.
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<any>}
 */
export async function rePay(manager: EntityManager, userId: number): Promise<{
  plan: string;
  validatePay: string;
}> {
  const user = await manager.findOne(User, { where: { id: userId } });
  if (!user) {
    throw Boom.notFound(ErrorMessages.ERROR_USER_NOT_FOUND);
  }
  const wompi = await manager.findOne(Wompi, { where: { user: user.id } });
  if (!wompi) {
    throw Boom.notFound(ErrorMessages.ERROR_WOMPI_NOT_FOUND);
  }

  const userData = decrypt(wompi.dataUser, process.env.WOMPI_TOKEN_SECRET);
  const payData = JSON.parse(userData);
  const tokenPay = decrypt(wompi.tokenPay, process.env.WOMPI_TOKEN_SECRET);

  const referenceCode = uuidv4();
  const findPlanInConfig = config.payValues.plans.find((plan) => plan.id === wompi.plan);
  if (!findPlanInConfig) {
    throw Boom.notFound(ErrorMessages.ERROR_PLAN_NOT_FOUND);
  }

  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const orders = await manager.find(Order, { where: { company: userId, createdAt: Between(firstDay, lastDay) } });
  let value = 0;
  orders.forEach(() => {
    value += findPlanInConfig.transaction;
  });
  if (findPlanInConfig.count < orders.length) {
    value = value - (findPlanInConfig.count * findPlanInConfig.transaction);
    value = value + (findPlanInConfig.count * findPlanInConfig.transaction);
  } else {
    value = findPlanInConfig.count * findPlanInConfig.transaction;
  }

  const wompiData = {
    amount_in_cents: value * 100,
    currency: 'COP',
    customer_email: payData.emailAddress,
    payment_method: {
      installments: 1,
    },
    payment_source_id: tokenPay,
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
  wompi.createdAt = new Date();
  wompi.valid = false;
  wompi.status = transaction.status;
  wompi.transactionId = transaction.id;
  await manager.save(wompi);
  return {
    plan: wompi.plan,
    validatePay: transaction.status
  };
}
