const sequelize = require('../config/database');
const User = require('./User');
const Item = require('./Item');
const Bid = require('./Bid');
const Subscription = require('./Subscription'); // ✅ ADD THIS LINE

// Define associations
const models = { User, Item, Bid, Subscription, sequelize }; // ✅ ADD Subscription HERE

// Call associate functions to set up relationships
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;
