const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../util/config');
const ngoHomeController = require('../controllers/ngoHomeController');

// GET route to retrieve available donations
router.get('/', authenticateToken , ngoHomeController.getDonations);

// POST route to create a request for a donation
router.post('/request/:id',authenticateToken , ngoHomeController.createRequest);

// POST route to send a chat message in a specific chat instance
router.post('/chat/:chatInstanceId/message',authenticateToken , ngoHomeController.sendChatMessage);

// GET route to get all chat instances of specific NGO
router.get('/chatinstances',authenticateToken , ngoHomeController.getChatInstances);

// GET route to retrieve chat messages from a specific chat instance
router.get('/chat/:chatInstanceId/messages',authenticateToken , ngoHomeController.getChatMessages);

// GET route to retrieve requests made by the NGO
router.get('/myrequests', authenticateToken ,ngoHomeController.getMyRequests);

// Route for retrieving notifications of the Donator which deliver donation
router.get('/notifications',authenticateToken, ngoHomeController.getNotifications);

// Route for updating notification status
router.put('/readNotification/:notificationId', authenticateToken ,ngoHomeController.updateNotificationStatus);

module.exports = router;
