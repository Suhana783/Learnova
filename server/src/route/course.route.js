const express = require ('express');
const roleBasedAccess = require('../middlewares/role.middleware.js');

const {

    createCourse,
    updateCourse,
    getAllCourses,
    getCourse,
    deleteCourse
} = require('../controller/course.controller');
const authMiddleware = require('../middlewares/auth.middleware.js');

const router = express.Router()

router.post('/create', authMiddleware,roleBasedAccess('admin'),createCourse);
router.put ('/update/:id', authMiddleware,roleBasedAccess('admin'),updateCourse);
router.get('/getAll',authMiddleware,roleBasedAccess('admin', 'user'),  getAllCourses);
router.get('/getOne/:id', authMiddleware,roleBasedAccess('admin', 'user'),getCourse);
router.delete('/delete/:id', authMiddleware,roleBasedAccess('admin'),deleteCourse);

module.exports = router;


