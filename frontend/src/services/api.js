// frontend/src/services/api.js
import axios from 'axios';

// Your live backend URL - Remove /api from base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://xandeum-pnode-analytics-9aon.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Increased timeout for Render cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`📡 API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
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
    console.log(`✅ API Response: ${response.status} - ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ API Response Error (${error.response.status}):`, error.response.data);
    } else if (error.request) {
      console.error('❌ No response from server. Backend might be sleeping or unreachable:', error.message);
    } else {
      console.error('❌ Request setup error:', error.message);
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
      console.log('🔍 Fetching all pNodes...');
      const response = await api.get('/api/pnodes', {
        params: refresh ? { refresh: 'true' } : {},
      });
      console.log('✅ pNodes fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch pNodes:', error.message);
      
      // Return detailed error info
      throw {
        message: error.message,
        status: error.response?.status,
        details: error.response?.data || 'Network error - backend might be sleeping',
        isNetworkError: !error.response,
      };
    }
  },

  /**
   * Get specific pNode by ID
   * @param {string} id - pNode ID
   */
  getPNodeById: async (id) => {
    try {
      console.log(`🔍 Fetching pNode: ${id}`);
      const response = await api.get(`/api/pnodes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to fetch pNode ${id}:`, error.message);
      throw {
        message: error.message,
        status: error.response?.status,
        details: error.response?.data,
        isNetworkError: !error.response,
      };
    }
  },

  /**
   * Get pNode statistics
   */
  getStatistics: async () => {
    try {
      console.log('🔍 Fetching statistics...');
      const response = await api.get('/api/pnodes/stats');
      console.log('✅ Statistics fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch statistics:', error.message);
      throw {
        message: error.message,
        status: error.response?.status,
        details: error.response?.data,
        isNetworkError: !error.response,
      };
    }
  },

  /**
   * Health check - Note: health endpoint is at root, not /api
   */
  healthCheck: async () => {
    try {
      console.log('🔍 Health check...');
      const response = await axios.get(`${API_BASE_URL}/health`, {
        timeout: 10000
      });
      console.log('✅ Health check passed:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Health check failed:', error.message);
      throw {
        message: error.message,
        status: error.response?.status,
        details: error.response?.data || 'Backend unreachable',
        isNetworkError: !error.response,
      };
    }
  },

  /**
   * Wake up backend (for Render free tier)
   */
  wakeUp: async () => {
    try {
      console.log('⏰ Waking up backend...');
      const response = await axios.get(`${API_BASE_URL}/health`, {
        timeout: 90000 // 90 seconds for cold start
      });
      console.log('✅ Backend is awake');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to wake backend:', error.message);
      throw error;
    }
  }
};

// Helper function to check API availability with retry
export const checkAPIConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 Connection attempt ${i + 1}/${retries}...`);
      const health = await pNodeAPI.healthCheck();
      console.log('✅ API Connection OK:', health);
      return { 
        connected: true, 
        data: health,
        attempt: i + 1
      };
    } catch (error) {
      console.warn(`⚠️ Attempt ${i + 1} failed:`, error.message);
      
      if (i === retries - 1) {
        // Last attempt failed
        console.error('❌ All connection attempts failed');
        return { 
          connected: false, 
          error: error.message,
          isNetworkError: error.isNetworkError,
          details: error.details
        };
      }
      
      // Wait before retry (exponential backoff)
      const delay = Math.pow(2, i) * 1000;
      console.log(`⏳ Waiting ${delay/1000}s before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Export default api instance
export default api;