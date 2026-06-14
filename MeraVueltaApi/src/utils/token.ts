import jwt from 'jsonwebtoken';
import config from '../config/index';
import { User } from '../entities/users';

export const createUserToken = (user: User): string => {
  // Sign the JWT
  return jwt.sign(
    { id: user.id, scope: user.role },
    config.project.tokenSecret,
    { algorithm: 'HS256', expiresIn: '500h' }
  );
};
