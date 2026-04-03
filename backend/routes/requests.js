const express = require('express');
const router = express.Router();
const {
    createRequest,
    getSentRequests,
    getReceivedRequests,
    acceptRequest,
    rejectRequest,
    getRequestById,
} = require('../controllers/requestController');
const authenticate = require('../middleware/auth');

// Protected Routes
router.post('/', authenticate, createRequest);
router.get('/sent', authenticate, getSentRequests);
router.get('/received', authenticate, getReceivedRequests);
router.get('/:id', authenticate, getRequestById);
router.put('/:id/accept', authenticate, acceptRequest);
router.put('/:id/reject', authenticate, rejectRequest);

module.exports = router;