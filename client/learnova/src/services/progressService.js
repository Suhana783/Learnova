/**
 * progressService.js
 * All API calls related to student course progress.
 * Uses the shared axios instance that automatically attaches the Bearer token.
 */

import api from '../api/axios.js';

/**
 * Get all course progress summaries for the current student.
 * Used by the student dashboard.
 */
export const getAllProgress = () => api.get('/progress');

/**
 * Get detailed progress for a single course.
 * @param {string} courseId - MongoDB ObjectId of the course
 */
export const getCourseProgress = (courseId) =>
  api.get(`/progress/${courseId}`);

/**
 * Record that the student started a lesson.
 * @param {string} courseId
 * @param {string} lessonId
 * @param {string} moduleId
 */
export const startLesson = (courseId, lessonId, moduleId) =>
  api.post(`/progress/${courseId}/lessons/${lessonId}/start`, { moduleId });

/**
 * Mark a lesson as completed.
 * @param {string} courseId
 * @param {string} lessonId
 * @param {string} moduleId
 */
export const completeLesson = (courseId, lessonId, moduleId) =>
  api.post(`/progress/${courseId}/lessons/${lessonId}/complete`, { moduleId });

/**
 * Get continue-learning data: course + current/next lesson to resume.
 * @param {string} courseId
 */
export const getContinueLearning = (courseId) =>
  api.get(`/progress/${courseId}/continue`);

/**
 * Enroll the current student in a course.
 * @param {string} courseId
 */
export const enrollInCourse = (courseId) =>
  api.post(`/enroll/enroll/${courseId}`);

/**
 * Get all enrollments for the current student.
 */
export const getMyEnrollments = () => api.get('/enroll/my-enrollments');
