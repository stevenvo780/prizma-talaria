import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import { Options } from '../../config/types';
import { UserRoleOptions } from '../../entities/users';
import {
  getAllPositionUser,
  getPositionUser,
  createPositionUser,
  updatePositionUser,
  deletePositionUser,
  getPositionUserByUser,
  getPositionUserByCompany,
} from './controller';

export = {
  name: 'positionUser',
  register: function (server: Hapi.Server, options: Options): void {
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/positionUser/byCompany`,
      options: {
        description: 'Get all data positionUser',
        notes: 'Get all data positionUser',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
        },
      },
      handler: getPositionUserByCompany,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/positionUser/{id}`,
      options: {
        description: 'Get all data positionUser',
        notes: 'Get all data positionUser',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
        },
        validate: {
          params: Joi.object({
            id: Joi.string().required(),
          }),
        },
      },
      handler: getPositionUser,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/positionUser/byUser/{userId}`,
      options: {
        description: 'Get all data positionUser',
        notes: 'Get all data positionUser',
        tags: ['api'],
        validate: {
          params: Joi.object({
            userId: Joi.string().required(),
          }),
        },
      },
      handler: getPositionUserByUser,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/positionUser`,
      options: {
        description: 'Get all categories and subcategories',
        notes: 'Description service',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
          scope: [UserRoleOptions.DOMICILIARY, UserRoleOptions.ADMIN],
        },
      },
      handler: getAllPositionUser,
    });

    server.route({
      method: 'POST',
      path: `${options.routePrefix}/positionUser`,
      options: {
        description: 'Create positionUser',
        notes: 'Create positionUser',
        tags: ['api'],
        validate: {
          payload: Joi.object().keys({
            position: Joi.string().required(),
            user: Joi.number().required(),
          }),
        },
        auth: {
          strategy: 'jwt',
          scope: [UserRoleOptions.DOMICILIARY, UserRoleOptions.ADMIN],
        },
      },
      handler: createPositionUser,
    });

    server.route({
      method: 'PATCH',
      path: `${options.routePrefix}/positionUser`,
      options: {
        description: 'Updated Data positionUser',
        notes: 'Updated Data positionUser',
        tags: ['api'],
        validate: {
          payload: Joi.object().keys({
            position: Joi.string().required(),
            user: Joi.number().required(),
          }),
        },
        auth: {
          strategy: 'jwt',
          scope: [UserRoleOptions.DOMICILIARY, UserRoleOptions.ADMIN],
        },
      },
      handler: updatePositionUser,
    });

    server.route({
      method: 'DELETE',
      path: `${options.routePrefix}/positionUser/{id}`,
      options: {
        description: 'Updated Data positionUser',
        notes: 'Updated Data positionUser',
        tags: ['api'],
        validate: {
          params: Joi.object({
            id: Joi.string().required(),
          }),
        },
        auth: {
          strategy: 'jwt',
          scope: [UserRoleOptions.DOMICILIARY, UserRoleOptions.ADMIN],
        },
      },
      handler: deletePositionUser,
    });

  },
};
