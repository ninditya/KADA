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
- `PORT` (optional)
