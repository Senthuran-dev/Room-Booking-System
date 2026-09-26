const Booking = require('../models/Booking.model');
const User = require('../models/User.model');
const Room = require('../models/Room.model');

exports.getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRooms = await Room.countDocuments();
    
    // Get bookings today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingsToday = await Booking.countDocuments({
      createdAt: { $gte: today }
    });

    // Get monthly revenue (completed & confirmed bookings)
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const revenueAggregation = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: firstDayOfMonth },
          status: { $in: ['Confirmed', 'Completed'] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);
    const monthlyRevenue = revenueAggregation[0]?.totalRevenue || 0;

    // True occupancy calculation for today
    const now = new Date();
    const activeTodayBookings = await Booking.countDocuments({
      status: { $in: ['Confirmed', 'Completed'] },
      checkIn: { $lte: now },
      checkOut: { $gt: now }
    });
    const occupancyRate = totalRooms > 0 ? Math.round((activeTodayBookings / totalRooms) * 100) : 0; 

    res.status(200).json({
      success: true,
      data: {
        bookingsToday,
        monthlyRevenue,
        occupancyRate,
        totalUsers
      }
    });
  } catch (err) {
    next(err);
  }
};
