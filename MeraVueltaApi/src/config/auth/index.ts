import Hapi from '@hapi/hapi';
import authJwtHapi from 'hapi-auth-jwt2';
import config from '../index';

const validate = (decoded: Record<string, unknown>): { isValid: boolean; credentials: Record<string, unknown> } => {
  return { isValid: true, credentials: decoded };
};

export default async function initializeAuth(server: Hapi.Server): Promise<void> {
  try {
    await server.register(authJwtHapi);
    server.auth.strategy('jwt', 'jwt',
      {
        key: config.project.tokenSecret,
        verifyOptions: { algorithms: ['HS256'] },
        validate,
      });
    console.log('JWT authentication initialized successfully');
  } catch (error) {
    console.error('Error initializing JWT authentication: ', error);
  }
}