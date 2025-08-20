const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, firstName, lastName, location } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      location,
      isVerified: true,
      rating: 0.00,
      totalReviews: 0,
      isPrime: false,
      lastActive: new Date()
    });

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback-secret', {
      expiresIn: '7d'
    });

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.status(201).json({
      message: 'User created successfully.',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Registration error:', error.message, error.stack);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback-secret', {
      expiresIn: '7d'
    });

    await user.update({ lastActive: new Date() });

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error.message, error.stack);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userResponse } = user;
    res.json({ user: userResponse });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, bio, location, phone } = req.body;
    
    if (sequelize.inMemoryDB) {
      const { users } = sequelize.inMemoryDB;
      const user = users.get(req.user.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update user
      Object.assign(user, {
        firstName,
        lastName,
        bio,
        location,
        phone,
        updatedAt: new Date()
      });

      users.set(user.id, user);

      const { password: _, ...userResponse } = user;
      res.json({
        message: 'Profile updated successfully',
        user: userResponse
      });
    } else {
      await req.user.update({
        firstName,
        lastName,
        bio,
        location,
        phone
      });

      res.json({
        message: 'Profile updated successfully',
        user: req.user.toJSON()
      });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 