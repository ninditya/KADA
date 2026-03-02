import { Router } from 'express';
import crypto from 'crypto';
import { User } from '../models/index.js';

const router = Router();

const sha256 = (text) =>
  crypto.createHash('sha256').update(text).digest('hex');

// GET /user (dipakai frontend kamu buat cek user list)
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find({}, { username: 1, passwordHash: 1 });
    res.json(users);
  } catch (e) {
    next(e);
  }
});

// POST /user (signup)
router.post('/', async (req, res, next) => {
  try {
    const { username, password, passwordHash } = req.body;
    if (!username || (!password && !passwordHash)) {
      return res.status(400).json({ error: 'username and password/passwordHash are required' });
    }

    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ error: 'Username already exists' });

    const finalHash = passwordHash || sha256(password);
    const user = await User.create({ username, passwordHash: finalHash });

    res.status(201).json({ id: user._id, username: user.username });
  } catch (e) {
    next(e);
  }
});

// POST /user/login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password, passwordHash } = req.body;
    if (!username || (!password && !passwordHash)) {
      return res.status(400).json({ error: 'username and password/passwordHash are required' });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const finalHash = passwordHash || sha256(password);
    if (user.passwordHash !== finalHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ result: 'success', username: user.username });
  } catch (e) {
    next(e);
  }
});

export default router;
