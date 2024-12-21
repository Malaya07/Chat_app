const mongoose = require('mongoose');

const msgSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  sendername: {
    type: String,
    required: true
  },
  ChatRoomname: {
    type: String,
    required: true,
  },
  createdAt:{
    type: String,
    default: Date.now
  },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", msgSchema);

module.exports = Message;  // Make sure you're exporting the model
