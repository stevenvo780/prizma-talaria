import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import { Options } from '../../config/types';
import { UserRoleOptions } from '../../entities/users';
import {
  getAllOrder,
  getOrderByOrderId,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderByCompany,
  getOrderByUserDomiciliary,
  getOrderByCompanyForStatus,
  searchOrders,
  searchOrdersByDomiciliary,
  searchOrdersAll,
  createMassiveOrder,
  updateMassiveOrder,
  updateByDomiciliaryMassiveOrder,
  validateTracing,
  deleteOrderMassive,
  createOrderWebhook
} from './controller';

export = {
  name: 'order',
  register: function (server: Hapi.Server, options: Options): void {
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/order/search/all`,
      options: {
        description: 'Get all data order product',
        notes: 'Get all data order product',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
        },
        validate: {
          query: Joi.object({
            word: Joi.string().required(),
            take: Joi.number().optional().allow(''),
            skip: Joi.number().optional().allow(''),
          }),
        },
      },
      handler: searchOrdersAll,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/order/search`,
      options: {
        description: 'Get all data order product',
        notes: 'Get all data order product',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
        },
        validate: {
          query: Joi.object({
            word: Joi.string().required(),
            state: Joi.string().optional().allow(''),
            orderQuery: Joi.boolean().optional(),
            take: Joi.number().optional().allow(''),
            skip: Joi.number().optional().allow(''),
          }),
        },
      },
      handler: searchOrders,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/order/search/domiciliary`,
      options: {
        description: 'Get all data order product',
        notes: 'Get all data order product',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
        },
        validate: {
          query: Joi.object({
            word: Joi.string().required(),
            orderQuery: Joi.boolean().optional(),
            state: Joi.string().optional().allow(''),
            domiciliaryId: Joi.number().required(),
          }),
        },
      },
      handler: searchOrdersByDomiciliary,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/order/user/domiciliary`,
      options: {
        description: 'Get all data order product',
        notes: 'Get all data order product',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
        },
        validate: {
          query: Joi.object({
            take: Joi.number().optional().allow(''),
            skip: Joi.number().optional().allow(''),
            state: Joi.string().optional().allow(''),
            orderQuery: Joi.boolean().optional(),
            company: Joi.string().optional(),
          }),
        },
      },
      handler: getOrderByUserDomiciliary,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/order/domiciliary/validate/tracing`,
      options: {
        description: 'Get all data order product',
        notes: 'Get all data order product',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
        },
      },
      handler: validateTracing,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/order/company/{id}`,
      options: {
        description: 'Get all data order product',
        notes: 'Get all data order product',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
        },
        validate: {
          query: Joi.object({
            take: Joi.number().optional().allow(''),
            skip: Joi.number().optional().allow(''),
          }),
        },
      },
      handler: getOrderByCompany,
    });

    server.route({
      method: 'GET',
      path: `${options.routePrefix}/order/{orderId}`,
      options: {
        description: 'Get all data order',
        notes: 'Get all data order',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
        },
        validate: {
          params: Joi.object({
            orderId: Joi.string().required(),
          }),
        },
      },
      handler: getOrderByOrderId,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/order/byCompany/status/{status}`,
      options: {
        description: 'Get all data order',
        notes: 'Get all data order',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
        },
        validate: {
          query: Joi.object({
            take: Joi.number().optional().allow(''),
            skip: Joi.number().optional().allow(''),
            orderQuery: Joi.boolean().optional(),
          }),
          params: Joi.object({
            status: Joi.string().required(),
          }),
        },
      },
      handler: getOrderByCompanyForStatus,
    });

    server.route({
      method: 'GET',
      path: `${options.routePrefix}/order`,
      options: {
        description: 'Get all categories and subcategories',
        notes: 'Description service',
        tags: ['api'],
        validate: {
          query: Joi.object({
            take: Joi.number().optional().allow(''),
            skip: Joi.number().optional().allow(''),
          }),
        },
        auth: {
          strategy: 'jwt',
          scope: [
            UserRoleOptions.COMPANY,
            UserRoleOptions.ADMIN
          ],
        },
      },
      handler: getAllOrder,
    });
    server.route({
      method: 'POST',
      path: `${options.routePrefix}/order/massive`,
      options: {
        description: 'Create order',
        notes: 'Create order',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
          scope: [
            UserRoleOptions.COMPANY,
            UserRoleOptions.ADMIN
          ],
        },
        validate: {
          payload: Joi.object().keys({
            orders:
              Joi.array().items(Joi.object().keys({
                NumeroDeCompra: Joi.string().required(),
                Email: Joi.string().optional().allow(''),
                TipoDeDocumento: Joi.string().optional().allow(''),
                Documento: Joi.string().optional().allow(''),
                Nombres: Joi.string().optional().allow(''),
                Apellidos: Joi.string().optional().allow(''),
                TelefonoCliente: Joi.string().optional().allow(''),
                Prefijo: Joi.string().optional().allow(''),
                DireccionEntrega: Joi.string().optional().allow(''),
                Departamento: Joi.string().optional().allow(''),
                Ciudad: Joi.string().optional().allow(''),
                Barrio: Joi.string().optional().allow(''),
                NombreConjuntoResidencial: Joi.string().optional().allow(''),
                NumeroDeCasaOApto: Joi.string().optional().allow(''),
                NotaEntrega: Joi.string().optional().allow(''),
                PaqueteAEntregar: Joi.string().optional().allow(''),
                UbicacionEntrega: Joi.string().optional().allow(''),
                TipoDePago: Joi.string().optional().allow(''),
                Domiciliario: Joi.string().optional().allow(''),
                DireccionRecogida: Joi.string().optional().allow(''),
                AutoEntrega: Joi.string().optional().allow(''),
                AutoDespacho: Joi.string().optional().allow(''),
              })
              ),
          }),
        },
      },
      handler: createMassiveOrder,
    });
    server.route({
      method: 'PATCH',
      path: `${options.routePrefix}/order/massive`,
      options: {
        description: 'update order',
        notes: 'update order',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
          scope: [
            UserRoleOptions.COMPANY,
            UserRoleOptions.DOMICILIARY,
            UserRoleOptions.ADMIN
          ],
        },
        validate: {
          payload: Joi.object().keys({
            orders:
              Joi.array().items(Joi.object().keys({
                id: Joi.string().optional().allow(''),
                deliveryNumber: Joi.string().optional().allow(''),
                purchaseNumber: Joi.string().optional().allow(''),
                creationDate: Joi.string().optional().allow(''),
                email: Joi.string().optional().allow(''),
                typeDocument: Joi.string().optional().allow(''),
                documentNumber: Joi.string().optional().allow(''),
                name: Joi.string().optional().allow(''),
                lastName: Joi.string().optional().allow(''),
                clientPhone: Joi.string().optional().allow(''),
                prefix: Joi.string().optional().allow(''),
                deliveryAddress: Joi.string().optional().allow(''),
                department: Joi.string().optional().allow(''),
                city: Joi.string().optional().allow(''),
                neighborhood: Joi.string().optional().allow(''),
                residentialGroupName: Joi.string().optional().allow(''),
                houseNumberOrApartment: Joi.string().optional().allow(''),
                deliveryNote: Joi.string().optional().allow(''),
                deliveryPacket: Joi.string().optional().allow(''),
                geolocationDelivery: Joi.string().optional().allow(''),
                paymentMethod: Joi.string().optional().allow(''),
                orderState: Joi.string().optional().allow(''),
                domiciliary: Joi.string().optional().allow(''),
                pickupPicture: Joi.string().optional().allow(''),
                dealerNote: Joi.string().optional().allow(''),
                pickupAddress: Joi.string().optional().allow(''),
                pickupTime: Joi.string().optional().allow(''),
                pickupLocation: Joi.string().optional().allow(''),
                company: Joi.string().optional().allow(''),
              })
              ),
          }),
        },
      },
      handler: updateMassiveOrder,
    });

    server.route({
      method: 'PATCH',
      path: `${options.routePrefix}/order/domiciliary/massive`,
      options: {
        description: 'update order',
        notes: 'update order',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
          scope: [
            UserRoleOptions.COMPANY,
            UserRoleOptions.DOMICILIARY,
            UserRoleOptions.ADMIN
          ],
        },
        validate: {
          payload: Joi.object().keys({
            orders:
              Joi.array().items(Joi.object().keys({
                id: Joi.string().optional().allow(''),
                deliveryNumber: Joi.string().optional().allow(''),
                purchaseNumber: Joi.string().optional().allow(''),
                creationDate: Joi.string().optional().allow(''),
                email: Joi.string().optional().allow(''),
                typeDocument: Joi.string().optional().allow(''),
                documentNumber: Joi.string().optional().allow(''),
                name: Joi.string().optional().allow(''),
                lastName: Joi.string().optional().allow(''),
                clientPhone: Joi.string().optional().allow(''),
                prefix: Joi.string().optional().allow(''),
                deliveryAddress: Joi.string().optional().allow(''),
                department: Joi.string().optional().allow(''),
                city: Joi.string().optional().allow(''),
                neighborhood: Joi.string().optional().allow(''),
                residentialGroupName: Joi.string().optional().allow(''),
                houseNumberOrApartment: Joi.string().optional().allow(''),
                deliveryNote: Joi.string().optional().allow(''),
                deliveryPacket: Joi.string().optional().allow(''),
                geolocationDelivery: Joi.string().optional().allow(''),
                paymentMethod: Joi.string().optional().allow(''),
                orderState: Joi.string().optional().allow(''),
                domiciliary: Joi.string().optional().allow(''),
                pickupPicture: Joi.string().optional().allow(''),
                dealerNote: Joi.string().optional().allow(''),
                pickupAddress: Joi.string().optional().allow(''),
                pickupTime: Joi.string().optional().allow(''),
                pickupLocation: Joi.string().optional().allow(''),
                company: Joi.string().optional().allow(''),
              })
              ),
          }),
        },
      },
      handler: updateByDomiciliaryMassiveOrder,
    });

    server.route({
      method: 'POST',
      path: `${options.routePrefix}/order`,
      options: {
        description: 'Create order',
        notes: 'Create order',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
          scope: [
            UserRoleOptions.COMPANY,
            UserRoleOptions.ADMIN
          ],
        },
        validate: {
          payload: Joi.object().keys({
            deliveryNumber: Joi.number().optional().allow(''),
            purchaseNumber: Joi.number().required(),
            creationDate: Joi.string().optional().allow(''),
            email: Joi.string().optional().allow(''),
            typeDocument: Joi.string().optional().allow(''),
            documentNumber: Joi.string().optional().allow(''),
            name: Joi.string().optional().allow(''),
            lastName: Joi.string().optional().allow(''),
            clientPhone: Joi.string().optional().allow(''),
            prefix: Joi.string().optional().allow(''),
            deliveryAddress: Joi.string().optional().allow(''),
            department: Joi.string().optional().allow(''),
            city: Joi.string().optional().allow(''),
            neighborhood: Joi.string().optional().allow(''),
            residentialGroupName: Joi.string().optional().allow(''),
            houseNumberOrApartment: Joi.string().optional().allow(''),
            deliveryNote: Joi.string().optional().allow(''),
            deliveryPacket: Joi.string().optional().allow(''),
            geolocationDelivery: Joi.string().optional().allow(''),
            paymentMethod: Joi.string().optional().allow(''),
            orderState: Joi.string().optional().allow(''),
            domiciliary: Joi.string().optional().allow(''),
            pickupPicture: Joi.string().optional().allow(''),
            dealerNote: Joi.string().optional().allow(''),
            pickupAddress: Joi.string().optional().allow(''),
            pickupTime: Joi.string().optional().allow(''),
            deliveryUbication: Joi.string().optional().allow(''),
            pickupLocation: Joi.string().optional().allow(''),
          }),
        },
      },
      handler: createOrder,
    });
    server.route({
      method: 'POST',
      path: `${options.routePrefix}/order/webhook/{token}`,
      options: {
        description: 'Create order',
        notes: 'Create order',
        tags: ['api'],
        validate: {
          params: Joi.object({
            token: Joi.string().required(),
          }),
          payload: Joi.object().keys({
            deliveryNumber: Joi.number().optional().allow(''),
            purchaseNumber: Joi.number().required(),
            creationDate: Joi.string().optional().allow(''),
            email: Joi.string().optional().allow(''),
            typeDocument: Joi.string().optional().allow(''),
            documentNumber: Joi.string().optional().allow(''),
            name: Joi.string().optional().allow(''),
            lastName: Joi.string().optional().allow(''),
            clientPhone: Joi.string().optional().allow(''),
            prefix: Joi.string().optional().allow(''),
            deliveryAddress: Joi.string().optional().allow(''),
            department: Joi.string().optional().allow(''),
            city: Joi.string().optional().allow(''),
            neighborhood: Joi.string().optional().allow(''),
            residentialGroupName: Joi.string().optional().allow(''),
            houseNumberOrApartment: Joi.string().optional().allow(''),
            deliveryNote: Joi.string().optional().allow(''),
            deliveryPacket: Joi.string().optional().allow(''),
            geolocationDelivery: Joi.string().optional().allow(''),
            paymentMethod: Joi.string().optional().allow(''),
            orderState: Joi.string().optional().allow(''),
            domiciliary: Joi.string().optional().allow(''),
            pickupPicture: Joi.string().optional().allow(''),
            dealerNote: Joi.string().optional().allow(''),
            pickupAddress: Joi.string().optional().allow(''),
            pickupTime: Joi.string().optional().allow(''),
            deliveryUbication: Joi.string().optional().allow(''),
            pickupLocation: Joi.string().optional().allow(''),
          }),
        },
      },
      handler: createOrderWebhook,
    });
    server.route({
      method: 'PATCH',
      path: `${options.routePrefix}/order/{orderId}`,
      options: {
        description: 'Updated Data order',
        notes: 'Updated Data order',
        tags: ['api'],
        validate: {
          params: Joi.object({
            orderId: Joi.number().required(),
          }),
          payload: Joi.object().keys({
            deliveryNumber: Joi.number().optional().allow(''),
            purchaseNumber: Joi.number().optional().allow(''),
            creationDate: Joi.string().optional().allow(''),
            email: Joi.string().optional().allow(''),
            typeDocument: Joi.string().optional().allow(''),
            documentNumber: Joi.string().optional().allow(''),
            name: Joi.string().optional().allow(''),
            lastName: Joi.string().optional().allow(''),
            clientPhone: Joi.string().optional().allow(''),
            prefix: Joi.string().optional().allow(''),
            deliveryAddress: Joi.string().optional().allow(''),
            department: Joi.string().optional().allow(''),
            city: Joi.string().optional().allow(''),
            neighborhood: Joi.string().optional().allow(''),
            residentialGroupName: Joi.string().optional().allow(''),
            houseNumberOrApartment: Joi.string().optional().allow(''),
            deliveryNote: Joi.string().optional().allow(''),
            deliveryPacket: Joi.string().optional().allow(''),
            geolocationDelivery: Joi.string().optional().allow(''),
            paymentMethod: Joi.string().optional().allow(''),
            orderState: Joi.string().optional().allow(''),
            domiciliary: Joi.string().optional().allow(''),
            pickupPicture: Joi.string().optional().allow(''),
            dealerNote: Joi.string().optional().allow(''),
            pickupAddress: Joi.string().optional().allow(''),
            pickupTime: Joi.string().optional().allow(''),
            pickupLocation: Joi.string().optional().allow(''),
          }),
        },
        auth: {
          strategy: 'jwt',
        },
      },
      handler: updateOrder,
    });
    server.route({
      method: 'DELETE',
      path: `${options.routePrefix}/order/{deliveryNumber}`,
      options: {
        description: 'Updated Data order',
        notes: 'Updated Data order',
        tags: ['api'],
        validate: {
          params: Joi.object({
            deliveryNumber: Joi.number().required(),
          }),
        },
        auth: {
          strategy: 'jwt',
          scope: [
            UserRoleOptions.COMPANY,
            UserRoleOptions.ADMIN
          ],
        },
      },
      handler: deleteOrder,
    });
    server.route({
      method: 'DELETE',
      path: `${options.routePrefix}/order/massive`,
      options: {
        description: 'Updated Data order',
        notes: 'Updated Data order',
        tags: ['api'],
        validate: {
          payload: Joi.object({
            deliverysNumber: Joi.array().items(Joi.number().required()),
          }),
        },
        auth: {
          strategy: 'jwt',
          scope: [
            UserRoleOptions.COMPANY,
            UserRoleOptions.ADMIN
          ],
        },
      },
      handler: deleteOrderMassive,
    });
  },
};
