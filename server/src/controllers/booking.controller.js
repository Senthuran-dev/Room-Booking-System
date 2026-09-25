const Booking = require('../models/Booking.model');
const Room = require('../models/Room.model');

exports.createBooking = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const room = await Room.findById(req.body.room);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    
    // Validate dates
    const checkIn = new Date(req.body.checkIn);
    const checkOut = new Date(req.body.checkOut);
    if (
      Number.isNaN(checkIn.getTime()) ||
      Number.isNaN(checkOut.getTime()) ||
      checkOut <= checkIn
    ) {
      return res.status(400).json({ success: false, message: 'Invalid booking dates' });
    }

    // Validate capacity
    if (req.body.guests > room.capacity) {
      return res.status(400).json({ success: false, message: `Maximum capacity is ${room.capacity} guests` });
    }

    // Calculate price
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * room.pricePerNight * 1.15;
    
    // Check overlap
    const overlapping = await Booking.find({
      room: req.body.room,
      status: { $in: ['Pending', 'Confirmed'] },
      $or: [
        { checkIn: { $lt: new Date(req.body.checkOut) }, checkOut: { $gt: new Date(req.body.checkIn) } }
      ]
    });
    
    if (overlapping.length > 0) {
      return res.status(400).json({ success: false, message: 'Room is already booked for these dates' });
    }

    const booking = await Booking.create({
      user: req.user.id,
      room: room._id,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
      guests: req.body.guests,
      totalPrice
    });
    res.status(201).json({ success: true, data: booking });
  } catch (err) { next(err); }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('room');
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) { next(err); }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('room user');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (
      booking.user._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (err) { next(err); }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    booking.status = 'Cancelled';
    await booking.save();
    res.status(200).json({ success: true, data: booking });
  } catch (err) { next(err); }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate('room user');
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.status(200).json({ success: true, data: booking });
  } catch (err) { next(err); }
};
