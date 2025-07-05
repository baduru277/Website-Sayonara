const User = require('./User');
const Item = require('./Item');
const Bid = require('./Bid');

// Define associations
User.hasMany(Item, { as: 'items', foreignKey: 'userId' });
Item.belongsTo(User, { as: 'seller', foreignKey: 'userId' });

User.hasMany(Bid, { as: 'bids', foreignKey: 'userId' });
Bid.belongsTo(User, { as: 'bidder', foreignKey: 'userId' });

Item.hasMany(Bid, { as: 'bids', foreignKey: 'itemId' });
Bid.belongsTo(Item, { as: 'item', foreignKey: 'itemId' });

module.exports = {
  User,
  Item,
  Bid
}; 