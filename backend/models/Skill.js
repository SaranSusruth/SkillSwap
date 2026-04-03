const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a skill name'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please provide a description'],
        },
        category: {
            type: String,
            enum: ['programming', 'design', 'languages', 'music', 'sports', 'arts', 'business', 'other'],
            default: 'other',
        },
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner',
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        totalReviews: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        tags: [String],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
