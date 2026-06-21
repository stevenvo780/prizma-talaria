import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import { Options } from '../../config/types';
import { createDelivery } from '../../controllers/deliveryController';

/**
 * Nous Delivery Bridge — acepta el payload canónico `delivery.create` de Nous
 * y lo adapta al schema de DeliveryAPI existente.
 *
 * Payload canónico (más laxo que el de DeliveryAPI nativo):
 * - orderId, customer (name, phone, email), address, items, total
 * - Campos opcionales: deliveryNotes, metadata
 */
export = {
  name: 'nous-delivery-bridge',
  register: function (server: Hapi.Server, options: Options): void {
    server.route({
      method: 'POST',
      path: `${options.routePrefix}/delivery/create`,
      options: {
        description: 'Bridge canónico delivery.create → DeliveryAPI (conector Nous)',
        notes: 'Recibe payload canónico de Nous y lo adapta al handler de DeliveryAPI existente',
        tags: ['api', 'deliveries', 'nous', 'bridge'],
        auth: false,
        validate: {
          headers: Joi.object({
            'x-hub-signature': Joi.string().optional(),
            'content-type': Joi.string().valid('application/json').required(),
          }).unknown(true),
          payload: Joi.object({
            orderId: Joi.string().required(),
            orderNumber: Joi.string().optional().default(''),
            customer: Joi.object({
              name: Joi.string().required(),
              phone: Joi.string().required(),
              email: Joi.string().optional().allow(''),
            }).required(),
            address: Joi.object({
              line: Joi.string().required(),
              city: Joi.string().required(),
              department: Joi.string().required(),
            }).required(),
            items: Joi.array().items(
              Joi.object({
                name: Joi.string().required(),
                quantity: Joi.number().required(),
                unitPrice: Joi.number().required(),
                totalPrice: Joi.number().optional(),
              }),
            ).required(),
            total: Joi.number().required(),
            deliveryNotes: Joi.string().optional().allow(''),
            metadata: Joi.object().optional(),
          }),
        },
      },
      handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
        const canonical = request.payload as any;
        console.log(`[NousBridge] delivery.create recibido: orderId=${canonical.orderId}`);

        // Calcular totalPrice por item si no viene
        const products = (canonical.items || []).map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice ?? (item.unitPrice * item.quantity),
        }));

        // Adaptar payload canónico al formato que espera DeliveryAPI
        const adaptedPayload = {
          orderId: canonical.orderId,
          orderNumber: canonical.orderNumber || canonical.orderId,
          customerName: canonical.customer?.name || '',
          customerPhone: canonical.customer?.phone || '',
          customerEmail: canonical.customer?.email || '',
          deliveryAddress: canonical.address?.line || '',
          city: canonical.address?.city || '',
          department: canonical.address?.department || '',
          orderValue: canonical.total || 0,
          paymentMethod: canonical.metadata?.paymentMethod || 'online',
          products,
          deliveryNotes: canonical.deliveryNotes || '',
          timestamp: new Date().toISOString(),
        };

        // Delegar al handler existente de DeliveryAPI
        const adaptedRequest = {
          ...request,
          payload: adaptedPayload,
          headers: {
            ...request.headers,
            'x-hub-signature': request.headers['x-hub-signature'] || 'nous-bridge',
          },
        } as Hapi.Request;

        return createDelivery(adaptedRequest, h);
      },
    });

    // Health check del bridge
    server.route({
      method: 'GET',
      path: `${options.routePrefix}/delivery/create/health`,
      options: {
        description: 'Health check del bridge Nous→DeliveryAPI',
        tags: ['api', 'health', 'nous'],
        auth: false,
      },
      handler: (_req: Hapi.Request, h: Hapi.ResponseToolkit) => {
        return h.response({
          status: 'healthy',
          bridge: 'nous-delivery-bridge',
          target: 'DeliveryAPI',
          timestamp: new Date().toISOString(),
        }).code(200);
      },
    });
  },
};
