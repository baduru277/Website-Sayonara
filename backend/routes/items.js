const express = require('express');
const { Op, fn, col } = require('sequelize');
const { Item, User, Bid } = require('../models');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Items API is working!' });
});

// Clear all items (GET)
router.get('/clear', async (req, res) => {
  try {
    if (Item.mockItems) {
      Item.mockItems = [];
    } else {
      await Item.destroy({ where: {} });
    }
    res.json({ message: 'All items cleared successfully' });
  } catch (error) {
    console.error('Clear items error:', error);
    res.status(500).json({ error: 'Failed to clear items' });
  }
});

// Clear all items (DELETE)
router.delete('/clear', async (req, res) => {
  try {
    if (Item.mockItems) {
      Item.mockItems = [];
    } else {
      await Item.destroy({ where: {} });
    }
    res.json({ message: 'All items cleared successfully' });
  } catch (error) {
    console.error('Clear items error:', error);
    res.status(500).json({ error: 'Failed to clear items' });
  }
});

// Get all items with filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      type,
      category,
      priority,
      condition,
      search,
      sortBy = 'createdAt',
      order = 'DESC',
      page = 1,
      limit = 20,
      tags
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { isActive: true };

    if (type) where.type = type;
    if (category && category !== 'All') where.category = category;
    if (priority && priority !== 'All') where.priority = priority;
    if (condition && condition !== 'All') where.condition = condition;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { lookingFor: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (tags) {
      const tagArray = tags.split(',');
      where.tags = { [Op.overlap]: tagArray };
    }

    const items = await Item.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'rating', 'totalReviews', 'isVerified', 'isPrime']
        }
      ],
      order: [[sortBy, order]],
      limit: parseInt(limit) || 20,
      offset: parseInt(offset) || 0
    });

    res.json({
      items: items.rows,
      total: items.count,
      page: parseInt(page) || 1,
      totalPages: Math.ceil(items.count / (limit || 20))
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single item by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'rating', 'totalReviews', 'isVerified', 'isPrime', 'location']
        }
      ]
    });

    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Increment view count
    await item.increment('views');

    // Get latest 10 bids for this item
    const bids = await Bid.findAll({
      where: { itemId: item.id },
      include: [
        {
          model: User,
          as: 'bidder',
          attributes: ['id', 'name']
        }
      ],
      order: [['amount', 'DESC']],
      limit: 10
    });

    res.json({ item, bids });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new item
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      condition,
      type,
      priority,
      images,
      tags,
      location,
      lookingFor,
      startingBid,
      buyNowPrice,
      auctionEndDate,
      price,
      originalPrice,
      stock,
      shipping,
      isPrime,
      fastShipping
    } = req.body;

    if (type === 'exchange' && !lookingFor)
      return res.status(400).json({ error: 'Looking for field is required for exchange items' });
    if (type === 'bidding' && (!startingBid || !auctionEndDate))
      return res.status(400).json({ error: 'Starting bid and auction end date are required for bidding items' });
    if (type === 'resell' && !price)
      return res.status(400).json({ error: 'Price is required for resell items' });

    const item = await Item.create({
      title,
      description,
      category,
      condition,
      type,
      priority,
      images: images || [],
      tags: tags || [],
      location,
      lookingFor,
      startingBid,
      currentBid: startingBid,
      buyNowPrice,
      auctionEndDate,
      price,
      originalPrice,
      discount: originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null,
      stock,
      shipping,
      isPrime,
      fastShipping,
      userId: req.user.id
    });

    const createdItem = await Item.findByPk(item.id, {
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'rating', 'totalReviews', 'isVerified', 'isPrime']
        }
      ]
    });

    res.status(201).json({ message: 'Item created successfully', item: createdItem });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update item
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.userId !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

    await item.update(req.body);
    res.json({ message: 'Item updated successfully', item });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.userId !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

    await item.update({ isActive: false });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Place bid
router.post('/:id/bid', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.type !== 'bidding') return res.status(400).json({ error: 'This item is not available for bidding' });
    if (item.userId === req.user.id) return res.status(400).json({ error: 'You cannot bid on your own item' });
    if (new Date() > new Date(item.auctionEndDate)) return res.status(400).json({ error: 'Auction has ended' });
    if (amount <= item.currentBid) return res.status(400).json({ error: 'Bid must be higher than current bid' });

    await Bid.create({ amount, userId: req.user.id, itemId: item.id });

    await item.update({ currentBid: amount, totalBids: item.totalBids + 1 });

    // Mark previous bids as not winning
    await Bid.update({ isWinning: false }, { where: { itemId: item.id } });
    await Bid.update({ isWinning: true }, { where: { itemId: item.id, amount } });

    res.json({ message: 'Bid placed successfully', currentBid: amount });
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get featured items
router.get('/featured/items', async (req, res) => {
  try {
    const items = await Item.findAll({
      where: { isFeatured: true, isActive: true },
      include: [
        { model: User, as: 'seller', attributes: ['id', 'name', 'rating', 'totalReviews', 'isVerified', 'isPrime'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 12
    });
    res.json({ items });
  } catch (error) {
    console.error('Get featured items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get categories
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

module.exports = router;
