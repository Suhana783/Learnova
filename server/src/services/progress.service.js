const mongoose = require('mongoose');
const Course = require('../model/course.model');
const CourseProgress = require('../model/courseProgress.model');

/**
 * Safely read modules array from a course document.
 */
const getCourseModules = (course) => {
  if (!course || !course.curriculum || !Array.isArray(course.curriculum.modules)) {
    return [];
  }
  return course.curriculum.modules;
};

/**
 * Build a set of valid lesson IDs from a course curriculum.
 */
const getValidLessonIdSet = (course) => {
  const modules = getCourseModules(course);
  const ids = new Set();

  for (const mod of modules) {
    const lessons = Array.isArray(mod.lessons) ? mod.lessons : [];
    for (const lesson of lessons) {
      if (lesson && lesson._id) ids.add(lesson._id.toString());
    }
  }

  return ids;
};

/**
 * Count completed lessons that still exist in the current course curriculum.
 */
const countValidCompletedLessons = (progressDoc, course) => {
  const validLessonIds = getValidLessonIdSet(course);

  if (validLessonIds.size === 0) return 0;

  const completedLessonIds = new Set();
  for (const l of progressDoc.lessons || []) {
    if (l.isCompleted && l.lessonId && validLessonIds.has(l.lessonId.toString())) {
      completedLessonIds.add(l.lessonId.toString());
    }
  }

  return completedLessonIds.size;
};

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
  const modules = getCourseModules(course);
  if (modules.length === 0) {
    const err = new Error('Course has no lessons configured. Populate curriculum.modules[].lessons[] first.');
    err.statusCode = 400;
    throw err;
  }

  const mod = modules.find(
    (m) => m._id.toString() === moduleId.toString()
  );
  if (!mod) {
    const err = new Error('Module not found in this course');
    err.statusCode = 404;
    throw err;
  }
  const moduleLessons = Array.isArray(mod.lessons) ? mod.lessons : [];
  const lesson = moduleLessons.find(
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
  return getCourseModules(course).reduce(
    (sum, mod) => sum + (Array.isArray(mod.lessons) ? mod.lessons.length : 0),
    0
  );
};

/**
 * Recalculate and persist progress percentage on a progress doc.
 * Safe against division by zero.
 */
const recalculateProgress = async (progressDoc, course) => {
  const total = countTotalLessons(course);
  const completed = countValidCompletedLessons(progressDoc, course);
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
  const completed = countValidCompletedLessons(progress, course);

  // Keep stored percent in sync with current curriculum shape.
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  if (progress.percentComplete !== percent || progress.isCourseCompleted !== (percent === 100)) {
    progress.percentComplete = percent;
    progress.isCourseCompleted = percent === 100;
    progress.lastAccessedAt = new Date();
    await progress.save();
  }

  return {
    progress,
    course,
    summary: {
      totalLessons: total,
      completedLessons: completed,
      percentComplete: percent,
      isCourseCompleted: percent === 100,
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

  return {
    progress,
    summary: {
      totalLessons: countTotalLessons(course),
      completedLessons: countValidCompletedLessons(progress, course),
      percentComplete: progress.percentComplete,
      isCourseCompleted: progress.isCourseCompleted,
      currentLessonId: progress.currentLessonId,
      currentModuleId: progress.currentModuleId,
      lastAccessedAt: progress.lastAccessedAt,
    },
  };
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
    const total = countTotalLessons(course);
    const completed = countValidCompletedLessons(p, course);
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

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
      percentComplete: percent,
      isCourseCompleted: percent === 100,
      currentLessonId: p.currentLessonId,
      currentModuleId: p.currentModuleId,
      lastAccessedAt: p.lastAccessedAt,
      hasValidCourseRef: !!course,
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
    outer: for (const mod of getCourseModules(course)) {
      for (const lesson of Array.isArray(mod.lessons) ? mod.lessons : []) {
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
    outer: for (const mod of getCourseModules(course)) {
      for (const lesson of Array.isArray(mod.lessons) ? mod.lessons : []) {
        if (!completedIds.has(lesson._id.toString())) {
          targetModule = mod;
          targetLesson = lesson;
          break outer;
        }
      }
    }
  }

  // All lessons done: return first lesson
  const modules = getCourseModules(course);
  if (!targetLesson && modules.length > 0) {
    targetModule = modules[0];
    targetLesson = (Array.isArray(targetModule.lessons) ? targetModule.lessons[0] : null) || null;
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
