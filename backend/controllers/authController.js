const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const EmailVerification = require('../models/EmailVerification');
const { sendVerificationCodeEmail } = require('../utils/mailer');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your_secret_key', {
        expiresIn: '30d',
    });
};

const normalizeEmail = (value = '') => String(value).trim().toLowerCase();
const isGmailAddress = (value = '') => normalizeEmail(value).endsWith('@gmail.com');

const generateEmailVerificationToken = () => crypto.randomBytes(32).toString('hex');
const generateVerificationCode = () => String(crypto.randomInt(100000, 1000000));

// Register User
exports.register = async (req, res) => {
    try {
        const { name, email, password, emailVerificationToken } = req.body;
        const normalizedEmail = normalizeEmail(email);

        // Check if user already exists
        let user = await User.findOne({ email: normalizedEmail });
        if (user) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        if (!emailVerificationToken) {
            return res.status(400).json({ error: 'Email verification is required' });
        }

        const verificationRecord = await EmailVerification.findOne({
            email: normalizedEmail,
            verificationToken: emailVerificationToken,
            verified: true,
        });

        if (!verificationRecord) {
            return res.status(400).json({ error: 'Email not verified' });
        }

        if (verificationRecord.usedAt) {
            return res.status(400).json({ error: 'Verification code already used' });
        }

        if (verificationRecord.expiresAt < new Date()) {
            return res.status(400).json({ error: 'Verification code has expired' });
        }

        // Create new user
        user = new User({
            name,
            email: normalizedEmail,
            password,
        });

        await user.save();

    verificationRecord.usedAt = new Date();
    await verificationRecord.save();

        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Send Email Verification Code
exports.sendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body || {};
        const normalizedEmail = normalizeEmail(email);

        if (!normalizedEmail) {
            return res.status(400).json({ error: 'Email is required' });
        }

        if (!isGmailAddress(normalizedEmail)) {
            return res.status(400).json({ error: 'Please use a Gmail address' });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        await EmailVerification.deleteMany({ email: normalizedEmail, verified: false });

        const verificationCode = generateVerificationCode();
        const verificationToken = generateEmailVerificationToken();
        const codeHash = await bcrypt.hash(verificationCode, 10);

        await EmailVerification.create({
            email: normalizedEmail,
            codeHash,
            verificationToken,
            verified: false,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });

        await sendVerificationCodeEmail({
            to: normalizedEmail,
            code: verificationCode,
        });

        res.status(200).json({
            message: 'Verification code sent successfully',
            verificationToken,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Verify Email Code
exports.verifyEmailCode = async (req, res) => {
    try {
        const { email, code, verificationToken } = req.body || {};
        const normalizedEmail = normalizeEmail(email);

        if (!normalizedEmail || !code || !verificationToken) {
            return res.status(400).json({ error: 'email, code and verificationToken are required' });
        }

        const verificationRecord = await EmailVerification.findOne({
            email: normalizedEmail,
            verificationToken,
            verified: false,
        });

        if (!verificationRecord) {
            return res.status(400).json({ error: 'Verification record not found' });
        }

        if (verificationRecord.expiresAt < new Date()) {
            return res.status(400).json({ error: 'Verification code has expired' });
        }

        const isCodeValid = await bcrypt.compare(String(code).trim(), verificationRecord.codeHash);
        if (!isCodeValid) {
            return res.status(400).json({ error: 'Invalid verification code' });
        }

        verificationRecord.verified = true;
        await verificationRecord.save();

        res.status(200).json({
            message: 'Email verified successfully',
            verificationToken: verificationRecord.verificationToken,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = normalizeEmail(email);

        // Validate input
        if (!normalizedEmail || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user and get password field
        const user = await User.findOne({ email: normalizedEmail }).select('+password');

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare passwords
        let isPasswordMatch = await user.matchPassword(password);

        // Backward compatibility for old plain-text password entries.
        if (!isPasswordMatch && user.password === password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            isPasswordMatch = true;
        }

        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('skills.skillId');

        res.status(200).json({
            user,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Promote User to Admin (key-protected bootstrap route)
exports.promoteAdmin = async (req, res) => {
    try {
        const { email, key, name, password } = req.body || {};
        const normalizedEmail = normalizeEmail(email);

        if (!normalizedEmail || !key) {
            return res.status(400).json({ error: 'email and key are required' });
        }

        if (!process.env.ADMIN_PROMOTION_KEY) {
            return res.status(500).json({ error: 'ADMIN_PROMOTION_KEY is not configured' });
        }

        if (key !== process.env.ADMIN_PROMOTION_KEY) {
            return res.status(403).json({ error: 'Invalid promotion key' });
        }

        let user = await User.findOne({ email: normalizedEmail }).select('+password');

        if (!user) {
            if (!name || !password) {
                return res.status(400).json({ error: 'name and password are required when creating a new admin user' });
            }

            user = new User({
                name,
                email: normalizedEmail,
                password,
                role: 'admin',
            });

            await user.save();
        } else {
            user.role = 'admin';
            await user.save();
        }

        res.status(200).json({
            message: 'Admin account is ready',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
