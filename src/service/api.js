import axios from 'axios';
import { clearAuthCookies, getTokenFromCookie } from './cookies';
import { API_BASE_URL } from './url';
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

export default api;
