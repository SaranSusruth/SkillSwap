const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        requestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Request',
            required: true,
        },
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
        content: {
            type: String,
            required: [true, 'Please provide a message'],
            trim: true,
            maxlength: 2000,
        },
        readAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

messageSchema.index({ requestId: 1, createdAt: 1 });
messageSchema.index({ senderId: 1, receiverId: 1 });

module.exports = mongoose.model('Message', messageSchema);