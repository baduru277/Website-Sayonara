const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const models = require('../models');
const User = models.User;
console.log('Auth: User model loaded:', typeof User);
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
 try {
  const { name, email, password, avatar, phone, location, bio } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
   return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
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
   avatar: avatar || null,
   phone: phone || null,
   location: location || null,
   bio: bio || null,
   isVerified: 0,
   rating: 0.0,
   totalReviews: 0,
   isPrime: 0,
   lastActive: new Date()
  });

  // Generate JWT
  const token = jwt.sign(
   { id: user.id },
   process.env.JWT_SECRET || 'fallback-secret',
   { expiresIn: '7d' }
  );

  // Remove password from response
  const { password: _, ...userData } = user.toJSON();
 
  res.status(201).json({
   message: 'User created successfully',
   user: userData,
   token
  });
 } catch (error) {
  console.error('Registration error:', error);
  res.status(500).json({ error: error.message || 'Server error' });
 }
});

// Login
router.post('/login', async (req, res) => {
 try {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
   return res.status(400).json({ error: 'Email and password are required' });
  }

  // Find user
  const user = await User.findOne({ where: { email: email.toLowerCase() } });
  if (!user) {
   return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
   return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Update last active
  await user.update({ lastActive: new Date() });

  // Generate JWT
  const token = jwt.sign(
   { id: user.id },
   process.env.JWT_SECRET || 'fallback-secret',
   { expiresIn: '7d' }
  );

  // Remove password from response
  const { password: _, ...userData } = user.toJSON();

  res.json({
   message: 'Login successful',
   user: userData,
   token
  });
 } catch (error) {
  console.error('Login error:', error);
  res.status(500).json({ error: error.message || 'Server error' });
 }
});

module.exports = router;