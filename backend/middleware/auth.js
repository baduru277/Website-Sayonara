const jwt = require('jsonwebtoken');
const { User } = require('../models');

// -------------------- Auth Middleware --------------------
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');

    const user = await User.findOne({
      where: { id: decoded.id },
      attributes: { exclude: ['password', 'otpCode', 'otpExpires'] }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found. Please login again.' });
    }

    req.user = user;
    next();
  } catch (error) {
    // ✅ Better error messages
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please login again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token. Please login again.' });
    }
    res.status(401).json({ error: 'Authentication failed.' });
  }
};

// -------------------- Optional Auth Middleware --------------------
// Used for public routes where login is optional (e.g. view items)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');

      const user = await User.findOne({
        where: { id: decoded.id },
        attributes: { exclude: ['password', 'otpCode', 'otpExpires'] }
      });

      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // ✅ Don't fail - just continue without user
    next();
  }
};

// -------------------- Admin Auth Middleware --------------------
// ✅ NEW: Protect admin routes
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');

    const user = await User.findOne({
      where: { id: decoded.id },
      attributes: { exclude: ['password', 'otpCode', 'otpExpires'] }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found. Please login again.' });
    }

    // ✅ Check admin flag
    if (!user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please login again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token. Please login again.' });
    }
    res.status(401).json({ error: 'Authentication failed.' });
  }
};

module.exports = { auth, optionalAuth, adminAuth };
