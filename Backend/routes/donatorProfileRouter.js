const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../util/config');
const donatorProfileController = require('../controllers/donatorProfileController');

// Route for accessing user-specific data
router.get('/', authenticateToken, donatorProfileController.getDonator);

// Route for changing Donator password
router.put('/password', authenticateToken, donatorProfileController.changePassword);

// Route for adding a phone number to the Donator's phoneNumber array
router.put('/phoneNumber', authenticateToken, donatorProfileController.addPhoneNumber);

// Route for removing an phonenumber from the Donator's phonenumber array
router.delete('/phoneNumber', authenticateToken, donatorProfileController.removePhoneNumber);

// Route for adding an address to the Donator's address array
router.put('/address', authenticateToken, donatorProfileController.addAddress);

// Route for removing an address from the Donator's address array
router.delete('/address', authenticateToken, donatorProfileController.removeAddress);


module.exports = router;