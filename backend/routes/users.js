const express = require('express');
const { User, Subscription } = require('../models'); // ✅ ADD Subscription
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get user profile with subscription
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Subscription,
          as: 'subscriptions',
          order: [['createdAt', 'DESC']],
          limit: 1
        }
      ]
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, avatar, phone, location, bio } = req.body;
    
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await user.update({
      name: name || user.name,
      avatar: avatar || user.avatar,
      phone: phone || user.phone,
      location: location || user.location,
      bio: bio || user.bio
    });
    
    const { password: _, ...userData } = user.toJSON();
    
    res.json({
      message: 'Profile updated successfully',
      user: userData
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'email', 'otpCode', 'otpExpires'] }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ NEW: Get user subscription details
router.get('/subscription', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found' });
    }
    
    // Check if subscription is expired
    const now = new Date();
    const isExpired = now > new Date(subscription.expiryDate);
    
    res.json({
      subscription: {
        ...subscription.toJSON(),
        isExpired,
        daysRemaining: isExpired ? 0 : Math.ceil((new Date(subscription.expiryDate) - now) / (1000 * 60 * 60 * 24))
      }
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
