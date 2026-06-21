import axios from 'axios';
import { EntityManager, In, LessThan } from 'typeorm';
import { DeliveryOutbox, DeliveryOutboxStatus } from '../entities/deliveryOutbox';

export class OutboxService {
  /**
   * Persiste una confirmación de webhook en la tabla outbox para reintentos.
   * Retorna el registro creado.
   */
  async persistConfirmation(
    manager: EntityManager,
    orderId: string,
    status: 'success' | 'error',
    data: Record<string, unknown>
  ): Promise<DeliveryOutbox> {
    const outboxRepo = manager.getRepository(DeliveryOutbox);

    const outbox = outboxRepo.create({
      orderId,
      confirmationStatus: status,
      payload: data,
      status: DeliveryOutboxStatus.PENDING,
      retryCount: 0,
      maxRetries: 5,
    });

    return outboxRepo.save(outbox);
  }

  /**
   * Envía una confirmación inmediatamente y marca como SENT si tiene éxito.
   * Si falla, deja el estado como PENDING para reintentos.
   */
  async sendConfirmationWithRetry(outbox: DeliveryOutbox, manager: EntityManager): Promise<boolean> {
    try {
      const confirmationUrl = process.env.PRIZMA_NOUS_URL || 'http://localhost:3007';

      const confirmationPayload = {
        orderId: outbox.orderId,
        service: 'talaria',
        status: outbox.confirmationStatus,
        timestamp: new Date().toISOString(),
        data: outbox.payload,
      };

      await axios.post(`${confirmationUrl}/webhooks/confirmation`, confirmationPayload, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Talaria-Webhook-Client',
        },
        timeout: 5000,
      });

      // Éxito: marcar como SENT
      const outboxRepo = manager.getRepository(DeliveryOutbox);
      outbox.status = DeliveryOutboxStatus.SENT;
      outbox.sentAt = new Date();
      await outboxRepo.save(outbox);

      console.log(`✅ [Outbox] Confirmación enviada - Pedido: ${outbox.orderId}, Intento: ${outbox.retryCount + 1}`);
      return true;
    } catch (error) {
      console.error(
        `❌ [Outbox] Error enviando confirmación (Intento ${outbox.retryCount + 1}/${outbox.maxRetries}): ${
          error instanceof Error ? error.message : String(error)
        }`
      );

      // Fallo: incrementar reintento
      outbox.retryCount += 1;
      outbox.lastRetryAt = new Date();
      outbox.lastError = error instanceof Error ? error.message : String(error);

      // Si se agotaron los reintentos, marcar como ABANDONED
      if (outbox.retryCount >= outbox.maxRetries) {
        outbox.status = DeliveryOutboxStatus.ABANDONED;
        console.error(`❌ [Outbox] Confirmación abandonada tras ${outbox.maxRetries} intentos: ${outbox.orderId}`);
      }

      const outboxRepo = manager.getRepository(DeliveryOutbox);
      await outboxRepo.save(outbox);

      return false;
    }
  }

  /**
   * Procesa las confirmaciones pendientes que no se han reenviado recientemente.
   * Ejecutarse periódicamente (ej: cada 5 minutos via cron).
   */
  async processPendingConfirmations(manager: EntityManager): Promise<void> {
    const outboxRepo = manager.getRepository(DeliveryOutbox);

    // Buscar confirmaciones PENDING que hace más de 30 segundos no se reintentaron
    const now = new Date();
    const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000);

    const pendingOutboxes = await outboxRepo.find({
      where: [
        { status: DeliveryOutboxStatus.PENDING, lastRetryAt: LessThan(thirtySecondsAgo) },
        { status: DeliveryOutboxStatus.PENDING, lastRetryAt: null }, // Nunca se intentó
      ],
    });

    console.log(`[Outbox] Procesando ${pendingOutboxes.length} confirmaciones pendientes`);

    for (const outbox of pendingOutboxes) {
      await this.sendConfirmationWithRetry(outbox, manager);
    }
  }

  /**
   * Limpia registros enviados exitosamente después de N horas (default 24h).
   * Ejecutarse diariamente vía cron.
   */
  async cleanupSentOutboxes(manager: EntityManager, hoursToKeep: number = 24): Promise<number> {
    const outboxRepo = manager.getRepository(DeliveryOutbox);

    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - hoursToKeep);

    const result = await outboxRepo.delete({
      status: DeliveryOutboxStatus.SENT,
      sentAt: LessThan(cutoffDate),
    });

    console.log(`[Outbox] Limpiados ${result.affected || 0} registros SENT anteriores a ${hoursToKeep}h`);
    return result.affected || 0;
  }

  /**
   * Marca como ABANDONED los registros que excedieron maxRetries.
   * Se llama antes de processPendingConfirmations para no reintentar forever.
   */
  async abandonFailedConfirmations(manager: EntityManager): Promise<number> {
    const outboxRepo = manager.getRepository(DeliveryOutbox);

    // Encontrar PENDING cuyo retryCount >= maxRetries
    const failedOutboxes = await outboxRepo
      .createQueryBuilder('outbox')
      .where('outbox.status = :status AND outbox.retryCount >= outbox.maxRetries', {
        status: DeliveryOutboxStatus.PENDING,
      })
      .getMany();

    for (const outbox of failedOutboxes) {
      outbox.status = DeliveryOutboxStatus.ABANDONED;
      await outboxRepo.save(outbox);
    }

    console.log(`[Outbox] Marcados ${failedOutboxes.length} registros como ABANDONED`);
    return failedOutboxes.length;
  }
}

export const outboxService = new OutboxService();
