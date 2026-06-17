const express = require('express');
const { getRooms, getRoom, createRoom, updateRoom, deleteRoom, uploadImages, deleteImage, checkAvailability } = require('../controllers/room.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');
const upload = require('../middleware/upload.middleware');
const reviewRouter = require('./review.routes');

const router = express.Router();

router.use('/:roomId/reviews', reviewRouter);

router.get('/available', checkAvailability);

router.route('/')
  .get(getRooms)
  .post(protect, adminOnly, createRoom);

router.route('/:id')
  .get(getRoom)
  .put(protect, adminOnly, updateRoom)
  .delete(protect, adminOnly, deleteRoom);

router.route('/:id/images')
  .post(protect, adminOnly, upload.array('images', 5), uploadImages);

router.delete('/:id/images/:imgId', protect, adminOnly, deleteImage);

module.exports = router;
