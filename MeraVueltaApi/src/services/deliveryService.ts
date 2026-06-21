import { EntityManager, getManager } from 'typeorm';
import Boom from '@hapi/boom';
import { Order } from '../entities/order';
import { User } from '../entities/users';
import { Customer } from '../entities/customer';
import { WebhookPayload } from '../controllers/webhookController';
import { sendWppMessage } from '../modules/Order/utils/wppNotifications';

// Función auxiliar para generar número único de entrega
async function generateUniqueDeliveryNumber(manager: EntityManager): Promise<string> {
  let deliveryNumber: number;
  let isUnique = false;

  do {
    deliveryNumber = Math.floor(Math.random() * 900000000) + 100000000;
    const existingOrder = await manager.findOne(Order, {
      where: { deliveryNumber: deliveryNumber }
    });
    isUnique = !existingOrder;
  } while (!isUnique);

  return deliveryNumber.toString();
}

export class DeliveryService {
  /**
   * Crear una entrega desde datos de webhook del Hub Central
   */
  async createFromWebhook(manager: EntityManager, payload: WebhookPayload): Promise<Order> {
    try {
      console.log(`📦 [Talaria] Procesando pedido: ${payload.orderNumber}`);

      // Buscar o crear empresa/usuario por defecto para pedidos de Graf
      let company = await manager.findOne(User, {
        where: { email: 'soporte@prisma-enterprise.cloud' }
      });

      if (!company) {
        // Crear empresa Graf si no existe
        company = new User();
        company.email = 'soporte@prisma-enterprise.cloud';
        company.name = 'Graf';
        company.lastName = 'Sistema';
        company.documentNumber = '900123456';
        company.typeDocument = 'NIT';
        company.role = 'ADMIN';
        company.address = 'Dirección Graf';
        company.bornDate = '1990-01-01';
        company.password = 'temp_password';
        company.clientPhone = '3001234567';
        company = await manager.save(User, company);
        console.log(`✅ [Talaria] Empresa Graf creada con ID: ${company.id}`);
      }

      // Buscar o crear cliente
      let customer = await manager.findOne(Customer, {
        where: { clientPhone: payload.customerPhone }
      });

      if (!customer) {
        customer = new Customer();
        customer.name = payload.customerName.split(' ')[0] || '';
        customer.lastName = payload.customerName.split(' ').slice(1).join(' ') || '';
        customer.clientPhone = payload.customerPhone;
        customer.email = payload.customerEmail || '';
        customer.documentNumber = payload.customerDocument || '';
        customer.typeDocument = payload.customerDocumentType || 'CC';
        customer.company = company;
        customer = await manager.save(Customer, customer);
        console.log(`✅ [Talaria] Cliente creado: ${customer.name} ${customer.lastName}`);
      }

      // Verificar que no exista pedido duplicado
      const existingOrder = await manager.findOne(Order, {
        where: { 
          purchaseNumber: parseInt(payload.orderNumber),
          company: company.id 
        }
      });

      if (existingOrder) {
        console.log(`⚠️ [Talaria] Pedido duplicado: ${payload.orderNumber}`);
        return existingOrder;
      }

      // Crear nueva entrega
      const order = new Order();
      order.company = company.id;
      order.deliveryNumber = parseInt(await generateUniqueDeliveryNumber(manager));
      order.purchaseNumber = parseInt(payload.orderNumber);
      order.name = customer.name;
      order.lastName = customer.lastName;
      order.documentNumber = customer.documentNumber;
      order.typeDocument = customer.typeDocument;
      order.email = customer.email;
      order.clientPhone = payload.customerPhone;
      order.deliveryAddress = payload.deliveryAddress;
      order.city = payload.city;
      order.department = payload.department;
      order.orderState = 'Compra'; // Estado inicial
      order.paymentMethod = payload.paymentMethod;
      order.deliveryNote = payload.deliveryNotes || '';
      order.creationDate = new Date();
      order.pickupAddress = company.address;
      order.isDelete = false;

      // Calcular información de productos
      const totalValue = payload.products.reduce((sum, product) => sum + product.totalPrice, 0);
      const productSummary = payload.products.map(p => 
        `${p.name} (x${p.quantity})`
      ).join(', ');
      
      order.deliveryPacket = productSummary;
      order.dealerNote = `Valor total: $${totalValue.toLocaleString()}`;

      const savedOrder = await manager.save(Order, order);

      console.log(`✅ [Talaria] Entrega creada - Número: ${savedOrder.deliveryNumber}, Pedido: ${savedOrder.purchaseNumber}`);

      // Enviar notificación WhatsApp
      try {
        await sendWppMessage(savedOrder, manager);
        console.log(`📱 [Talaria] Notificación WhatsApp enviada para entrega ${savedOrder.deliveryNumber}`);
      } catch (wppError) {
        console.error('❌ [Talaria] Error enviando WhatsApp:', wppError);
        // No fallar por error de WhatsApp
      }

      return savedOrder;

    } catch (error: unknown) {
      console.error('❌ [Talaria] Error creando entrega:', error);
      throw Boom.badRequest(`Error creando entrega: ${(error as Error).message}`);
    }
  }

  /**
   * Generar token aleatorio para nuevas empresas
   */
  private generateRandomToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Obtener entrega por ID
   */
  async getById(deliveryId: string): Promise<Order | undefined> {
    const manager = getManager();
    try {
      const order = await manager.findOne(Order, {
        where: { deliveryNumber: parseInt(deliveryId) },
        relations: ['company']
      });
      return order;
    } catch (error) {
      console.error('❌ [Talaria] Error obteniendo entrega:', error);
      throw new Error(`Error obteniendo entrega: ${(error as Error).message}`);
    }
  }

  /**
   * Actualizar estado de entrega
   */
  async updateStatus(deliveryId: string, updateData: {
    status: string;
    notes?: string;
    trackingInfo?: Record<string, unknown>;
  }): Promise<Order | undefined> {
    const manager = getManager();
    try {
      const order = await manager.findOne(Order, {
        where: { deliveryNumber: parseInt(deliveryId) }
      });

      if (!order) {
        return undefined;
      }

      order.orderState = updateData.status;
      if (updateData.notes) {
        order.deliveryNote = updateData.notes;
      }

      const updatedOrder = await manager.save(Order, order);
      console.log(`🔄 [Talaria] Estado actualizado: ${deliveryId} -> ${updateData.status}`);
      
      return updatedOrder;
    } catch (error) {
      console.error('❌ [Talaria] Error actualizando estado:', error);
      throw new Error(`Error actualizando estado: ${(error as Error).message}`);
    }
  }

  /**
   * Health check del servicio
   */
  async healthCheck(): Promise<boolean> {
    try {
      const manager = getManager();
      await manager.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('❌ [Talaria] Error en health check:', error);
      return false;
    }
  }
}

export const deliveryService = new DeliveryService();
