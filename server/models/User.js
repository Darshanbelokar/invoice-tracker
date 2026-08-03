const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Must be required: false for OAuth!
  googleId: { type: String },
  githubId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);