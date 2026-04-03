const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
    {
        mentorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        skillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Please provide a session title'],
        },
        description: {
            type: String,
            default: '',
        },
        sessionDate: {
            type: Date,
            required: [true, 'Please provide a session date'],
        },
        duration: {
            type: Number,
            required: [true, 'Please provide duration in minutes'],
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending',
        },
        mode: {
            type: String,
            enum: ['online', 'offline'],
            default: 'online',
        },
        location: {
            type: String,
            default: null,
        },
        notes: {
            type: String,
            default: '',
        },
        reviewed: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);
