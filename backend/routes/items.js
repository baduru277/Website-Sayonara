const express = require('express');
const { Op, fn, col } = require('sequelize');
const { Item, User, Bid } = require('../models');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// -------------------- Get All Items --------------------
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      type, category, priority, condition, search,
      sortBy = 'createdAt', order = 'DESC',
      page = 1, limit = 20, tags, status
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = { isActive: true };

    if (type) where.type = type;
    if (category && category !== 'All') where.category = category;
    if (priority && priority !== 'All') where.priority = priority;
    if (condition && condition !== 'All') where.condition = condition;
    if (status && status !== 'All') where.status = status;

    // ✅ FIXED: Use Op.like instead of Op.iLike (SQLite doesn't support iLike)
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { lookingFor: { [Op.like]: `%${search}%` } }
      ];
    }

    // ✅ FIXED: tags stored as JSON string, use like instead of overlap
    if (tags) {
      where.tags = { [Op.like]: `%${tags}%` };
    }

    const validSortFields = ['createdAt', 'price', 'views', 'likes', 'currentBid', 'startingBid'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const items = await Item.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'rating', 'totalReviews', 'isVerified', 'isPrime', 'avatar']
      }],
      order: [[sortField, sortOrder]],
      limit: parseInt(limit) || 20,
      offset: parseInt(offset) || 0
    });

    res.json({
      items: items.rows,
      total: items.count,
      page: parseInt(page) || 1,
      totalPages: Math.ceil(items.count / (parseInt(limit) || 20))
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// -------------------- Get Featured Items --------------------
// ✅ FIXED: Moved before /:id to prevent route conflict
router.get('/featured/items', async (req, res) => {
  try {
    const items = await Item.findAll({
      where: { isFeatured: true, isActive: true },
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'rating', 'totalReviews', 'isVerified', 'isPrime', 'avatar']
      }],
      order: [['createdAt', 'DESC']],
      limit: 12
    });
    res.json({ items });
  } catch (error) {
    console.error('Get featured items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- Get Categories --------------------
// ✅ FIXED: Moved before /:id to prevent route conflict
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Item.findAll({
      attributes: [
        'category',
        [fn('COUNT', col('id')), 'count']
      ],
      where: { isActive: true },
      group: ['category'],
      order: [[fn('COUNT', col('id')), 'DESC']]
    });
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
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

// -------------------- Get Single Item --------------------
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'rating', 'totalReviews', 'isVerified', 'isPrime', 'location', 'avatar']
      }]
    });

    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Increment views
    await item.increment('views');

    // Get bids if bidding item
    let bids = [];
    if (item.type === 'bidding') {
      bids = await Bid.findAll({
        where: { itemId: item.id },
        include: [{ model: User, as: 'bidder', attributes: ['id', 'name', 'avatar'] }],
        order: [['amount', 'DESC']],
        limit: 10
      });
    }

    res.json({ item, bids });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- Create Item --------------------
router.post('/', auth, async (req, res) => {
  try {
    const {
      title, description, category, condition, type,
      price, originalPrice, discount, stock,
      startingBid, buyNowPrice, auctionEndDate,
      lookingFor, images = [], tags = [],
      location, shipping, priority,
      warrantyStatus, damageInfo, usageHistory, originalBox,
      fastShipping
    } = req.body;

    // -------------------- Validation --------------------
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    if (!type) {
      return res.status(400).json({ error: 'Type is required (bidding, exchange, or resell)' });
    }
    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }
    if (!condition) {
      return res.status(400).json({ error: 'Condition is required' });
    }
    if (!location) {
      return res.status(400).json({ error: 'Location is required' });
    }
    if (type === 'resell' && !price) {
      return res.status(400).json({ error: 'Resell items require a price' });
    }
    if (type === 'bidding' && !startingBid) {
      return res.status(400).json({ error: 'Bidding items require a starting bid' });
    }
    if (type === 'exchange' && !lookingFor) {
      return res.status(400).json({ error: 'Exchange items require what you are looking for' });
    }

    // -------------------- Create Item --------------------
    const item = await Item.create({
      title,
      description,
      category,
      condition,
      type,
      priority: priority || 'medium',
      images: Array.isArray(images) ? images : [],
      tags: Array.isArray(tags) ? tags : [],
      location,
      userId: req.user.id,
      isActive: true,
      status: 'available',
      views: 0,
      likes: 0,

      // Resell fields
      price: price || null,
      originalPrice: originalPrice || null,
      discount: discount || null,
      stock: stock || 1,
      shipping: shipping || null,
      fastShipping: fastShipping || false,

      // Bidding fields
      startingBid: startingBid || null,
      currentBid: startingBid || null,
      buyNowPrice: buyNowPrice || null,
      auctionEndDate: auctionEndDate || null,
      totalBids: 0,

      // Exchange fields
      lookingFor: lookingFor || null,

      // Extra fields
      warrantyStatus: warrantyStatus || null,
      damageInfo: damageInfo || null,
      usageHistory: usageHistory || null,
      originalBox: originalBox || false,
    });

    // Return item with seller info
    const createdItem = await Item.findByPk(item.id, {
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'rating', 'totalReviews', 'isVerified', 'isPrime', 'avatar']
      }]
    });

    console.log(`✅ Item created: ${item.id} by user ${req.user.id}`);
    res.status(201).json({ message: 'Item created successfully', item: createdItem });

  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ error: error.message || 'Failed to create item' });
  }
});

// -------------------- Update Item --------------------
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.userId !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

    // ✅ Prevent updating sensitive fields directly
    const { userId, views, totalBids, currentBid, likes, ...updateData } = req.body;

    await item.update(updateData);

    const updatedItem = await Item.findByPk(item.id, {
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'rating', 'totalReviews', 'isVerified', 'isPrime', 'avatar']
      }]
    });

    res.json({ message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// -------------------- Delete Item --------------------
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.userId !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

    // ✅ Soft delete - just set isActive to false
    await item.update({ isActive: false, status: 'cancelled' });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- Place Bid --------------------
router.post('/:id/bid', auth, async (req, res) => {
  try {
    const { amount, message } = req.body;
    const item = await Item.findByPk(req.params.id);

    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.type !== 'bidding') return res.status(400).json({ error: 'This item is not available for bidding' });
    if (item.userId === req.user.id) return res.status(400).json({ error: 'You cannot bid on your own item' });
    if (!item.isActive) return res.status(400).json({ error: 'This item is no longer active' });
    if (item.auctionEndDate && new Date() > new Date(item.auctionEndDate)) {
      return res.status(400).json({ error: 'Auction has ended' });
    }
    if (parseFloat(amount) <= parseFloat(item.currentBid || item.startingBid)) {
      return res.status(400).json({ error: `Bid must be higher than current bid of ₹${item.currentBid || item.startingBid}` });
    }

    // ✅ Set previous winning bid to not winning
    await Bid.update(
      { isWinning: false, status: 'lost' },
      { where: { itemId: item.id, isWinning: true } }
    );

    // Create new bid
    const bid = await Bid.create({
      amount: parseFloat(amount),
      userId: req.user.id,
      itemId: item.id,
      isWinning: true,
      status: 'active',
      message: message || null
    });

    // Update item current bid
    await item.update({
      currentBid: parseFloat(amount),
      totalBids: item.totalBids + 1
    });

    console.log(`✅ Bid placed: ₹${amount} on item ${item.id} by user ${req.user.id}`);

    res.json({
      message: 'Bid placed successfully',
      currentBid: amount,
      totalBids: item.totalBids + 1,
      bid
    });
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// -------------------- Like Item --------------------
router.post('/:id/like', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    await item.increment('likes');
    res.json({ message: 'Item liked', likes: item.likes + 1 });
  } catch (error) {
    console.error('Like item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
