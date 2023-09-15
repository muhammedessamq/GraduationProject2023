const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationId: {
    type: Number,
    unique: true,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  recipientId: {
    type: String,
    required: true
  },
  senderId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread',
    required: true
  },
  timestamp: {
    type: Date,
    default: function() {
      return new Date();
  },
    required: true
  }
});


const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
