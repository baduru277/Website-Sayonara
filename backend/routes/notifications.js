const express = require('express');
const router = express.Router();
const { Notification, User } = require('../models');
const { auth } = require('../middleware/auth');

// -------------------- Get My Notifications --------------------
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    const unreadCount = notifications.filter(n => !n.isRead).length;
    res.json({ notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- Mark All as Read --------------------
router.put('/mark-all-read', auth, async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id, isRead: false } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- Mark One as Read --------------------
router.put('/:id/read', auth, async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { id: req.params.id, userId: req.user.id } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- Helper to create notification --------------------
// Call this from other routes (messages, bids, etc.)
const createNotification = async ({ userId, type, title, message, link, fromUserName }) => {
  try {
    await Notification.create({
      userId,
      type,      // 'message' | 'bid' | 'exchange' | 'system' | 'sale'
      title,
      message,
      link,
      fromUserName: fromUserName || null,
      isRead: false
    });
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
};

module.exports = { router, createNotification };
