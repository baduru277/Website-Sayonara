const User = require('./User');
const Item = require('./Item');
const Bid = require('./Bid');

// Define associations
User.hasMany(Item, { foreignKey: 'userId', as: 'items' });
Item.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Bid, { foreignKey: 'userId', as: 'bids' });
Bid.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Item.hasMany(Bid, { foreignKey: 'itemId', as: 'bids' });
Bid.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });

module.exports = {
  User,
  Item,
  Bid
}; 