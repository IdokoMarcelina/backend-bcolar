const mongoose = require('mongoose');

const forgetPasswordSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  expires_at: { type: Date, required: true }, // OTP expiry
});

forgetPasswordSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Otp', forgetPasswordSchema);