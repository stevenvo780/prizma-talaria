import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import { Options } from '../../config/types';
import { receiveWebhook, healthCheck } from '../../controllers/webhookController';

export = {
  name: 'nous-webhooks',
  register: function (server: Hapi.Server, options: Options): void {
    // Endpoint para recibir webhooks del Hub Central
    server.route({
      method: 'POST',
      path: `${options.routePrefix}/webhooks/deliveries`,
      options: {
        description: 'Recibir webhook de pedidos desde Hub Central para crear entregas',
        notes: 'Endpoint que recibe pedidos pagados desde Hermes vía Hub Central y los convierte en entregas de Talaria',
        tags: ['api', 'webhooks', 'nous'],
        auth: false, // Sin autenticación, validación por HMAC
        validate: {
          headers: Joi.object({
            'x-prizma-signature': Joi.string().optional(),
            'x-hub-signature-256': Joi.string().optional(),
            'content-type': Joi.string().valid('application/json').required(),
          }).unknown(true),
          payload: Joi.object({
            orderId: Joi.string().required(),
            orderNumber: Joi.string().required(),
            status: Joi.string().required(),
            customerName: Joi.string().required(),
            customerPhone: Joi.string().required(),
            customerEmail: Joi.string().optional().allow(''),
            customerDocument: Joi.string().optional().allow(''),
            customerDocumentType: Joi.string().optional().allow(''),
            deliveryAddress: Joi.string().required(),
            city: Joi.string().required(),
            department: Joi.string().required(),
            orderValue: Joi.number().required(),
            paymentMethod: Joi.string().required(),
            products: Joi.array().items(
              Joi.object({
                name: Joi.string().required(),
                quantity: Joi.number().required(),
                unitPrice: Joi.number().required(),
                totalPrice: Joi.number().required(),
              })
            ).required(),
            deliveryNotes: Joi.string().optional().allow(''),
            timestamp: Joi.string().required(),
          }),
        },
      },
      handler: receiveWebhook,
    });

    // Health check endpoint
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/webhooks/health`,
      options: {
        description: 'Health check del servicio de webhooks de Talaria',
        notes: 'Verificar estado del servicio de entregas',
        tags: ['api', 'health'],
        auth: false,
      },
      handler: healthCheck,
    });
  },
};
