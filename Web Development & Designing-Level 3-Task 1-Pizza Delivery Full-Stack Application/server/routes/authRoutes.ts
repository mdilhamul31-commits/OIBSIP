import express from 'express';
import { 
  registerUser, 
  loginUser, 
  verifyEmail, 
  forgotPassword, 
  resetPassword,
  getUserProfile
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/profile', protect, getUserProfile);

export default router;
