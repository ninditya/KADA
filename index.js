import express from 'express';
import notesRouter from './routers/notes.js';
import mongoose from 'mongoose';
import { Post } from './models/index.js';

import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Pastikan menggunakan port yang benar (biasanya 27017) dan protokol yang tepat
const mongoURI = process.env.MONGO_URI;
try {
  await mongoose.connect(mongoURI);
  console.log('Terhubung ke MongoDB');
} catch (error) {
  console.error('Gagal koneksi:', error);
}

const port = 3000;

app.use(express.json());
app.use('/notes', notesRouter);

/* ---------- GLOBAL MIDDLEWARE ---------- */
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

/* ---------- ROUTES ---------- */

// Home
app.get('/', (req, res) => {
  res.send('Hello Nindit!');
});

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

// Implementing Error Handling Middleware
app.use((req, res, next) => {
  res.status(500);
  res.json({ result:'fail', error: err.message });
});

/* ---------- ERROR MIDDLEWARE (HARUS PALING AKHIR) ---------- */
app.use((err, req, res, next) => {
  console.log('Error middleware executed:', err.message);
  res.status(500).send(err.message || 'Internal Server Error');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});