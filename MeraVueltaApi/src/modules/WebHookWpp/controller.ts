import { EntityManager } from 'typeorm';
import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { ErrorMessages } from '../../utils/errors';
import { WppMessagesUser } from '../../entities/wppMessagesUser';
import { handlerMessagesWpp } from './services';

/**
 * Returns a positionUser
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<any>}
 */
export async function webHookWppLogGet(req: Hapi.request): Promise<any> {
  const manager: EntityManager = req.server.app.connection.manager;
  const log = req.query;
  if (log['hub.verify_token']) {
    if (log['hub.verify_token'] !== process.env.WPP_VERIFY_WEBSOCKET) {
      throw Boom.badRequest(ErrorMessages.ERROR_WPP_UNEXPECTED);
    }
    return log['hub.challenge'];
  }
  await handlerMessagesWpp(log, manager);
  return log;
}

/**
 * Returns a positionUser
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<any>}
 */
export async function webHookWppLogPost(req: Hapi.request): Promise<any> {
  const manager: EntityManager = req.server.app.connection.manager;
  const log = req.payload;
  if (log['hub.verify_token']) {
    if (log['hub.verify_token'] !== process.env.WPP_VERIFY_WEBSOCKET) {
      throw Boom.badRequest(ErrorMessages.ERROR_WPP_UNEXPECTED);
    }
    return log['hub.challenge'];
  }
  await handlerMessagesWpp(log, manager);
  return log;
}

/**
 * Returns a positionUser
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<any>}
 */
export async function clearData(req: Hapi.request): Promise<{ message: string }> {
  const manager: EntityManager = req.server.app.connection.manager;
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  await manager
    .createQueryBuilder()
    .delete()
    .from(WppMessagesUser)
    .where('createdAt < :date', { date: oneWeekAgo })
    .execute();
  return { message: 'ok' };
}


