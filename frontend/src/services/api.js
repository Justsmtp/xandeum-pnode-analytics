// frontend/src/services/api.js
import axios from 'axios';
import solanaService from './solanaService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`📡 API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Methods
export const pNodeAPI = {
  /**
   * Get all pNodes
   */
  getAllPNodes: async (refresh = false) => {
    const response = await api.get('/pnodes', {
      params: { refresh: refresh ? 'true' : undefined },
    });
    return response.data;
  },

  /**
   * Get specific pNode by ID
   */
  getPNodeById: async (id) => {
    const response = await api.get(`/pnodes/${id}`);
    return response.data;
  },

  /**
   * Get statistics
   */
  getStatistics: async () => {
    const response = await api.get('/pnodes/stats');
    return response.data;
  },
};

export { solanaService };

export default api;