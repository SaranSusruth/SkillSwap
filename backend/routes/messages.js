const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { getMessagesForRequest, sendMessage } = require('../controllers/messageController');

router.get('/:requestId', authenticate, getMessagesForRequest);
router.post('/:requestId', authenticate, sendMessage);

module.exports = router;