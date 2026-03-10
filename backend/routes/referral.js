// routes/referral.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { User, Referral } = require('../models');
const crypto = require('crypto');

// Generate a unique referral code for a user
function generateCode(name) {
  const base = (name || 'USER').replace(/\s+/g, '').toUpperCase().slice(0, 5);
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${base}${rand}`;
}

// ── GET my referral info ──────────────────────────────────────────
router.get('/my', auth, async (req, res) => {
  try {
    let user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Auto-generate referral code if not exists
    if (!user.referralCode) {
      user.referralCode = generateCode(user.name || user.email);
      await user.save();
    }

    // Get all referrals made by this user
    const referrals = await Referral.findAll({
      where: { referrerId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    res.json({
      referralCode: user.referralCode,
      user: { name: user.name, email: user.email },
      referrals,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── POST apply a referral code ────────────────────────────────────
router.post('/apply', auth, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Referral code required' });

    // Can't use your own code
    const me = await User.findByPk(req.user.id);
    if (me.referralCode === code.toUpperCase()) {
      return res.status(400).json({ error: "You can't use your own referral code!" });
    }

    // Already applied a code?
    if (me.referredBy) {
      return res.status(400).json({ error: 'You have already applied a referral code.' });
    }

    // Find the referrer
    const referrer = await User.findOne({ where: { referralCode: code.toUpperCase() } });
    if (!referrer) return res.status(404).json({ error: 'Invalid referral code. Please check and try again.' });

    // Apply referral
    me.referredBy = referrer.id;

    // Give both users 1 month free premium
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    // Extend or set premium for the new user (me)
    if (me.premiumUntil && new Date(me.premiumUntil) > new Date()) {
      // Already premium — extend by 1 month
      const existing = new Date(me.premiumUntil);
      existing.setMonth(existing.getMonth() + 1);
      me.premiumUntil = existing;
    } else {
      me.premiumUntil = oneMonthFromNow;
    }
    me.isSubscribed = true;
    await me.save();

    // Extend or set premium for the referrer
    if (referrer.premiumUntil && new Date(referrer.premiumUntil) > new Date()) {
      const existing = new Date(referrer.premiumUntil);
      existing.setMonth(existing.getMonth() + 1);
      referrer.premiumUntil = existing;
    } else {
      referrer.premiumUntil = oneMonthFromNow;
    }
    referrer.isSubscribed = true;
    await referrer.save();

    // Create referral record
    await Referral.create({
      referrerId: referrer.id,
      referredId: me.id,
      name: me.name || me.email,
      email: me.email,
      status: 'completed',
    });

    res.json({ message: '🎉 Referral applied! You and your friend both get 1 month FREE Premium!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;