function createHttpError(status, message, details) {
  const error = new Error(message);
  error.status = status;
  if (details) error.details = details;
  return error;
}

function normalizeError(err) {
  if (err?.status || err?.statusCode) {
    return {
      status: err.status || err.statusCode,
      message: err.message || 'Request failed',
      details: err.details
    };
  }

  if (err?.type === 'entity.parse.failed') {
    return { status: 400, message: 'Invalid JSON body' };
  }

  if (err?.name === 'CastError') {
    return { status: 400, message: `Invalid value for ${err.path}` };
  }

  if (err?.name === 'ValidationError') {
    return { status: 400, message: 'Validation failed', details: err.errors };
  }

  if (err?.code === 11000) {
    return { status: 409, message: 'Duplicate data is not allowed', details: err.keyValue };
  }

  if (err?.name === 'JsonWebTokenError' || err?.name === 'TokenExpiredError') {
    return { status: 401, message: 'Invalid or expired token' };
  }

  return { status: 500, message: err?.message || 'Internal Server Error' };
}

// Middleware untuk route yang tidak ditemukan.
export function notFoundHandler(req, _res, next) {
  next(createHttpError(404, `Route not found ${req.path}`));
}

// Global error handler untuk semua error dari route/middleware.
export default function errorHandler(err, _req, res, next) {
  if (res.headersSent) return next(err);

  const normalized = normalizeError(err);

  if (normalized.status >= 500) {
    console.error(err);
  }

  const body = {
    result: 'fail',
    error: normalized.message
  };

  if (normalized.details) {
    body.details = normalized.details;
  }

  res.status(normalized.status).json(body);
}

export { createHttpError };
