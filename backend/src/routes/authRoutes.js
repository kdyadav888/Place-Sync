import express from 'express';
import { registerSendOTP, verifyOTPAndRegister, resendOTP, login, getProfile, updateProfile, logout, forgotPasswordSendOTP, verifyOTPAndResetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// OTP-based registration flow
router.post('/register', registerSendOTP);
router.post('/verify-otp', verifyOTPAndRegister);
router.post('/resend-otp', resendOTP);

// OTP-based password reset flow
router.post('/forgot-password', forgotPasswordSendOTP);
router.post('/reset-password', verifyOTPAndResetPassword);

// Login and profile management
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);

export default router;

