import api from '../api/axios.js';

export const getCourses = (params) => api.get('/courses/getAll', { params });

export const getCourseById = (id) => api.get(`/courses/getOne/${id}`);