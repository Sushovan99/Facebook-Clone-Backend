const express = require('express');
const authController = require('../controllers/authcontroller');

const router = express.Router();

router.post('/signup', authController.signup);
router.get('/verifiyEmail', authController.verifyEmail);

module.exports = router;
