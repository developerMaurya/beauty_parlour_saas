/**
 * @file adminAxiosClient.js
 * @description Dedicated Axios instance for Tenant Admin and User Operations.
 * Automatically injects Tenant ID, Branch ID, JWT Bearer tokens, and handles 401 refresh.
 * @module frontend/src/services/api/admin/adminAxiosClient
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const adminAxiosClient = axios.create({
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

// Request Interceptor: Attach Access Token, Tenant ID, and Branch ID
adminAxiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tenant_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const tenantId = localStorage.getItem('active_tenant_id') || localStorage.getItem('active_tenant_slug');
    if (tenantId) {
      config.headers['x-tenant-id'] = tenantId;
    }

    const branchId = localStorage.getItem('active_branch_id');
    if (branchId) {
      config.headers['x-branch-id'] = branchId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 401 Refresh Token Rotation
adminAxiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url?.includes('/admin/auth/login') ||
        originalRequest.url?.includes('/admin/auth/refresh')
      ) {
        return Promise.reject(error.response?.data || error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return adminAxiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken = localStorage.getItem('tenant_refresh_token');
        const refreshRes = await axios.post(
          `${API_BASE_URL}/admin/auth/refresh`,
          { refreshToken: storedRefreshToken },
          {
            withCredentials: true,
            headers: {
              'x-tenant-id': localStorage.getItem('active_tenant_id') || '',
            },
          }
        );

        const newAccessToken = refreshRes.data?.data?.accessToken;
        const newRefreshToken = refreshRes.data?.data?.refreshToken;

        if (newAccessToken) {
          localStorage.setItem('tenant_access_token', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('tenant_refresh_token', newRefreshToken);
          }
          adminAxiosClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return adminAxiosClient(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem('tenant_access_token');
        localStorage.removeItem('tenant_refresh_token');
        localStorage.removeItem('tenant_user');
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default adminAxiosClient;
