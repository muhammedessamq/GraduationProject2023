const mongoose = require('mongoose');

const chatInstanceSchema = new mongoose.Schema({
  chatInstanceId: {
    type: Number,
    unique: true,
    required: true
  },
  donatorId: {
    type: String,
    required: true
  },
  ngoId: {
    type: String,
    required: true
  },
  donationId: {
    type: String,
    required: true
  },
  donationName: {
    type: String,
    required: true
  },
  donatorName: {
    type: String,
    required: true
  },
  ngoName: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
});

const ChatInstance = mongoose.model('ChatInstance', chatInstanceSchema);

module.exports = ChatInstance;
