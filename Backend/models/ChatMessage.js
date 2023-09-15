const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    chatInstanceId: {
      type:Number,
      required: true
    },
    senderId: {
      type: String,
      required: true
    },
    recipientId: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: function() {
        return new Date();
    }
    }
  });
  
  const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

  module.exports = ChatMessage;