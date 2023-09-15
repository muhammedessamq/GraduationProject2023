const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../util/config');
const ngoProfileController = require('../controllers/ngoProfileController');

// Route for accessing NGO-specific data
router.get('/', authenticateToken, ngoProfileController.getNGO);

// Route for changing NGO password
router.put('/password', authenticateToken, ngoProfileController.changePassword);

// Route for adding a phone number to the NGO's phoneNumber array
router.put('/phoneNumber', authenticateToken, ngoProfileController.addPhoneNumber);

// Route for removing an phonenumber from the Donator's phonenumber array
router.delete('/phoneNumber', authenticateToken, ngoProfileController.removePhoneNumber);

// Route for adding an address to the NGO's address array
router.put('/address', authenticateToken, ngoProfileController.addAddress);

// Route for removing an address from the Donator's address array
router.delete('/address', authenticateToken, ngoProfileController.removeAddress);

module.exports = router;