/**
 * @file studentAxiosClient.js
 * @description Dedicated Axios instance for Student Academy Portal operations.
 * Automatically injects student bearer token, tenant ID, and active branch headers.
 * Handles automatic 401 refresh token rotation.
 * @module frontend/src/services/api/student/studentAxiosClient
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const studentAxiosClient = axios.create({
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

// Request Interceptor
studentAxiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('student_access_token');
    const tenantId = localStorage.getItem('student_tenant_id') || localStorage.getItem('tenant_id');
    const branchId = localStorage.getItem('student_branch_id');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (tenantId) {
      config.headers['x-tenant-id'] = tenantId;
    }
    if (branchId) {
      config.headers['x-branch-id'] = branchId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
studentAxiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url.includes('/student/auth/login') || originalRequest.url.includes('/student/auth/refresh')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return studentAxiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshRes = await axios.post(
          `${API_BASE_URL}/student/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: {
              'x-tenant-id': localStorage.getItem('student_tenant_id') || localStorage.getItem('tenant_id'),
            },
          }
        );

        const newAccessToken = refreshRes.data?.data?.accessToken;
        if (newAccessToken) {
          localStorage.setItem('student_access_token', newAccessToken);
          studentAxiosClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return studentAxiosClient(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem('student_access_token');
        localStorage.removeItem('student_user');
        window.location.href = '/student/login';
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default studentAxiosClient;
