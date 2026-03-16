cat > /root/Website-Sayonara/backend/routes/users.js << 'ENDOFFILE'
const express = require('express');
const { User, Subscription, Item } = require('../models');
const { auth } = require('../middleware/auth');
const router = express.Router();

// -------------------- Dashboard --------------------
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'otpCode', 'otpExpires'] },
      include: [{ model: Subscription, as: 'subscriptions', limit: 1, order: [['createdAt', 'DESC']] }]
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const itemCount = await Item.count({ where: { userId: req.user.id, isActive: true } });
    res.json({ user, stats: { totalItems: itemCount } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- Get Subscription --------------------
router.get('/subscription', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    if (!subscription) return res.status(404).json({ error: 'No subscription found' });
    const now = new Date();
    const isExpired = subscription.expiryDate ? now > new Date(subscription.expiryDate) : false;
    const daysRemaining = subscription.expiryDate && !isExpired
      ? Math.ceil((new Date(subscription.expiryDate) - now) / (1000 * 60 * 60 * 24)) : 0;
    res.json({ subscription: { ...subscription.toJSON(), isExpired, daysRemaining } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- Update Profile --------------------
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, avatar, phone, location, lat, lng, bio } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update({
      name: name || user.name,
      avatar: avatar || user.avatar,
      phone: phone || user.phone,
      location: location || user.location,
      lat: lat !== undefined ? lat : user.lat,
      lng: lng !== undefined ? lng : user.lng,
      bio: bio || user.bio
    });

    const { password: _, otpCode: __, otpExpires: ___, ...userData } = user.toJSON();
    res.json({ message: 'Profile updated successfully', user: userData });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- Update Location --------------------
router.put('/location', auth, async (req, res) => {
  try {
    const { lat, lng, location } = req.body;
    if (!lat || !lng) return res.status(400).json({ error: 'lat and lng are required' });
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.update({ lat: parseFloat(lat), lng: parseFloat(lng), location: location || user.location });
    res.json({ message: 'Location updated', lat, lng, location });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- Get Me --------------------
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'otpCode', 'otpExpires'] }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- Check Mobile --------------------
router.post('/check-mobile', async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ error: 'Mobile number required' });
    if (!/^\d{10}$/.test(mobile)) return res.status(400).json({ error: 'Invalid mobile number' });
    const existingUser = await User.findOne({ where: { contact: mobile } });
    res.json({ exists: !!existingUser, available: !existingUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check mobile number' });
  }
});

router.get('/check-mobile', async (req, res) => {
  try {
    const { mobile } = req.query;
    if (!mobile) return res.status(400).json({ error: 'Mobile number required' });
    if (!/^\d{10}$/.test(mobile)) return res.status(400).json({ error: 'Invalid mobile number' });
    const existingUser = await User.findOne({ where: { contact: mobile } });
    res.json({ exists: !!existingUser, available: !existingUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check mobile number' });
  }
});

// -------------------- Get My Items --------------------
router.get('/my/items', auth, async (req, res) => {
  try {
    const items = await Item.findAll({ where: { userId: req.user.id, isActive: true }, order: [['createdAt', 'DESC']] });
    res.json({ items, total: items.length });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- Get Public User Profile --------------------
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'email', 'otpCode', 'otpExpires', 'lat', 'lng'] }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const itemCount = await Item.count({ where: { userId: req.params.id, isActive: true } });
    res.json({ user, stats: { totalItems: itemCount } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
ENDOFFILE

pm2 restart sayonara-backend && pm2 logs sayonara-backend --lines 15
