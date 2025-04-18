const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  transactionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Transaction', 
    required: true 
  },
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'resolved', 'denied'], 
    default: 'pending' 
  },
  resolution: { type: String }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Dispute', disputeSchema);
