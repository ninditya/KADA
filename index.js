import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import notesRouter from './routers/notes.js';
import cors from 'cors';

dotenv.config();

// Cache Koneksi MongoDB (Pattern Serverless)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Setup App
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Basic Route
app.use('/notes', notesRouter);

app.get('/', (req, res) => {
  res.send('Hello Nindit!');
});

// Pastikan menggunakan port yang benar (biasanya 27017) dan protokol yang tepat
async function startServer() {
  try {
    await connectDB();
    console.log('Terhubung ke MongoDB');

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });

  } catch (error) {
    console.error('Gagal koneksi:', error);
    process.exit(1); // stop server kalau DB gagal
  }
}
startServer();

/* ---------- GLOBAL MIDDLEWARE ---------- */
// Path parameter
app.get('/say/:greeting', (req, res) => {
  res.send(req.params.greeting);
});

// Query parameter example: /search?q=test
app.get('/search', (req, res) => {
  const { q } = req.query;
  res.send(`Search result for: ${q}`);
});

// Login page
app.get('/login', (req, res) => {
  res.send('Username: admin, Password: password');
});

// POST login (body JSON)
app.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (username !== 'admin' || password !== 'password') {
    return next(new Error('Not Authorized'));
  }

  res.send('Login success');
});

// Example protected route
app.get('/dashboard', (req, res) => {
  res.send('Welcome to dashboard');
});

// Route not found
app.use((req, res) => {
  res.status(404);
  res.send({
    result: 'fail',
    error: `Route not found ${req.path}`
  });
});

/* ---------- ERROR MIDDLEWARE (HARUS PALING AKHIR) ---------- */
app.use((err, req, res, next) => {
  console.log('Error middleware executed:', err.message);
  res.status(500).send(err.message || 'Internal Server Error');
});