const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * POST /api/auth/register
 * Creates a new user account.
 */
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // --- Validate required fields ---
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email, and password are required.' });
  }

  // --- Check for duplicate email ---
  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({ message: 'An account with that email already exists.' });
  }

  // --- Hash password ---
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // --- Persist user ---
  const user = await User.create({ name, email, passwordHash });

  return res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

/**
 * POST /api/auth/login
 * Authenticates a user and returns a signed JWT.
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  // --- Validate required fields ---
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required.' });
  }

  try {
    // --- Look up user ---
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // --- Verify password ---
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // --- Sign JWT ---
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};

module.exports = { register, login };
