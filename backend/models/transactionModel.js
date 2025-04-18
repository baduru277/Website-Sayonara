const mongoose = require('mongoose');
const crypto = require('crypto');
const { encryptData, decryptData } = require('../utils/encryptionUtils'); 

// Define the Transaction schema
const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true, 
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', 
    required: true, 
  },
  transactionType: {
    type: String,
    enum: ['barter', 'bid', 'buy', 'resell'], 
    required: true,
  },
  amount: {
    type: String, 
    required: true,
  },
  amountIv: {
    type: String, 
    required: true,
  },
  description: {
    type: String,
    required: false, 
  },
  descriptionIv: {
    type: String, 
    required: false,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'failed'], 
    default: 'pending', 
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
  updatedAt: {
    type: Date,
    default: Date.now, 
  },
});


transactionSchema.pre('save', function (next) {
  if (this.isModified('amount')) {
    const { encryptedData, iv } = encryptData(this.amount);
    this.amount = encryptedData;
    this.amountIv = iv;
  }

  if (this.isModified('description') && this.description) {
    const { encryptedData, iv } = encryptData(this.description);
    this.description = encryptedData;
    this.descriptionIv = iv;
  }

  next();
});

transactionSchema.methods.getDecryptedAmount = function () {
  return decryptData(this.amount, this.amountIv);
};

transactionSchema.methods.getDecryptedDescription = function () {
  return decryptData(this.description, this.descriptionIv);
};

const Transaction = mongoose.model('Transaction', transactionSchema);


module.exports = Transaction;
