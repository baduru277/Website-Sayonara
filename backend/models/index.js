const sequelize = require('../config/database');
const User = require('./User');
const Item = require('./Item');
const Bid = require('./Bid');
const Subscription = require('./Subscription');
const PaymentProof = require('./PaymentProof'); // ✅ ADD THIS
const messagesRouter = require('./messages');


// Define all models
const models = { User, Item, Bid, Subscription, PaymentProof, sequelize,messages }; // ✅ ADD PaymentProof

// Call associate functions to set up all relationships
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;
