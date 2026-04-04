const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, promoteAdmin, sendVerificationCode, verifyEmailCode } = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const validation = require('../middleware/validation');

// Public Routes
router.post('/register', validation.validateRegister, register);
router.post('/login', validation.validateLogin, login);
router.post('/logout', (req, res) => res.status(200).json({ message: 'Logged out successfully' }));
router.post('/promote-admin', promoteAdmin);
router.post('/send-verification-code', validation.validateEmailVerificationSend, sendVerificationCode);
router.post('/verify-email-code', validation.validateEmailVerificationCode, verifyEmailCode);

// Protected Routes
router.get('/me', authenticate, getCurrentUser);

module.exports = router;
