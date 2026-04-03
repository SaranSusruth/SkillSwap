const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, promoteAdmin, sendVerificationCode, verifyEmailCode } = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const validation = require('../middleware/validation');

// Public Routes
router.post('/register', validation.validateRegister, register);
router.post('/login', validation.validateLogin, login);
router.post('/promote-admin', promoteAdmin);
router.post('/send-verification-code', sendVerificationCode);
router.post('/verify-email-code', verifyEmailCode);

// Protected Routes
router.get('/me', authenticate, getCurrentUser);

module.exports = router;
