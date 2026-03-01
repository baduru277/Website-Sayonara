const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Import and initialize all models
const User = require('./User')(sequelize, DataTypes);
const Item = require('./Item')(sequelize, DataTypes);
const Bid = require('./Bid')(sequelize, DataTypes);
const Subscription = require('./Subscription')(sequelize, DataTypes);
const PaymentProof = require('./PaymentProof')(sequelize, DataTypes);
const Message = require('./messages')(sequelize, DataTypes);

// Export all models
const models = { User, Item, Bid, Subscription, PaymentProof, Message, sequelize };

// Call associate functions to set up all relationships
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;
