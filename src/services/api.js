import axios from 'axios';

// Base API URL
const API_URL = 'https://api.medicrypt.com'; // Replace with your actual API URL

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('userType');
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication Services
export const authService = {
  // Register a new user (with MetaMask)
  register: async (userData) => {
    try {
      const response = await api.post('/api/register', userData);
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('userType', response.data.userType);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login with MetaMask
  login: async (walletAddress, signature) => {
    try {
      const response = await api.post('/api/login', { walletAddress, signature });
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('userType', response.data.userType);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verify if a wallet is already registered
  checkWalletRegistration: async (walletAddress) => {
    try {
      const response = await api.get(`/api/wallet-check/${walletAddress}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('userType');
  }
};

// Medical Records Services
export const recordsService = {
  // Get all records (for patient or doctor)
  getRecords: async () => {
    try {
      const response = await api.get('/api/records');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a specific record
  getRecord: async (recordId) => {
    try {
      const response = await api.get(`/api/records/${recordId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Submit a new medical record (doctor)
  submitRecord: async (recordData) => {
    try {
      const response = await api.post('/api/records', recordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a record
  updateRecord: async (recordId, recordData) => {
    try {
      const response = await api.put(`/api/records/${recordId}`, recordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Access Control Services
export const accessService = {
  // Get access requests (for patients to see pending requests)
  getAccessRequests: async () => {
    try {
      const response = await api.get('/api/access/requests');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Doctor requests access to a patient's record
  requestAccess: async (patientId) => {
    try {
      const response = await api.post('/api/access/request', { patientId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Patient approves/denies access request
  responseToAccessRequest: async (requestId, approved) => {
    try {
      const response = await api.post('/api/access/response', { requestId, approved });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check access status
  checkAccessStatus: async (requestId) => {
    try {
      const response = await api.get(`/api/access/status/${requestId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Revoke previously granted access
  revokeAccess: async (requestId) => {
    try {
      const response = await api.post('/api/access/revoke', { requestId });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// User Profile Services
export const userService = {
  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/api/user/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/api/user/profile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // For doctors: get list of patients
  getPatients: async () => {
    try {
      const response = await api.get('/api/doctor/patients');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // For researchers: get anonymized data
  getAnonymizedData: async (params) => {
    try {
      const response = await api.get('/api/researcher/data', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default {
  authService,
  recordsService,
  accessService,
  userService
};