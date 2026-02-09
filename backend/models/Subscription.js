const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  planName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Basic Plan'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 99.00
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'expired', 'cancelled', 'rejected'),
    allowNull: false,
    defaultValue: 'pending'  // ✅ Changed from 'active' to 'pending'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'offline'
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentProof: {
    type: DataTypes.TEXT,  // Store image URL or path
    allowNull: true
  },
  agentName: {
    type: DataTypes.STRING,
    allowNull: true  // ✅ Agent who approved/processed
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rejectedReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true  // Set when approved
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true  // Set when approved
  }
}, {
  timestamps: true,
  tableName: 'Subscriptions'
});

Subscription.associate = (models) => {
  Subscription.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = Subscription;

