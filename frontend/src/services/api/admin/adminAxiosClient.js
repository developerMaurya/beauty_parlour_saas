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
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];
let autoLoginPromise = null;

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
  async (config) => {
    let token = localStorage.getItem('tenant_access_token');
    
    // Auto-authenticate with demo tenant admin if no token in session (singleton promise)
    if (!token && !config.url?.includes('/admin/auth/login')) {
      if (!autoLoginPromise) {
        autoLoginPromise = axios.post(
          `${API_BASE_URL}/admin/auth/login`,
          {
            identifier: 'admin@parlour.local',
            password: 'Password@123',
          },
          {
            timeout: 6000,
            headers: {
              'x-tenant-slug': localStorage.getItem('active_tenant_slug') || 'blossom-salon',
            },
          }
        ).then((loginRes) => {
          const data = loginRes.data?.data;
          if (data?.accessToken) {
            token = data.accessToken;
            localStorage.setItem('tenant_access_token', token);
            if (data.refreshToken) {
              localStorage.setItem('tenant_refresh_token', data.refreshToken);
            }
            if (data.user) {
              localStorage.setItem('tenant_user', JSON.stringify(data.user));
            }
            localStorage.setItem('active_tenant_slug', 'blossom-salon');
          }
          return token;
        }).catch((authErr) => {
          console.warn('Auto auth fallback:', authErr?.message);
          return null;
        }).finally(() => {
          autoLoginPromise = null;
        });
      }
      token = await autoLoginPromise;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const tenantId = localStorage.getItem('active_tenant_id') || localStorage.getItem('active_tenant_slug') || 'blossom-salon';
    if (tenantId) {
      config.headers['x-tenant-id'] = tenantId;
      config.headers['x-tenant-slug'] = tenantId;
    }

    const branchId = localStorage.getItem('active_branch_id');
    if (branchId) {
      config.headers['x-branch-id'] = branchId;
    }

    // Automatic Query-to-Body Transformation for filterable listing endpoints:
    // Ensures all listing/filter queries are sent via HTTP JSON Request Body (POST) instead of URL query parameters
    const FILTERABLE_ENDPOINTS = [
      '/admin/users',
      '/admin/staff',
      '/admin/products',
      '/admin/roles',
      '/admin/user-types',
      '/admin/business-targets',
      '/admin/branches',
      '/admin/students',
      '/admin/student-plans',
      '/admin/enrollments',
      '/admin/student-attendance',
      '/admin/course-materials',
      '/admin/customers',
      '/admin/services',
      '/admin/service-categories',
      '/admin/service-subcategories',
      '/admin/sub-services',
      '/admin/parlour-plans',
      '/admin/packages',
      '/admin/offers',
      '/admin/coupons',
      '/admin/appointments',
      '/admin/inquiries',
      '/admin/departments',
      '/admin/designations',
      '/admin/skills',
      '/admin/inventory',
      '/admin/dashboard/assigned-products',
    ];

    const urlPath = (config.url || '').split('?')[0];
    if (config.method?.toLowerCase() === 'get' && FILTERABLE_ENDPOINTS.includes(urlPath)) {
      config.method = 'post';
      config.url = urlPath.endsWith('/assigned-products') ? `${urlPath}/list` : `${urlPath}/filter`;
      config.data = { ...(config.params || {}), ...(config.data || {}) };
      config.params = {};
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 401 Refresh Token Rotation / Auto-recovery
adminAxiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.data?.code === 'DOMAIN_ACCESS_SUSPENDED') {
      const msg = encodeURIComponent(error.response?.data?.message || 'Connect to Super Admin for access to your website portal.');
      if (window.location.pathname !== '/portal-suspended') {
        window.location.href = `/portal-suspended?msg=${msg}`;
      }
      return Promise.reject(error.response?.data || error);
    }

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

        let newAccessToken = null;
        let newRefreshToken = null;

        // If refresh token exists, rotate session
        if (storedRefreshToken) {
          const refreshRes = await axios.post(
            `${API_BASE_URL}/admin/auth/refresh`,
            { refreshToken: storedRefreshToken },
            {
              withCredentials: true,
              headers: {
                'x-tenant-id': localStorage.getItem('active_tenant_id') || 'blossom-salon',
                'x-tenant-slug': localStorage.getItem('active_tenant_slug') || 'blossom-salon',
              },
            }
          );
          newAccessToken = refreshRes.data?.data?.accessToken;
          newRefreshToken = refreshRes.data?.data?.refreshToken;
        } else {
          // If refresh token is missing, perform automatic re-authentication
          const autoLoginRes = await axios.post(
            `${API_BASE_URL}/admin/auth/login`,
            {
              identifier: 'admin@parlour.local',
              password: 'Password@123',
            },
            {
              headers: {
                'x-tenant-slug': localStorage.getItem('active_tenant_slug') || 'blossom-salon',
              },
            }
          );
          newAccessToken = autoLoginRes.data?.data?.accessToken;
          newRefreshToken = autoLoginRes.data?.data?.refreshToken;
        }

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
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default adminAxiosClient;
