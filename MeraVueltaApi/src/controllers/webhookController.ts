import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { EntityManager } from 'typeorm';
import config from '../config';
import { deliveryService } from '../services/deliveryService';
import { webhookService } from '../services/webhookService';

export interface WebhookPayload {
  orderId: string;
  orderNumber: string;
  status: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerDocument?: string;
  customerDocumentType?: string;
  deliveryAddress: string;
  city: string;
  department: string;
  orderValue: number;
  paymentMethod: string;
  products: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  deliveryNotes?: string;
  timestamp: string;
}

/**
 * Webhook endpoint para recibir pedidos desde Hub Central
 */
export async function receiveWebhook(req: Hapi.request, h: Hapi.ResponseToolkit): Promise<Hapi.ResponseObject | Boom.Boom> {
  try {
    const manager: EntityManager = req.server.app.connection.manager;
    const payload = req.payload as WebhookPayload;
    const signature = req.headers['x-hub-signature-256'] as string;

    // Validar firma HMAC
    const isValidSignature = webhookService.validateSignature(
      JSON.stringify(payload),
      signature,
      config.webhook.secret
    );

    if (!isValidSignature) {
      console.error('❌ [MeraVuelta] Firma de webhook inválida');
      return Boom.unauthorized('Firma de webhook inválida');
    }

    console.log(`✅ [MeraVuelta] Webhook recibido - Pedido: ${payload.orderNumber}`);

    // Procesar el pedido y crear la entrega
    const delivery = await deliveryService.createFromWebhook(manager, payload);

    // Enviar confirmación asíncrona al Hub Central
    setTimeout(async () => {
      try {
        await webhookService.sendAsyncConfirmation(payload.orderId, 'success', {
          deliveryNumber: delivery.deliveryNumber,
          status: delivery.orderState,
          message: 'Entrega creada exitosamente'
        });
      } catch (error) {
        console.error('❌ [MeraVuelta] Error enviando confirmación asíncrona:', error);
      }
    }, 1000);

    return h.response({
      success: true,
      message: 'Webhook procesado correctamente',
      deliveryNumber: delivery.deliveryNumber,
      status: delivery.orderState
    }).code(200);

  } catch (error: unknown) {
    console.error('❌ [MeraVuelta] Error procesando webhook:', error);

    // Enviar confirmación de error asíncrona
    setTimeout(async () => {
      try {
        const payload = req.payload as WebhookPayload;
        await webhookService.sendAsyncConfirmation(payload.orderId, 'error', {
          message: (error as Error).message || 'Error procesando webhook'
        });
      } catch (confirmError) {
        console.error('❌ [MeraVuelta] Error enviando confirmación de error:', confirmError);
      }
    }, 1000);

    if (error && typeof error === 'object' && 'isBoom' in error) {
      return error as Boom.Boom;
    }    return Boom.internal('Error interno del servidor');
  }
}

/**
 * Health check para verificar el estado del servicio de entregas
 */
export async function healthCheck(req: Hapi.request, h: Hapi.ResponseToolkit): Promise<Hapi.ResponseObject | Boom.Boom> {
  try {
    const manager: EntityManager = req.server.app.connection.manager;
    
    // Verificar conectividad de base de datos
    await manager.query('SELECT 1');

    return h.response({
      status: 'ok',
      service: 'MeraVuelta Delivery Service',
      timestamp: new Date().toISOString(),
      database: 'connected'
    }).code(200);

  } catch (error) {
    console.error('❌ [MeraVuelta] Error en health check:', error);
    return Boom.serverUnavailable('Servicio no disponible');
  }
}
