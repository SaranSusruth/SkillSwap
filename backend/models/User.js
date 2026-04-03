const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 6,
            select: false,
        },
        phone: {
            type: String,
            trim: true,
        },
        bio: {
            type: String,
            default: '',
        },
        profileImage: {
            type: String,
            default: null,
        },
        skills: [
            {
                skillId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Skill',
                },
                level: {
                    type: String,
                    enum: ['beginner', 'intermediate', 'advanced'],
                    default: 'beginner',
                },
            },
        ],
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
        totalSessions: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        teachSkills: {
            type: Boolean,
            default: true,
        },
        learnSkills: {
            type: Boolean,
            default: true,
        },
        role: {
            type: String,
            enum: ['student', 'mentor', 'both', 'admin'],
            default: 'both',
        },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
