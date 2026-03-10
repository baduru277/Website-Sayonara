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
  isAdmin: {
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

  // ✅ REFERRAL FIELDS
  referralCode: {
    type: DataTypes.TEXT,
    allowNull: true,
    unique: true,
  },
  referredBy: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  premiumUntil: {
    type: DataTypes.DATE,
    allowNull: true,
  },

//   // ✅ AADHAAR VERIFICATION FIELDS
//   aadhaarVerified: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: false,
//   },
//   aadhaarName: {
//     type: DataTypes.TEXT,
//     allowNull: true,   // name as per Aadhaar
//   },
//   aadhaarRef: {
//     type: DataTypes.TEXT,
//     allowNull: true,   // Surepass reference ID (never store actual Aadhaar number)
//   },
//   aadhaarVerifiedAt: {
//     type: DataTypes.DATE,
//     allowNull: true,
//   },

// }, {
//   timestamps: true,
// });

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
  User.hasMany(models.Subscription, {
    as: 'subscriptions',
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });
  User.hasMany(models.PaymentProof, {
    as: 'paymentProofs',
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });
  // ✅ Referral association
  User.hasMany(models.Referral, {
    as: 'referrals',
    foreignKey: 'referrerId',
    onDelete: 'CASCADE'
  });
};

module.exports = User;
