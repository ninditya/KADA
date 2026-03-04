// Mengecek apakah JWT secret kosong, placeholder, atau terlalu pendek.
function isWeakJwtSecret(secret) {
  return (
    !secret ||
    secret === 'change_this_jwt_secret' ||
    secret === 'dev_jwt_secret_change_me' ||
    secret.length < 32
  );
}

// Mengambil JWT secret yang aman untuk sign/verify token.
export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (isWeakJwtSecret(secret)) {
    throw new Error(
      'JWT_SECRET is missing or too weak. Use a random secret with at least 32 characters.'
    );
  }

  return secret;
}

// Validasi env penting saat server start agar fail-fast.
export function validateRuntimeEnv() {
  getJwtSecret();
}
