const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {
  getCourseProgress,
  startLesson,
  completeLesson,
  getAllProgress,
  getContinueLearning,
} = require('../controller/progress.controller');

// All progress routes are protected — student must be authenticated
router.use(authMiddleware);

// GET  /api/progress               → all course progress summaries
router.get('/', getAllProgress);

// GET  /api/progress/:courseId              → single course progress
router.get('/:courseId', getCourseProgress);

// GET  /api/progress/:courseId/continue     → resume learning info
router.get('/:courseId/continue', getContinueLearning);

// POST /api/progress/:courseId/lessons/:lessonId/start    → start a lesson
router.post('/:courseId/lessons/:lessonId/start', startLesson);

// POST /api/progress/:courseId/lessons/:lessonId/complete → complete a lesson
router.post('/:courseId/lessons/:lessonId/complete', completeLesson);

module.exports = router;
