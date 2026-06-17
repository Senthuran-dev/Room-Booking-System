const express = require('express');
const { getReviews, createReview, deleteReview } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getReviews)
  .post(protect, createReview);

router.route('/:reviewId')
  .delete(protect, adminOnly, deleteReview);

module.exports = router;
