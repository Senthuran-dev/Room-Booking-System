const Review = require('../models/Review.model');
const Booking = require('../models/Booking.model');

exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ room: req.params.roomId }).populate({ path: 'user', select: 'name avatar' });
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (err) { next(err); }
};

exports.createReview = async (req, res, next) => {
  try {
    req.body.room = req.params.roomId;
    req.body.user = req.user.id;

    const completedBooking = await Booking.findOne({
      user: req.user.id,
      room: req.params.roomId,
      status: 'Completed'
    });

    if (!completedBooking) {
      return res.status(400).json({ success: false, message: 'You must complete a stay before reviewing' });
    }

    const review = await Review.create(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'You have already reviewed this room' });
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    await review.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) { next(err); }
};
