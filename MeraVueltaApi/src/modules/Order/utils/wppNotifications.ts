import Boom from '@hapi/boom';
import { EntityManager } from 'typeorm';
import { Order, statusOrder } from '../../../entities/order';
import { ErrorMessages } from '../../../utils/errors';
import { User } from '../../../entities/users';
import { MessageConfig } from '../../../entities/messageConfig';
import { sendMessage } from '../../../utils/whatsapp';

const getConfigurableMessage = async (
  manager: EntityManager, 
  companyId: string, 
  messageKey: string, 
  defaultMessage: string
): Promise<string> => {
  try {
    const messageConfig = await manager.findOne(MessageConfig, {
      where: { 
        messageKey: messageKey, 
        company: { id: companyId },
        isActive: true 
      }
    });
    
    return messageConfig?.messageText || defaultMessage;
  } catch (error) {
    return defaultMessage;
  }
};

export const sendWppMessage = async (order: Order, manager: EntityManager): Promise<any> => {
  const urlFrond = process.env.HOST_FROND;
  const userCompany = await manager.findOne(User, { where: { id: order.company } });
  const userDomiciliary = await manager.findOne(User, { where: { id: order.domiciliary?.id } });
  const numberClient = order.clientPhone;
  const prefixClient = order.prefix;
  try {
    if (order.orderState === statusOrder.WAIT_DISPATCH) {
      if (userCompany) {
        if (order.deliveryNumber &&
          order.purchaseNumber &&
          order.name &&
          order.lastName &&
          order.clientPhone &&
          order.creationDate &&
          order.department &&
          order.city &&
          order.neighborhood &&
          order.residentialGroupName &&
          order.houseNumberOrApartment &&
          order.orderState &&
          order.pickupAddress
        ) {
          await sendMessage(
            `Hola ${userCompany.companyName}, la vuelta con el numero de compra ${order.purchaseNumber} ya tiene toda la información de entrega, para asignar un domiciliario, aquí podrá añadirlo ${urlFrond}/company/editorder/${order?.deliveryNumber}`,
            `${userCompany.prefix}${userCompany.clientPhone}`,
            manager,
            userCompany,
          );
        } else {
          await sendMessage(
            `Hola ${userCompany.companyName}, tienes una vuelta con el numero de compra ${order.purchaseNumber} pendiente de la información de entrega, aquí podrá editarla ${urlFrond}/company/editorder/${order?.deliveryNumber}, o puede enviar la orden al cliente`,
            `${userCompany.prefix}${userCompany.clientPhone}`,
            manager,
            userCompany,
          );
          if (order.clientPhone) {
            const clientMessage = await getConfigurableMessage(
              manager,
              userCompany.id.toString(),
              'CLIENT_FILL_DATA',
              `Tienes una vuelta, de la empresa ${userCompany.companyName} con el numero de entrega ${order?.purchaseNumber}, por favor llena los datos en esta URL, ${urlFrond}/takeOrder/${order?.deliveryNumber}`
            );
            
            const messageWithPlaceholders = clientMessage
              .replace('{companyName}', userCompany.companyName)
              .replace('{purchaseNumber}', order?.purchaseNumber?.toString() || '')
              .replace('{deliveryNumber}', order?.deliveryNumber?.toString() || '')
              .replace('{url}', `${urlFrond}/takeOrder/${order?.deliveryNumber}`);
              
            await sendMessage(
              messageWithPlaceholders,
              `${order.prefix}${order.clientPhone}`,
              manager,
              userCompany,
            );
          } else {
            await sendMessage(
              `URL de la vuelta, ${urlFrond}/takeOrder/${order?.deliveryNumber}`,
              `${userCompany.prefix}${userCompany.clientPhone}`,
              manager,
              userCompany,
            );
          }
        }
      } else {
        throw Boom.badGateway(ErrorMessages.ERROR_WHATSAPP_NOT_FOUND);
      }
    } else if (order.orderState === statusOrder.WAIT_EXIT) {
      if (userCompany && userDomiciliary) {
        await sendMessage(
          `Tienes un nueva vuelta de la empresa ${userCompany.companyName} con el numero de entrega ${order?.purchaseNumber}, Recoger en: ${userCompany?.address}, entregar en ${order.deliveryAddress}, ingrese al APP de domiciliario para aceptar esta orden o rechazarla`,
          `${userDomiciliary.prefix}${userDomiciliary.clientPhone}`,
          manager,
          userCompany,
        );
      } else {
        throw Boom.badGateway(ErrorMessages.ERROR_WHATSAPP_NOT_FOUND);
      }
    } else if (order.orderState === statusOrder.AGREE) {
      if (numberClient && prefixClient && userCompany && userDomiciliary) {
        await sendMessage(
          `Hola ${userCompany.companyName}, El domiciliario ${userDomiciliary.name} ${userDomiciliary.lastName} ya acepto la orden ${order.purchaseNumber}, Celular +${userDomiciliary.prefix}${userDomiciliary.clientPhone} whatsapp: https://wa.me/+${userDomiciliary.prefix}${userDomiciliary.clientPhone}`,
          `${userCompany.prefix}${userCompany.clientPhone}`,
          manager,
          userCompany,
        );
      } else {
        throw Boom.badGateway(ErrorMessages.ERROR_WHATSAPP_NOT_FOUND);
      }
    } else if (order.orderState === statusOrder.EXIT) {
      if (numberClient && prefixClient && userCompany && userDomiciliary) {
        await sendMessage(
          `Hola ${order.name} ${order?.lastName}, El domiciliario ${userDomiciliary.name} ${userDomiciliary.lastName} acepto la orden ${order.purchaseNumber} y esta en camino, Celular +${userDomiciliary.prefix}${userDomiciliary.clientPhone} whatsapp: https://wa.me/+${userDomiciliary.prefix}${userDomiciliary.clientPhone}.`,
          `${prefixClient}${numberClient}`,
          manager,
          userCompany,
        );
        await sendMessage(
          `Si tienes alguna inquietud también puedes comunicarte con ${userCompany.companyName}. Celular +${userCompany.prefix}${userCompany.clientPhone} whatsapp: https://wa.me/+${userCompany.prefix}${userCompany.clientPhone}`,
          `${prefixClient}${numberClient}`,
          manager,
          userCompany,
        );
        await sendMessage(
          `Puedes hacer seguimiento del domicilio desde la siguiente URL ${urlFrond}/map/${order?.deliveryNumber}`,
          `${prefixClient}${numberClient}`,
          manager,
          userCompany,
        );
        await sendMessage(
          `El pedido con numero de compra ${order.purchaseNumber} ya salio a ruta, la vuelta esta a cargo del domiciliario ${userDomiciliary.name} ${userDomiciliary.lastName}, Celular +${userDomiciliary.prefix}${userDomiciliary.clientPhone} whatsapp: https://wa.me/+${userDomiciliary.prefix}${userDomiciliary.clientPhone}`,
          `${userCompany.prefix}${userCompany.clientPhone}`,
          manager,
          userCompany,
        );
        await sendMessage(
          `Puedes hacer seguimiento del domicilio desde la siguiente URL ${urlFrond}/map/${order?.deliveryNumber}`,
          `${userCompany.prefix}${userCompany.clientPhone}`,
          manager,
          userCompany,
        );
      } else {
        throw Boom.badGateway(ErrorMessages.ERROR_WHATSAPP_NOT_FOUND);
      }
    } else if (order.orderState === statusOrder.DELIVERED) {
      if (numberClient && prefixClient && userCompany && userDomiciliary) {
        await sendMessage(
          `Tu pedido de ${userCompany.companyName} con numero de compra ${order.purchaseNumber} fue entregado, aquí podrás ver el detalle ${urlFrond}/takeOrder/${order?.deliveryNumber}`,
          `${prefixClient}${numberClient}`,
          manager,
          userCompany,
        );
        await sendMessage(
          `Si tienes alguna inquietud también puedes comunicarte con ${userCompany.companyName}. Celular +${userCompany.prefix}${userCompany.clientPhone} whatsapp: https://wa.me/+${userCompany.prefix}${userCompany.clientPhone}`,
          `${prefixClient}${numberClient}`,
          manager,
          userCompany,
        );
        await sendMessage(
          `El pedido con numero de compra ${order.purchaseNumber} fue entregado, aquí podrás ver el detalle ${urlFrond}/takeOrder/${order?.deliveryNumber}`,
          `${userCompany.prefix}${userCompany.clientPhone}`,
          manager,
          userCompany,
        );
      } else {
        throw Boom.badGateway(ErrorMessages.ERROR_WHATSAPP_NOT_FOUND);
      }
    }
  } catch (error) {
    console.error('Create order error', error);
    throw Boom.badGateway(ErrorMessages.ERROR_WHATSAPP_UNEXPECTED);
  }
};

const messageQueue: any = [];
let isProcessing = false;
export const sendWppMessageCache = async (order: Order, manager: EntityManager) => {
  messageQueue.push({ order, manager });
  if (!isProcessing) {
    processQueue();
  }
};

const processQueue = async () => {
  isProcessing = true;
  while (messageQueue.length > 0) {
    console.info('estado de la cola', messageQueue.length, 'cola');
    const { order, manager } = messageQueue.shift();
    try {
      await sendWppMessage(order, manager);
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }
  isProcessing = false;
};