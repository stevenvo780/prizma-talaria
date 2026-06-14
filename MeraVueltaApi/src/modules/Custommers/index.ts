import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import { Options } from '../../config/types';
import { UserRoleOptions } from '../../entities/users';
import {
  getAllCustomer,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  listCustomerByCompany,
  listCustomerByDomiciliary,
  createCustomerMassive
} from './controller';

export = {
  name: 'Customer',
  register: function (server: Hapi.Server, options: Options): void {
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/customer/byDomiciliary`,
      options: {
        description: 'Returns a customer',
        notes: 'Returns a customer',
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
      handler: listCustomerByDomiciliary,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/customer/byCompany`,
      options: {
        description: 'Returns a customer',
        notes: 'Returns a customer',
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
      handler: listCustomerByCompany,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/customer/{id}`,
      options: {
        description: 'Returns a customer',
        notes: 'Returns a customer',
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
      handler: getCustomer,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/customer`,
      options: {
        description: 'Return all customer',
        notes: 'Return all customer',
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
      handler: getAllCustomer,
    });
    server.route({
      method: 'POST',
      path: `${options.routePrefix}/customer`,
      options: {
        description: 'Create customer',
        notes: 'Create customer',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
          scope: [
            UserRoleOptions.ADMIN,
            UserRoleOptions.DOMICILIARY,
            UserRoleOptions.COMPANY,
          ]
        },
        validate: {
          payload: Joi.object().keys({
            order: Joi.string().required(),
            prefix: Joi.string().required(),
            clientPhone: Joi.string().required(),
            company: Joi.any().allow(null).optional(),
            name: Joi.string().allow(null).optional(),
            lastName: Joi.string().allow(null).optional(),
            documentNumber: Joi.string().allow(null).optional(),
            typeDocument: Joi.string().allow(null).optional(),
            email: Joi.string().allow(null).optional(),
            city: Joi.string().allow(null).optional(),
            department: Joi.string().allow(null).optional(),
            neighborhood: Joi.string().allow(null).optional(),
            residentialGroupName: Joi.string().allow(null).optional(),
            houseNumberOrApartment: Joi.string().allow(null).optional(),
            deliveryAddress: Joi.string().allow(null).optional(),
            paymentMethod: Joi.string().allow(null).optional(),
            geolocationDelivery: Joi.string().allow(null).optional(),
            zone: Joi.string().allow(null).optional(),
          }).unknown(),
        },
      },
      handler: createCustomer,
    });
    server.route({
      method: 'POST',
      path: `${options.routePrefix}/customer/massive`,
      options: {
        description: 'Create customer',
        notes: 'Create customer',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
          scope: [
            UserRoleOptions.ADMIN,
            UserRoleOptions.DOMICILIARY,
            UserRoleOptions.COMPANY,
          ]
        },
        validate: {
          payload: Joi.array().items(Joi.object().keys({
            prefix: Joi.string().required(),
            clientPhone: Joi.string().required(),
            company: Joi.any().allow(null).optional(),
            name: Joi.string().allow(null).optional(),
            lastName: Joi.string().allow(null).optional(),
            documentNumber: Joi.string().allow(null).optional(),
            typeDocument: Joi.string().allow(null).optional(),
            email: Joi.string().allow(null).optional(),
            city: Joi.string().allow(null).optional(),
            department: Joi.string().allow(null).optional(),
            neighborhood: Joi.string().allow(null).optional(),
            residentialGroupName: Joi.string().allow(null).optional(),
            houseNumberOrApartment: Joi.string().allow(null).optional(),
            deliveryAddress: Joi.string().allow(null).optional(),
            paymentMethod: Joi.string().allow(null).optional(),
            geolocationDelivery: Joi.string().allow(null).optional(),
            zone: Joi.string().allow(null).optional(),
          }).unknown()),
        },
      },
      handler: createCustomerMassive,
    });
    server.route({
      method: 'PUT',
      path: `${options.routePrefix}/customer/{id}`,
      options: {
        description: 'Update customer',
        notes: 'Update customer',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
          scope: [
            UserRoleOptions.ADMIN,
            UserRoleOptions.DOMICILIARY,
            UserRoleOptions.COMPANY,
          ]
        },
        validate: {
          params: Joi.object().keys({
            id: Joi.string().required(),
          }),
          payload: Joi.object().keys({
            order: Joi.number().required(),
            company: Joi.any().allow(null).optional(),
            name: Joi.string().allow(null).optional(),
            lastName: Joi.string().allow(null).optional(),
            documentNumber: Joi.string().allow(null).optional(),
            typeDocument: Joi.string().allow(null).optional(),
            email: Joi.string().allow(null).optional(),
            prefix: Joi.string().allow(null).optional(),
            clientPhone: Joi.string().allow(null).optional(),
            city: Joi.string().allow(null).optional(),
            department: Joi.string().allow(null).optional(),
            neighborhood: Joi.string().allow(null).optional(),
            residentialGroupName: Joi.string().allow(null).optional(),
            houseNumberOrApartment: Joi.string().allow(null).optional(),
            deliveryAddress: Joi.string().allow(null).optional(),
            paymentMethod: Joi.string().allow(null).optional(),
            geolocationDelivery: Joi.string().allow(null).optional(),
            zone: Joi.string().allow(null).optional(),
          }).unknown(),
        },
      },
      handler: updateCustomer,
    });
    server.route({
      method: 'DELETE',
      path: `${options.routePrefix}/customer/{id}`,
      options: {
        description: 'Delete a Customer',
        notes: 'Delete a Customer',
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
      handler: deleteCustomer,
    });

  },
};
