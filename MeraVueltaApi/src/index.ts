import initializeServer from './config/server';
import registerModules from './config/modules';
import initializeAuth from './config/auth';
import initializeDatabase from './config/database/initializeDatabase';
import config from './config';
import { OutboxProcessor } from './jobs/outboxProcessor';

async function startServer() {
  // Initialize Hapi Server
  const server = initializeServer();
  // Initialize authentication
  await initializeAuth(server);
  // Initialize database
  const database = initializeDatabase(__dirname);
  await database.connect(server);
  // Register modules (APIs for this project)
  await registerModules(server);

  // Initialize outbox processor for persistent delivery confirmations
  const connection = (server.app as any).connection;
  if (connection) {
    const outboxProcessor = new OutboxProcessor(connection);
    outboxProcessor.start();

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('[Server] SIGTERM received, shutting down gracefully...');
      outboxProcessor.stop();
      server.stop().then(() => process.exit(0));
    });
  }

  // Start the server
  await server.start();
  console.info(
    `\x1b[34m------------- Project: ${config.project.name}, Server run ${server.info.uri} ------------- \x1b[0m`,
  );
}

(async function init() {
  try {
    await startServer();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();