const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], required: true },
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], required: true },
  specialRequests: { type: String }
}, {
  timestamps: true
});

BookingSchema.index({ room: 1, checkIn: 1, checkOut: 1 });

module.exports = mongoose.model('Booking', BookingSchema);
