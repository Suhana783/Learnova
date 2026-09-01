const express = require('express');

const authMiddleware = require('../middlewares/auth.middleware');
const {
    userEnrolled,
    getAllEnrollments

} = require('../controller/enroll.controller')

const router = express.Router()

router.post('/enroll/:courseId', authMiddleware, userEnrolled)
router.get('/my-enrollments', authMiddleware, getAllEnrollments)

module.exports = router