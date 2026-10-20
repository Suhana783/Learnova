const mongoose = require('mongoose');
const Course = require('../model/course.model');
const CourseProgress = require('../model/courseProgress.model');

/**
 * Resolve a course by MongoDB ObjectId.
 * Throws 404 if not found.
 */
const resolveCourseById = async (courseId) => {
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    const err = new Error('Invalid course ID format');
    err.statusCode = 400;
    throw err;
  }
  const course = await Course.findById(courseId);
  if (!course) {
    const err = new Error('Course not found');
    err.statusCode = 404;
    throw err;
  }
  return course;
};

/**
 * Resolve a specific module and lesson inside a course.
 * Returns { module, lesson } or throws 404.
 */
const resolveLessonInCourse = (course, moduleId, lessonId) => {
  const mod = course.curriculum.modules.find(
    (m) => m._id.toString() === moduleId.toString()
  );
  if (!mod) {
    const err = new Error('Module not found in this course');
    err.statusCode = 404;
    throw err;
  }
  const lesson = mod.lessons.find(
    (l) => l._id.toString() === lessonId.toString()
  );
  if (!lesson) {
    const err = new Error('Lesson not found in this module');
    err.statusCode = 404;
    throw err;
  }
  return { module: mod, lesson };
};

/**
 * Count total lessons across all modules of a course.
 */
const countTotalLessons = (course) => {
  return course.curriculum.modules.reduce(
    (sum, mod) => sum + mod.lessons.length,
    0
  );
};

/**
 * Recalculate and persist progress percentage on a progress doc.
 * Safe against division by zero.
 */
const recalculateProgress = async (progressDoc, course) => {
  const total = countTotalLessons(course);
  const completed = progressDoc.lessons.filter((l) => l.isCompleted).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  progressDoc.percentComplete = percent;
  progressDoc.isCourseCompleted = percent === 100;
  progressDoc.lastAccessedAt = new Date();
  await progressDoc.save();
  return progressDoc;
};

/**
 * Get or create a progress record for the given student + course.
 */
const getOrCreateProgress = async (userId, courseId) => {
  let progress = await CourseProgress.findOne({ userId, courseId });
  if (!progress) {
    progress = await CourseProgress.create({ userId, courseId });
  }
  return progress;
};

/**
 * Get detailed progress for a single course, populated with course data.
 */
const getCourseProgressService = async (userId, courseId) => {
  const course = await resolveCourseById(courseId);
  const progress = await getOrCreateProgress(userId, courseId);
  const total = countTotalLessons(course);
  const completed = progress.lessons.filter((l) => l.isCompleted).length;

  return {
    progress,
    course,
    summary: {
      totalLessons: total,
      completedLessons: completed,
      percentComplete: progress.percentComplete,
      isCourseCompleted: progress.isCourseCompleted,
      currentLessonId: progress.currentLessonId,
      currentModuleId: progress.currentModuleId,
      lastAccessedAt: progress.lastAccessedAt,
    },
  };
};

/**
 * Record a lesson start. Creates progress doc if needed.
 * Idempotent: re-starting an already-started lesson is safe.
 */
const startLessonService = async (userId, courseId, moduleId, lessonId) => {
  const course = await resolveCourseById(courseId);

  // Validate IDs
  if (
    !mongoose.Types.ObjectId.isValid(moduleId) ||
    !mongoose.Types.ObjectId.isValid(lessonId)
  ) {
    const err = new Error('Invalid module or lesson ID format');
    err.statusCode = 400;
    throw err;
  }

  resolveLessonInCourse(course, moduleId, lessonId);

  const progress = await getOrCreateProgress(userId, courseId);

  // Check if this lesson is already tracked
  const existing = progress.lessons.find(
    (l) =>
      l.lessonId.toString() === lessonId.toString() &&
      l.moduleId.toString() === moduleId.toString()
  );

  if (!existing) {
    progress.lessons.push({
      lessonId,
      moduleId,
      startedAt: new Date(),
      isCompleted: false,
    });
  }

  // Update current lesson pointers
  progress.currentLessonId = lessonId;
  progress.currentModuleId = moduleId;
  progress.lastAccessedAt = new Date();

  await progress.save();
  return progress;
};

/**
 * Mark a lesson as completed. Idempotent and recalculates percentage.
 */
const completeLessonService = async (userId, courseId, moduleId, lessonId) => {
  const course = await resolveCourseById(courseId);

  if (
    !mongoose.Types.ObjectId.isValid(moduleId) ||
    !mongoose.Types.ObjectId.isValid(lessonId)
  ) {
    const err = new Error('Invalid module or lesson ID format');
    err.statusCode = 400;
    throw err;
  }

  resolveLessonInCourse(course, moduleId, lessonId);

  const progress = await getOrCreateProgress(userId, courseId);

  // Upsert the lesson entry
  const existingIdx = progress.lessons.findIndex(
    (l) =>
      l.lessonId.toString() === lessonId.toString() &&
      l.moduleId.toString() === moduleId.toString()
  );

  if (existingIdx >= 0) {
    if (!progress.lessons[existingIdx].isCompleted) {
      progress.lessons[existingIdx].isCompleted = true;
      progress.lessons[existingIdx].completedAt = new Date();
    }
  } else {
    progress.lessons.push({
      lessonId,
      moduleId,
      startedAt: new Date(),
      completedAt: new Date(),
      isCompleted: true,
    });
  }

  // Always keep current pointers up to date
  progress.currentLessonId = lessonId;
  progress.currentModuleId = moduleId;

  await recalculateProgress(progress, course);
  return progress;
};

/**
 * Get all course progress summaries for a student — for dashboard use.
 */
const getAllProgressService = async (userId) => {
  const allProgress = await CourseProgress.find({ userId }).populate(
    'courseId',
    'title slug thumbnail category level curriculum'
  );

  return allProgress.map((p) => {
    const course = p.courseId;
    const total = course
      ? course.curriculum.modules.reduce(
          (sum, mod) => sum + mod.lessons.length,
          0
        )
      : 0;
    const completed = p.lessons.filter((l) => l.isCompleted).length;

    return {
      progressId: p._id,
      courseId: course?._id,
      courseTitle: course?.title,
      courseSlug: course?.slug,
      courseThumbnail: course?.thumbnail,
      courseCategory: course?.category,
      courseLevel: course?.level,
      totalLessons: total,
      completedLessons: completed,
      percentComplete: p.percentComplete,
      isCourseCompleted: p.isCourseCompleted,
      currentLessonId: p.currentLessonId,
      currentModuleId: p.currentModuleId,
      lastAccessedAt: p.lastAccessedAt,
    };
  });
};

/**
 * Return enough context to resume learning: course + current/next lesson info.
 */
const getContinueLearningService = async (userId, courseId) => {
  const course = await resolveCourseById(courseId);
  const progress = await getOrCreateProgress(userId, courseId);

  let targetModule = null;
  let targetLesson = null;

  // If we have a current lesson pointer, use it
  if (progress.currentLessonId) {
    outer: for (const mod of course.curriculum.modules) {
      for (const lesson of mod.lessons) {
        if (lesson._id.toString() === progress.currentLessonId.toString()) {
          targetModule = mod;
          targetLesson = lesson;
          break outer;
        }
      }
    }
  }

  // Fallback: find the first incomplete lesson
  if (!targetLesson) {
    const completedIds = new Set(
      progress.lessons.filter((l) => l.isCompleted).map((l) => l.lessonId.toString())
    );
    outer: for (const mod of course.curriculum.modules) {
      for (const lesson of mod.lessons) {
        if (!completedIds.has(lesson._id.toString())) {
          targetModule = mod;
          targetLesson = lesson;
          break outer;
        }
      }
    }
  }

  // All lessons done: return first lesson
  if (!targetLesson && course.curriculum.modules.length > 0) {
    targetModule = course.curriculum.modules[0];
    targetLesson = targetModule.lessons[0] || null;
  }

  return {
    courseId: course._id,
    courseTitle: course.title,
    courseSlug: course.slug,
    percentComplete: progress.percentComplete,
    isCourseCompleted: progress.isCourseCompleted,
    targetModule: targetModule
      ? { _id: targetModule._id, title: targetModule.title, order: targetModule.order }
      : null,
    targetLesson: targetLesson
      ? {
          _id: targetLesson._id,
          title: targetLesson.title,
          videoId: targetLesson.videoId,
          videoUrl: targetLesson.videoUrl,
          order: targetLesson.order,
        }
      : null,
  };
};

module.exports = {
  getCourseProgressService,
  startLessonService,
  completeLessonService,
  getAllProgressService,
  getContinueLearningService,
};
