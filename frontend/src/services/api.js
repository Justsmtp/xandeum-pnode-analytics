// frontend/src/services/api.js
import axios from 'axios';

// Use your live backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://xandeum-pnode-analytics-9aon.onrender.com/api';

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

// Response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} - ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error(`❌ API Response Error (${error.response.status}):`, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('❌ No response from server:', error.message);
    } else {
      // Request setup error
      console.error('❌ API Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API Methods matching your backend routes
export const pNodeAPI = {
  /**
   * Get all pNodes
   * @param {boolean} refresh - Force refresh data (bypass cache)
   */
  getAllPNodes: async (refresh = false) => {
    try {
      const response = await api.get('/pnodes', {
        params: { refresh: refresh ? 'true' : undefined },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch pNodes:', error);
      throw error;
    }
  },

  /**
   * Get specific pNode by ID
   * @param {string} id - pNode ID
   */
  getPNodeById: async (id) => {
    try {
      const response = await api.get(`/pnodes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch pNode ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get pNode statistics
   */
  getStatistics: async () => {
    try {
      const response = await api.get('/pnodes/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      throw error;
    }
  },

  /**
   * Health check
   */
  healthCheck: async () => {
    try {
      // Note: health endpoint is at root level, not /api
      const response = await axios.get('https://xandeum-pnode-analytics-9aon.onrender.com/health', {
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },
};

// Helper function to check API availability
export const checkAPIConnection = async () => {
  try {
    const health = await pNodeAPI.healthCheck();
    console.log('✅ API Connection OK:', health);
    return { connected: true, data: health };
  } catch (error) {
    console.error('❌ API Connection Failed:', error.message);
    return { connected: false, error: error.message };
  }
};

// Export default api instance for custom requests
export default api;