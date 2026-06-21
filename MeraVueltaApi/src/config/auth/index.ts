import Hapi from '@hapi/hapi';
import authJwtHapi from 'hapi-auth-jwt2';
import config from '../index';
import { getRepository } from 'typeorm';
import { User } from '../../entities/users';

/**
 * Valida que el usuario decodificado del JWT:
 * 1. Exista en la BD
 * 2. Esté activo (isActive = true)
 *
 * FAIL-CLOSED: si el usuario no existe o está inactivo, se rechaza el request.
 * Esto previene la revocación de tokens siendo bypasseada.
 */
const validate = async (
  decoded: Record<string, unknown>,
  request: Hapi.Request
): Promise<{ isValid: boolean; credentials: Record<string, unknown> }> => {
  try {
    const userId = decoded.id as number;

    if (!userId) {
      console.warn('[Auth] Token válido pero sin userId');
      return { isValid: false, credentials: {} };
    }

    // Acceder al manager de BD desde el servidor
    const connection = (request.server.app as Record<string, unknown>).connection as any;
    if (!connection) {
      console.error('[Auth] No DB connection available');
      return { isValid: false, credentials: {} };
    }

    const userRepository = connection.getRepository(User);
    const user = await userRepository.findOne(userId);

    // Verificar que el usuario existe Y está activo
    if (!user) {
      console.warn(`[Auth] User ${userId} not found in DB (token revoked or deleted)`);
      return { isValid: false, credentials: {} };
    }

    if (!user.isActive) {
      console.warn(`[Auth] User ${userId} is disabled (isActive=false)`);
      return { isValid: false, credentials: {} };
    }

    // Usuario válido: retornar credenciales con datos actualizados
    return {
      isValid: true,
      credentials: {
        ...decoded,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    };
  } catch (error) {
    console.error('[Auth] Error validating token:', error);
    return { isValid: false, credentials: {} };
  }
};

export default async function initializeAuth(server: Hapi.Server): Promise<void> {
  try {
    await server.register(authJwtHapi);
    server.auth.strategy('jwt', 'jwt', {
      key: config.project.tokenSecret,
      verifyOptions: { algorithms: ['HS256'] },
      validate,
    });
    console.log('JWT authentication initialized successfully');
  } catch (error) {
    console.error('Error initializing JWT authentication: ', error);
  }
}