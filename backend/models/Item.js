cat > /root/Website-Sayonara/backend/models/Item.js << 'ENDOFFILE'
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('Item', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false, validate: { len: [3, 200] } },
  description: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  condition: { type: DataTypes.ENUM('New', 'Like New', 'Excellent', 'Very Good', 'Good', 'Fair'), allowNull: false },
  type: { type: DataTypes.ENUM('exchange', 'bidding', 'resell'), allowNull: false },
  priority: { type: DataTypes.ENUM('high', 'medium', 'low'), defaultValue: 'medium' },
  images: {
    type: DataTypes.TEXT, defaultValue: '[]',
    get() { try { const v = this.getDataValue('images'); return typeof v === 'string' ? JSON.parse(v) : v || []; } catch { return []; } },
    set(value) { this.setDataValue('images', JSON.stringify(value || [])); }
  },
  tags: {
    type: DataTypes.TEXT, defaultValue: '[]',
    get() { try { const v = this.getDataValue('tags'); return typeof v === 'string' ? JSON.parse(v) : v || []; } catch { return []; } },
    set(value) { this.setDataValue('tags', JSON.stringify(value || [])); }
  },
  location: { type: DataTypes.STRING, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
  status: { type: DataTypes.ENUM('available', 'sold', 'exchanged', 'pending', 'cancelled'), defaultValue: 'available' },
  views: { type: DataTypes.INTEGER, defaultValue: 0 },
  likes: { type: DataTypes.INTEGER, defaultValue: 0 },
  lookingFor: { type: DataTypes.TEXT, allowNull: true },
  startingBid: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  currentBid: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  buyNowPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  auctionEndDate: { type: DataTypes.DATE, allowNull: true },
  totalBids: { type: DataTypes.INTEGER, defaultValue: 0 },
  winnerId: { type: DataTypes.UUID, allowNull: true },
  minimumNotifyBid: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  originalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  discount: { type: DataTypes.INTEGER, allowNull: true },
  stock: { type: DataTypes.INTEGER, defaultValue: 1 },
  shipping: { type: DataTypes.STRING, allowNull: true },
  isPrime: { type: DataTypes.BOOLEAN, defaultValue: false },
  fastShipping: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  timestamps: true,
  indexes: [
    { fields: ['type'] }, { fields: ['category'] }, { fields: ['priority'] },
    { fields: ['isActive'] }, { fields: ['status'] }, { fields: ['createdAt'] }, { fields: ['userId'] }
  ]
});

Item.associate = (models) => {
  Item.belongsTo(models.User, { as: 'seller', foreignKey: 'userId', onDelete: 'CASCADE' });
  Item.hasMany(models.Bid, { as: 'bids', foreignKey: 'itemId', onDelete: 'CASCADE' });
};

module.exports = Item;
ENDOFFILE
