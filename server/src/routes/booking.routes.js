const express = require('express');
const { createBooking, getMyBookings, getBookingById, cancelBooking, getAllBookings, updateStatus } = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createBooking)
  .get(adminOnly, getAllBookings);

router.get('/my', getMyBookings);

router.route('/:id')
  .get(getBookingById);

router.patch('/:id/cancel', cancelBooking);
router.patch('/:id/status', adminOnly, updateStatus);

module.exports = router;
