const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const models = require('../models');
const User = models.User;
const Subscription = models.Subscription;
console.log('Auth: User model loaded:', typeof User);

const router = express.Router();

// -------------------- JWT Auth Middleware --------------------
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// -------------------- Register --------------------
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, avatar, phone, location, bio } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
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

    // ✅ CREATE PENDING SUBSCRIPTION (waiting for offline payment approval)
    console.log('Creating pending subscription for user:', user.id);
    
    try {
      const newSubscription = await Subscription.create({
        userId: user.id,
        planName: 'Basic Plan',
        amount: 99.00,
        status: 'pending',  // ✅ Pending until admin approves
        paymentMethod: 'offline',
        transactionId: null,
        paymentProof: null,
        agentName: null,
        approvedAt: null,
        startDate: null,  // Will be set when approved
        expiryDate: null   // Will be set when approved
      });
      
      console.log('✅ Pending subscription created:', newSubscription.toJSON());
    } catch (subErr) {
      console.error('❌ Error creating subscription:', subErr.message);
      console.error('Full error:', subErr);
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
    
    const { password: _, ...userData } = user.toJSON();
    
    res.status(201).json({
      message: 'User created successfully. Subscription pending approval.',
      user: userData,
      token,
      subscription: {
        planName: 'Basic Plan',
        amount: 99,
        status: 'pending',
        message: 'Please contact admin with payment details for subscription approval'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// -------------------- Login --------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

    await user.update({ lastActive: new Date() });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
    
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

// -------------------- Get current user --------------------
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const { password: _, ...userData } = user.toJSON();
    res.json({ user: userData });
  } catch (err) {
    console.error('Get current user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
