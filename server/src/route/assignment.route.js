const express = require('express');
const upload = require('../middlewares/assignment.middleware');

const {
    uploadAssignment,
    getAssignments,
} = require('../controller/assignment.controller');

const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');

router.post('/upload', authMiddleware, upload.single('file'), uploadAssignment);
router.get('/', authMiddleware, getAssignments);

module.exports = router;
