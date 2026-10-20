const express = require('express');
const upload = require('../middlewares/assignment.middleware');

const {
    uploadAssignment,
    getAssignments,
} = require('../controller/assignment.controller');

const router = express.Router();

const jwt = require('jsonwebtoken');
const { accessTokenSecret } = require('../config/secrets');
const User = require('../model/user.model');

const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, accessTokenSecret);
            const user = await User.findById(decoded.userId);
            if (user) req.user = user;
        }
    } catch (_) {}
    next();
};

router.post('/upload', optionalAuth, upload.single('file'), uploadAssignment);
router.get('/', optionalAuth, getAssignments);

module.exports = router;