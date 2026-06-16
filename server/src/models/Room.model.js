const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['single', 'double', 'suite', 'villa'], required: true },
  pricePerNight: { type: Number, required: true, min: [1, 'Price must be greater than 0'] },
  capacity: { type: Number, required: true },
  amenities: [{ type: String }],
  images: [{ type: String }],
  isAvailable: { type: Boolean, default: true, required: true },
  averageRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 }
}, {
  timestamps: true
});

RoomSchema.index({ type: 1, pricePerNight: 1 });

module.exports = mongoose.model('Room', RoomSchema);
