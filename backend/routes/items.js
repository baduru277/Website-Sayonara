const express = require('express');
const { createNotification } = require('./notifications');
const { Op, fn, col } = require('sequelize');
const { Item, User, Bid } = require('../models');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();
const FREE_LIMIT = 3;

// ── Haversine distance in km ──
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// -------------------- Get Nearby Items --------------------
router.get('/nearby', optionalAuth, async (req, res) => {
  try {
    const { lat, lng, radius = 50, type, limit = 20 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const radiusKm = parseFloat(radius);

    // Bounding box for fast pre-filter
    const latDelta = radiusKm / 111;
    const lngDelta = radiusKm / (111 * Math.cos(userLat * Math.PI / 180));

    const where = {
      isActive: true,
      status: 'available',
      lat: { [Op.between]: [userLat - latDelta, userLat + latDelta] },
      lng: { [Op.between]: [userLng - lngDelta, userLng + lngDelta] },
    };

    if (type) where.type = type;

    const items = await Item.findAll({
      where,
      attributes: { exclude: ['minimumNotifyBid'] },
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'rating', 'totalReviews', 'isVerified', 'isPrime', 'avatar']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit) * 3 // fetch more for haversine filtering
    });

    // Precise haversine filter + add distance
    const nearby = items
      .map(item => {
        const itemData = item.toJSON();
        const dist = (item.lat && item.lng)
          ? haversine(userLat, userLng, item.lat, item.lng)
          : null;
        return { ...itemData, distanceKm: dist ? Math.round(dist * 10) / 10 : null };
      })
      .filter(item => item.distanceKm !== null && item.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, parseInt(limit));

    res.json({ items: nearby, total: nearby.length, radius: radiusKm });
  } catch (error) {
    console.error('Nearby items error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// -------------------- Get All Items --------------------
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      type, category, priority, condition, search,
      sortBy = 'createdAt', order = 'DESC',
      page = 1, limit = 20, tags, status,
      lat, lng, radius
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = { isActive: true };

    if (type) where.type = type;
    if (category && category !== 'All') where.category = category;
    if (priority && priority !== 'All') where.priority = priority;
    if (condition && condition !== 'All') where.condition = condition;
    if (status && status !== 'All') where.status = status;

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { lookingFor: { [Op.like]: `%${search}%` } }
      ];
    }

    if (tags) where.tags = { [Op.like]: `%${tags}%` };

    // Optional bounding box filter
    if (lat && lng && radius) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const radiusKm = parseFloat(radius);
      const latDelta = radiusKm / 111;
      const lngDelta = radiusKm / (111 * Math.cos(userLat * Math.PI / 180));
      where.lat = { [Op.between]: [userLat - latDelta, userLat + latDelta] };
      where.lng = { [Op.between]: [userLng - lngDelta, userLng + lngDelta] };
    }

    const validSortFields = ['createdAt', 'price', 'views', 'likes', 'currentBid', 'startingBid'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const items = await Item.findAndCountAll({
      where,
      attributes: { exclude: ['minimumNotifyBid'] },
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'rating', 'totalReviews', 'isVerified', 'isPrime', 'avatar']
      }],
      order: [[sortField, sortOrder]],
      limit: parseInt(limit) || 20,
      offset: parseInt(offset) || 0
    });

    // Add distance if user coords provided
    let rows = items.rows;
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      rows = rows.map(item => {
        const itemData = item.toJSON();
        if (item.lat && item.lng) {
          itemData.distanceKm = Math.round(haversine(userLat, userLng, item.lat, item.lng) * 10) / 10;
        }
        return itemData;
      });
    }

    res.json({
      items: rows,
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
router.get('/featured/items', async (req, res) => {
  try {
    const items = await Item.findAll({
      where: { isFeatured: true, isActive: true },
      attributes: { exclude: ['minimumNotifyBid'] },
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'rating', 'totalReviews', 'isVerified', 'isPrime', 'avatar'] }],
      order: [['createdAt', 'DESC']],
      limit: 12
    });
    res.json({ items });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- Get Categories --------------------
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Item.findAll({
      attributes: ['category', [fn('COUNT', col('id')), 'count']],
      where: { isActive: true },
      group: ['category'],
      order: [[fn('COUNT', col('id')), 'DESC']]
    });
    res.json({ categories });
  } catch (error) {
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
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- Get Post Count --------------------
router.get('/my/post-count', auth, async (req, res) => {
  try {
    const totalEverPosted = await Item.count({ where: { userId: req.user.id } });
    let isSubscribed = false;
    try {
      const { Subscription } = require('../models');
      if (Subscription) {
        const sub = await Subscription.findOne({ where: { userId: req.user.id, status: 'active' } });
        if (sub?.expiryDate && new Date(sub.expiryDate) > new Date()) isSubscribed = true;
      }
    } catch {}
    res.json({
      totalEverPosted, limit: FREE_LIMIT,
      remaining: isSubscribed ? 999 : Math.max(0, FREE_LIMIT - totalEverPosted),
      isSubscribed,
      limitReached: !isSubscribed && totalEverPosted >= FREE_LIMIT
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- Get Single Item --------------------
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'rating', 'totalReviews', 'isVerified', 'isPrime', 'location', 'avatar'] }]
    });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    await item.increment('views');
    const itemData = item.toJSON();
    if (!req.user || req.user.id !== item.userId) delete itemData.minimumNotifyBid;
    let bids = [];
    if (item.type === 'bidding') {
      bids = await Bid.findAll({
        where: { itemId: item.id },
        include: [{ model: User, as: 'bidder', attributes: ['id', 'name', 'avatar'] }],
        order: [['amount', 'DESC']],
        limit: 10
      });
    }
    res.json({ item: itemData, bids });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- Create Item --------------------
router.post('/', auth, async (req, res) => {
  try {
    const {
      title, description, category, condition, type,
      price, originalPrice, discount, stock,
      startingBid, buyNowPrice, auctionEndDate, minimumNotifyBid,
      lookingFor, images = [], tags = [],
      location, lat, lng, shipping, priority,
      warrantyStatus, damageInfo, usageHistory, originalBox, fastShipping
    } = req.body;

    if (!title || !description) return res.status(400).json({ error: 'Title and description are required' });
    if (!type) return res.status(400).json({ error: 'Type is required' });
    if (!category) return res.status(400).json({ error: 'Category is required' });
    if (!condition) return res.status(400).json({ error: 'Condition is required' });
    if (!location) return res.status(400).json({ error: 'Location is required' });
    if (type === 'resell' && !price) return res.status(400).json({ error: 'Resell items require a price' });
    if (type === 'bidding' && !startingBid) return res.status(400).json({ error: 'Bidding items require a starting bid' });
    if (type === 'exchange' && !lookingFor) return res.status(400).json({ error: 'Exchange items require what you are looking for' });
    if (type === 'bidding' && minimumNotifyBid && parseFloat(minimumNotifyBid) <= parseFloat(startingBid)) {
      return res.status(400).json({ error: 'Minimum notify bid must be higher than starting bid' });
    }

    const user = await User.findByPk(req.user.id);
    let isSubscribed = false;
    try {
      if (user?.subscriptionStatus === 'active' && user?.subscriptionExpiry) {
        isSubscribed = new Date(user.subscriptionExpiry) > new Date();
      }
      if (!isSubscribed) {
        const { Subscription } = require('../models');
        if (Subscription) {
          const sub = await Subscription.findOne({ where: { userId: req.user.id, status: 'active' } });
          if (sub?.expiryDate && new Date(sub.expiryDate) > new Date()) isSubscribed = true;
        }
      }
    } catch {}

    if (!isSubscribed) {
      const totalEverPosted = await Item.count({ where: { userId: req.user.id } });
      if (totalEverPosted >= FREE_LIMIT) {
        return res.status(403).json({ error: `Free plan limit reached. Upgrade to Rs.99/year.`, limitReached: true });
      }
    }

    // Use seller's lat/lng if item lat/lng not provided
    const itemLat = lat || user?.lat || null;
    const itemLng = lng || user?.lng || null;

    const item = await Item.create({
      title, description, category, condition, type,
      priority: priority || 'medium',
      images: Array.isArray(images) ? images : [],
      tags: Array.isArray(tags) ? tags : [],
      location, lat: itemLat, lng: itemLng,
      userId: req.user.id,
      isActive: true, status: 'available', views: 0, likes: 0,
      price: price || null, originalPrice: originalPrice || null,
      discount: discount || null, stock: stock || 1,
      shipping: shipping || null, fastShipping: fastShipping || false,
      startingBid: startingBid || null, currentBid: startingBid || null,
      buyNowPrice: buyNowPrice || null, auctionEndDate: auctionEndDate || null,
      totalBids: 0, minimumNotifyBid: minimumNotifyBid || null,
      lookingFor: lookingFor || null,
      warrantyStatus: warrantyStatus || null, damageInfo: damageInfo || null,
      usageHistory: usageHistory || null, originalBox: originalBox || false,
    });

    const createdItem = await Item.findByPk(item.id, {
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'rating', 'totalReviews', 'isVerified', 'isPrime', 'avatar'] }]
    });

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
    const { userId, views, totalBids, currentBid, likes, ...updateData } = req.body;
    await item.update(updateData);
    const updatedItem = await Item.findByPk(item.id, {
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'rating', 'totalReviews', 'isVerified', 'isPrime', 'avatar'] }]
    });
    res.json({ message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// -------------------- Delete Item --------------------
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.userId !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
    await item.update({ isActive: false, status: 'cancelled' });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
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
    if (item.auctionEndDate && new Date() > new Date(item.auctionEndDate)) return res.status(400).json({ error: 'Auction has ended' });
    if (parseFloat(amount) <= parseFloat(item.currentBid || item.startingBid)) {
      return res.status(400).json({ error: `Bid must be higher than current bid of Rs.${item.currentBid || item.startingBid}` });
    }

    await Bid.update({ isWinning: false, status: 'lost' }, { where: { itemId: item.id, isWinning: true } });

    const bid = await Bid.create({
      amount: parseFloat(amount), userId: req.user.id, itemId: item.id,
      isWinning: true, status: 'active', message: message || null
    });

    await item.update({ currentBid: parseFloat(amount), totalBids: item.totalBids + 1 });

    try {
      const bidder = await User.findByPk(req.user.id, { attributes: ['name'] });
      const minNotify = parseFloat(item.minimumNotifyBid || 0);
      const bidAmount = parseFloat(amount);
      if (!minNotify || bidAmount >= minNotify) {
        await createNotification({
          userId: item.userId, type: 'bid',
          title: 'New Bid on Your Item!',
          message: `${bidder?.name || 'Someone'} placed a bid of Rs.${amount} on "${item.title}"`,
          link: `/bidding/${item.id}`,
          fromUserName: bidder?.name || 'A bidder'
        });
      }
    } catch {}

    res.json({ message: 'Bid placed successfully', currentBid: amount, totalBids: item.totalBids + 1, bid });
  } catch (error) {
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
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
