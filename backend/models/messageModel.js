const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  activityLogs: [
    {
      activity: String, 
      date: { type: Date, default: Date.now }, 
    },
  ],
});


messageSchema.methods.addActivityLog = function (activityDescription) {
  this.activityLogs.push({
    activity: activityDescription,
    date: Date.now(),
  });
  return this.save(); 
};

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
