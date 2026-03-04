# KADA Backend (Minimal)

## Struktur (MVC)
- `models/` untuk schema dan koneksi database.
- `controllers/` untuk business logic endpoint.
- `routers/` untuk mapping URL ke controller.
- `middlewares/` untuk auth middleware.

## Endpoints
- `GET /`
- `GET /notes`
- `GET /notes/:id`
- `POST /notes`
- `PUT /notes/:id`
- `DELETE /notes/:id`
- `GET /auth`
- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me` (Bearer token)

## Env
- `NOTES_MONGO_URI`
- `USER_MONGO_URI`
- `JWT_SECRET` (wajib, random, minimal 32 karakter)
- `SMTP_HOST` (opsional, wajib jika ingin kirim email login/signup)
- `SMTP_PORT` (opsional, contoh `587`)
- `SMTP_USER` (opsional)
- `SMTP_PASS` (opsional)
- `SMTP_FROM` (opsional, fallback ke `SMTP_USER`)
- `PORT` (optional)

## Auth body
- Signup: `username`, `emailAddress`, `password`
- Login: `identifier` (boleh username/emailAddress) + `password`

## Auth response
- Signup sukses: `user`, `emailSent`
- Login sukses: `token`, `emailSent`
