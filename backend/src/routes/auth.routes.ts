import express from 'express';
import { signup, login, logout, getCurrentUser, googleLogin, appleLogin } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentUser);
router.post('/google', googleLogin);
router.post('/apple', appleLogin);

export default router;

