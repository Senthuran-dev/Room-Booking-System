const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.ObjectId, ref: 'Room', required: true },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: [true, 'Please add a rating between 1 and 5'] },
  comment: { type: String, required: [true, 'Please add a comment'] },
  createdAt: { type: Date, default: Date.now }
});

// Prevent duplicate reviews from same user for same room
reviewSchema.index({ room: 1, user: 1 }, { unique: true });

// Static method to get avg rating
reviewSchema.statics.getAverageRating = async function(roomId) {
  const obj = await this.aggregate([
    { $match: { room: roomId } },
    { $group: { _id: '$room', averageRating: { $avg: '$rating' } } }
  ]);
  try {
    await this.model('Room').findByIdAndUpdate(roomId, {
      averageRating: obj[0] ? obj[0].averageRating : 0
    });
  } catch (err) {
    console.error(err);
  }
};

reviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.room);
});

reviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await doc.constructor.getAverageRating(doc.room);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
