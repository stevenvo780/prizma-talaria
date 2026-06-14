import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import { Options } from '../../config/types';
import { UserRoleOptions } from '../../entities/users';
import {
  getAllDomiciliaryCompanyRequest,
  getDomiciliaryCompanyRequest,
  createDomiciliaryCompanyRequest,
  updateDomiciliaryCompanyRequest,
  deleteDomiciliaryCompanyRequest,
  listDomiciliarysByCompany,
  listDomiciliaryCompanyRequestByCompany,
  listDomiciliaryCompanyRequestByDomiciliary
} from './controller';

export = {
  name: 'DomiciliaryCompanyRequest',
  register: function (server: Hapi.Server, options: Options): void {
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/domiciliaryCompanyRequest/byDomiciliary`,
      options: {
        description: 'Returns a domiciliaryCompanyRequest',
        notes: 'Returns a domiciliaryCompanyRequest',
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
      handler: listDomiciliaryCompanyRequestByDomiciliary,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/domiciliaryCompanyRequest/byCompany`,
      options: {
        description: 'Returns a domiciliaryCompanyRequest',
        notes: 'Returns a domiciliaryCompanyRequest',
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
      handler: listDomiciliaryCompanyRequestByCompany,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/domiciliaryCompanyRequest/domiciliarysByCompany`,
      options: {
        description: 'Returns a domiciliaryCompanyRequest',
        notes: 'Returns a domiciliaryCompanyRequest',
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
      handler: listDomiciliarysByCompany,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/domiciliaryCompanyRequest/{id}`,
      options: {
        description: 'Returns a domiciliaryCompanyRequest',
        notes: 'Returns a domiciliaryCompanyRequest',
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
      handler: getDomiciliaryCompanyRequest,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/domiciliaryCompanyRequest`,
      options: {
        description: 'Return all domiciliaryCompanyRequest',
        notes: 'Return all domiciliaryCompanyRequest',
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
      handler: getAllDomiciliaryCompanyRequest,
    });

    server.route({
      method: 'POST',
      path: `${options.routePrefix}/domiciliaryCompanyRequest`,
      options: {
        description: 'Create domiciliaryCompanyRequest',
        notes: 'Create domiciliaryCompanyRequest',
        tags: ['api'],
        validate: {
          payload: Joi.object().keys({
            company: Joi.number().required(),
            domiciliary: Joi.number().required(),
          }),
        },
      },
      handler: createDomiciliaryCompanyRequest,
    });

    server.route({
      method: 'PATCH',
      path: `${options.routePrefix}/domiciliaryCompanyRequest/{id}`,
      options: {
        description: 'Updated Data DomiciliaryCompanyRequest',
        notes: 'Updated Data DomiciliaryCompanyRequest',
        tags: ['api'],
        validate: {
          payload: Joi.object().keys({
            company: Joi.number().optional(),
            domiciliary: Joi.number().optional(),
            state: Joi.string().required(),
          }),
          params: Joi.object({
            id: Joi.string().required(),
          }),
        },
        auth: {
          strategy: 'jwt',
        },
      },
      handler: updateDomiciliaryCompanyRequest,
    });

    server.route({
      method: 'DELETE',
      path: `${options.routePrefix}/domiciliaryCompanyRequest/{id}`,
      options: {
        description: 'Delete a DomiciliaryCompanyRequest',
        notes: 'Delete a DomiciliaryCompanyRequest',
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
      handler: deleteDomiciliaryCompanyRequest,
    });

  },
};
