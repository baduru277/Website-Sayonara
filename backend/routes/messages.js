const express = require('express');
const { Op } = require('sequelize');
const { Message, User, Item } = require('../models');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Multer for chat image uploads
const chatUploadDir = path.join(__dirname, '../uploads/chat');
if (!fs.existsSync(chatUploadDir)) {
  fs.mkdirSync(chatUploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, chatUploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `chat_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// -------------------- Get All Conversations --------------------
// GET /api/messages/conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all messages where user is sender or receiver
    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }]
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'avatar', 'lastActive'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'avatar', 'lastActive'] },
        { model: Item, as: 'item', attributes: ['id', 'title', 'images', 'type', 'price', 'startingBid'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Group by conversation (unique user + item pair)
    const conversationMap = new Map();

    for (const msg of messages) {
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
      const key = `${otherUser.id}_${msg.itemId || 'general'}`;

      if (!conversationMap.has(key)) {
        // Count unread messages
        const unreadCount = await Message.count({
          where: {
            senderId: otherUser.id,
            receiverId: userId,
            itemId: msg.itemId || null,
            isRead: false
          }
        });

        conversationMap.set(key, {
          id: key,
          otherUser: {
            id: otherUser.id,
            name: otherUser.name,
            avatar: otherUser.avatar,
            online: otherUser.lastActive
              ? (Date.now() - new Date(otherUser.lastActive).getTime()) < 5 * 60 * 1000
              : false
          },
          item: msg.item ? {
            id: msg.item.id,
            title: msg.item.title,
            image: msg.item.images?.[0] || null,
            type: msg.item.type,
            price: msg.item.price || msg.item.startingBid
          } : null,
          lastMessage: msg.content || (msg.messageType === 'image' ? '📷 Image' : ''),
          lastMessageTime: msg.createdAt,
          unreadCount
        });
      }
    }

    res.json({ conversations: Array.from(conversationMap.values()) });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: error.message });
  }
});

// -------------------- Get Messages in a Conversation --------------------
// GET /api/messages/:otherUserId?itemId=xxx
router.get('/:otherUserId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;
    const { itemId } = req.query;

    const where = {
      [Op.or]: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    };
    if (itemId) where.itemId = itemId;

    const messages = await Message.findAll({
      where,
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] },
        { model: Item, as: 'item', attributes: ['id', 'title', 'images', 'type', 'price', 'startingBid', 'condition', 'location'] }
      ],
      order: [['createdAt', 'ASC']]
    });

    // Mark messages as read
    await Message.update(
      { isRead: true },
      { where: { senderId: otherUserId, receiverId: userId, isRead: false } }
    );

    // Get other user info
    const otherUser = await User.findByPk(otherUserId, {
      attributes: ['id', 'name', 'avatar', 'lastActive', 'isVerified']
    });

    res.json({ messages, otherUser });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: error.message });
  }
});

// -------------------- Send Text Message --------------------
// POST /api/messages
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, content, itemId } = req.body;

    if (!receiverId || !content?.trim()) {
      return res.status(400).json({ error: 'Receiver and content are required' });
    }

    // Update sender's lastActive
    await User.update({ lastActive: new Date() }, { where: { id: req.user.id } });

    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      content: content.trim(),
      itemId: itemId || null,
      messageType: 'text'
    });

    const fullMessage = await Message.findByPk(message.id, {
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] }
      ]
    });

    res.status(201).json({ message: fullMessage });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: error.message });
  }
});

// -------------------- Send Image Message --------------------
// POST /api/messages/image
router.post('/image', auth, upload.single('image'), async (req, res) => {
  try {
    const { receiverId, itemId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ error: 'Receiver is required' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const imageUrl = `/uploads/chat/${req.file.filename}`;
    await User.update({ lastActive: new Date() }, { where: { id: req.user.id } });

    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      imageUrl,
      itemId: itemId || null,
      messageType: 'image'
    });

    const fullMessage = await Message.findByPk(message.id, {
      include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] }]
    });

    res.status(201).json({ message: fullMessage });
  } catch (error) {
    console.error('Send image message error:', error);
    res.status(500).json({ error: error.message });
  }
});

// -------------------- Share Item in Chat --------------------
// POST /api/messages/share-item
router.post('/share-item', auth, async (req, res) => {
  try {
    const { receiverId, itemId } = req.body;

    if (!receiverId || !itemId) {
      return res.status(400).json({ error: 'Receiver and item are required' });
    }

    const item = await Item.findByPk(itemId, {
      include: [{ model: User, as: 'seller', attributes: ['id', 'name'] }]
    });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    await User.update({ lastActive: new Date() }, { where: { id: req.user.id } });

    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      itemId,
      messageType: 'item_share',
      content: `Shared item: ${item.title}`,
      itemSnapshot: {
        id: item.id,
        title: item.title,
        image: item.images?.[0] || null,
        price: item.price || item.startingBid,
        condition: item.condition,
        type: item.type,
        location: item.location
      }
    });

    const fullMessage = await Message.findByPk(message.id, {
      include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] }]
    });

    res.status(201).json({ message: fullMessage });
  } catch (error) {
    console.error('Share item error:', error);
    res.status(500).json({ error: error.message });
  }
});

// -------------------- Get Unread Count --------------------
// GET /api/messages/unread/count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Message.count({
      where: { receiverId: req.user.id, isRead: false }
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
