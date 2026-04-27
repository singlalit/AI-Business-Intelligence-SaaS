import axios from 'axios';

const API_URL = 'http://localhost:8000'; // FastAPI backend

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);
  
  const response = await axios.post(`${API_URL}/auth/login`, formData);
  return response.data;
};

export const register = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, { email, password });
  return response.data;
};

export const uploadDataset = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload-dataset', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const queryDataset = async (datasetId, query) => {
  const response = await api.post('/query', {
    dataset_id: datasetId,
    query: query
  });
  return response.data;
};

export default api;
