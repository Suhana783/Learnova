import api from '../api/axios';

export const uploadAssignment = async (formData) => {
  const response = await api.post('/assignments/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getAssignments = async (params = {}) => {
  const response = await api.get('/assignments', { params });
  return response.data;
};
