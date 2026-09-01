const express = require('express');

const {
    registerUser,
    verifyOTP,
    loginUser,
    refreshToken,
} = require('../controller/auth.controller');

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);

module.exports = router;