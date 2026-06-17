const Room = require('../models/Room');
const APIFeatures = require('../utils/apiFeatures');
const Booking = require('../models/Booking');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.getRooms = async (req, res, next) => {
  try {
    const features = new APIFeatures(Room.find(), req.query).filter().sort().paginate();
    const rooms = await features.query;
    res.status(200).json({ success: true, count: rooms.length, data: rooms });
  } catch (err) { next(err); }
};

exports.getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.status(200).json({ success: true, data: room });
  } catch (err) { next(err); }
};

exports.createRoom = async (req, res, next) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ success: true, data: room });
  } catch (err) { next(err); }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.status(200).json({ success: true, data: room });
  } catch (err) { next(err); }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    await room.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) { next(err); }
};

exports.uploadImages = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'stayease_rooms' },
          (error, result) => {
            if (error) reject(error);
            else resolve({ url: result.secure_url, public_id: result.public_id });
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    });

    const newImages = await Promise.all(uploadPromises);
    room.images.push(...newImages);
    await room.save();

    res.status(200).json({ success: true, data: room });
  } catch (err) { next(err); }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

    const image = room.images.id(req.params.imgId);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found in room' });

    await cloudinary.uploader.destroy(image.public_id);
    
    room.images.pull(req.params.imgId);
    await room.save();

    res.status(200).json({ success: true, data: room });
  } catch (err) { next(err); }
};

exports.checkAvailability = async (req, res, next) => {
  try {
    const { roomId, checkIn, checkOut } = req.query;
    const overlappingBookings = await Booking.find({
      room: roomId,
      status: { $in: ['Pending', 'Confirmed'] },
      $or: [
        { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }
      ]
    });
    res.status(200).json({ success: true, available: overlappingBookings.length === 0 });
  } catch (err) { next(err); }
};
