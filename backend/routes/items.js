const express = require('express');
const { Op, fn, col } = require('sequelize');
const { Item, User, Bid } = require('../models');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Test route
router.get('/test', (req, res) => res.json({ message: 'Items API is working!' }));

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

    if (tags) where.tags = { [Op.overlap]: tags.split(',') };

    const items = await Item.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'rating', 'totalReviews', 'isVerified', 'isPrime']
      }],
      order: [[sortBy, order]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      items: items.rows,
      total: items.count,
      page: parseInt(page),
      totalPages: Math.ceil(items.count / limit)
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
      order: [['amount', 'DESC']], limit: 10
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
    const data = req.body;
    if (!data.title || !data.description || !data.type)
      return res.status(400).json({ error: 'Missing required fields' });

    const item = await Item.create({
      ...data,
      discount: data.originalPrice ? Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100) : null,
      userId: req.user.id
    });

    const createdItem = await Item.findByPk(item.id, {
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'rating'] }]
    });

    res.status(201).json({ message: 'Item created successfully', item: createdItem });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
