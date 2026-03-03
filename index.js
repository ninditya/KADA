import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRouter from './routers/auth.js';
import notesRouter from './routers/notes.js';
import { validateRuntimeEnv } from './config/env.js';
import { connectDatabases } from './models/index.js';

dotenv.config();

// Setup App
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// health check sederhana untuk memastikan backend hidup.
app.get('/', (_req, res) => {
  res.json({ message: 'Hello Nindit' });
});

// Basic Route
app.use('/notes', notesRouter);
app.use('/auth', authRouter);

// semua path yang tidak cocok route akan dibalas Route not found.
app.use((req, res) => {
  res.status(404).json({ result: 'fail', error: `Route not found ${req.path}` });
});

// menangkap error dari router (next(error)) dan kirim JSON error konsisten.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ result: 'fail', error: err.message || 'Internal Server Error' });
});

// konek ke DB dulu lewat connectDatabases(), baru mulai listen port.
async function start() {
  try {
    validateRuntimeEnv();
    await connectDatabases();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
