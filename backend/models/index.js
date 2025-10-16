const User = require('./User');
const Item = require('./Item');
const Bid = require('./Bid');

// --- Associations ---

// User ↔ Item
User.hasMany(Item, { foreignKey: 'userId', as: 'items' });
Item.belongsTo(User, { foreignKey: 'userId', as: 'seller' }); // ✅ alias is now 'seller'

// User ↔ Bid
User.hasMany(Bid, { foreignKey: 'userId', as: 'bids' });
Bid.belongsTo(User, { foreignKey: 'userId', as: 'bidder' }); // ✅ alias is 'bidder'

// Item ↔ Bid
Item.hasMany(Bid, { foreignKey: 'itemId', as: 'bids' });
Bid.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });

module.exports = { User, Item, Bid };
