import Hapi from '@hapi/hapi';
import config from '../../config';
import { Status } from './types';
import { User } from '../../entities/users';
import { EntityManager } from 'typeorm';

/**
 * Get API service status
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<User>}
 */
export async function getStatus(req: Hapi.request): Promise<Status> {
  const manager: EntityManager = req.server.app.connection.manager;
  const userId = req.auth.credentials.id;
  const user = await manager.findOne(User, { where: { id: userId } });
  return {
    module: config.project.name,
    api: true,
    database: req?.server?.app?.connection?.isConnected || false,
    user: user ? user : null,
  };
}
