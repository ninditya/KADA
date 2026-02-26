import express from 'express';
import notesRouter from './routers/notes.js';
import mongoose from 'mongoose';
import { Post } from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

/* ---------- MIDDLEWARE ---------- */
app.use(express.json());
app.use('/notes', notesRouter);

/* ---------- ROUTES ---------- */
app.get('/', (req, res) => {
  res.send('Hello Nindit!');
});

// Implementing Error Handling Middleware
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).json({ result: 'fail', error: err.message });
});

// Pastikan menggunakan port yang benar (biasanya 27017) dan protokol yang tepat
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
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
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
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

/* ---------- ERROR MIDDLEWARE (HARUS PALING AKHIR) ---------- */
app.use((err, req, res, next) => {
  console.log('Error middleware executed:', err.message);
  res.status(500).send(err.message || 'Internal Server Error');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});