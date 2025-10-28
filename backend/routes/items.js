const express = require('express');
const { Op, fn, col } = require('sequelize');
const { Item, User, Bid } = require('../models');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Items API is working!' });
});

// Clear all items
router.delete('/clear', async (req, res) => {
  try {
    await Item.destroy({ where: {} });
    res.json({ message: 'All items cleared successfully' });
  } catch (error) {
    console.error('Clear items error:', error);
    res.status(500).json({ error: 'Failed to clear items' });
  }
});

// Get all items
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      type, category, priority, condition, search,
      sortBy = 'createdAt', order = 'DESC',
      page = 1, limit = 20, tags
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
      where.tags = { [Op.overlap]: tags.split(',') };
    }
    
    const items = await Item.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'rating', 'totalReviews', 'isVerified', 'isPrime']
      }],
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
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'rating', 'totalReviews', 'isVerified', 'isPrime', 'location']
      }]
    });
    
    if (!item) return res.status(404).json({ error: 'Item not found' });
    
    await item.increment('views');
    
    const bids = await Bid.findAll({
      where: { itemId: item.id },
      include: [{ model: User, as: 'bidder', attributes: ['id', 'name'] }],
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
    console.log('📨 POST /items - Creating new item');
    console.log('User ID:', req.user?.id);
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Request body:', req.body);

    const {
      title,
      description,
      category,
      condition,
      type,
      price,
      startingBid,
      lookingFor,
      auctionEndDate,
      images = [],
      tags = [],
      stock = 1,
      warrantyStatus,
      itemCondition,
      damageInfo,
      usageHistory,
      originalBox
    } = req.body;

    // Validate required fields
    if (!title || !description) {
      console.error('❌ Missing required fields: title or description');
      return res.status(400).json({ error: 'Title and description are required' });
    }

    if (!type) {
      console.error('❌ Missing required field: type (bidding, exchange, resell)');
      return res.status(400).json({ error: 'Type is required (bidding, exchange, or resell)' });
    }

    // Validate type-specific requirements
    if (type === 'resell' && !price) {
      console.error('❌ Resell items require price');
      return res.status(400).json({ error: 'Resell items require a price' });
    }

    if (type === 'bidding' && !startingBid) {
      console.error('❌ Bidding items require startingBid');
      return res.status(400).json({ error: 'Bidding items require a starting bid' });
    }

    if (type === 'exchange' && !lookingFor) {
      console.error('❌ Exchange items require lookingFor');
      return res.status(400).json({ error: 'Exchange items require what you are looking for' });
    }

    console.log('✅ All validations passed');

    // Create the item
    const itemData = {
      title,
      description,
      category: category || 'Other',
      condition: condition || 'Used',
      type,
      price: price || null,
      startingBid: startingBid || null,
      currentBid: startingBid || null,
      lookingFor: lookingFor || null,
      auctionEndDate: auctionEndDate || null,
      images: Array.isArray(images) ? images : [],
      tags: Array.isArray(tags) ? tags : [],
      stock: stock || 1,
      warrantyStatus: warrantyStatus || null,
      itemCondition: itemCondition || null,
      damageInfo: damageInfo || null,
      usageHistory: usageHistory || null,
      originalBox: originalBox || null,
      userId: req.user.id,
      isActive: true,
      views: 0,
      totalBids: 0
    };

    console.log('📝 Creating item with data:', itemData);

    const item = await Item.create(itemData);
    console.log('✅ Item created with ID:', item.id);

    const createdItem = await Item.findByPk(item.id, {
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'rating', 'totalReviews', 'isVerified', 'isPrime']
      }]
    });

    console.log('✅ Item retrieved with seller info');
    res.status(201).json({ message: 'Item created successfully', item: createdItem });

  } catch (error) {
    console.error('❌ Create item error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: error.message || 'Failed to create item' });
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
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'rating', 'totalReviews', 'isVerified', 'isPrime']
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
