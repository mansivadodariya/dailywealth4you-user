import axios from 'axios';
import { clearAuthCookies, getTokenFromCookie } from './cookies';
import config from '@/config';

const api = axios.create({
  baseURL: config.APP_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-auth-token'] = token;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      clearAuthCookies();
    }

    const fallbackMessage = 'Something went wrong. Please try again.';
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      fallbackMessage;

    return Promise.reject(message);
  }
);

// Separate instance for file uploads
const fileApi = axios.create({
  baseURL: config.APP_BACKEND_URL,
});

fileApi.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-auth-token'] = token;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

fileApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      clearAuthCookies();
    }

    const fallbackMessage = 'Something went wrong. Please try again.';
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      fallbackMessage;

    return Promise.reject(message);
  }
);

export { fileApi };
export default api;
