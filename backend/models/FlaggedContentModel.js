const mongoose = require("mongoose");

// Define the FlaggedContent schema
const flaggedContentSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Please provide the product ID"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide the user ID who flagged the content"],
  },
  flagReason: {
    type: String,
    required: [true, "Please provide a reason for flagging the content"],
  },
  status: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending",
  },
  moderator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  resolution: {
    type: String,
  },
}, { timestamps: true });


module.exports = mongoose.model("FlaggedContent", flaggedContentSchema);
