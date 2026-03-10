const sequelize = require('../config/database');

const User        = require('./User');
const Item        = require('./Item');
const Bid         = require('./Bid');
const Subscription= require('./Subscription');
const PaymentProof= require('./PaymentProof');
const Message     = require('./messages');

// ✅ Referral — initialized with sequelize instance
const ReferralModel = require('./Referral');
const Referral = ReferralModel(sequelize);

const models = { User, Item, Bid, Subscription, PaymentProof, Message, Referral, sequelize };

Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;
