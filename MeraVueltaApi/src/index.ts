import initializeServer from './config/server';
import registerModules from './config/modules';
import initializeAuth from './config/auth';
import initializeDatabase from './config/database/initializeDatabase';
import config from './config';

async function startServer() {
  // Initialize Hapi Server
  const server = initializeServer();
  // Initialize authentication
  await initializeAuth(server);
  // Initialize database
  await initializeDatabase(__dirname).connect(server);
  // Register modules (APIs for this project)
  await registerModules(server);
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