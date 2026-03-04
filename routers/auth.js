import requireAuth from '../middlewares/requireAuth.js';
import iatChecker from '../middlewares/iatChecker.js';
import { Router } from 'express';
import { authInfo, login, me, signup } from '../controllers/authController.js';

const router = Router();

router.get('/', authInfo);
router.post('/signup', signup);
router.post('/login', login);
router.get('/me', requireAuth, iatChecker, me);

export default router;
