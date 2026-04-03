const express = require('express');
const router = express.Router();
const {
    createSession,
    getAllSessions,
    getSessionById,
    getUserSessions,
    getActiveSessions,
    getCompletedSessions,
    updateSessionStatus,
    reviewSession,
    getUserReviews,
} = require('../controllers/sessionController');
const authenticate = require('../middleware/auth');

// Public Routes
router.get('/', getAllSessions);
router.get('/reviews/:userId', getUserReviews);

// Protected Routes
router.post('/', authenticate, createSession);
router.get('/user', authenticate, getUserSessions);
router.get('/active', authenticate, getActiveSessions);
router.get('/completed', authenticate, getCompletedSessions);
router.get('/:id', getSessionById);
router.put('/:id/status', authenticate, updateSessionStatus);
router.post('/:id/review', authenticate, reviewSession);

module.exports = router;
