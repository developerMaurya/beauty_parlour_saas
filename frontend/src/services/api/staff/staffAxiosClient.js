/**
 * @file staffAxiosClient.js
 * @description Dedicated Axios instance for Staff Portal API operations.
 * Automatically injects staff bearer token, tenant ID, and active branch ID headers.
 * Handles automatic 401 refresh token rotation.
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const staffAxiosClient = axios.create({
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
staffAxiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('staff_access_token');
    const tenantId = localStorage.getItem('staff_tenant_id') || localStorage.getItem('tenant_id');
    const branchId = localStorage.getItem('staff_branch_id');

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
staffAxiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url?.includes('/staff/auth/login') ||
        originalRequest.url?.includes('/staff/auth/refresh')
      ) {
        return Promise.reject(error.response?.data || error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return staffAxiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshRes = await axios.post(
          `${API_BASE_URL}/staff/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: {
              'x-tenant-id': localStorage.getItem('staff_tenant_id') || '',
            },
          }
        );

        const newAccessToken =
          refreshRes.data?.data?.accessToken || refreshRes.data?.accessToken;

        if (newAccessToken) {
          localStorage.setItem('staff_access_token', newAccessToken);
          staffAxiosClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return staffAxiosClient(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem('staff_access_token');
        localStorage.removeItem('staff_profile');
        if (window.location.pathname.startsWith('/staff') && !window.location.pathname.includes('/staff/login')) {
          window.location.href = '/staff/login';
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default staffAxiosClient;
