const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user', required: true },
  avatar: { type: String, default: 'https://via.placeholder.com/150' },
  phone: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
