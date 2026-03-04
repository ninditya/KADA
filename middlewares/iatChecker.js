import { createHttpError } from './errorHandler.js';

// Menolak token jika umur token (berdasarkan iat) melewati batas tertentu.
export default function iatChecker(req, res, next) {
  try {
    const iat = req.user?.iat;
    const now = Math.floor(Date.now() / 1000);
    const maxAgeSeconds = Number(process.env.IAT_MAX_AGE_SECONDS || 30);

    if (!iat) {
      return next(createHttpError(401, 'Token iat tidak ditemukan'));
    }

    if (now - iat > maxAgeSeconds) {
      return next(createHttpError(401, 'Token sudah terlalu lama'));
    }

    next();
  } catch (err) {
    next(createHttpError(500, err.message));
  }
}
