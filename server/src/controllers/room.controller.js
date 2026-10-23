const Room = require('../models/Room.model');
const APIFeatures = require('../utils/apiFeatures');
const Booking = require('../models/Booking.model');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

exports.getRooms = async (req, res, next) => {
  try {
    let query = Room.find();
    const queryParams = { ...req.query };

    // Check-in and check-out availability filtering
    if (queryParams.checkIn && queryParams.checkOut) {
      const checkIn = new Date(queryParams.checkIn);
      const checkOut = new Date(queryParams.checkOut);

      if (!Number.isNaN(checkIn.getTime()) && !Number.isNaN(checkOut.getTime())) {
        const overlappingBookings = await Booking.find({
          status: { $in: ['Pending', 'Confirmed'] },
          $or: [
            { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }
          ]
        });

        const bookedRoomIds = overlappingBookings.map(b => b.room);
        query = query.find({ _id: { $nin: bookedRoomIds } });
      }
      
      delete queryParams.checkIn;
      delete queryParams.checkOut;
    }

    // Support minPrice and maxPrice query parameters
    if (queryParams.minPrice !== undefined || queryParams.maxPrice !== undefined) {
      queryParams.pricePerNight = queryParams.pricePerNight || {};
      if (queryParams.minPrice !== undefined && queryParams.minPrice !== '') {
        const minP = Number(queryParams.minPrice);
        if (!Number.isNaN(minP)) queryParams.pricePerNight.gte = minP;
      }
      if (queryParams.maxPrice !== undefined && queryParams.maxPrice !== '') {
        const maxP = Number(queryParams.maxPrice);
        if (!Number.isNaN(maxP)) queryParams.pricePerNight.lte = maxP;
      }
      delete queryParams.minPrice;
      delete queryParams.maxPrice;
    }

    // Support guests capacity (minimum capacity needed to accommodate guests)
    if (queryParams.capacity !== undefined && queryParams.capacity !== '') {
      const cap = Number(queryParams.capacity);
      if (!Number.isNaN(cap) && cap > 0) {
        queryParams.capacity = { gte: cap };
      } else {
        delete queryParams.capacity;
      }
    }

    // Ignore empty or 'All' type filter
    if (!queryParams.type || queryParams.type.toLowerCase() === 'all') {
      delete queryParams.type;
    }

    // Support search keyword by room name or description
    if (queryParams.search && queryParams.search.trim()) {
      const searchRegex = new RegExp(queryParams.search.trim(), 'i');
      query = query.find({
        $or: [{ name: searchRegex }, { description: searchRegex }]
      });
      delete queryParams.search;
    }

    const features = new APIFeatures(query, queryParams).filter().sort().paginate();
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
