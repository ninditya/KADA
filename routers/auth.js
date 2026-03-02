import { Router } from 'express';
import { getModels } from '../models/index.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    result: 'success',
    message: 'Auth endpoint ready',
    endpoints: ['POST /auth/signup', 'POST /auth/login']
  });
});

router.post('/signup', async (req, res, next) => {
  try {
    const { User } = getModels();
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        result: 'fail',
        error: 'Username and password are required'
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        result: 'fail',
        error: 'Username already exists'
      });
    }

    const user = await User.create({ username, password });
    res.status(201).json({
      result: 'success',
      user
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { User } = getModels();
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        result: 'fail',
        error: 'Username and password are required'
      });
    }

    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({
        result: 'fail',
        error: 'Invalid username or password'
      });
    }

    const isValid = await user.verifyPassword(password);
    if (!isValid) {
      return res.status(401).json({
        result: 'fail',
        error: 'Invalid username or password'
      });
    }

    res.json({
      result: 'success',
      message: 'Login success'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
