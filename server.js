require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);

/**
 * Example protected route to demonstrate authorization
 * Requires valid JWT token with 'user' or 'admin' role
 */
app.get(
  '/api/protected',
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['user', 'admin']),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'You have access to this protected route',
      userId: req.user.id,
    });
  }
);

/**
 * Admin-only route example
 * Requires valid JWT token with 'admin' role
 */
app.get(
  '/api/admin',
  authMiddleware.verifyToken,
  authMiddleware.checkRole('admin'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'You have access to admin resources',
      userId: req.user.id,
    });
  }
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
});

module.exports = app;