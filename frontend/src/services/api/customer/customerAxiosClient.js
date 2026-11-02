/**
 * @file customerAxiosClient.js
 * @description Dedicated Axios instance for Customer Portal operations.
 * Injects customer bearer token, tenant ID, and active branch headers.
 * Handles automatic 401 refresh token rotation.
 * @module frontend/src/services/api/customer/customerAxiosClient
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const customerAxiosClient = axios.create({
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
customerAxiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('customer_access_token');
    const tenantId = localStorage.getItem('customer_tenant_id') || localStorage.getItem('tenant_id');
    const branchId = localStorage.getItem('customer_branch_id');

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
customerAxiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/customer/auth/login') || originalRequest.url?.includes('/customer/auth/refresh')) {
        return Promise.reject(error.response?.data || error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return customerAxiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const storedRefreshToken = localStorage.getItem('customer_refresh_token');
      const tenantId = localStorage.getItem('customer_tenant_id') || localStorage.getItem('tenant_id');

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/customer/auth/refresh`,
          { refreshToken: storedRefreshToken },
          {
            withCredentials: true,
            headers: tenantId ? { 'x-tenant-id': tenantId } : {},
          }
        );

        const newAccessToken = refreshResponse.data?.data?.accessToken;
        const newRefreshToken = refreshResponse.data?.data?.refreshToken;

        if (newAccessToken) {
          localStorage.setItem('customer_access_token', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('customer_refresh_token', newRefreshToken);
          }
          customerAxiosClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return customerAxiosClient(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem('customer_access_token');
        localStorage.removeItem('customer_refresh_token');
        localStorage.removeItem('customer_user');
        window.dispatchEvent(new Event('customer_auth_expired'));
        return Promise.reject(refreshErr.response?.data || refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default customerAxiosClient;
