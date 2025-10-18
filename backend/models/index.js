const User = require('./User');
const Item = require('./Item');
const Bid = require('./Bid');

// Call associate functions to set up relationships
const models = { User, Item, Bid };

Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;
