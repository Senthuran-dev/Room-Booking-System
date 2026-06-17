const express = require('express');
const cors = require('cors');
const errorHandler = require('./utils/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/rooms', require('./routes/room.routes'));
app.use('/api/v1/bookings', require('./routes/booking.routes'));
app.use('/api/v1/reviews', require('./routes/review.routes'));

app.use(errorHandler);

module.exports = app;
