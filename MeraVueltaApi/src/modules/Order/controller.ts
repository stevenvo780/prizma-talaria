import { EntityManager } from 'typeorm';
import Hapi from '@hapi/hapi';
import { User } from '../../entities/users';
import { Order } from '../../entities/order';
import { Customer } from '../../entities/customer';

import Boom from '@hapi/boom';
import {
  getOrderByUserDomiciliaryService,
  getOrderByCompanyService,
  getOrderByOrderIdService,
  getOrderByCompanyForStatusService,
  getAllOrderService,
  createOrderService,
  updateOrderService,
  deleteOrderService,
  searchOrdersService,
  searchOrdersServiceByDomiciliary,
  searchOrdersAllService,
  createMassiveOrderService,
  updateMassiveOrderService,
  validateTracingService,
  deleteOrderMassiveService
} from './services';
import { OrderInterfaceRequest, SheetsOrderAutomatic } from './types';

/**
 * Search orders for word by name, lastName , deliveryNumber, deliveryNumber, documentNumber, email and clientPhone
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Order[]>}
 */
export async function validateTracing(req: Hapi.Request): Promise<boolean> {
  const manager: EntityManager = req.server.app.connection.manager;
  const userId = req.auth.credentials.id;
  return await validateTracingService(manager, userId);
}

/**
 * Search orders for word by name, lastName , deliveryNumber, deliveryNumber, documentNumber, email and clientPhone
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Order[]>}
 */
export async function searchOrdersAll(req: Hapi.Request): Promise<Order[]> {
  const manager: EntityManager = req.server.app.connection.manager;
  const { word, take, skip } = req.query;
  const userId = req.auth.credentials.id;
  return await searchOrdersAllService(manager, word, userId, take, skip);
}

/**
 * Search orders for word by name, lastName , deliveryNumber, deliveryNumber, documentNumber, email and clientPhone
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Order[]>}
 */
export async function searchOrders(req: Hapi.Request): Promise<Order[]> {
  const manager: EntityManager = req.server.app.connection.manager;
  const { word, state, orderQuery, take, skip } = req.query;
  const userId = req.auth.credentials.id;
  return await searchOrdersService(manager, word, state, orderQuery, userId, take, skip);
}

/**
 * Search orders for word by name, lastName , deliveryNumber, deliveryNumber, documentNumber, email and clientPhone
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Order[]>}
 */
export async function searchOrdersByDomiciliary(req: Hapi.Request): Promise<Order[]> {
  const manager: EntityManager = req.server.app.connection.manager;
  const userId = req.auth.credentials.id;
  const { word, orderQuery, domiciliaryId, state } = req.query;
  return await searchOrdersServiceByDomiciliary(manager, userId, state, word, orderQuery, domiciliaryId);
}

/**
 * Returns a orderProduct
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Order[]>}
 */
export async function getOrderByUserDomiciliary(
  req: Hapi.request
): Promise<Order[]> {
  const manager: EntityManager = req.server.app.connection.manager;
  const userId = req.auth.credentials.id;
  const { take, skip, orderQuery, state, company } = req.query;
  return await getOrderByUserDomiciliaryService(manager, userId, company, state, take, skip, orderQuery);
}

/**
 * Returns a order by Company
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Order[]>}
 */
export async function getOrderByCompany(req: Hapi.request): Promise<Order[]> {
  const manager: EntityManager = req.server.app.connection.manager;
  const companyId = req.params.id;
  const userId = req.auth.credentials.id;
  const { take, skip } = req.query;
  return await getOrderByCompanyService(manager, userId, companyId, take, skip);
}

/**
 * Returns a order by Company
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Order[]>}
 */
export async function getOrderByOrderId(req: Hapi.request): Promise<Order> {
  const manager: EntityManager = req.server.app.connection.manager;
  const orderId = req.params.orderId;
  return await getOrderByOrderIdService(manager, orderId.toString());
}

/**
 * Returns a order by Company
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Order[]>}
 */
export async function getOrderByCompanyForStatus(req: Hapi.request): Promise<Order[]> {
  const manager: EntityManager = req.server.app.connection.manager;
  const userId = req.auth.credentials.id;
  const status = req.params.status;
  const { take, skip, orderQuery } = req.query;
  return await getOrderByCompanyForStatusService(manager, userId, status, take, skip, orderQuery);
}

/**
 * Return all orders
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Order[]>}
 */
export const getAllOrder = async (req: Hapi.request): Promise<Order[]> => {
  const manager: EntityManager = req.server.app.connection.manager;
  const { take, skip } = req.query;
  const userId = req.auth.credentials.id;
  return await getAllOrderService(manager, userId, take, skip);
};

/**
 * Create massive order
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Order[]>}
 */
export async function createMassiveOrder(
  req: Hapi.request
): Promise<{ status: string, order: Order }[]> {
  const manager: EntityManager = req.server.app.connection.manager;
  const orderData: SheetsOrderAutomatic[] = req.payload.orders;
  const userId = req.auth.credentials.id;
  const user = await manager.findOne(User, { where: { id: userId } });
  if (!user) {
    throw Boom.badRequest('User not found but not resolve google sheets');
  }
  const order = await createMassiveOrderService(manager, orderData, user);
  return order;
}

/**
 * Create massive order
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Order[]>}
 */
export async function updateByDomiciliaryMassiveOrder(
  req: Hapi.request
): Promise<{ status: string, order: Order }[]> {
  try {
    const manager: EntityManager = req.server.app.connection.manager;
    const orderData: OrderInterfaceRequest[] = req.payload.orders;
    if (orderData.length === 0) {
      throw Boom.badRequest('Orders is empty');
    }
    const userId = orderData[0].company;
    const user = await manager.findOne(User, { where: { id: userId } });
    if (!user) {
      throw Boom.badRequest('User not found but not resolve google sheets');
    }
    for (let index = 0; index < orderData.length; index++) {
      const order = orderData[index];
      const dataOrder = await manager.findOne(Order, { where: { purchaseNumber: order.purchaseNumber, company: user.id }, relations: ['domiciliary'] });
      if (dataOrder) {
        Object.assign(dataOrder, order);
        Object.assign(orderData[index], dataOrder);
        const domiciliary: any = dataOrder.domiciliary?.id ? dataOrder.domiciliary.id.toString() : dataOrder.domiciliary;
        orderData[index].domiciliary = domiciliary;
      }
    }
    const order = await updateMassiveOrderService(manager, orderData, user);
    return order;
  } catch (error) {
    console.error(error);
    throw Boom.badRequest('error');
  }

}

/**
 * Create massive order
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Order[]>}
 */
export async function updateMassiveOrder(
  req: Hapi.request
): Promise<{ status: string, order: Order }[]> {
  const manager: EntityManager = req.server.app.connection.manager;
  const orderData: OrderInterfaceRequest[] = req.payload.orders;
  const userId = req.auth.credentials.id;
  const user = await manager.findOne(User, { where: { id: userId } });
  if (!user) {
    throw Boom.badRequest('User not found but not resolve google sheets');
  }
  for (let index = 0; index < orderData.length; index++) {
    const order = orderData[index];
    const dataOrder = await manager.findOne(Order, { where: { purchaseNumber: order.purchaseNumber, company: user.id } });
    if (dataOrder) {
      Object.assign(dataOrder, order);
      Object.assign(orderData[index], dataOrder);
    }
  }

  const order = await updateMassiveOrderService(manager, orderData, user);
  return order;
}

/**
 * Create order
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Order[]>}
 */
export async function createOrder(
  req: Hapi.request
): Promise<Order> {
  const manager: EntityManager = req.server.app.connection.manager;
  const orderData: OrderInterfaceRequest = req.payload;
  const userId = req.auth.credentials.id;
  const order = await createOrderService(manager, orderData, userId);
  return order;
}

/**
 * Create order
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Order[]>}
 */
export async function createOrderWebhook(
  req: Hapi.request
): Promise<Order> {
  const manager: EntityManager = req.server.app.connection.manager;
  const orderData: OrderInterfaceRequest = req.payload;
  const token = req.params.token;
  const user = await manager.findOne(User, { where: { token } });
  if (!user) {
    throw Boom.notFound('User not found');
  }
  const orderWithLargestNumber = await manager.findOne(Order, {
    where: {
      company: user.id
    },
    order: {
      purchaseNumber: 'DESC'
    }
  });
  const customer = await manager.findOne(Customer, {
    where: {
      clientPhone: orderData.clientPhone
    }
  });
  Object.assign(orderData, customer);
  if (orderWithLargestNumber) {
    const numberOrder = Number(orderWithLargestNumber.purchaseNumber) + 1;
    orderData.purchaseNumber = numberOrder;
  }
  const order = await createOrderService(manager, orderData, user.id);
  return order;
}

/**
 * Update order
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Order>}
 */
export async function updateOrder(req: Hapi.request): Promise<Order> {
  const manager: EntityManager = req.server.app.connection.manager;
  const orderId = req.params.orderId;
  let userId: number | null = null;
  const orderData: OrderInterfaceRequest = req.payload;
  const dataOrder = await manager.findOne(Order, { where: { deliveryNumber: orderId } });
  const credentials = req.auth.credentials;
  if (credentials) {
    const credentialsId = credentials.id;
    const user = await manager.findOne(User, { where: { id: credentialsId } });
    if (!user) {
      throw Boom.badRequest('User not found but not resolve google sheets');
    }
    userId = user.id;
  } else {
    if (dataOrder) {
      userId = dataOrder.company;
    } else {
      throw Boom.badRequest('Order in local system not found');
    }
  }
  if (!userId) {
    throw Boom.badRequest('User owner by order not found');
  }
  const order = await updateOrderService(manager, orderId, orderData, userId);
  return order;
}

/**
 * Delete order
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Order>}
 */
export async function deleteOrder(req: Hapi.request): Promise<Order> {
  const manager: EntityManager = req.server.app.connection.manager;
  const deliveryNumber = req.params.deliveryNumber;
  const userId = req.auth.credentials.id;
  const order = await deleteOrderService(manager, deliveryNumber, userId);
  return order;
}

/**
 * Delete order
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Order>}
 */
export async function deleteOrderMassive(req: Hapi.request): Promise<{ status: string, order: Order }[]> {
  const manager: EntityManager = req.server.app.connection.manager;
  const deliverysNumber = req.payload.deliverysNumber;
  const userId = req.auth.credentials.id;
  const order = await deleteOrderMassiveService(manager, deliverysNumber, userId);
  return order;
}