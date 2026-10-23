const express = require('express');

const {
    getAllCourses,
    getCourse,
} = require('../controller/course.controller');

const router = express.Router();

// ─── Public Site & Student Dashboard Course Routes ─────────────────────────
router.get('/getAll', getAllCourses);
router.get('/getOne/:id', getCourse);

module.exports = router;




