const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
    {
        reporterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        reportedUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        reason: {
            type: String,
            required: [true, 'Please provide a reason for report'],
            trim: true,
            maxlength: 200,
        },
        details: {
            type: String,
            default: '',
            maxlength: 1000,
        },
        status: {
            type: String,
            enum: ['open', 'reviewed', 'resolved'],
            default: 'open',
        },
    },
    { timestamps: true }
);

reportSchema.index({ reporterId: 1, createdAt: -1 });
reportSchema.index({ reportedUserId: 1, status: 1 });

module.exports = mongoose.model('Report', reportSchema);
