// Mengecek apakah JWT secret kosong, placeholder, atau terlalu pendek.
function isWeakJwtSecret(secret) {
  return (
    !secret ||
    secret === 'change_this_jwt_secret' ||
    secret === 'dev_jwt_secret_change_me' ||
    secret.length < 32
  );
}

// Mengambil JWT secret yang sudah lolos validasi keamanan minimum.
export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (isWeakJwtSecret(secret)) {
    throw new Error(
      'JWT_SECRET is missing or too weak. Use a random secret with at least 32 characters.'
    );
  }

  return secret;
}

// Validasi env wajib saat aplikasi start.
export function validateRuntimeEnv() {
  getJwtSecret();
}
