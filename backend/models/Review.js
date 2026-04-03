const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Session',
            default: null,
        },
        requestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Request',
            default: null,
        },
        skillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill',
            default: null,
        },
        reviewerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        revieweeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        rating: {
            type: Number,
            required: [true, 'Please provide a rating'],
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: [true, 'Please provide a comment'],
            minlength: 10,
        },
        helpful: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

reviewSchema.index({ sessionId: 1, reviewerId: 1 }, { unique: true, partialFilterExpression: { sessionId: { $type: 'objectId' } } });
reviewSchema.index({ requestId: 1, reviewerId: 1 }, { unique: true, partialFilterExpression: { requestId: { $type: 'objectId' } } });

module.exports = mongoose.model('Review', reviewSchema);
