import api from '../api/axios.js';

export const getAllProgress = () => api.get('/progress');

export const getCourseProgress = (courseId) =>
  api.get(`/progress/${courseId}`);

export const startLesson = (courseId, lessonId, moduleId) =>
  api.post(`/progress/${courseId}/lessons/${lessonId}/start`, { moduleId });

export const completeLesson = (courseId, lessonId, moduleId) =>
  api.post(`/progress/${courseId}/lessons/${lessonId}/complete`, { moduleId });

export const getContinueLearning = (courseId) =>
  api.get(`/progress/${courseId}/continue`);

export const enrollInCourse = (courseId) =>
  api.post(`/enroll/enroll/${courseId}`);

export const getMyEnrollments = () => api.get('/enroll/my-enrollments');
