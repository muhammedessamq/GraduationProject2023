const mongoose = require('mongoose');

const donatorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim:true
  },
  phoneNumber: [{
    type: String
  }],
  address: [{
    type: String
  }],
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  taxNumber: {
    type: String,
    required: true
  },
  taxIdImage: {
    type: String
  },
  userType: {
    type: String,
    required: true,
    enum: ["Donator"]
  },
  donatorId: {
    type: Number,
    unique: true,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "Approved","Rejected"]
  },
  resetPasswordToken : {
    type: String
  },
  resetPasswordExpires : {
    type: Date
  },


});

const Donator = mongoose.model('Donators', donatorSchema);


module.exports = Donator;
