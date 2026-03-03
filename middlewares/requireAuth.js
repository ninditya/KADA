import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../config/env.js';

// Memverifikasi Bearer token JWT sebelum request masuk ke endpoint protected.
export default function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ result: 'fail', error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, getJwtSecret());
    req.user = payload;
    next();
  } catch (_error) {
    res.status(401).json({ result: 'fail', error: 'Invalid or expired token' });
  }
}
