const express = require('express');
const { getProfile, updateProfile } = require('../controller/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// ─── Student Profile Routes ──────────────────────────────────────────────
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;

