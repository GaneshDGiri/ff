const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - requires a valid login token
exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    
    // --- ADMIN BYPASS CHECK ---
    if (decoded.role === 'admin' && decoded.id === 'admin-bhavesh-123') {
      req.user = { id: decoded.id, role: 'admin' };
      return next();
    }
    // --------------------------

    // Standard User Check
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ error: 'User associated with token no longer exists' });
    }
    
    next();
  } catch (error) {
    console.error("Token Verification Error:", error);
    res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

// Admin only routes - requires the user role to be 'admin'
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Not authorized as an admin' });
  }
};