import { EntityManager, Between } from 'typeorm';
import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { ErrorMessages } from '../../utils/errors';
import { PositionUser } from '../../entities/positionUser';
import { Order } from '../../entities/order';
import { DomiciliaryCompany } from '../../entities/domiciliaryCompany';

/**
 * Returns a positionUser
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<PositionUser[]>}
 */
export async function getPositionUser(req: Hapi.request): Promise<PositionUser | undefined> {
  try {
    const manager: EntityManager = req.server.app.connection.manager;
    const id = req.params.id;
    return await manager.findOne(PositionUser, id);
  } catch (error) {
    console.error('get all positionUser Error', error);
    throw Boom.badGateway(ErrorMessages.ERROR_POSITION_UNEXPECTED);
  }
}



/**
 * Returns a positionUser
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<PositionUser[]>}
 */
export async function getPositionUserByUser(req: Hapi.request): Promise<PositionUser | undefined> {
  const manager: EntityManager = req.server.app.connection.manager;
  const userId = req.params.userId;
  const position = await manager.findOne(PositionUser, { where: { user: userId } });
  if (!position) throw Boom.notFound(ErrorMessages.ERROR_POSITION_NOT_FOUND);
  return position;
}

/**
 * Returns a positionUser by company
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<PositionUser[]>}
 */
export async function getPositionUserByCompany(req: Hapi.request): Promise<{
  position: PositionUser, domiciliaryCompany: DomiciliaryCompany, status: {
    WAIT_DISPATCH: number,
    WAIT_EXIT: number,
    AGREE: number,
    EXIT: number,
    DELIVERED: number,
    DELIVERED_TODAY: number,
  }
}[]> {
  const manager: EntityManager = req.server.app.connection.manager;
  const userId = req.auth.credentials.id;
  const domiciliaryCompanies = await manager.find(DomiciliaryCompany, { where: { company: userId }, relations: ['domiciliary', 'company'] });
  const positions: {
    position: PositionUser, domiciliaryCompany: DomiciliaryCompany, status: {
      WAIT_DISPATCH: number,
      WAIT_EXIT: number,
      AGREE: number,
      EXIT: number,
      DELIVERED: number,
      DELIVERED_TODAY: number,
    }
  }[] = [];

  for (const domiciliaryCompany of domiciliaryCompanies) {
    const position = await manager.findOne(PositionUser, { where: { user: domiciliaryCompany.domiciliary.id } });
    if (position) {
      const orders = await manager.find(Order, { where: { domiciliary: domiciliaryCompany.domiciliary.id } });
      const ordersToday = await manager.find(Order, { where: { domiciliary: domiciliaryCompany.domiciliary.id, createdAt: Between(new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 59, 999))) } });
      const status = {
        WAIT_DISPATCH: 0,
        WAIT_EXIT: 0,
        AGREE: 0,
        EXIT: 0,
        DELIVERED: 0,
        DELIVERED_TODAY: 0,
      };
      for (const order of ordersToday) {
        if (order.orderState === 'Entregada') status.DELIVERED_TODAY++;
      }
      for (const order of orders) {
        if (order.orderState === 'EsperaDespacho') status.WAIT_DISPATCH++;
        if (order.orderState === 'EsperaSalida') status.WAIT_EXIT++;
        if (order.orderState === 'Aceptada') status.AGREE++;
        if (order.orderState === 'Salida') status.EXIT++;
        if (order.orderState === 'Entregada') status.DELIVERED++;
      }
      if (
        status.EXIT > 0 ||
        status.AGREE > 0 ||
        status.WAIT_EXIT > 0 ||
        status.WAIT_DISPATCH > 0
      ) {
        positions.push({ position, domiciliaryCompany, status });
      }
    }
  }

  return positions;
}

/**
 * Return all categories
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<PositionUser[]>}
 */
export const getAllPositionUser = async (
  req: Hapi.request
): Promise<PositionUser[]> => {
  const manager: EntityManager = req.server.app.connection.manager;
  return manager.find(PositionUser);
};

/**
 * Create positionUser
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<PositionUser[]>}
 */
export async function createPositionUser(req: Hapi.request): Promise<PositionUser> {
  try {
    const manager: EntityManager = req.server.app.connection.manager;
    const {
      position,
      user
    } = req.payload;

    const newPositionUser = new PositionUser();
    newPositionUser.user = user;
    newPositionUser.position = position;
    return await manager.save(PositionUser, newPositionUser);
  } catch (error) {
    console.error('Create positionUser error', error);
    throw Boom.badGateway(ErrorMessages.ERROR_POSITION_UNEXPECTED);
  }
}

/**
 * Update positionUser
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<PositionUser>}
 */
export async function updatePositionUser(req: Hapi.request): Promise<PositionUser> {
  try {
    const manager: EntityManager = req.server.app.connection.manager;
    const {
      position,
      user
    } = req.payload;
    let positionUser = await manager.findOne(PositionUser, { where: { user: user } });
    console.info('position user', positionUser, user);
    if (!positionUser) positionUser = new PositionUser();
    positionUser.position = position;
    positionUser.user = user;

    return await manager.save(positionUser);
  } catch (error) {
    console.error('Update positionUser error', error);
    throw Boom.badGateway(ErrorMessages.ERROR_POSITION_UNEXPECTED);
  }
}

/**
 * Update positionUser
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<PositionUser>}
 */
export async function deletePositionUser(req: Hapi.request): Promise<PositionUser> {
  try {
    const manager: EntityManager = req.server.app.connection.manager;
    const id = req.params.id;

    const dataPositionUser = await manager.findOne(PositionUser, id);
    if (!dataPositionUser) throw Boom.badRequest(ErrorMessages.ERROR_POSITION_NOT_FOUND);

    return await manager.remove(PositionUser, dataPositionUser);

  } catch (error) {
    console.error('Delete positionUser error', error);
    throw Boom.badGateway(ErrorMessages.ERROR_POSITION_UNEXPECTED);
  }
}



