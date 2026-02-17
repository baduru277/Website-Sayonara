const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  condition: {
    type: DataTypes.ENUM('New', 'Like New', 'Excellent', 'Very Good', 'Good', 'Fair'),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('exchange', 'bidding', 'resell'),
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('high', 'medium', 'low'),
    defaultValue: 'medium'
  },

  // -------------------- Images --------------------
  images: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('images');
      try {
        return typeof value === 'string' ? JSON.parse(value) : value || [];
      } catch {
        return [];
      }
    },
    set(value) {
      this.setDataValue('images', JSON.stringify(value || []));
    }
  },

  // -------------------- Tags --------------------
  tags: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('tags');
      try {
        return typeof value === 'string' ? JSON.parse(value) : value || [];
      } catch {
        return [];
      }
    },
    set(value) {
      this.setDataValue('tags', JSON.stringify(value || []));
    }
  },

  // -------------------- Location & Status --------------------
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  // ✅ NEW: Item sold/completed status
  status: {
    type: DataTypes.ENUM('available', 'sold', 'exchanged', 'pending', 'cancelled'),
    defaultValue: 'available'
  },

  // -------------------- Stats --------------------
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  // ✅ NEW: Likes count
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  // -------------------- Exchange Fields --------------------
  lookingFor: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  // -------------------- Bidding Fields --------------------
  startingBid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  currentBid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  buyNowPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  auctionEndDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  totalBids: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  // ✅ NEW: Auction winner
  winnerId: {
    type: DataTypes.UUID,
    allowNull: true
  },

  // -------------------- Resell Fields --------------------
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  originalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  shipping: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // -------------------- Flags --------------------
  isPrime: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  fastShipping: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }

}, {
  timestamps: true,
  indexes: [
    { fields: ['type'] },
    { fields: ['category'] },
    { fields: ['priority'] },
    { fields: ['isActive'] },
    { fields: ['status'] },
    { fields: ['createdAt'] },
    { fields: ['userId'] }
  ]
});

Item.associate = (models) => {
  Item.belongsTo(models.User, {
    as: 'seller',
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });

  Item.hasMany(models.Bid, {
    as: 'bids',
    foreignKey: 'itemId',
    onDelete: 'CASCADE'
  });
};

module.exports = Item;
