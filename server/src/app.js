const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const roomRoutes = require('./routes/room.routes');
const bookingRoutes = require('./routes/booking.routes');
const userRoutes = require('./routes/user.routes');
const reviewRoutes = require('./routes/review.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const errorHandler = require('./utils/errorHandler');

const app = express();

// Trust reverse proxy (required for Render, Heroku, etc. so rate-limiter gets the real client IP)
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

const frontendUrl = process.env.FRONTEND_URL;
app.use(
  cors({
    origin: frontendUrl,
    credentials: false
  })
);
app.use(express.json());

// Routes
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, status: 'ok', service: 'stayease-api' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

app.use(errorHandler);

module.exports = app;
