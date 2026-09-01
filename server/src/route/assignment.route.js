const express = require('express');
const upload = require('../middlewares/assignment.middleware');

const {
    uploadAssignment,
    getAssignments,
} = require('../controller/assignment.controller');

const router = express.Router();

router.post('/upload', upload.single('file'), uploadAssignment);

router.get('/', getAssignments);

module.exports = router;