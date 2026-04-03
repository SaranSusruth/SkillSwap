const mongoose = require('mongoose');

const emailVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    codeHash: {
      type: String,
      required: true,
    },
    verificationToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

emailVerificationSchema.index({ email: 1, verified: 1, createdAt: -1 });

module.exports = mongoose.model('EmailVerification', emailVerificationSchema);
