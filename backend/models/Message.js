const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // Conversation is identified by senderId + receiverId + itemId
  senderId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  itemId: {
    type: DataTypes.UUID,
    allowNull: true // optional - links message to a specific item
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  messageType: {
    type: DataTypes.ENUM('text', 'image', 'item_share'),
    defaultValue: 'text'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // For item_share type - stores item snapshot
  itemSnapshot: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('itemSnapshot');
      try {
        return value ? JSON.parse(value) : null;
      } catch {
        return null;
      }
    },
    set(value) {
      this.setDataValue('itemSnapshot', value ? JSON.stringify(value) : null);
    }
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['senderId'] },
    { fields: ['receiverId'] },
    { fields: ['itemId'] },
    { fields: ['createdAt'] }
  ]
});

Message.associate = (models) => {
  Message.belongsTo(models.User, {
    as: 'sender',
    foreignKey: 'senderId'
  });
  Message.belongsTo(models.User, {
    as: 'receiver',
    foreignKey: 'receiverId'
  });
  Message.belongsTo(models.Item, {
    as: 'item',
    foreignKey: 'itemId'
  });
};

module.exports = Message;
