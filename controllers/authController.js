import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../config/env.js';
import { getModels } from '../models/index.js';

// Menampilkan daftar endpoint auth yang tersedia.
export function authInfo(_req, res) {
  res.json({
    result: 'success',
    endpoints: ['POST /auth/signup', 'POST /auth/login', 'GET /auth/me']
  });
}

// Mendaftarkan user baru setelah validasi input sederhana.
export async function signup(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ result: 'fail', error: 'Username and password are required' });
    }

    const { User } = getModels();
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ result: 'fail', error: 'Username already exists' });
    }

    const user = await User.create({ username, password });
    res.status(201).json({ result: 'success', user });
  } catch (error) {
    next(error);
  }
}

// Memvalidasi kredensial lalu menghasilkan JWT.
export async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ result: 'fail', error: 'Username and password are required' });
    }

    const { User } = getModels();
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      return res.status(401).json({ result: 'fail', error: 'Invalid username or password' });
    }

    const valid = await user.verifyPassword(password);

    if (!valid) {
      return res.status(401).json({ result: 'fail', error: 'Invalid username or password' });
    }
    // token JWT dibuat dengan payload minimal user ID dan username, serta masa berlaku 1 jam. Secret key diambil dari env.
    const token = jwt.sign(
      { sub: user._id.toString(), username: user.username },
      getJwtSecret(),
      { expiresIn: '1h' }
    );
    res.json({ result: 'success', token });
    
  } catch (error) {
    next(error);
  }
}

// Mengambil profil user login dari payload JWT.
export async function me(req, res, next) {
  try {
    const { User } = getModels();
    const user = await User.findById(req.user.sub); 

    if (!user) {
      return res.status(404).json({ result: 'fail', error: 'User not found' });
    }

    res.json({ result: 'success', user });
  } catch (error) {
    next(error);
  }
}
