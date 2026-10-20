const express = require('express');
const { getProfile, updateProfile } = require('../controller/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// ─── Student Profile Routes ──────────────────────────────────────────────
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// Note: Future admin user management routes (getAllUsers, deleteUser) 
// can be seamlessly mounted here or in an admin router when admin is added.

module.exports = router;

