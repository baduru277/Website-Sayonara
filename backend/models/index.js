const sequelize = require('../config/database');

// Import models directly
const User = require('./User');
const Item = require('./Item');
const Bid = require('./Bid');
const Subscription = require('./Subscription');
const PaymentProof = require('./PaymentProof');
const Message = require('./messages');

// Export all models
const models = { User, Item, Bid, Subscription, PaymentProof, Message, sequelize };

// Call associate functions to set up all relationships
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;
