import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum DeliveryOutboxStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  ABANDONED = 'ABANDONED', // después de N reintentos
}

/**
 * Outbox pattern: persist webhook confirmations to retry later.
 * Garantiza entrega de confirmaciones al Hub aunque falle la primera.
 */
@Entity('delivery_outbox')
@Index('idx_delivery_outbox_status_created', ['status', 'createdAt'])
@Index('idx_delivery_outbox_order_id', ['orderId'])
export class DeliveryOutbox {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  orderId: string;

  @Column({ type: 'varchar', length: 50, default: DeliveryOutboxStatus.PENDING })
  status: DeliveryOutboxStatus;

  @Column({ type: 'jsonb' })
  payload: Record<string, unknown>;

  @Column({ type: 'varchar', length: 50 })
  confirmationStatus: 'success' | 'error';

  @Column({ type: 'int', default: 0 })
  retryCount: number;

  @Column({ type: 'int', default: 5 })
  maxRetries: number;

  @Column({ type: 'text', nullable: true })
  lastError: string | null;

  @Column({ type: 'timestamp', nullable: true })
  lastRetryAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date | null;
}
