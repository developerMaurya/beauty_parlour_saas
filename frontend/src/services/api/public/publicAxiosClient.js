/**
 * @file publicAxiosClient.js
 * @description Dedicated Axios instance for Public Catalog and Showcase operations.
 * Automatically resolves tenant from hostname subdomain, URL, or cached context.
 * @module frontend/src/services/api/public/publicAxiosClient
 */

import axios from 'axios';
import { getCurrentTenantIdentifier } from '../../../utils/tenantDomain.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const publicAxiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

publicAxiosClient.interceptors.request.use((config) => {
  const tenantSlug = getCurrentTenantIdentifier();
  if (tenantSlug) {
    config.headers['x-tenant-slug'] = tenantSlug;
  }

  const tenantId = localStorage.getItem('tenant_id') || localStorage.getItem('customer_tenant_id');
  if (tenantId) {
    config.headers['x-tenant-id'] = tenantId;
  }

  if (typeof window !== 'undefined' && window.location.hostname) {
    config.headers['x-tenant-domain'] = window.location.hostname;
  }

  return config;
});

publicAxiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data || error)
);

export default publicAxiosClient;
