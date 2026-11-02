/**
 * @file axiosClient.js
 * @description Central Axios instance with JWT bearer tokens and automatic refresh interceptor
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach Access Token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sa_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Automatic Refresh
axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't refresh on login or refresh endpoint failures
      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/refresh')
      ) {
        return Promise.reject(error.response?.data || error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken = localStorage.getItem('sa_refresh_token');
        // Call refresh endpoint
        const refreshRes = await axios.post(
          `${API_BASE_URL}/superadmin/auth/refresh`,
          { refreshToken: storedRefreshToken },
          { withCredentials: true }
        );

        const newAccessToken = refreshRes.data?.data?.accessToken;
        const newRefreshToken = refreshRes.data?.data?.refreshToken;

        if (newAccessToken) {
          localStorage.setItem('sa_access_token', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('sa_refresh_token', newRefreshToken);
          }
          axiosClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return axiosClient(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem('sa_access_token');
        localStorage.removeItem('sa_refresh_token');
        localStorage.removeItem('sa_user');
        if (window.location.pathname !== '/superadmin/login') {
          window.location.href = '/superadmin/login';
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;
