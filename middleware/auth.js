const jwt = require('jsonwebtoken');

/**
 * Verify JWT Token Middleware
 * Extracts and verifies JWT token from Authorization header
 * Attaches decoded user information to request object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No authorization header provided',
      });
    }

    // Extract token from "Bearer <token>" format
    const tokenParts = authHeader.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization header format. Use: Bearer <token>',
      });
    }

    const token = tokenParts[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Token verification failed',
      error: error.message,
    });
  }
};

/**
 * Check User Role Middleware
 * Verifies that the authenticated user has the required role
 * @param {String|Array} allowedRoles - Role(s) allowed to access the route
 * @returns {Function} - Middleware function
 */
exports.checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const User = require('../models/User');

      // Get user from database to check current role
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Convert to array if single role provided
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role(s): ${roles.join(', ')}`,
        });
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({
        success: false,
        message: 'Error checking user role',
        error: error.message,
      });
    }
  };
};

module.exports = exports;