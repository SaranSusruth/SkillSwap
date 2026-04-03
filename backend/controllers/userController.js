const User = require('../models/User');
const Skill = require('../models/Skill');
const Review = require('../models/Review');
const Request = require('../models/Request');

const recalculateUserRating = async (userId) => {
    const reviews = await Review.find({ revieweeId: userId }).select('rating');
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
        ? reviews.reduce((sum, entry) => sum + Number(entry.rating || 0), 0) / totalReviews
        : 0;

    await User.findByIdAndUpdate(userId, {
        rating: avgRating,
        totalReviews,
    });

    return { avgRating, totalReviews };
};

// Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const { skill, role } = req.query;

        let filter = { isActive: true };

        if (role) {
            filter.role = role;
        }

        let users = await User.find(filter).populate('skills.skillId');

        // Filter by skill if provided
        if (skill) {
            users = users.filter(user =>
                user.skills.some(s => s.skillId?.name?.toLowerCase().includes(skill.toLowerCase()))
            );
        }

        res.status(200).json({
            count: users.length,
            users,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get User by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('skills.skillId')
            .populate({
                path: 'skills.skillId',
                select: 'name category level description',
            });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, bio, phone, profileImage, skills, teachSkills, learnSkills } = req.body;

        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update fields
        if (name !== undefined) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (phone !== undefined) user.phone = phone;
        if (profileImage !== undefined) user.profileImage = profileImage;
        if (teachSkills !== undefined) user.teachSkills = teachSkills;
        if (learnSkills !== undefined) user.learnSkills = learnSkills;
        if (skills !== undefined) {
            if (Array.isArray(skills)) {
                const normalizedSkills = [];

                for (const entry of skills) {
                    const skillName = typeof entry === 'string' ? entry.trim() : String(entry?.name || '').trim();
                    const skillLevel = typeof entry === 'object' && entry?.level ? entry.level : 'beginner';

                    if (entry?.skillId) {
                        normalizedSkills.push({ skillId: entry.skillId, level: skillLevel });
                        continue;
                    }

                    if (!skillName) {
                        continue;
                    }

                    let existingSkill = await Skill.findOne({ userId: req.user.id, name: skillName });

                    if (!existingSkill) {
                        existingSkill = await Skill.create({
                            name: skillName,
                            description: skillName,
                            category: 'other',
                            level: skillLevel,
                            userId: req.user.id,
                            tags: [],
                        });
                    }

                    normalizedSkills.push({ skillId: existingSkill._id, level: skillLevel });
                }

                user.skills = normalizedSkills;
            }
        }

        await user.save();
        await user.populate({
            path: 'skills.skillId',
            select: 'name category level description tags userId',
        });

        res.status(200).json({
            message: 'Profile updated successfully',
            user,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Upload Profile Image
exports.uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Save the file path
        user.profileImage = `/uploads/${req.file.filename}`;
        await user.save();

        res.status(200).json({
            message: 'Profile image uploaded successfully',
            profileImage: user.profileImage,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a direct peer review for a connected user.
exports.createUserReview = async (req, res) => {
    try {
        const revieweeId = req.params.id;
        const reviewerId = req.user.id;
        const { rating, comment } = req.body || {};

        if (!rating || !comment) {
            return res.status(400).json({ error: 'Rating and comment are required' });
        }

        const normalizedRating = Number(rating);
        if (!Number.isFinite(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const trimmedComment = String(comment).trim();
        if (trimmedComment.length < 10) {
            return res.status(400).json({ error: 'Comment must be at least 10 characters long' });
        }

        if (String(revieweeId) === String(reviewerId)) {
            return res.status(400).json({ error: 'You cannot review yourself' });
        }

        const reviewee = await User.findById(revieweeId);
        if (!reviewee) {
            return res.status(404).json({ error: 'User not found' });
        }

        const acceptedRequest = await Request.findOne({
            $or: [
                { senderId: reviewerId, receiverId: revieweeId },
                { senderId: revieweeId, receiverId: reviewerId },
            ],
            status: 'accepted',
        }).sort({ createdAt: -1 });

        if (!acceptedRequest) {
            return res.status(403).json({ error: 'You can only review connected users with accepted requests' });
        }

        const existingReview = await Review.findOne({
            requestId: acceptedRequest._id,
            reviewerId,
        });

        if (existingReview) {
            return res.status(400).json({ error: 'You already reviewed this user for your latest accepted request' });
        }

        const review = await Review.create({
            reviewerId,
            revieweeId,
            requestId: acceptedRequest._id,
            skillId: acceptedRequest.skillRequestedId || null,
            rating: normalizedRating,
            comment: trimmedComment,
        });

        const ratingSummary = await recalculateUserRating(revieweeId);

        await review.populate([
            { path: 'reviewerId', select: 'name profileImage' },
            { path: 'revieweeId', select: 'name profileImage rating totalReviews' },
            { path: 'skillId', select: 'name category level' },
        ]);

        res.status(201).json({
            message: 'Review submitted successfully',
            review,
            rating: ratingSummary,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get reviews received by a user.
exports.getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ revieweeId: req.params.id })
            .populate('reviewerId', 'name profileImage')
            .populate('skillId', 'name category level')
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: reviews.length,
            reviews,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get rating summary for a user.
exports.getUserRatingSummary = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('rating totalReviews');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            rating: user.rating || 0,
            totalReviews: user.totalReviews || 0,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
