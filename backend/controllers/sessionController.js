const Session = require('../models/Session');
const Review = require('../models/Review');
const User = require('../models/User');
const Skill = require('../models/Skill');

// Create Session (Booking)
exports.createSession = async (req, res) => {
    try {
        const { mentorId, skillId, title, description, sessionDate, duration, mode, location } = req.body;

        // Validation
        if (!mentorId || !skillId || !sessionDate || !duration) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if mentor exists
        const mentor = await User.findById(mentorId);
        if (!mentor) {
            return res.status(404).json({ error: 'Mentor not found' });
        }

        // Check if skill exists
        const skill = await Skill.findById(skillId);
        if (!skill) {
            return res.status(404).json({ error: 'Skill not found' });
        }

        const session = new Session({
            mentorId,
            studentId: req.user.id,
            skillId,
            title: title || skill.name,
            description,
            sessionDate,
            duration,
            mode: mode || 'online',
            location,
        });

        await session.save();

        res.status(201).json({
            message: 'Session created successfully',
            session,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Sessions
exports.getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find()
            .populate('mentorId', 'name email profileImage rating')
            .populate('studentId', 'name email profileImage')
            .populate('skillId', 'name category');

        res.status(200).json({
            count: sessions.length,
            sessions,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Session by ID
exports.getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate('mentorId', 'name email profileImage rating')
            .populate('studentId', 'name email profileImage')
            .populate('skillId', 'name category description');

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.status(200).json({ session });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get User Sessions (As Student or Mentor)
exports.getUserSessions = async (req, res) => {
    try {
        const { type } = req.query; // 'mentor' or 'student' or 'all'

        let filter = {};

        if (type === 'mentor') {
            filter.mentorId = req.user.id;
        } else if (type === 'student') {
            filter.studentId = req.user.id;
        } else {
            filter.$or = [{ mentorId: req.user.id }, { studentId: req.user.id }];
        }

        const sessions = await Session.find(filter)
            .populate('mentorId', 'name email profileImage rating')
            .populate('studentId', 'name email profileImage')
            .populate('skillId', 'name category');

        res.status(200).json({
            count: sessions.length,
            sessions,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Active Sessions (Confirmed but not completed)
exports.getActiveSessions = async (req, res) => {
    try {
        const sessions = await Session.find({
            $or: [{ mentorId: req.user.id }, { studentId: req.user.id }],
            status: { $in: ['confirmed', 'pending'] }
        })
            .populate('mentorId', 'name email profileImage rating')
            .populate('studentId', 'name email profileImage')
            .populate('skillId', 'name category')
            .sort({ sessionDate: 1 });

        res.status(200).json({
            count: sessions.length,
            sessions,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Completed Sessions
exports.getCompletedSessions = async (req, res) => {
    try {
        const sessions = await Session.find({
            $or: [{ mentorId: req.user.id }, { studentId: req.user.id }],
            status: 'completed'
        })
            .populate('mentorId', 'name email profileImage rating')
            .populate('studentId', 'name email profileImage')
            .populate('skillId', 'name category')
            .sort({ sessionDate: -1 });

        res.status(200).json({
            count: sessions.length,
            sessions,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Session Status
exports.updateSessionStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Only mentor can confirm/complete, only student can request cancellation
        if (status === 'confirmed' || status === 'completed') {
            if (session.mentorId.toString() !== req.user.id) {
                return res.status(403).json({ error: 'Only mentor can update this status' });
            }
        }

        session.status = status;
        await session.save();

        res.status(200).json({
            message: 'Session status updated successfully',
            session,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Review Session
exports.reviewSession = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        if (!rating || !comment) {
            return res.status(400).json({ error: 'Rating and comment are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (session.status !== 'completed') {
            return res.status(400).json({ error: 'Can only review completed sessions' });
        }

        // Check if this user already reviewed this session.
        const existingReview = await Review.findOne({
            sessionId: req.params.id,
            reviewerId: req.user.id,
        });
        if (existingReview) {
            return res.status(400).json({ error: 'You already reviewed this session' });
        }

        // Determine reviewee
        const revieweeId = session.mentorId.toString() === req.user.id ? session.studentId : session.mentorId;

        const review = new Review({
            sessionId: session._id,
            skillId: session.skillId,
            reviewerId: req.user.id,
            revieweeId,
            rating,
            comment,
        });

        await review.save();

        // Update user rating
        const reviews = await Review.find({ revieweeId });
        const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

        await User.findByIdAndUpdate(revieweeId, {
            rating: avgRating,
            totalReviews: reviews.length,
        });

        // Mark session as reviewed
        session.reviewed = true;
        await session.save();

        res.status(201).json({
            message: 'Review submitted successfully',
            review,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Reviews for User
exports.getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ revieweeId: req.params.userId })
            .populate('reviewerId', 'name profileImage')
            .populate('skillId', 'name');

        res.status(200).json({
            count: reviews.length,
            reviews,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
