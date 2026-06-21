import path from 'path';
import glob from 'glob';
import Hapi from '@hapi/hapi';

const registerModules = async (server: Hapi.Server): Promise<void> => {
  const dirname = path.join(__dirname, '../');
  // Derive extension from the currently-running file: .js when compiled, .ts when running via ts-node.
  // This is immune to NODE_ENV values ('production' vs 'PROD').
  const routesFile = __filename.endsWith('.js') ? 'index.js' : 'index.ts';
  const modules = glob.sync(`/modules/**/${routesFile}`, {
    root: dirname,
  });

  for (const file of modules) {
    const module = require(file);

    await server.register({
      plugin: module,
      options: {
        routePrefix: '/api',
      },
    });

    console.info(`\x1b[33mModule register:\x1b[0m ${module.name}`);
  }
};

export default registerModules;