import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('tms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global 401 handler
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('tms_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const login = (data) => API.post('/auth/login', data);
export const getMe  = ()     => API.get('/auth/me');

// Masters
export const getDepartments = ()       => API.get('/departments');
export const createDepartment = (d)    => API.post('/departments', d);
export const updateDepartment = (id,d) => API.put(`/departments/${id}`, d);
export const deleteDepartment = (id)   => API.delete(`/departments/${id}`);

export const getProgrammes = ()       => API.get('/programmes');
export const createProgramme = (d)    => API.post('/programmes', d);
export const updateProgramme = (id,d) => API.put(`/programmes/${id}`, d);
export const deleteProgramme = (id)   => API.delete(`/programmes/${id}`);

export const getBlocks = ()       => API.get('/blocks');
export const createBlock = (d)    => API.post('/blocks', d);
export const updateBlock = (id,d) => API.put(`/blocks/${id}`, d);
export const deleteBlock = (id)   => API.delete(`/blocks/${id}`);

export const getRooms = ()       => API.get('/rooms');
export const createRoom = (d)    => API.post('/rooms', d);
export const updateRoom = (id,d) => API.put(`/rooms/${id}`, d);
export const deleteRoom = (id)   => API.delete(`/rooms/${id}`);

export const getRoles = ()       => API.get('/roles');
export const createRole = (d)    => API.post('/roles', d);
export const updateRole = (id,d) => API.put(`/roles/${id}`, d);
export const deleteRole = (id)   => API.delete(`/roles/${id}`);

export const getUsers = ()       => API.get('/users');
export const createUser = (d)    => API.post('/users', d);
export const updateUser = (id,d) => API.put(`/users/${id}`, d);
export const deleteUser = (id)   => API.delete(`/users/${id}`);

// Complaints
export const getComplaints    = (params)   => API.get('/complaints', { params });
export const getComplaintById = (id)       => API.get(`/complaints/${id}`);
export const createComplaint  = (formData) => API.post('/complaints', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const assignComplaint  = (id, data) => API.patch(`/complaints/${id}/assign`, data);
export const updateStatus     = (id, data) => API.patch(`/complaints/${id}/status`, data);
export const getDashboard     = ()         => API.get('/complaints/dashboard');

// Reports
export const getReport = (params) => API.get('/reports/complaints', { params });

export default API;
