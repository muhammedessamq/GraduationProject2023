const express = require('express');
const router = express.Router();
const donatorHomeController = require('../controllers/donatorHomeController');
const { authenticateToken } = require('../util/config');

// Route for accessing user-specific data
router.get('/', authenticateToken, donatorHomeController.getDonations);

// Route for adding a new donation
router.post('/createdonation', authenticateToken, donatorHomeController.createDonation);

// Route for updating the donation status to "Removed"
router.put('/removedonation/:donationId', authenticateToken, donatorHomeController.removeDonation);

// Route for updating the donation status to "Delivered"
router.put('/deliverdonation/:donationId', authenticateToken, donatorHomeController.deliverDonation);

// Route for retrieving donations with status "Removed" or "Delivered"
router.get('/history', authenticateToken, donatorHomeController.getDonationHistory);

// Route for adding a new chat message to a chat instance
router.post('/chat/:chatInstanceId/message', authenticateToken, donatorHomeController.sendChatMessage);

// GET route to get all chat instances of specific Donator
router.get('/chatinstances',authenticateToken , donatorHomeController.getChatInstances);

// Route for retrieving chat messages for a chat instance
router.get('/chat/:chatInstanceId/messages', authenticateToken, donatorHomeController.getChatMessages);

// Route for retrieving notifications of the NGO which requested donator's donation
router.get('/notifications',authenticateToken, donatorHomeController.getNotifications);

// Route for updating notification status
router.put('/readNotification/:notificationId',authenticateToken , donatorHomeController.updateNotificationStatus);

module.exports = router;
