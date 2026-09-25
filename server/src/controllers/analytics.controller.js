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

    // Occupancy calculation (mocked based on total bookings vs rooms capacity for simplicity, or just return a static nice number for the demo)
    // A real system would check overlapping dates. For now, let's just base it on active bookings.
    const activeBookings = await Booking.countDocuments({
      status: { $in: ['Confirmed', 'Completed'] }
    });
    const occupancyRate = totalRooms > 0 ? Math.min(Math.round((activeBookings / (totalRooms * 30)) * 100), 100) : 0; 

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
