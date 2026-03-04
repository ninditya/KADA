import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../config/env.js';
import { getModels } from '../models/index.js';
import { sendLoginSuccessEmail, sendSignupSuccessEmail } from '../services/emailService.js';

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
    const { username, emailAddress, password } = req.body;

    if (!username || !emailAddress || !password) {
      return res.status(400).json({
        result: 'fail',
        error: 'Username, emailAddress, and password are required'
      });
    }

    const normalizedEmail = emailAddress.toLowerCase();
    const { User } = getModels();
    const existingUser = await User.findOne({
      $or: [{ username }, { emailAddress: normalizedEmail }]
    });

    if (existingUser) {
      return res.status(409).json({
        result: 'fail',
        error: 'Username or emailAddress already exists'
      });
    }

    const user = await User.create({
      username,
      emailAddress: normalizedEmail,
      password
    });

    let emailSent = false;

    try {
      emailSent = await sendSignupSuccessEmail({
        to: user.emailAddress,
        username: user.username
      });
    } catch (mailError) {
      console.error('Failed to send signup email:', mailError.message);
    }

    res.status(201).json({ result: 'success', user, emailSent });
  } catch (error) {
    next(error);
  }
}

// Memvalidasi kredensial lalu menghasilkan JWT.
export async function login(req, res, next) {
  try {
    const { password } = req.body;
    const identifier = req.body.identifier || req.body.username || req.body.emailAddress;

    if (!identifier || !password) {
      return res.status(400).json({
        result: 'fail',
        error: 'identifier/emailAddress/username and password are required'
      });
    }

    const normalizedIdentifier = identifier.toLowerCase();
    const { User } = getModels();
    const user = await User.findOne({
      $or: [{ username: identifier }, { emailAddress: normalizedIdentifier }]
    }).select('+password');

    if (!user) {
      return res.status(401).json({ result: 'fail', error: 'Invalid username or password' });
    }

    const valid = await user.verifyPassword(password);

    if (!valid) {
      return res.status(401).json({ result: 'fail', error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { sub: user._id.toString(), username: user.username },
      getJwtSecret(),
      { expiresIn: '1h' }
    );

    let emailSent = false;

    try {
      emailSent = await sendLoginSuccessEmail({
        to: user.emailAddress,
        username: user.username
      });
    } catch (mailError) {
      console.error('Failed to send login email:', mailError.message);
    }

    res.json({ result: 'success', token, emailSent });
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
