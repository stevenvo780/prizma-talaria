import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

/**
 * Migración: Agregar campos de estado y refresh tokens a la tabla User.
 * También crea la tabla delivery_outbox para persistir confirmaciones de webhooks.
 */
export class AddUserStatusAndRefreshTokens1624600000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar columnas a tabla 'user'
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'isActive',
        type: 'boolean',
        default: true,
        isNullable: false,
      })
    );

    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'refreshToken',
        type: 'varchar',
        length: '500',
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'refreshTokenExpiresAt',
        type: 'timestamp',
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'lastLoginAt',
        type: 'timestamp',
        isNullable: true,
      })
    );

    // Crear tabla delivery_outbox
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS delivery_outbox (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        orderId VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
        payload JSONB NOT NULL,
        confirmationStatus VARCHAR(50) NOT NULL,
        retryCount INT NOT NULL DEFAULT 0,
        maxRetries INT NOT NULL DEFAULT 5,
        lastError TEXT,
        lastRetryAt TIMESTAMP,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        sentAt TIMESTAMP
      );
    `);

    // Crear índices en delivery_outbox
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_delivery_outbox_status_created
       ON delivery_outbox(status, "createdAt")`
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_delivery_outbox_order_id
       ON delivery_outbox("orderId")`
    );

    console.log('✅ Migration: User status and refresh tokens added. Outbox table created.');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir: eliminar tabla delivery_outbox
    await queryRunner.query(`DROP TABLE IF EXISTS delivery_outbox`);

    // Revertir: eliminar columnas de user
    await queryRunner.dropColumn('user', 'lastLoginAt');
    await queryRunner.dropColumn('user', 'refreshTokenExpiresAt');
    await queryRunner.dropColumn('user', 'refreshToken');
    await queryRunner.dropColumn('user', 'isActive');

    console.log('✅ Migration rolled back: User columns and outbox table removed.');
  }
}
