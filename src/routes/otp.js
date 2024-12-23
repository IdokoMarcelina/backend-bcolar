
const express = require('express');
const { verifyOtp, resendOtp } = require('../controllers/otpController');

const router = express.Router();

router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

module.exports = router;

