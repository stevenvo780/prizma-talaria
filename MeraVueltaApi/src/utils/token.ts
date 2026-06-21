import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/index';
import { User } from '../entities/users';

/**
 * Createa un access token de corta duración (12-24h).
 * Requiere que validate() en auth/index.ts verifique existencia del usuario.
 */
export const createAccessToken = (user: User): string => {
  return jwt.sign(
    { id: user.id, scope: user.role, type: 'access' },
    config.project.tokenSecret,
    { algorithm: 'HS256', expiresIn: '24h' }
  );
};

/**
 * Crea un refresh token de larga duración (30 días).
 * Se almacena en BD (hasheado) y se usa para obtener nuevos access tokens.
 */
export const createRefreshToken = (user: User): { token: string; expiresAt: Date } => {
  const token = jwt.sign(
    { id: user.id, scope: user.role, type: 'refresh' },
    config.project.tokenSecret,
    { algorithm: 'HS256', expiresIn: '30d' }
  );

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  return { token, expiresAt };
};

/**
 * Crea un par de tokens (access + refresh).
 * Access token es corto (24h), refresh token es largo (30 días).
 */
export const createUserTokenPair = (
  user: User
): { accessToken: string; refreshToken: string; refreshTokenExpiresAt: Date } => {
  const accessToken = createAccessToken(user);
  const { token: refreshToken, expiresAt: refreshTokenExpiresAt } = createRefreshToken(user);

  return { accessToken, refreshToken, refreshTokenExpiresAt };
};

/**
 * Verifica y decodifica un JWT (access o refresh).
 * Retorna null si es inválido o expirado.
 */
export const verifyToken = (
  token: string
): ({ id: number; scope: string; type: string } & Record<string, unknown>) | null => {
  try {
    const decoded = jwt.verify(token, config.project.tokenSecret) as {
      id: number;
      scope: string;
      type: string;
    } & Record<string, unknown>;
    return decoded;
  } catch (error) {
    console.error('[Token] Error verifying token:', error instanceof Error ? error.message : error);
    return null;
  }
};

/**
 * Hashea un refresh token para almacenarlo de forma segura en BD.
 */
export const hashRefreshToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
