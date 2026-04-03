const Report = require('../models/Report');
const User = require('../models/User');

const ensureAdmin = async (req, res) => {
    const adminUser = await User.findById(req.user.id);

    if (!adminUser || adminUser.role !== 'admin') {
        res.status(403).json({ error: 'Admin access required' });
        return null;
    }

    return adminUser;
};

// Create user report
exports.createReport = async (req, res) => {
    try {
        const { reportedUserId, reason, details } = req.body;

        if (!reportedUserId || !reason) {
            return res.status(400).json({ error: 'reportedUserId and reason are required' });
        }

        if (reportedUserId === req.user.id) {
            return res.status(400).json({ error: 'You cannot report yourself' });
        }

        const reportedUser = await User.findById(reportedUserId);
        if (!reportedUser) {
            return res.status(404).json({ error: 'Reported user not found' });
        }

        const report = await Report.create({
            reporterId: req.user.id,
            reportedUserId,
            reason: String(reason).trim(),
            details: String(details || '').trim(),
        });

        res.status(201).json({
            message: 'Report submitted successfully',
            report,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get admin dashboard stats for reports
exports.getAdminReportStats = async (req, res) => {
    try {
        const adminUser = await ensureAdmin(req, res);
        if (!adminUser) return;

        const [totalReports, openReports, resolvedReports, activeUsers] = await Promise.all([
            Report.countDocuments(),
            Report.countDocuments({ status: 'open' }),
            Report.countDocuments({ status: 'resolved' }),
            User.countDocuments({ isActive: true }),
        ]);

        const reportedUsers = await Report.aggregate([
            {
                $group: {
                    _id: '$reportedUserId',
                    reportCount: { $sum: 1 },
                    latestReportAt: { $max: '$createdAt' },
                    openReportCount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'open'] }, 1, 0],
                        },
                    },
                },
            },
            { $sort: { reportCount: -1, latestReportAt: -1 } },
        ]);

        const reportedUserIds = reportedUsers.map((entry) => entry._id);
        const reportedUserDocs = await User.find({ _id: { $in: reportedUserIds } })
            .select('name email profileImage role isActive rating')
            .lean();

        const reportedUsersWithDetails = reportedUsers.map((entry) => ({
            ...entry,
            user: reportedUserDocs.find((user) => String(user._id) === String(entry._id)) || null,
        }));

        res.status(200).json({
            stats: {
                totalReports,
                openReports,
                resolvedReports,
                activeUsers,
            },
            reportedUsers: reportedUsersWithDetails,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// List reports for a given reported user
exports.getReportsForUser = async (req, res) => {
    try {
        const adminUser = await ensureAdmin(req, res);
        if (!adminUser) return;

        const reports = await Report.find({ reportedUserId: req.params.userId })
            .populate('reporterId', 'name email profileImage')
            .populate('reportedUserId', 'name email profileImage role isActive')
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: reports.length,
            reports,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Block reported user if needed
exports.blockReportedUser = async (req, res) => {
    try {
        const adminUser = await ensureAdmin(req, res);
        if (!adminUser) return;

        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const reportCount = await Report.countDocuments({ reportedUserId: userId });

        if (reportCount <= 5) {
            return res.status(400).json({ error: 'User needs more than 5 reports before blocking' });
        }

        user.isActive = false;
        await user.save();

        await Report.updateMany(
            { reportedUserId: userId, status: 'open' },
            { status: 'resolved' }
        );

        res.status(200).json({
            message: 'User blocked successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isActive: user.isActive,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
