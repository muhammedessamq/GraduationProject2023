const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.post('/', loginController.loginUser);

router.post('/sendActivationMail', loginController.sendActivationMail);

router.post('/resetPassword', loginController.resetPassword);

module.exports = router;