const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, minlength: 10, maxlength: 500 }
}, {
  timestamps: true
});

ReviewSchema.post('save', async function() {
  const Room = mongoose.model('Room');
  const stats = await this.constructor.aggregate([
    { $match: { room: this.room } },
    { $group: { _id: '$room', averageRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } }
  ]);

  if (stats.length > 0) {
    await Room.findByIdAndUpdate(this.room, {
      averageRating: stats[0].averageRating,
      numReviews: stats[0].numReviews
    });
  } else {
    await Room.findByIdAndUpdate(this.room, {
      averageRating: 0,
      numReviews: 0
    });
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
