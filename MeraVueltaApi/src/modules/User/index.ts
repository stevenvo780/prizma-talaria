import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import {
  update,
  getUsersByRoleDomiciliary,
  getUsersByRoleCompany,
} from './controller';
import { Options } from '../../config/types';
import { UserRoleOptions } from '../../entities/users';

export = {
  name: 'user',
  register: function (server: Hapi.Server, options: Options): void {
    server.route({
      method: 'PATCH',
      path: `${options.routePrefix}/user/{id}`,
      options: {
        description: 'Get status service',
        notes: 'Service to obtain the status of the project',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
          scope: [
            UserRoleOptions.COMPANY,
            UserRoleOptions.DOMICILIARY,
            UserRoleOptions.ADMIN,
          ],
        },
        validate: {
          payload: Joi.object().keys({
            email: Joi.string().optional(),
            password: Joi.string().optional(),
            name: Joi.string().optional(),
            lastName: Joi.string().optional(),
            bornDate: Joi.string().optional(),
            typeDocument: Joi.string().optional(),
            documentNumber: Joi.string().optional(),
            address: Joi.string().optional(),
            googleSheets: Joi.string().optional(),
            urlPush: Joi.string().optional(),
            clientPhone: Joi.string().optional(),
            companyName: Joi.string().optional(),
            prefix: Joi.string().optional()
          }),
          params: Joi.object({
            id: Joi.number().required(),
          }),
        },
      },
      handler: update,
    });

    server.route({
      method: 'GET',
      path: `${options.routePrefix}/user/domiciliary`,
      options: {
        description: 'Get status service',
        notes: 'Service to obtain the status of the project',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
          scope: [

            UserRoleOptions.COMPANY,
            UserRoleOptions.ADMIN,
          ],
        },
      },
      handler: getUsersByRoleDomiciliary,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/user/company`,
      options: {
        description: 'Get companys in db',
        notes: 'Service to obtain the companys stored in db',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
          scope: [UserRoleOptions.COMPANY, UserRoleOptions.ADMIN],
        },
      },
      handler: getUsersByRoleCompany,
    });
  },
};
