const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Booking = require('./src/models/Booking.model');
const Room = require('./src/models/Room.model');
const User = require('./src/models/User.model');
const { createBooking } = require('./src/controllers/booking.controller');

dotenv.config({ path: './.env' });

async function runTest() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  // Create dummy user and room
  const user = await User.create({ name: 'Test User', email: 'test' + Date.now() + '@test.com', password: 'password123' });
  const room = await Room.create({
    name: 'Test Room',
    type: 'Standard',
    description: 'Test',
    pricePerNight: 100,
    capacity: 2
  });

  const req1 = {
    user: { id: user._id },
    body: {
      room: room._id.toString(),
      checkIn: '2027-01-01',
      checkOut: '2027-01-05',
      guests: 2
    }
  };

  const req2 = {
    user: { id: user._id },
    body: {
      room: room._id.toString(),
      checkIn: '2027-01-01',
      checkOut: '2027-01-05',
      guests: 2
    }
  };

  let responses = [];
  const mockRes = () => {
    const res = {};
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      res.data = data;
      responses.push({ code: res.statusCode, data });
    };
    return res;
  };
  
  const next = (err) => { if (err) console.error(err); };

  console.log('Sending two booking requests concurrently...');
  await Promise.all([
    createBooking(req1, mockRes(), next),
    createBooking(req2, mockRes(), next)
  ]);

  console.log('Responses:', responses.map(r => r.code));
  
  const bookings = await Booking.find({ room: room._id });
  console.log('Total bookings created for room:', bookings.length);

  // Cleanup
  await Booking.deleteMany({ room: room._id });
  await Room.findByIdAndDelete(room._id);
  await User.findByIdAndDelete(user._id);
  
  await mongoose.disconnect();
}

runTest().catch(console.error);
