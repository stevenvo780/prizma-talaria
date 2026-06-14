import { Server } from '@hapi/hapi';
import {
  getMessageConfigs,
  createMessageConfig,
  updateMessageConfig,
  deleteMessageConfig,
  getMessageConfigByKey
} from './controller';

module.exports = {
  name: 'messageConfig',
  version: '1.0.0',
  register: async (server: Server) => {
    server.route([
      {
        method: 'GET',
        path: '/api/message-config',
        handler: getMessageConfigs,
        options: {
          auth: 'jwt'
        }
      },
      {
        method: 'POST',
        path: '/api/message-config',
        handler: createMessageConfig,
        options: {
          auth: 'jwt'
        }
      },
      {
        method: 'PUT',
        path: '/api/message-config/{id}',
        handler: updateMessageConfig,
        options: {
          auth: 'jwt'
        }
      },
      {
        method: 'DELETE',
        path: '/api/message-config/{id}',
        handler: deleteMessageConfig,
        options: {
          auth: 'jwt'
        }
      },
      {
        method: 'GET',
        path: '/api/message-config/key/{key}',
        handler: getMessageConfigByKey,
        options: {
          auth: 'jwt'
        }
      }
    ]);
  }
};