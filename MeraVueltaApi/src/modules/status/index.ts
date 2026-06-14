import Hapi from '@hapi/hapi';
import { getStatus } from './controller';
import { Options } from '../../config/types';

export = {
  name: 'status',
  register: function (server: Hapi.Server, options: Options): void {
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/status`,
      options: {
        description: 'Get status service',
        notes: 'Service to obtain the status of the project',
        tags: ['api']
      },
      handler: getStatus,
    });
    // JWT authentication route disabled temporarily to avoid startup errors
    // TODO: Re-enable when JWT strategy is properly configured
    /*
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/status/login`,
      options: {
        description: 'Get status service',
        notes: 'Service to obtain the status of the project',
        tags: ['api'],
        auth: {
          strategy: 'jwt'
        },
      },
      handler: getStatus,
    });
    */
    server.route({
      method: 'GET',
      path: '/health',
      options: {
        description: 'Health check endpoint',
        notes: 'Simple health check for monitoring',
        tags: ['health']
      },
      handler: () => ({ status: 'ok', timestamp: new Date().toISOString() }),
    });
  },
};