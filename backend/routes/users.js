const express = require('express');
const { User, Subscription, Item } = require('../models');
const { auth } = require('../middleware/auth');
const router = express.Router();

// -------------------- Dashboard --------------------
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'otpCode', 'otpExpires'] },
      include: [
        {
          model: Subscription,
          as: 'subscriptions',
          limit: 1,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's item count
    const itemCount = await Item.count({
      where: { userId: req.user.id, isActive: true }
    });

    res.json({
      user,
      stats: {
        totalItems: itemCount
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- Get Subscription --------------------
// ✅ FIXED: Moved BEFORE /:id to prevent route conflict
router.get('/subscription', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found' });
    }

    const now = new Date();
    const isExpired = subscription.expiryDate
      ? now > new Date(subscription.expiryDate)
      : false;

    const daysRemaining = subscription.expiryDate && !isExpired
      ? Math.ceil((new Date(subscription.expiryDate) - now) / (1000 * 60 * 60 * 24))
      : 0;

    res.json({
      subscription: {
        ...subscription.toJSON(),
        isExpired,
        daysRemaining
      }
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- Update Profile --------------------
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

    const { password: _, otpCode: __, otpExpires: ___, ...userData } = user.toJSON();

    res.json({
      message: 'Profile updated successfully',
      user: userData
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- Get My Items --------------------
router.get('/my/items', auth, async (req, res) => {
  try {
    const items = await Item.findAll({
      where: { userId: req.user.id, isActive: true },
      order: [['createdAt', 'DESC']]
    });

    res.json({ items, total: items.length });
  } catch (error) {
    console.error('Get my items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- Get Public User Profile --------------------
// ✅ FIXED: Kept at bottom so it doesn't conflict with other routes
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'email', 'otpCode', 'otpExpires'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's active items count
    const itemCount = await Item.count({
      where: { userId: req.params.id, isActive: true }
    });

    res.json({ user, stats: { totalItems: itemCount } });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
