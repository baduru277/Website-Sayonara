const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaymentProof = sequelize.define('PaymentProof', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  subscriptionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Subscriptions',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Public URL to access the image'
  },
  imagePath: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'File system path where image is stored'
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'File size in bytes'
  },
  mimeType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'e.g., image/jpeg, image/png'
  },
  uploadedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Optional notes from user about payment'
  }
}, {
  timestamps: true,
  tableName: 'PaymentProofs'
});

PaymentProof.associate = (models) => {
  PaymentProof.belongsTo(models.Subscription, {
    foreignKey: 'subscriptionId',
    as: 'subscription'
  });
  
  PaymentProof.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = PaymentProof;
