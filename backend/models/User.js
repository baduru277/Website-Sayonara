const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database'); // adjust path to your sequelize instance

const User = sequelize.define('User', {
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
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // 0 = false, 1 = true
  },
  rating: {
    type: DataTypes.REAL,
    allowNull: false,
    defaultValue: 0.0,
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  isPrime: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
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
  tableName: 'Users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = User;
