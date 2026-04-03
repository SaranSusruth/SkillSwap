const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const {
	createReport,
	getAdminReportStats,
	getReportsForUser,
	blockReportedUser,
} = require('../controllers/reportController');

// Protected Routes
router.post('/', authenticate, createReport);
router.get('/admin/stats', authenticate, getAdminReportStats);
router.get('/admin/users/:userId/reports', authenticate, getReportsForUser);
router.put('/admin/users/:userId/block', authenticate, blockReportedUser);

module.exports = router;
