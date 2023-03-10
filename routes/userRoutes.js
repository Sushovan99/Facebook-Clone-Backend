const express = require('express');
const authController = require('../controllers/authcontroller');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/verifiyEmail', authController.verifyEmail);
router.post('/login', authController.login);

module.exports = router;
