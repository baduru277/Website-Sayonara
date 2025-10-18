const sequelize = require('../config/database');
const User = require('./User');
const Item = require('./Item');
const Bid = require('./Bid');

// Define associations
const models = { User, Item, Bid, sequelize };

// Call associate functions to set up relationships
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;
