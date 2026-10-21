const {
  getCourseProgressService,
  startLessonService,
  completeLessonService,
  getAllProgressService,
  getContinueLearningService,
} = require('../services/progress.service');

/**
 * GET /api/progress/:courseId
 * Returns the authenticated student's progress for a specific course.
 */
exports.getCourseProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;

    const result = await getCourseProgressService(userId, courseId);

    res.status(200).json({
      success: true,
      message: 'Course progress retrieved',
      data: {
        progress: result.progress,
        summary: result.summary,
        course: {
          _id: result.course._id,
          title: result.course.title,
          slug: result.course.slug,
          thumbnail: result.course.thumbnail,
          curriculum: result.course.curriculum,
        },
      },
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

/**
 * POST /api/progress/:courseId/lessons/:lessonId/start
 * Records that the student started a lesson.
 * Body must include: moduleId
 */
exports.startLesson = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { courseId, lessonId } = req.params;
    const { moduleId } = req.body;

    if (!moduleId) {
      const err = new Error('moduleId is required in the request body');
      err.statusCode = 400;
      return next(err);
    }

    const progress = await startLessonService(userId, courseId, moduleId, lessonId);

    res.status(200).json({
      success: true,
      message: 'Lesson started',
      data: progress,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

/**
 * POST /api/progress/:courseId/lessons/:lessonId/complete
 * Marks a lesson as completed and recalculates course progress.
 * Body must include: moduleId
 */
exports.completeLesson = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { courseId, lessonId } = req.params;
    const { moduleId } = req.body;

    if (!moduleId) {
      const err = new Error('moduleId is required in the request body');
      err.statusCode = 400;
      return next(err);
    }

    const result = await completeLessonService(userId, courseId, moduleId, lessonId);

    res.status(200).json({
      success: true,
      message: 'Lesson marked as completed',
      data: {
        percentComplete: result.summary.percentComplete,
        isCourseCompleted: result.summary.isCourseCompleted,
        completedLessons: result.summary.completedLessons,
        totalLessons: result.summary.totalLessons,
        progress: result.progress,
      },
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

/**
 * GET /api/progress
 * Returns all course progress summaries for the authenticated student.
 */
exports.getAllProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const summaries = await getAllProgressService(userId);

    res.status(200).json({
      success: true,
      message: 'All course progress retrieved',
      data: summaries,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

/**
 * GET /api/progress/:courseId/continue
 * Returns the current/next lesson to resume for the authenticated student.
 */
exports.getContinueLearning = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;

    const resumeData = await getContinueLearningService(userId, courseId);

    res.status(200).json({
      success: true,
      message: 'Continue learning data retrieved',
      data: resumeData,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};
