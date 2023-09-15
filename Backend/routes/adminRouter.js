const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../util/config');
const adminController = require('../controllers/adminController');

// Donators routes
router.get('/donators', authenticateToken, adminController.getAllDonators);
router.get('/pendingDonators', authenticateToken, adminController.getPendingDonators);
router.post('/approveDonator/:id', authenticateToken, adminController.approveDonator);
router.post('/rejectDonator/:id', authenticateToken, adminController.rejectDonator);

// NGOs routes
router.get('/ngos', authenticateToken, adminController.getAllNGOs);
router.get('/pendingNgos', authenticateToken, adminController.getPendingNGOs);
router.post('/approveNgo/:id', authenticateToken, adminController.approveNGO);
router.post('/rejectNgo/:id', authenticateToken, adminController.rejectNGO);

// Notifications route
router.get('/notifications', authenticateToken, adminController.getNotifications);
// Read notification 
router.put('/readNotification/:notificationId', adminController.updateNotificationStatus);

module.exports = router;