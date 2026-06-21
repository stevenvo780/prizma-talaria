/**
 * One-shot schema synchronize script for talaria DB.
 * Uses TypeORM createConnection with synchronize:true to create all tables.
 * Does NOT start Hapi server or Firebase.
 */
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Customer } from './src/entities/customer';
import { DomiciliaryCompany } from './src/entities/domiciliaryCompany';
import { DomiciliaryCompanyRequest } from './src/entities/domiciliaryCompanyRequest';
import { MessageConfig } from './src/entities/messageConfig';
import { Order } from './src/entities/order';
import { PositionUser } from './src/entities/positionUser';
import { User } from './src/entities/users';
import { UsersEmailToken } from './src/entities/usersEmailToken';
import { UsersPasswordRecoveryToken } from './src/entities/usersPasswordRecoveryToken';
import { Wompi } from './src/entities/wompi';
import { WompiLog } from './src/entities/wompiLog';
import { WppMessagesUser } from './src/entities/wppMessagesUser';

async function main() {
  const conn = await createConnection({
    type: 'postgres',
    host: process.env.DB_HOST || '35.222.129.2',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'talariauser',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'talaria',
    entities: [
      Customer,
      DomiciliaryCompany,
      DomiciliaryCompanyRequest,
      MessageConfig,
      Order,
      PositionUser,
      User,
      UsersEmailToken,
      UsersPasswordRecoveryToken,
      Wompi,
      WompiLog,
      WppMessagesUser,
    ],
    synchronize: true,
    logging: true,
    ssl: false,
  });

  console.log('Connection established. Synchronizing schema...');
  await conn.synchronize();
  console.log('Schema synchronized successfully!');

  const result = await conn.query(
    "SELECT count(*) FROM information_schema.tables WHERE table_schema='public'"
  );
  console.log('Tables in public schema:', result[0].count);

  await conn.close();
  process.exit(0);
}

main().catch(err => {
  console.error('Schema sync failed:', err);
  process.exit(1);
});
