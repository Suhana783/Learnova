const express = require('express');

const {
    createCourse,
    updateCourse,
    patchCourse,
    getAllCourses,
    getCourse,
    deleteCourse,
} = require('../controller/course.controller');

const router = express.Router();

// ─── Course Creation Routes (POST from Postman to Database) ──────────────────
router.post('/create', createCourse);
router.post('/', createCourse);

// ─── Course Update Routes (PUT for whole update, PATCH for partial update) ──
// A course is looked up using :id and then updated
router.put('/update/:id', updateCourse);
router.put('/:id', updateCourse);

router.patch('/update/:id', patchCourse);
router.patch('/:id', patchCourse);

// ─── Public Site & Student Dashboard Course Routes ─────────────────────────
router.get('/getAll', getAllCourses);
router.get('/getOne/:id', getCourse);

// ─── Course Deletion Routes ─────────────────────────────────────────────────
router.delete('/delete/:id', deleteCourse);
router.delete('/:id', deleteCourse);

module.exports = router;




