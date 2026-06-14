import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import { Options } from '../../config/types';
import { createDelivery, updateDeliveryStatus, getDeliveryStatus, healthCheck } from '../../controllers/deliveryController';

export = {
  name: 'delivery-api',
  register: function (server: Hapi.Server, options: Options): void {
    
    // Endpoint para crear entregas (API real requerida por Hub Central)
    server.route({
      method: 'POST',
      path: `${options.routePrefix}/deliveries`,
      options: {
        description: 'Crear nueva entrega - API REAL Flujo 1A',
        notes: 'Endpoint crítico para completar Flujo 1A desde Hub Central',
        tags: ['api', 'deliveries', 'flujo-1a'],
        auth: false, // Validación por HMAC
        validate: {
          headers: Joi.object({
            'x-hub-signature': Joi.string().required(),
            'content-type': Joi.string().valid('application/json').required(),
          }).unknown(true),
          payload: Joi.object({
            orderId: Joi.string().required(),
            orderNumber: Joi.string().required(),
            customerName: Joi.string().required(),
            customerPhone: Joi.string().required(),
            customerEmail: Joi.string().optional().allow(''),
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
      handler: createDelivery,
    });

    // Endpoint para actualizar estado de entrega
    server.route({
      method: 'PATCH',
      path: `${options.routePrefix}/deliveries/{deliveryId}/status`,
      options: {
        description: 'Actualizar estado de entrega',
        notes: 'Endpoint para tracking de entregas',
        tags: ['api', 'deliveries', 'status'],
        auth: false,
        validate: {
          params: Joi.object({
            deliveryId: Joi.string().required(),
          }),
          payload: Joi.object({
            status: Joi.string().valid(
              'Compra', 'En_preparacion', 'Lista_para_envio', 
              'En_camino', 'Entregado', 'Devuelto', 'Cancelado'
            ).required(),
            notes: Joi.string().optional().allow(''),
            trackingInfo: Joi.object().optional(),
          }),
        },
      },
      handler: updateDeliveryStatus,
    });

    // Endpoint para consultar estado de entrega
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/deliveries/{deliveryId}/status`,
      options: {
        description: 'Consultar estado de entrega',
        notes: 'Endpoint para obtener información actual de entrega',
        tags: ['api', 'deliveries', 'tracking'],
        auth: false,
        validate: {
          params: Joi.object({
            deliveryId: Joi.string().required(),
          }),
        },
      },
      handler: getDeliveryStatus,
    });

    // Health check específico para API de entregas
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/deliveries/health`,
      options: {
        description: 'Health check del API de entregas',
        notes: 'Verificar estado operacional de la API de entregas',
        tags: ['api', 'health', 'deliveries'],
        auth: false,
      },
      handler: healthCheck,
    });
  },
};
