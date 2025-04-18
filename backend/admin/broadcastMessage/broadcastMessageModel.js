// models/broadcastMessageModel.js

const mongoose = require('mongoose');

const broadcastMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BroadcastMessage', broadcastMessageSchema);
