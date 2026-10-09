const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protects routes by verifying a Bearer JWT in the Authorization header.
 * Attaches the authenticated user (without passwordHash) to req.user.
 */
const protect = async (req, res, next) => {
  try {
    // --- Extract token from Authorization header ---
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorised. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authorised. Malformed token.' });
    }

    // --- Verify token ---
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: 'Not authorised. Invalid or expired token.' });
    }

    // --- Load user from DB, strip passwordHash ---
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'Not authorised. User no longer exists.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};

module.exports = protect;
