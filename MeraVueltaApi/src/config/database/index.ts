import Hapi from '@hapi/hapi';
import { ApplicationState, DatabaseConfig } from '../types';
import { createConnection } from 'typeorm';

export default class Database {
    private config: DatabaseConfig;

    constructor(config: DatabaseConfig) {
      this.config = config;
    }

    async connect(server: Hapi.server): Promise<void> {
      try {
        // SSL controlado explícitamente por env (no acoplado a NODE_ENV): el
        // Postgres configurado puede no soportar SSL ("server does not support
        // SSL connections"). Default false; poner DB_SSL=true solo si el server
        // lo soporta (p.ej. Neon).
        const useSsl = process.env.DB_SSL === 'true';
        const connection = await createConnection({
          type: 'postgres',
          host: this.config.host,
          port: this.config.port,
          username: this.config.username,
          password: this.config.password,
          database: this.config.name,
          entities: [this.config.entitiesPath],
          synchronize: this.config.synchronize,
          logging: this.config.logging,
          ssl: useSsl ? { rejectUnauthorized: false } : false,
        });

        (<ApplicationState>server.app).connection = connection;
      } catch (err) {
        console.error('Database error:', err);
      }
    }
};
