import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import config from '.';

export default function initializeServer(): Hapi.Server {
  const { host, addresses, port, CORS_ORIGINS } = config.server;
  const server = Hapi.server({
    host: host,
    port: port,
    address: addresses,
    routes: {
      cors: {
        origin: [CORS_ORIGINS]
      },
    },
  });

  server.validator(Joi);
  return server;
}
