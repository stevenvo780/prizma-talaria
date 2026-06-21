import Hapi from '@hapi/hapi';
import crypto from 'crypto';
import { getManager } from 'typeorm';
import { deliveryService } from '../services/deliveryService';
import axios from 'axios';
import {
  publishDeliveryCreated,
  publishDeliveryStatusUpdate,
  publishDeliveryCompleted,
  isCompletedStatus,
} from '../prizma/hub';

// Tipos para la API de entregas
interface DeliveryPayload {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
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

interface StatusUpdatePayload {
  status: string;
  notes?: string;
  trackingInfo?: Record<string, unknown>;
}

// HMAC validation para seguridad
function validateHubSignature(payload: string, signature: string): boolean {
  if (!signature || !signature.startsWith('sha256=')) {
    return false;
  }
  const secret = process.env.PRIZMA_NOUS_SECRET || 'default-secret';
  const expectedSignature = `sha256=${crypto.createHmac('sha256', secret).update(payload).digest('hex')}`;
  if (signature.length !== expectedSignature.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

// Crear nueva entrega desde Hub Central - ENDPOINT CRÍTICO FLUJO 1A
export async function createDelivery(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<Hapi.ResponseObject> {
  try {
    console.log('🚚 Talaria API - Recibiendo orden de entrega para Flujo 1A');
    
    // Validar HMAC signature
    const signature = (request.headers['x-prizma-signature'] || request.headers['x-hub-signature']) as string;
    const payload = JSON.stringify(request.payload);
    
    if (!validateHubSignature(payload, signature)) {
      console.error('❌ Firma HMAC inválida en solicitud de entrega');
      return h.response({ 
        error: 'Invalid signature', 
        code: 'INVALID_SIGNATURE' 
      }).code(401);
    }

    const orderData = request.payload as DeliveryPayload;
    console.log(`📦 Procesando orden: ${orderData.orderNumber} para cliente: ${orderData.customerName}`);

    const manager = getManager();

    // Crear entrega usando el servicio existente
    const delivery = await deliveryService.createFromWebhook(manager, {
      orderId: orderData.orderId,
      orderNumber: orderData.orderNumber,
      status: 'Compra',
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail || '',
      customerDocument: '',
      customerDocumentType: 'CC',
      deliveryAddress: orderData.deliveryAddress,
      city: orderData.city,
      department: orderData.department,
      orderValue: orderData.orderValue,
      paymentMethod: orderData.paymentMethod,
      products: orderData.products,
      deliveryNotes: orderData.deliveryNotes || '',
      timestamp: orderData.timestamp
    });

    console.log(`✅ Entrega creada: ID ${delivery.id} - Número: ${delivery.deliveryNumber} - Estado: ${delivery.orderState}`);

    // Prizma: publicar delivery.created al Nous (no bloqueante, tolerante a fallos)
    void publishDeliveryCreated({
      deliveryId: delivery.deliveryNumber.toString(),
      orderId: orderData.orderId,
    });

    // Enviar confirmación a Hub Central de forma asíncrona
    setImmediate(async () => {
      try {
        const hubCentralUrl = process.env.PRIZMA_NOUS_URL || 'http://localhost:3007';
        const confirmationData = {
          orderId: orderData.orderId,
          deliveryId: delivery.deliveryNumber.toString(),
          status: delivery.orderState,
          trackingNumber: delivery.deliveryNumber.toString(),
          timestamp: new Date().toISOString()
        };

        const response = await axios.post(`${hubCentralUrl}/api/webhooks/delivery-confirmation`, confirmationData, {
          headers: {
            'Content-Type': 'application/json',
            'x-prizma-signature': `sha256=${crypto
              .createHmac('sha256', process.env.PRIZMA_NOUS_SECRET || 'default-secret')
              .update(JSON.stringify(confirmationData))
              .digest('hex')}`
          }
        });

        if (response.status >= 200 && response.status < 300) {
          console.log(`🔄 Confirmación enviada a Hub Central para entrega ${delivery.deliveryNumber}`);
        } else {
          console.error(`❌ Error enviando confirmación a Hub Central: ${response.status}`);
        }
      } catch (hubError) {
        console.error(`⚠️ Error comunicando con Hub Central para entrega ${delivery.deliveryNumber}:`, hubError);
      }
    });

    // Respuesta inmediata exitosa
    return h.response({
      success: true,
      message: 'Entrega creada exitosamente',
      deliveryId: delivery.deliveryNumber.toString(),
      trackingNumber: delivery.deliveryNumber.toString(),
      status: delivery.orderState
    }).code(201);

  } catch (error) {
    console.error('❌ Error creando entrega:', error);
    return h.response({
      error: 'Error interno del servidor',
      code: 'INTERNAL_ERROR',
      details: error instanceof Error ? error.message : 'Unknown error'
    }).code(500);
  }
}

// Actualizar estado de entrega
export async function updateDeliveryStatus(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<Hapi.ResponseObject> {
  try {
    const { deliveryId } = request.params;
    const { status, notes, trackingInfo } = request.payload as StatusUpdatePayload;

    console.log(`🔄 Actualizando entrega ${deliveryId} a estado: ${status}`);

    const updatedDelivery = await deliveryService.updateStatus(deliveryId, {
      status,
      notes,
      trackingInfo
    });

    if (!updatedDelivery) {
      return h.response({
        error: 'Entrega no encontrada',
        code: 'DELIVERY_NOT_FOUND'
      }).code(404);
    }

    // Prizma: publicar el cambio de estado al Nous (no bloqueante, tolerante a fallos)
    void publishDeliveryStatusUpdate({
      deliveryId: updatedDelivery.deliveryNumber.toString(),
      status: updatedDelivery.orderState,
    });
    // Si la entrega quedó completada, emitir además delivery.completed
    if (isCompletedStatus(updatedDelivery.orderState)) {
      void publishDeliveryCompleted({
        deliveryId: updatedDelivery.deliveryNumber.toString(),
        orderId: updatedDelivery.purchaseNumber?.toString() || updatedDelivery.deliveryNumber.toString(),
      });
    }

    // Notificar a Hub Central sobre cambio de estado
    setImmediate(async () => {
      try {
        const hubCentralUrl = process.env.PRIZMA_NOUS_URL || 'http://localhost:3007';
        const statusData = {
          deliveryId: updatedDelivery.deliveryNumber.toString(),
          status: updatedDelivery.orderState,
          notes: notes || '',
          timestamp: new Date().toISOString()
        };

        await axios.post(`${hubCentralUrl}/api/webhooks/delivery-status-update`, statusData, {
          headers: {
            'Content-Type': 'application/json',
            'x-prizma-signature': `sha256=${crypto
              .createHmac('sha256', process.env.PRIZMA_NOUS_SECRET || 'default-secret')
              .update(JSON.stringify(statusData))
              .digest('hex')}`
          }
        });

        console.log(`🔄 Estado actualizado enviado a Hub Central para entrega ${deliveryId}`);
      } catch (hubError) {
        console.error('⚠️ Error notificando Hub Central sobre actualización:', hubError);
      }
    });

    return h.response({
      success: true,
      message: 'Estado actualizado exitosamente',
      delivery: {
        id: updatedDelivery.deliveryNumber.toString(),
        status: updatedDelivery.orderState,
        notes: updatedDelivery.deliveryNote,
        updatedAt: updatedDelivery.updatedAt || new Date()
      }
    }).code(200);

  } catch (error) {
    console.error('❌ Error actualizando estado de entrega:', error);
    return h.response({
      error: 'Error interno del servidor',
      code: 'INTERNAL_ERROR'
    }).code(500);
  }
}

// Consultar estado de entrega
export async function getDeliveryStatus(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<Hapi.ResponseObject> {
  try {
    const { deliveryId } = request.params;

    const delivery = await deliveryService.getById(deliveryId);

    if (!delivery) {
      return h.response({
        error: 'Entrega no encontrada',
        code: 'DELIVERY_NOT_FOUND'
      }).code(404);
    }

    return h.response({
      success: true,
      delivery: {
        id: delivery.deliveryNumber.toString(),
        orderNumber: delivery.purchaseNumber?.toString() || '',
        status: delivery.orderState,
        trackingNumber: delivery.deliveryNumber.toString(),
        deliveryAddress: delivery.deliveryAddress,
        city: delivery.city,
        department: delivery.department,
        customerName: `${delivery.name} ${delivery.lastName}`,
        customerPhone: delivery.clientPhone,
        createdAt: delivery.creationDate,
        updatedAt: delivery.updatedAt || delivery.creationDate,
        notes: delivery.deliveryNote
      }
    }).code(200);

  } catch (error) {
    console.error('❌ Error consultando entrega:', error);
    return h.response({
      error: 'Error interno del servidor',
      code: 'INTERNAL_ERROR'
    }).code(500);
  }
}

// Health check del API de entregas
export async function healthCheck(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<Hapi.ResponseObject> {
  try {
    // Verificar conexión a base de datos
    const dbHealth = await deliveryService.healthCheck();
    
    return h.response({
      status: 'healthy',
      service: 'Talaria Deliveries API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      database: dbHealth ? 'connected' : 'disconnected',
      hubCentralUrl: process.env.PRIZMA_NOUS_URL || 'not configured'
    }).code(200);

  } catch (error) {
    return h.response({
      status: 'unhealthy',
      service: 'Talaria Deliveries API',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }).code(503);
  }
}
