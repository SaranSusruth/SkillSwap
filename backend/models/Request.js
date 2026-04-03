const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        skillOfferedId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill',
            required: true,
        },
        skillRequestedId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill',
            required: true,
        },
        message: {
            type: String,
            required: [true, 'Please provide a message'],
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
        },
        responseMessage: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

// Index for efficient queries
requestSchema.index({ senderId: 1, receiverId: 1 });
requestSchema.index({ status: 1 });

module.exports = mongoose.model('Request', requestSchema);