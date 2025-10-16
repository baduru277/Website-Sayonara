const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, avatar, phone, location, bio } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      avatar: avatar || null,
      phone: phone || null,
      location: location || null,
      bio: bio || null,
      isVerified: 1,
      rating: 0.0,
      totalReviews: 0,
      isPrime: 0,
      lastActive: new Date()
    });

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });

    const { password: _, ...userData } = user.toJSON();
    res.status(201).json({ message: 'User created successfully', user: userData, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

module.exports = router;
