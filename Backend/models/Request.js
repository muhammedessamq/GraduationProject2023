const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    donatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donator',
        required: true
    },
    donatorName: {
        type: String,
        required: true
    },
    donationId: {
        type: Number,
        required: true
    },
    donationName: {
        type: String,
        required: true
    },
    deliveryStatus: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    donationItems: [
        {
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }       ],
    donationStatus: {
        type: String,
        required: true
    },
    requestDate: {
        type: Date,
        default: function() {
            return new Date();
        },
        required: true
    },
    requestId: {
        type: Number,
        unique: true,
        required: true
    },
    ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NGO',
        required: true
    }
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
