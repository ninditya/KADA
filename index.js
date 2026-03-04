import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRouter from './routers/auth.js';
import notesRouter from './routers/notes.js';
import paymentsRouter from './routers/payments.js';
import errorHandler, { notFoundHandler } from './middlewares/errorHandler.js';
import { validateRuntimeEnv } from './services/JWTSecret.js';
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
app.use('/payments', paymentsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

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
