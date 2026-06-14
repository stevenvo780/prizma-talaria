import Hapi from '@hapi/hapi';
import { Options } from '../../config/types';
import {
  payUsers,
  validatePay,
  cancelSubscription,
} from './controller';
import Joi from '@hapi/joi';

export = {
  name: 'payUsers',
  register: function (server: Hapi.Server, options: Options): void {
    server.route({
      method: 'POST',
      path: `${options.routePrefix}/payUsers`,
      options: {
        description: 'Get all data payUsers',
        notes: 'Get all data payUsers',
        tags: ['api'],
        validate: {
          payload: Joi.object().keys({
            token: Joi.string().required(),
            typePlan: Joi.string().required(),
            emailAddress: Joi.string().required(),
            creditCard: Joi.object({
              number: Joi.string().required(),
              securityCode: Joi.string().required(),
              expirationDate: Joi.string().required(),
              name: Joi.string().required()
            }).required(),
          }),
        },
        auth: {
          strategy: 'jwt',
        },
      },
      handler: payUsers,
    });
    server.route({
      method: 'POST',
      path: `${options.routePrefix}/validatePay`,
      options: {
        description: 'Get all data validatePay',
        notes: 'Get all data validatePay',
        tags: ['api'],
      },
      handler: validatePay,
    });
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/cancelSubscription`,
      options: {
        description: 'Get all data validatePay',
        notes: 'Get all data validatePay',
        tags: ['api'],
        auth: {
          strategy: 'jwt',
        },
      },
      handler: cancelSubscription,
    });
  },
};
