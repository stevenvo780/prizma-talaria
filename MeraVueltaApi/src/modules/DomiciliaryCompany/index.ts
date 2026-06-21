import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import { Options } from '../../config/types';
import { UserRoleOptions } from '../../entities/users';
import {
  getAllDomiciliaryCompany,
  getDomiciliaryCompany,
  createDomiciliaryCompany,
  updateDomiciliaryCompany,
  deleteDomiciliaryCompany,
  listDomiciliaryCompanyByCompany,
  listDomiciliaryCompanyByDomiciliary
} from './controller';

export = {
  name: 'DomiciliaryCompany',
  register: function (server: Hapi.Server, options: Options): void {
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/domiciliaryCompany/byDomiciliary`,
      options: {
        description: 'Returns a domiciliaryCompany',
        notes: 'Returns a domiciliaryCompany',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
          scope: [
            UserRoleOptions.ADMIN,
            UserRoleOptions.DOMICILIARY,
            UserRoleOptions.COMPANY,
          ]
        },
      },
      handler: listDomiciliaryCompanyByDomiciliary,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/domiciliaryCompany/byCompany`,
      options: {
        description: 'Returns a domiciliaryCompany',
        notes: 'Returns a domiciliaryCompany',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
          scope: [
            UserRoleOptions.ADMIN,
            UserRoleOptions.DOMICILIARY,
            UserRoleOptions.COMPANY,
          ]
        },
      },
      handler: listDomiciliaryCompanyByCompany,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/domiciliaryCompany/{id}`,
      options: {
        description: 'Returns a domiciliaryCompany',
        notes: 'Returns a domiciliaryCompany',
        tags: ['api'],
        validate: {
          params: Joi.object().keys({
            id: Joi.string().required(),
          }),
        },
        auth: {
          strategy: 'jwt',
          scope: [
            UserRoleOptions.ADMIN,
            UserRoleOptions.DOMICILIARY,
            UserRoleOptions.COMPANY,
          ]
        },
      },
      handler: getDomiciliaryCompany,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/domiciliaryCompany`,
      options: {
        description: 'Return all domiciliaryCompany',
        notes: 'Return all domiciliaryCompany',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
          scope: [
            UserRoleOptions.ADMIN,
            UserRoleOptions.DOMICILIARY,
            UserRoleOptions.COMPANY,
          ]
        },
      },
      handler: getAllDomiciliaryCompany,
    });

    server.route({
      method: 'POST',
      path: `${options.routePrefix}/domiciliaryCompany`,
      options: {
        description: 'Create domiciliaryCompany',
        notes: 'Create domiciliaryCompany',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
          scope: [UserRoleOptions.COMPANY, UserRoleOptions.ADMIN],
        },
        validate: {
          payload: Joi.object().keys({
            company: Joi.number().required(),
            domiciliary: Joi.number().required(),
          }),
        },
      },
      handler: createDomiciliaryCompany,
    });

    server.route({
      method: 'PATCH',
      path: `${options.routePrefix}/domiciliaryCompany/{id}`,
      options: {
        description: 'Updated Data DomiciliaryCompany',
        notes: 'Updated Data DomiciliaryCompany',
        tags: ['api'],
        validate: {
          payload: Joi.object().keys({
            company: Joi.number().optional(),
            domiciliary: Joi.number().optional(),
          }),
          params: Joi.object({
            id: Joi.string().required(),
          }),
        },
        auth: {
          strategy: 'jwt',
        },
      },
      handler: updateDomiciliaryCompany,
    });

    server.route({
      method: 'DELETE',
      path: `${options.routePrefix}/domiciliaryCompany/{id}`,
      options: {
        description: 'Delete a DomiciliaryCompany',
        notes: 'Delete a DomiciliaryCompany',
        tags: ['api'],
        validate: {
          params: Joi.object({
            id: Joi.string().required(),
          }),
        },
        auth: {
          strategy: 'jwt',
          scope: [
            UserRoleOptions.ADMIN,
            UserRoleOptions.DOMICILIARY,
            UserRoleOptions.COMPANY,
          ]
        },
      },
      handler: deleteDomiciliaryCompany,
    });

  },
};
