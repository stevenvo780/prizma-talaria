import dotenv from 'dotenv';
import { Environments } from './types';

dotenv.config();

// Normalize NODE_ENV: 'production' (Node standard) and 'PROD' both map to Environments.PROD.
const rawNodeEnv = (process.env.NODE_ENV || '').toLowerCase();
const environment: Environments =
  rawNodeEnv === 'production' || rawNodeEnv === 'prod'
    ? Environments.PROD
    : Environments.DEV;

export default {
  server: {
    environment,
    host: process.env.HOST || 'localhost',
    addresses: process.env.ADDRESSES || '0.0.0.0',
    port: process.env.PORT || 3006,
    CORS_ORIGINS: process.env.CORS_ORIGINS || '*',
  },
  webhook: {
    secret: (() => {
      const secret = process.env.WEBHOOK_SECRET;
      if (!secret) {
        if (environment === Environments.PROD) {
          throw new Error('WEBHOOK_SECRET is required in production');
        }
      }
      return secret || '';
    })(),
  },
  mailProvider: {
    public: process.env.MJ_APIKEY_PUBLIC,
    private: process.env.MJ_APIKEY_PRIVATE,
    errorEmail: process.env.MJ_ERROR_EMAIL,
    name: process.env.NAME || 'Talaria',
    email: process.env.EMAIL || 'info@prizma.co'
  },
  project: {
    name: process.env.NAME || 'Talaria',
    tokenSecret: (() => {
      const secret = process.env.TOKEN_SECRET;
      if (!secret) {
        if (environment === Environments.PROD) {
          throw new Error('TOKEN_SECRET is required in production');
        }
      }
      return secret || '';
    })(),
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'talaria',
    username: process.env.DB_USER || 'talariauser',
    password: process.env.DB_PWD || 'talariauser',
    synchronize: process.env.DB_SYNCHRONIZE === 'true' ? true : false || true,
    logging: process.env.DB_ENABLE_LOGGING === 'true' ? true : false || false,
    entitiesPath:
      environment === Environments.PROD
        ? './entities/*.js'
        : './entities/*.ts',
    migrationsPath:
      environment === Environments.PROD
        ? './migrations/*.js'
        : './migrations/*.ts',
    ssl: environment === Environments.PROD ? { rejectUnauthorized: false } : false,
  },
  payValues: {
    testValue: 14229,
    iva: 0,
    free: 20,
    freeDomiciliary: 1,
    plans: [
      {
        id: 'PLAN_300',
        count: 300,
        discount: 0.10,
        transaction: 165,
        domiciliarys: 3,
      },
      {
        id: 'PLAN_500',
        count: 500,
        discount: 0.20,
        transaction: 139,
        domiciliarys: 10,
      },
      {
        id: 'PLAN_1000',
        count: 1000,
        discount: 0.30,
        transaction: 110,
        domiciliarys: 20,
      },
      {
        id: 'PLAN_2000',
        count: 2000,
        discount: 0.30,
        transaction: 110,
        domiciliarys: 30,
      },
    ]
  }
};
