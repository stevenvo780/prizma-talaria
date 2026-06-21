import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { EntityManager } from 'typeorm';
import config from '../config';
import { deliveryService } from '../services/deliveryService';
import { webhookService } from '../services/webhookService';
import { outboxService } from '../services/outboxService';

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
  const manager: EntityManager = req.server.app.connection.manager;

  try {
    const payload = req.payload as WebhookPayload;
    const signature = (req.headers['x-prizma-signature'] || req.headers['x-hub-signature-256']) as string;

    // Validar firma HMAC
    const isValidSignature = webhookService.validateSignature(
      JSON.stringify(payload),
      signature,
      config.webhook.secret
    );

    if (!isValidSignature) {
      console.error('❌ [Talaria] Firma de webhook inválida');
      return Boom.unauthorized('Firma de webhook inválida');
    }

    console.log(`✅ [Talaria] Webhook recibido - Pedido: ${payload.orderNumber}`);

    // Procesar el pedido y crear la entrega
    const delivery = await deliveryService.createFromWebhook(manager, payload);

    // Persistir confirmación en outbox para reintentos (no setTimeout efímero)
    const outbox = await outboxService.persistConfirmation(manager, payload.orderId, 'success', {
      deliveryNumber: delivery.deliveryNumber,
      status: delivery.orderState,
      message: 'Entrega creada exitosamente',
    });

    // Intentar envío inmediato (asíncrono, no bloqueante)
    // Si falla, el outbox processor retentará periódicamente
    setImmediate(() => {
      outboxService.sendConfirmationWithRetry(outbox, manager).catch((err) => {
        console.error('[Outbox] Error en reintentos inmediatos:', err);
      });
    });

    return h.response({
      success: true,
      message: 'Webhook procesado correctamente',
      deliveryNumber: delivery.deliveryNumber,
      status: delivery.orderState,
    }).code(200);

  } catch (error: unknown) {
    console.error('❌ [Talaria] Error procesando webhook:', error);

    // Persistir confirmación de error en outbox para reintentos
    try {
      const payload = req.payload as WebhookPayload;
      const errorMessage = error instanceof Error ? error.message : String(error);

      const outbox = await outboxService.persistConfirmation(manager, payload.orderId, 'error', {
        message: errorMessage,
      });

      // Intentar envío inmediato
      setImmediate(() => {
        outboxService.sendConfirmationWithRetry(outbox, manager).catch((err) => {
          console.error('[Outbox] Error en reintentos de error:', err);
        });
      });
    } catch (confirmError) {
      console.error('❌ [Talaria] Error persistiendo confirmación de error:', confirmError);
    }

    if (error && typeof error === 'object' && 'isBoom' in error) {
      return error as Boom.Boom;
    }
    return Boom.internal('Error interno del servidor');
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
      service: 'Talaria Delivery Service',
      timestamp: new Date().toISOString(),
      database: 'connected'
    }).code(200);

  } catch (error) {
    console.error('❌ [Talaria] Error en health check:', error);
    return Boom.serverUnavailable('Servicio no disponible');
  }
}
