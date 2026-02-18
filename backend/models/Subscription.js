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
    defaultValue: 'pending'
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
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Image URL or path to payment proof'
  },
  agentName: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Admin/agent who approved or rejected'
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When subscription was approved/rejected'
  },
  rejectedReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Reason for rejection'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Subscription start date (set when approved)'
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Subscription expiry date (set when approved)'
  }
}, {
  timestamps: true,
  tableName: 'Subscriptions',
  indexes: [
    { fields: ['userId'] },
    { fields: ['status'] },
    { fields: ['expiryDate'] }
  ]
});

Subscription.associate = (models) => {
  Subscription.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });

  // ✅ NEW: Payment proof association
  Subscription.hasMany(models.PaymentProof, {
    foreignKey: 'subscriptionId',
    as: 'paymentProofs'
  });
};

module.exports = Subscription;
