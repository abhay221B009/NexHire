import axios from 'axios';

// Axios Instance Configuration
// - import.meta.env.VITE_API_URL: Vite environment variable syntax for client-side URL injection.
// - withCredentials: true: Mandates browser sending HTTP-Only authentication cookies in cross-origin requests (Vercel to Render).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Response Interceptor:
// Intercepts all backend HTTP responses globally. Normalizes error messages (error.response?.data?.message)
// into customMessage so frontend UI components don't need duplicate error parsing logic.
api.interceptors.response.use(
  (response) => response,
  (error) => {
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
