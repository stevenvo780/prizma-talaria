import { Connection } from 'typeorm';
import { outboxService } from '../services/outboxService';

/**
 * Job para procesar confirmaciones pendientes en el outbox.
 * Se ejecuta cada 5 minutos.
 *
 * Responsabilidades:
 * 1. Reintentar envíos de confirmaciones pendientes
 * 2. Abandonar confirmaciones tras N reintentos
 * 3. Limpiar registros enviados exitosamente
 */
export class OutboxProcessor {
  private connection: Connection;
  private intervalId: NodeJS.Timeout | null = null;
  private processingInterval = 5 * 60 * 1000; // 5 minutos

  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Inicia el procesador de outbox como un job periódico.
   */
  start(): void {
    console.log('[OutboxProcessor] Starting outbox processor (interval: 5 minutes)');

    // Ejecutar inmediatamente en arranque
    this.process().catch((err) => {
      console.error('[OutboxProcessor] Error en ejecución inicial:', err);
    });

    // Luego periódicamente
    this.intervalId = setInterval(() => {
      this.process().catch((err) => {
        console.error('[OutboxProcessor] Error en ciclo periódico:', err);
      });
    }, this.processingInterval);
  }

  /**
   * Detiene el procesador.
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('[OutboxProcessor] Stopped');
    }
  }

  /**
   * Ejecuta el ciclo completo de procesamiento.
   */
  private async process(): Promise<void> {
    try {
      const manager = this.connection.manager;

      // Paso 1: Abandonar confirmaciones que excedieron reintentos
      await outboxService.abandonFailedConfirmations(manager);

      // Paso 2: Procesar confirmaciones pendientes con reintentos
      await outboxService.processPendingConfirmations(manager);

      // Paso 3: Limpiar registros enviados (mantener últimas 24h)
      await outboxService.cleanupSentOutboxes(manager, 24);
    } catch (error) {
      console.error('[OutboxProcessor] Unexpected error during processing:', error);
    }
  }
}
