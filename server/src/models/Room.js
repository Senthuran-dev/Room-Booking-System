const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please add a room name'] },
  type: { type: String, required: [true, 'Please add a room type'], enum: ['Standard', 'Deluxe', 'Suite'] },
  description: { type: String, required: [true, 'Please add a description'] },
  pricePerNight: { type: Number, required: [true, 'Please add a price'] },
  capacity: { type: Number, required: [true, 'Please add maximum capacity'] },
  amenities: [String],
  images: [{ url: String, public_id: String }],
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', roomSchema);
