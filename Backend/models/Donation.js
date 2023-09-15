const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donator',
        required: true
    }
    ,donatorName: {
        type: String,
        required: true
    },
    donationId: {
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    deliveryStatus: {
        type: String,
        enum: ["Available", "Not Available"],
        required: true
    },
    description: {
        type: String
    },
    items: [
        {
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
            ],
    tags: [{
        type: String,
        required: true
    }],
    donationStatus: {
        type: String,
        enum: ["Available", "Requested" , "Delivered", "Removed"],
        required: true
    },
    donationDate: {
        type: Date,
        default: function() {
            return new Date();
        }
    }
});

const Donation = mongoose.model('Donation', donationSchema);




module.exports = Donation;
