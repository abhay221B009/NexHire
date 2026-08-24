import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  withCredentials: true, // Crucial for sending/receiving HTTP-Only auth cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for handling common API errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize backend error responses
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    return Promise.reject({
      ...error,
      customMessage: message,
      status: error.response?.status,
    });
  }
);

export default api;
