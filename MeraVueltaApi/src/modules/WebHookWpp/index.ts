import Hapi from '@hapi/hapi';
import { Options } from '../../config/types';
import {
  webHookWppLogGet,
  webHookWppLogPost,
  clearData,
} from './controller';

export = {
  name: 'webHookWpp',
  register: function (server: Hapi.Server, options: Options): void {
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/webHookWpp`,
      options: {
        description: 'Get all data webHookWpp',
        notes: 'Get all data webHookWpp',
        tags: ['api'],
      },
      handler: webHookWppLogGet,
    });
    server.route({
      method: 'POST',
      path: `${options.routePrefix}/webHookWpp`,
      options: {
        description: 'Get all data webHookWpp',
        notes: 'Get all data webHookWpp',
        tags: ['api'],
      },
      handler: webHookWppLogPost,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/clearData`,
      options: {
        description: 'clearData',
        notes: 'clearData',
        tags: ['api'],
      },
      handler: clearData,
    });
  },
};
