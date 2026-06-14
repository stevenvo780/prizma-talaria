import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import { Options } from '../../config/types';
import { UserRoleOptions } from '../../entities/users';
import {
  getAllGoogleSheets,
  getGoogleSheets,
  createGoogleSheets,
  updateGoogleSheets,
  deleteGoogleSheets,
} from './controller';

export = {
  name: 'googleSheets',
  register: function (server: Hapi.Server, options: Options): void {
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/googleSheets/{id}`,
      options: {
        description: 'Get all data googleSheets',
        notes: 'Get all data googleSheets',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
        },
        validate: {
          params: Joi.object({
            id: Joi.string(),
          }),
          query: Joi.object({
            sheet: Joi.string(),
          }),
        },
      },
      handler: getGoogleSheets,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/googleSheets`,
      options: {
        description: 'Get all categories and subcategories',
        notes: 'Description service',
        tags: ['api'],
        validate: {
          query: Joi.object({
            sheet: Joi.string(),
          }),
        },
        auth: {
          strategy: 'jwt',
          scope: [UserRoleOptions.DOMICILIARY, UserRoleOptions.ADMIN, UserRoleOptions.COMPANY],
        },
      },
      handler: getAllGoogleSheets,
    });

    server.route({
      method: 'POST',
      path: `${options.routePrefix}/googleSheets`,
      options: {
        description: 'Create googleSheets',
        notes: 'Create googleSheets',
        tags: ['api'],
        validate: {
          query: Joi.object({
            sheet: Joi.string(),
          }),
          payload: Joi.object().keys({
            NumeroDeEntrega: Joi.string(),
            NumeroDeCompra: Joi.string().required(),
            FechaCreacion: Joi.string(),
            Email: Joi.string(),
            TipoDeDocumento: Joi.string(),
            Documento: Joi.string(),
            Nombres: Joi.string(),
            Apellidos: Joi.string(),
            TelefonoCliente: Joi.string(),
            Prefijo: Joi.string(),
            DireccionEntrega: Joi.string(),
            Departamento: Joi.string(),
            Ciudad: Joi.string(),
            Barrio: Joi.string(),
            NombreConjuntoResidencial: Joi.string(),
            NumeroDeCasaOApto: Joi.string(),
            NotaEntrega: Joi.string(),
            PaqueteAEntregar: Joi.string(),
            UbicacionEntrega: Joi.string(),
            GeolocalizacionEntrega: Joi.string(),
            TipoDePago: Joi.string(),
            EstadoPedido: Joi.string(),
            Domiciliario: Joi.string(),
            FotoRecogida: Joi.string(),
            NotaDomiciliario: Joi.string(),
            DireccionRecogida: Joi.string(),
            HoraRecogida: Joi.string(),
          }),
        },
        auth: {
          strategy: 'jwt',
          scope: [UserRoleOptions.DOMICILIARY, UserRoleOptions.ADMIN, UserRoleOptions.COMPANY],
        },
      },
      handler: createGoogleSheets,
    });

    server.route({
      method: 'PATCH',
      path: `${options.routePrefix}/googleSheets/{id}`,
      options: {
        description: 'Updated Data googleSheets',
        notes: 'Updated Data googleSheets',
        tags: ['api'],
        validate: {
          params: Joi.object({
            id: Joi.string(),
          }),
          query: Joi.object({
            sheet: Joi.string(),
          }),
          payload: Joi.object().keys({
            NumeroDeEntrega: Joi.string(),
            NumeroDeCompra: Joi.string(),
            FechaCreacion: Joi.string(),
            Email: Joi.string(),
            TipoDeDocumento: Joi.string(),
            Documento: Joi.string(),
            Nombres: Joi.string(),
            Apellidos: Joi.string(),
            TelefonoCliente: Joi.string(),
            Prefijo: Joi.string(),
            DireccionEntrega: Joi.string(),
            Departamento: Joi.string(),
            Ciudad: Joi.string(),
            Barrio: Joi.string(),
            NombreConjuntoResidencial: Joi.string(),
            NumeroDeCasaOApto: Joi.string(),
            NotaEntrega: Joi.string(),
            PaqueteAEntregar: Joi.string(),
            UbicacionEntrega: Joi.string(),
            GeolocalizacionEntrega: Joi.string(),
            TipoDePago: Joi.string(),
            EstadoPedido: Joi.string(),
            Domiciliario: Joi.string(),
            FotoRecogida: Joi.string(),
            NotaDomiciliario: Joi.string(),
            DireccionRecogida: Joi.string(),
            HoraRecogida: Joi.string(),
          }),
        },
        auth: {
          strategy: 'jwt',
          scope: [UserRoleOptions.DOMICILIARY, UserRoleOptions.ADMIN, UserRoleOptions.COMPANY],
        },
      },
      handler: updateGoogleSheets,
    });

    server.route({
      method: 'DELETE',
      path: `${options.routePrefix}/googleSheets/{id}`,
      options: {
        description: 'Updated Data googleSheets',
        notes: 'Updated Data googleSheets',
        tags: ['api'],
        validate: {
          params: Joi.object({
            id: Joi.string(),
          }),
          query: Joi.object({
            sheet: Joi.string(),
          }),
        },
        auth: {
          strategy: 'jwt',
          scope: [UserRoleOptions.DOMICILIARY, UserRoleOptions.ADMIN, UserRoleOptions.COMPANY],
        },
      },
      handler: deleteGoogleSheets,
    });

  },
};
