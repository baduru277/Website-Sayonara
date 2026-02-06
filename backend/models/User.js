const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  phone: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  location: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  isPrime: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  lastActive: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  otpCode: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  otpExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
});

User.associate = (models) => {
  User.hasMany(models.Item, {
    as: 'items',
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });
  User.hasMany(models.Bid, {
    as: 'bids',
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });
  
  // ✅ ADD THIS - Subscription relationship
  User.hasMany(models.Subscription, {
    as: 'subscriptions',
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });
};

module.exports = User;
