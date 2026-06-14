import Boom from '@hapi/boom';
import { EntityManager, Not } from 'typeorm';
import { Order, statusOrder } from '../../entities/order';
import { ErrorMessages } from '../../utils/errors';
import { User } from '../../entities/users';
import { Customer } from '../../entities/customer';
import { OrderInterfaceRequest, SheetsOrderAutomatic } from './types';
import { validatePayInUser } from '../PayUsers/services';
import {
  assignBasicDataOrder,
  discernmentOfOrdersToUploadInAMassiveWay,
  updateGoogleSheets,
  convertDataSheetOrderToOrder,
} from './utils/dataTreatment';
import { sendWppMessage, sendWppMessageCache } from './utils/wppNotifications';

/**
 * list a orders by user domiciliary
 *
 * @param {EntityManager} manager DB connection
 * @return {Promise<Order[]>}
 */
export const validateTracingService = async (manager: EntityManager, userId: number): Promise<boolean> => {
  try {
    const orders = await manager.find(Order, {
      where: {
        domiciliary: userId,
        orderState: Not(statusOrder.DELIVERED),
        isDelete: false
      }
    });
    if (orders.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('get all order Error', error);
    throw Boom.badGateway(ErrorMessages.ERROR_ORDER_UNEXPECTED);
  }
};

/**
 * Buscar pedidos por palabra en nombre, apellido, deliveryNumber, purchaseNumber, documentNumber, correo electrónico, clientPhone y documento del domiciliario
 *
 * @param {EntityManager} manager Conexión DB
 * @return {Promise<Order[]>}
 */
export async function searchOrdersAllService(manager: EntityManager, userId: number, word: string, take = 50, skip = 0): Promise<Order[]> {
  try {
    const orders = await manager.createQueryBuilder(Order, 'o')
      .addSelect('(similarity(o."name", :word) + similarity(o."lastName", :word) + similarity(o."deliveryNumber"::text, :word) + similarity(o."purchaseNumber"::text, :word) + similarity(o."documentNumber"::text, :word) + similarity(o."email", :word) + similarity(o."clientPhone", :word) + similarity("domiciliary"."documentNumber"::text, :word))', 'score')
      .where('o."company" = :userId', { userId: userId })
      .andWhere('(o."name" % :word OR o."lastName" % :word OR o."deliveryNumber"::text % :word OR o."purchaseNumber"::text % :word OR o."documentNumber"::text % :word OR o."email" % :word OR o."clientPhone" % :word OR "domiciliary"."documentNumber"::text % :word)', { word: word })
      .andWhere('o."isDelete" = :isDelete', { isDelete: false })
      .leftJoinAndSelect('o.domiciliary', 'domiciliary')
      .orderBy('score', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
    const orderOrders = OrderOrders(manager, userId, orders);
    return orderOrders;
  } catch (error) {
    console.error('Error searchOrdersAllService', error);
    throw Boom.badRequest(ErrorMessages.ERROR_ORDER_UNEXPECTED);
  }
}

/**
 * Buscar pedidos por palabra en nombre, apellido, deliveryNumber, purchaseNumber, documentNumber, correo electrónico, clientPhone y documento del domiciliario
 *
 * @param {EntityManager} manager Conexión DB
 * @return {Promise<Order[]>}
 */
export async function searchOrdersService(manager: EntityManager, word: string, state: string, orderQuery: boolean, userId: number, take = 50, skip = 0): Promise<Order[]> {
  try {
    const orders = await manager.createQueryBuilder(Order, 'o')
      .addSelect('(similarity(o.name, :word) + similarity(o.lastName, :word) + similarity(o."deliveryNumber"::text, :word) + similarity(o."purchaseNumber"::text, :word) + similarity(o."documentNumber"::text, :word) + similarity(o.email, :word) + similarity(o."clientPhone", :word) + similarity(domiciliary."documentNumber"::text, :word))', 'score')
      .where('o.orderState = :state ', { state: state })
      .andWhere('o.company = :userId', { userId: userId })
      .andWhere('(o.name % :word OR o.lastName % :word OR o."deliveryNumber"::text % :word OR o."purchaseNumber"::text % :word OR o."documentNumber"::text % :word OR o.email % :word OR o."clientPhone" % :word OR domiciliary."documentNumber"::text % :word)', { word: word })
      .andWhere('o.isDelete = :isDelete', { isDelete: false })
      .leftJoinAndSelect('o.domiciliary', 'domiciliary')
      .orderBy('score', 'DESC')
      .addOrderBy('o.purchaseNumber', orderQuery ? 'DESC' : 'ASC')
      .skip(skip)
      .take(take)
      .getMany();
    const orderOrders = OrderOrders(manager, userId, orders);
    return orderOrders;
  } catch (error) {
    console.error('Error searchOrdersService', error);
    throw Boom.badRequest(ErrorMessages.ERROR_ORDER_UNEXPECTED);
  }
}

/**
 * Search orders for word by name, lastName , deliveryNumber, purchaseNumber, documentNumber, email, clientPhone, and domiciliary's documentNumber
 *
 * @param {EntityManager} manager DB connection
 * @return {Promise<Order[]>}
 */
export async function searchOrdersServiceByDomiciliary(manager: EntityManager, userId: number, state: string, word: string, orderQuery: true, domiciliaryId: number): Promise<Order[]> {
  try {
    const orders = await manager.createQueryBuilder(Order, 'o')
      .addSelect('(similarity(o."name", :word) + similarity(o."lastName", :word) + similarity(o."deliveryNumber"::text, :word) + similarity(o."purchaseNumber"::text, :word) + similarity(o."documentNumber"::text, :word) + similarity(o."email", :word) + similarity(o."clientPhone", :word) + similarity("domiciliary"."documentNumber"::text, :word))', 'score')
      .where('o."orderState" = :state ', { state: state })
      .andWhere('o."domiciliaryId" = :domiciliaryId', { domiciliaryId: domiciliaryId })
      .andWhere('(o."name" % :word OR o."lastName" % :word OR o."deliveryNumber"::text % :word OR o."purchaseNumber"::text % :word OR o."documentNumber"::text % :word OR o."email" % :word OR o."clientPhone" % :word OR "domiciliary"."documentNumber"::text % :word)', { word: word })
      .andWhere('o."isDelete" = :isDelete', { isDelete: false })
      .leftJoinAndSelect('o.domiciliary', 'domiciliary')
      .orderBy('score', 'DESC')
      .addOrderBy('o."purchaseNumber"', orderQuery ? 'DESC' : 'ASC')
      .getMany();
    const orderOrders = OrderOrders(manager, userId, orders);
    return orderOrders;
  } catch (error) {
    console.error('Error searchOrdersServiceByDomiciliary', error);
    throw Boom.badRequest(ErrorMessages.ERROR_ORDER_UNEXPECTED);
  }
}


/**
 * list a orders by user domiciliary
 *
 * @param {EntityManager} manager DB connection
 * @return {Promise<Order[]>}
 */
export const getOrderByUserDomiciliaryService = async (manager: EntityManager, userId: number, company: string, state: string, take = 50, skip = 0, orderQuery = true): Promise<Order[]> => {
  try {
    let orders: Order[] = [];
    if (parseInt(company) > 0) {
      orders = await manager.find(Order, {
        where: {
          domiciliary: userId,
          orderState: state,
          isDelete: false,
          company: company
        },
        order: {
          purchaseNumber: orderQuery ? 'DESC' : 'ASC',
        },
        take,
        skip,
      });
    } else {
      orders = await manager.find(Order, {
        where: {
          domiciliary: userId,
          orderState: state,
          isDelete: false,
        },
        order: {
          purchaseNumber: orderQuery ? 'DESC' : 'ASC',
        },
        take,
        skip,
      });
    }
    const orderOrders = OrderOrders(manager, userId, orders);
    return orderOrders;
  } catch (error) {
    console.error('get all order Error', error);
    throw Boom.badGateway(ErrorMessages.ERROR_ORDER_UNEXPECTED);
  }
};

/**
 * list a orders by user domiciliary
 *
 * @param {EntityManager} manager DB connection
 * @return {Promise<Order[]>}
 */
export const getOrderByCompanyService = async (manager: EntityManager, userId: number, companyId: number, take = 50, skip = 0): Promise<Order[]> => {
  try {
    const orders = await manager.find(Order, {
      where: { company: companyId, isDelete: false },
      order: {
        purchaseNumber: 'DESC',
      },
      take,
      skip,
      relations: ['domiciliary']
    });
    const orderOrders = OrderOrders(manager, userId, orders);
    return orderOrders;
  } catch (error) {
    console.error('get all order Error', error);
    throw Boom.badGateway(ErrorMessages.ERROR_ORDER_UNEXPECTED);
  }
};

/**
 * list a orders by delivery number service
 *
 * @param {EntityManager} manager DB connection
 * @param {number} deliveryNumber deliveryNumber
 * @return {Promise<Order[]>}
 */
export const getOrderByOrderIdService = async (manager: EntityManager, orderId: string): Promise<Order> => {
  let order = await manager.findOne(Order, {
    where: { deliveryNumber: orderId, isDelete: false },
    order: {
      purchaseNumber: 'DESC',
    },
    relations: ['domiciliary']
  });
  if (!order) {
    order = await manager.findOne(Order, {
      where: { purchaseNumber: orderId, isDelete: false }, order: {
        purchaseNumber: 'DESC',
      },
      relations: ['domiciliary']
    });
  }
  if (!order) {
    throw Boom.badRequest(ErrorMessages.ERROR_ORDER_NOT_FOUND);
  }
  return order;
};

/**
 * list a orders by company id for status
 *
 * @param {EntityManager} manager DB connection
 * @return {Promise<Order[]>}
 */
export const getOrderByCompanyForStatusService = async (manager: EntityManager, userId: number, status: string, take = 50, skip = 0, orderQuery: true): Promise<Order[]> => {
  try {
    const orders = await manager.find(Order, {
      where: { orderState: status, company: userId, isDelete: false },
      order: {
        purchaseNumber: orderQuery ? 'DESC' : 'ASC',
      },
      relations: ['domiciliary'],
      take,
      skip,
    });
    const orderOrders = OrderOrders(manager, userId, orders);
    return orderOrders;
  } catch (error) {
    console.error('get all order Error', error);
    throw Boom.badGateway(ErrorMessages.ERROR_ORDER_UNEXPECTED);
  }
};


/**
 * list all orders
 *
 * @param {EntityManager} manager DB connection
 * @return {Promise<Order[]>}
 */
export const getAllOrderService = async (manager: EntityManager, userId: number, take = 50, skip = 0): Promise<Order[]> => {
  const orders = await manager.find(Order, {
    where: { isDelete: false }, order: {
      creationDate: 'DESC',
    },
    relations: ['domiciliary'],
    take,
    skip,
  });
  const orderOrders = OrderOrders(manager, userId, orders);
  return orderOrders;
};

/**
 * list all orders
 * @param {EntityManager} manager DB connection
 * @param {User} user user
 * @return {Promise<string>}
 */
async function generateUniqueDeliveryNumber(manager: EntityManager, user: User): Promise<string> {
  let deliveryNumber;
  let existOrder;

  do {
    const timestampPart = Date.now().toString().slice(-6);
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
    deliveryNumber = parseInt(timestampPart + randomPart, 10);

    existOrder = await manager.findOne(Order, { where: { deliveryNumber: deliveryNumber, company: user.id } });
  } while (existOrder);

  return deliveryNumber;
}

/**
 * Create a Order
 *
 * @param {EntityManager} manager DB connection
 * @param {Order} orderData orderData.
 * @param {number} userId userId.
 * @return {Promise<Order>}
 */
export const createOrderService = async (
  manager: EntityManager,
  orderData: OrderInterfaceRequest,
  userId: number,
): Promise<Order> => {
  const user = await manager.findOne(User, { where: { id: userId } });
  if (!user) {
    throw Boom.badRequest(ErrorMessages.ERROR_USER_NOT_FOUND);
  }
  const existOrder = await manager.findOne(Order, { where: { purchaseNumber: orderData.purchaseNumber, company: user.id } });
  if (existOrder) {
    throw Boom.badRequest(ErrorMessages.ERROR_ORDER_EXIST);
  }
  await validatePayInUser(manager, user);

  let dataOrder = new Order();
  const tiempoTranscurrido = Date.now();
  const hoy = new Date(tiempoTranscurrido);
  dataOrder.creationDate = hoy;
  dataOrder.orderState = 'Compra';
  dataOrder.company = user.id;
  dataOrder.deliveryNumber = parseInt(await generateUniqueDeliveryNumber(manager, user));
  if (!orderData.purchaseNumber) {
    throw Boom.badRequest('El número de compra es requerido');
  }
  if (orderData.domiciliary) {
    if (orderData.domiciliary == '0') {
      dataOrder.domiciliary = null;
    } else {
      const userDomiciliary = await manager.findOne(User, { where: { id: orderData.domiciliary } });
      if (!userDomiciliary) {
        throw Boom.badRequest(ErrorMessages.ERROR_USER_NOT_FOUND);
      }
    }
  }
  dataOrder = await assignBasicDataOrder(manager, orderData, dataOrder);
  if (orderData.pickupAddress) {
    dataOrder.pickupAddress = orderData.pickupAddress;
  } else {
    dataOrder.pickupAddress = user.address;
  }
  try {
    const order = await manager.save(Order, dataOrder);
    if (user.googleSheets) {
      void updateGoogleSheets(manager, user).catch((err) => console.error('updateGoogleSheets failed', err));
    }
    sendWppMessage(dataOrder, manager);
    return order;
  } catch (error) {
    console.error('Create order error', error);
    throw Boom.badGateway(ErrorMessages.ERROR_ORDER_UNEXPECTED);
  }
};

/**
 * Update a Order
 *
 * @param {EntityManager} manager DB connection
 * @param {string} deliveryNumber deliveryNumber.
 * @param {any} orderData orderData.
 * @return {Promise<Order[]>}
 */
export const updateOrderService = async (
  manager: EntityManager,
  orderId: string,
  orderData: OrderInterfaceRequest,
  userId: number,
): Promise<Order> => {
  const user = await manager.findOne(User, { where: { id: userId } });
  if (!user) {
    throw Boom.badRequest(ErrorMessages.ERROR_USER_NOT_FOUND);
  }
  let dataOrder = await manager.findOne(Order, { where: { purchaseNumber: orderId, isDelete: false }, relations: ['domiciliary'] });
  if (!dataOrder) {
    dataOrder = await manager.findOne(Order, { where: { deliveryNumber: orderId, isDelete: false }, relations: ['domiciliary'] });
  }
  if (!dataOrder) {
    throw Boom.notFound(ErrorMessages.ERROR_ORDER_NOT_FOUND);
  }
  let urlSheets = '';
  if (user.role === 'domiciliary') {
    const userCompany = await manager.findOne(User, { where: { id: dataOrder?.company } });
    if (!userCompany) {
      throw Boom.badRequest(ErrorMessages.ERROR_USER_NOT_FOUND);
    }
    urlSheets = userCompany.googleSheets;
  } else if (user.role === 'company') {
    urlSheets = user.googleSheets;
  }
  if (orderData.domiciliary) {
    if (orderData.domiciliary != '0') {
      const userDomiciliary = await manager.findOne(User, { where: { id: orderData.domiciliary } });
      if (!userDomiciliary) {
        throw Boom.badRequest(ErrorMessages.ERROR_USER_NOT_FOUND);
      }
    }
  }
  dataOrder = await assignBasicDataOrder(manager, orderData, dataOrder);

  try {
    const order = await manager.save(dataOrder);
    if (urlSheets) {
      // Si el usuario es domiciliario, actualizar en las sheets de la empresa dueña de la orden
      if (user.role === 'domiciliary') {
        const userCompany = await manager.findOne(User, { where: { id: dataOrder?.company } });
        if (userCompany?.googleSheets) {
          void updateGoogleSheets(manager, userCompany).catch((err) => console.error('updateGoogleSheets failed', err));
        }
      } else {
        void updateGoogleSheets(manager, user).catch((err) => console.error('updateGoogleSheets failed', err));
      }
    }
    sendWppMessage(dataOrder, manager);
    return order;
  } catch (error) {
    console.error('Update order error', error);
    throw Boom.badGateway(ErrorMessages.ERROR_ORDER_UNEXPECTED);
  }
};

/**
 * Delete a Order
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Order>}
 */
export const deleteOrderService = async (
  manager: EntityManager,
  deliveryNumber: string,
  userId: number): Promise<Order> => {
  const user = await manager.findOne(User, { where: { id: userId } });
  if (!user) {
    throw Boom.badRequest(ErrorMessages.ERROR_USER_NOT_FOUND);
  }
  const dataOrder = await manager.findOne(Order, { where: { deliveryNumber, isDelete: false } });
  if (!dataOrder) {
    throw Boom.notFound(ErrorMessages.ERROR_ORDER_NOT_FOUND);
  }
  if (dataOrder.orderState === 'Entregada') {
    throw Boom.badRequest('No se puede eliminar una orden entregada');
  }
  try {
    await manager.remove(dataOrder);
    void updateGoogleSheets(manager, user).catch((err) => console.error('updateGoogleSheets failed', err));
    return dataOrder;
  } catch (error) {
    console.error('Delete order error', error);
    throw Boom.badGateway(ErrorMessages.ERROR_ORDER_UNEXPECTED);
  }
};

/**
 * Delete a Order
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Order>}
 */
export const deleteOrderMassiveService = async (
  manager: EntityManager,
  deliverysNumber: string[],
  userId: number
): Promise<{ status: string, order: Order }[]> => {
  const ordersDelete: { status: string, order: Order }[] = [];
  const user = await manager.findOne(User, { where: { id: userId } });
  if (!user) {
    throw Boom.badRequest(ErrorMessages.ERROR_USER_NOT_FOUND);
  }
  for (let index = 0; index < deliverysNumber.length; index++) {
    const deliveryNumber = deliverysNumber[index];
    const dataOrder = await manager.findOne(Order, { where: { deliveryNumber, isDelete: false } });
    const newOrderForResponse = new Order();
    newOrderForResponse.deliveryNumber = Number(deliveryNumber);
    if (!dataOrder) {
      ordersDelete.push({
        status: 'No se encontró la orden',
        order: newOrderForResponse,
      });
      continue;
    }
    if (dataOrder.orderState === 'Entregada') {
      ordersDelete.push({
        status: 'No se puede eliminar una orden entregada',
        order: dataOrder,
      });
      continue;
    }
    try {
      await manager.remove(dataOrder);
      ordersDelete.push({
        status: 'Borrada',
        order: dataOrder,
      });
    } catch (error) {
      console.error('Delete order error', error);
      ordersDelete.push({
        status: 'Error',
        order: dataOrder,
      });
    }
  }
  if (user.googleSheets) {
    void updateGoogleSheets(manager, user).catch((err) => console.error('updateGoogleSheets failed', err));
  }
  return ordersDelete;
};

export async function createMassiveOrderService(manager: EntityManager, orders: SheetsOrderAutomatic[], user: User): Promise<{ status: string, order: Order }[]> {
  await validatePayInUser(manager, user, orders.length);
  try {
    const { ordersFail, readyOrders } = await discernmentOfOrdersToUploadInAMassiveWay(manager, orders, user);
    const ordersFailed: { status: string, order: OrderInterfaceRequest }[] = [];
    const ordersSaved: { status: string, order: Order }[] = [];
    for (let i = 0; i < readyOrders.length; i++) {
      const orderData = readyOrders[i];
      const existOrder = await manager.findOne(Order, { where: { purchaseNumber: orderData.purchaseNumber, company: user.id } });
      if (existOrder) {
        ordersFailed.push({ status: 'Orden ya existe', order: orderData });
        continue;
      }
      if (orderData.orderState == null || !orderData.deliveryNumber) {
        ordersFailed.push({ status: 'Creada', order: orderData });
        continue;
      }

      let dataOrder: Order = new Order();
      if (!orderData.purchaseNumber) {
        ordersFailed.push({ status: 'El número de compra es requerido', order: orderData });
        continue;
      }

      if (orderData.domiciliary) {
        if (orderData.domiciliary != '0') {
          const userDomiciliary = await manager.findOne(User, { where: { id: orderData.domiciliary } });
          if (!userDomiciliary) {
            ordersFailed.push({ status: 'El domiciliario no existe', order: orderData });
            continue;
          }
        }
      }
      dataOrder.company = user.id;
      dataOrder = await assignBasicDataOrder(manager, orderData, dataOrder);
      if (orderData.pickupAddress) {
        dataOrder.pickupAddress = orderData.pickupAddress;
      } else {
        dataOrder.pickupAddress = user.address;
      }
      try {
        const orderSave = await manager.save(Order, dataOrder);
        ordersSaved.push({ status: 'Creada', order: orderSave });
        sendWppMessageCache(dataOrder, manager);
      } catch (error) {
        console.error('Error create order', error);
        ordersFailed.push({ status: 'Error intente nuevamente', order: orderData });
      }
    }
    const response = [...ordersSaved, ...ordersFailed];
    const ordersResponse: {
      status: string;
      order: Order;
    }[] = [];
    for (let i = 0; i < response.length; i++) {
      const order = response[i];
      const orderData = order.order as Order;
      ordersResponse.push({ status: order.status, order: orderData });
    }
    for (let i = 0; i < ordersFail.length; i++) {
      const order = ordersFail[i];
      const dataSheet = await convertDataSheetOrderToOrder(manager, order.order);
      ordersResponse.push({ status: order.status, order: dataSheet });
    }
    if (user.googleSheets) {
      void updateGoogleSheets(manager, user).catch((err) => console.error('updateGoogleSheets failed', err));
    }
    return ordersResponse;
  } catch (error) {
    console.error('Error create massive order', error);
    throw Boom.badGateway(ErrorMessages.ERROR_ORDER_UNEXPECTED);
  }

}

export async function updateMassiveOrderService(
  manager: EntityManager,
  orders: OrderInterfaceRequest[],
  user: User,
): Promise<{
  status: string,
  order: Order
}[]> {
  const ordersFailed: { status: string, order: OrderInterfaceRequest }[] = [];
  const ordersResponse: { status: string, order: Order }[] = [];
  for (let i = 0; i < orders.length; i++) {
    const orderData = orders[i];
    let dataOrder = await manager.findOne(Order, { where: { purchaseNumber: orderData.purchaseNumber, company: user.id } });
    if (!dataOrder) {
      ordersFailed.push({ status: 'Orden no existe', order: orderData });
      continue;
    }
    if (!orderData.deliveryNumber) {
      ordersFailed.push({ status: 'El número de entrega es requerido', order: orderData });
      continue;
    }
    dataOrder.purchaseNumber = orderData.purchaseNumber;
    if (!orderData.purchaseNumber) {
      ordersFailed.push({ status: 'El número de compra es requerido', order: orderData });
      continue;
    }
    dataOrder = await assignBasicDataOrder(manager, orderData, dataOrder);
    if (orderData.orderState) {
      dataOrder.orderState = orderData.orderState;
    } else {
      dataOrder.orderState = 'EsperaDespacho';
    }
    try {
      const orderSave = await manager.save(Order, dataOrder);
      ordersResponse.push({ status: 'Actualizada', order: orderSave });
      sendWppMessageCache(dataOrder, manager);
    } catch (error) {
      console.error('Error create order', error);
      ordersFailed.push({ status: 'Error intente nuevamente', order: orderData });
    }
  }
  if (user.googleSheets) {
    void updateGoogleSheets(manager, user).catch((err) => console.error('updateGoogleSheets failed', err));
  }
  for (let index = 0; index < ordersFailed.length; index++) {
    const ordersFail = ordersFailed[index];
    const orderFail = new Order();
    const dataSheet = await assignBasicDataOrder(manager, ordersFail.order, orderFail);
    ordersResponse.push({ status: 'Error intente nuevamente', order: dataSheet });
  }
  const allOrders = ordersResponse;
  return allOrders;
}

const OrderOrders = async (manager: EntityManager, userId: number, orders: Order[]): Promise<Order[]> => {
  try {
    const customers = await manager.find(Customer, { where: { company: { id: userId } }, relations: ['company'] });
    const ordersByCustomer: { order: Order, customer: Customer }[] = [];
    const ordersNotCustomer: Order[] = [...orders];

    for (const order of orders) {
      const findCustomer = customers.find(c => c.clientPhone === order.clientPhone);
      if (findCustomer) {
        ordersByCustomer.push({
          order,
          customer: findCustomer,
        });
        const index = ordersNotCustomer.findIndex(o => o.clientPhone === order.clientPhone);
        if (index !== -1) {
          ordersNotCustomer.splice(index, 1);
        }
      }
    }

    ordersByCustomer.sort((a, b) => a.customer.order - b.customer.order);
    const orderFinish: Order[] = [];
    for (const order of ordersByCustomer) {
      orderFinish.push(order.order);
    }
    return orderFinish.concat(ordersNotCustomer);
  } catch (error) {
    console.log(error);
    throw Boom.badGateway(ErrorMessages.ERROR_ORDER_UNEXPECTED);
  }
};
