/**
 * @file publicAxiosClient.js
 * @description Dedicated Axios instance for Public Catalog and Showcase operations.
 * Resolves tenant from hostname subdomain or localStorage tenant context.
 * @module frontend/src/services/api/public/publicAxiosClient
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const publicAxiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

publicAxiosClient.interceptors.request.use((config) => {
  const tenantId = localStorage.getItem('tenant_id') || localStorage.getItem('customer_tenant_id');
  if (tenantId) {
    config.headers['x-tenant-id'] = tenantId;
  }
  return config;
});

publicAxiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data || error)
);

export default publicAxiosClient;
