import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import {
  authenticate,
  register,
  confirmEmail,
  reSendConfirmEmail,
  recoverPasswordSendEmail,
  recoverPassword,
  emailQuestion,
  refreshAccessToken
} from './controller';
import { Options } from '../../config/types';

export = {
  name: 'auth',
  register: function (server: Hapi.Server, options: Options): void {
    server.route({
      method: 'POST',
      path: `${options.routePrefix}/auth`,
      options: {
        description: 'Get status service',
        notes: 'Service to obtain the status of the project',
        tags: ['api'],
        validate: {
          payload: {
            email: Joi.string().email().required(),
            password: Joi.string().required(),
          },
        },
      },
      handler: authenticate,
    });

    server.route({
      method: 'POST',
      path: `${options.routePrefix}/register`,
      options: {
        description: 'Get status service',
        notes: 'Service to obtain the status of the project',
        tags: ['api'],
        validate: {
          payload: {
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            name: Joi.string().required(),
            lastName: Joi.string().required(),
            bornDate: Joi.string().required(),
            address: Joi.string().required(),
            clientPhone: Joi.string().required(),
            role: Joi.string().required(),
            typeDocument: Joi.string().required(),
            documentNumber: Joi.string().required(),
            companyName: Joi.string().optional(),
            prefix: Joi.string().optional(),
          },
        },
      },
      handler: register,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/confirmEmail/{token}`,
      options: {
        description: 'Get status service',
        notes: 'Service to obtain the status of the project',
        tags: ['api'],
        validate: {
          params: {
            token: Joi.string().required(),
          },
        },
      },
      handler: confirmEmail,
    });
    server.route({
      method: 'POST',
      path: `${options.routePrefix}/reSendConfirmEmail`,
      options: {
        description: 'Get status service',
        notes: 'Service to obtain the status of the project',
        tags: ['api'],
        validate: {
          payload: {
            email: Joi.string().email().optional(),
          },
        },
        auth: {
          strategy: 'jwt',
          mode: 'optional'
        },
      },
      handler: reSendConfirmEmail,
    });
    server.route({
      method: 'POST',
      path: `${options.routePrefix}/recoverPasswordSendEmail`,
      options: {
        description: 'Get status service',
        notes: 'Service to obtain the status of the project',
        tags: ['api'],
        validate: {
          payload: {
            email: Joi.string().email().optional(),
          },
        },
      },
      handler: recoverPasswordSendEmail,
    });
    server.route({
      method: 'POST',
      path: `${options.routePrefix}/recoverPassword`,
      options: {
        description: 'Get status service',
        notes: 'Service to obtain the status of the project',
        tags: ['api'],
        validate: {
          payload: {
            token: Joi.string().required(),
            password: Joi.string().required(),
          },
        },
      },
      handler: recoverPassword,
    });
    server.route({
      method: 'POST',
      path: `${options.routePrefix}/questionMail`,
      options: {
        description: 'Get status service',
        notes: 'Service to obtain the status of the project',
        tags: ['api'],
        validate: {
          payload: {
            name: Joi.string().required(),
            mail: Joi.string().required(),
            phone: Joi.string().required(),
            message: Joi.string().required(),
          },
        },
      },
      handler: emailQuestion,
    });

    server.route({
      method: 'POST',
      path: `${options.routePrefix}/auth/refresh`,
      options: {
        description: 'Refresh access token using refresh token',
        notes: 'Exchange a valid refresh token for a new short-lived access token',
        tags: ['api'],
        validate: {
          payload: {
            refreshToken: Joi.string().required(),
          },
        },
      },
      handler: refreshAccessToken,
    });
  },
};
