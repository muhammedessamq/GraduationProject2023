const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

router.post('/', registerController.registerUser);

router.post('/uploadImage', registerController.uploadImage);

module.exports = router;