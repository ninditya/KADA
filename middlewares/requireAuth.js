import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../services/JWTSecret.js';
import { createHttpError } from './errorHandler.js';

// Memverifikasi Bearer token JWT sebelum request masuk ke endpoint protected.
export default function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createHttpError(401, 'Missing or invalid Authorization header'));
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, getJwtSecret());
    req.user = payload;
    next();
  } catch (error) {
    next(createHttpError(401, 'Invalid or expired token', { name: error.name }));
  }
}
