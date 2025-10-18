const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bid = sequelize.define('Bid', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  isWinning: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isAutoBid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  maxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  indexes: [
    { fields: ['itemId'] },
    { fields: ['userId'] },
    { fields: ['createdAt'] }
  ]
});

Bid.associate = (models) => {
  Bid.belongsTo(models.User, {
    as: 'bidder',
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });

  Bid.belongsTo(models.Item, {
    as: 'item',
    foreignKey: 'itemId',
    onDelete: 'CASCADE'
  });
};

module.exports = Bid;
