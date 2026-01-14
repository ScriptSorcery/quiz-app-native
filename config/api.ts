import axios from 'axios';
import { Platform } from 'react-native';

// Configure your FastAPI backend URL here
// For local development on physical device, use your computer's IP address
// For Android emulator: http://10.0.2.2:8000
// For iOS simulator: http://localhost:8000
// For physical device: http://YOUR_IP_ADDRESS:8000

// Automatically detect the right URL based on platform
const getApiUrl = () => {
  if (!__DEV__) {
    return 'https://your-production-api.com';
  }
  
  // In development, use platform-specific URLs
  if (Platform.OS === 'android') {
    return 'http://192.168.0.110:8000'; // Android emulator
  } else if (Platform.OS === 'ios') {
    return 'http://192.168.0.110:8000'; // iOS simulator
  } else {
    return 'http://192.168.0.110:8000'; // Web or other platforms
  }
};

const API_BASE_URL = getApiUrl();

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here
    // const token = await AsyncStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export { API_BASE_URL };

// Helper functions for API calls
export const api = {
  /**
   * GET request
   * @param url - Endpoint URL (relative to baseURL)
   * @param config - Optional axios config
   */
  get: async <T = any>(url: string, config?: any): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  /**
   * POST request
   * @param url - Endpoint URL (relative to baseURL)
   * @param data - Request body data
   * @param config - Optional axios config
   */
  post: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  /**
   * PUT request
   * @param url - Endpoint URL (relative to baseURL)
   * @param data - Request body data
   * @param config - Optional axios config
   */
  put: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  /**
   * PATCH request
   * @param url - Endpoint URL (relative to baseURL)
   * @param data - Request body data
   * @param config - Optional axios config
   */
  patch: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },

  /**
   * DELETE request
   * @param url - Endpoint URL (relative to baseURL)
   * @param config - Optional axios config
   */
  delete: async <T = any>(url: string, config?: any): Promise<T> => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },
};

