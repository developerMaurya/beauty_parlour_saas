/**
 * @file env.js
 * @description Centralized environment variable loader and parser.
 * @module backend/src/config/env
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  APP_NAME: process.env.APP_NAME || 'BeautySaaS',
  API_PREFIX: process.env.API_PREFIX || '/api/v1',
  APP_URL: process.env.APP_URL || 'http://localhost:5000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Database
  MONGODB_URI: process.env.MONGODB_URI || process.env.CENTRAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/beauty_saas_central',
  CENTRAL_MONGODB_URI: process.env.CENTRAL_MONGODB_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/beauty_saas_central',

  // JWT Token Configuration
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'dev_access_secret_fallback_key_min_32_characters_long',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_fallback_key_min_32_characters_long',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  JWT_ISSUER: process.env.JWT_ISSUER || 'beauty-saas',
  JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'beauty-saas-api',

  // Cookie Settings
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || undefined,
  COOKIE_SECURE: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production',
  COOKIE_SAME_SITE: process.env.COOKIE_SAME_SITE || 'lax',

  // Super Admin Bootstrap
  SUPERADMIN_BOOTSTRAP_NAME: process.env.SUPERADMIN_BOOTSTRAP_NAME || 'Master Super Admin',
  SUPERADMIN_BOOTSTRAP_EMAIL: process.env.SUPERADMIN_BOOTSTRAP_EMAIL || 'superadmin@beautysaas.local',
  SUPERADMIN_BOOTSTRAP_USERNAME: process.env.SUPERADMIN_BOOTSTRAP_USERNAME || 'superadmin',
  SUPERADMIN_BOOTSTRAP_PASSWORD: process.env.SUPERADMIN_BOOTSTRAP_PASSWORD || 'SuperAdmin@Secure2026!',

  // CORS
  CORS_ALLOWED_ORIGINS: process.env.CORS_ALLOWED_ORIGINS
    ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 mins
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  AUTH_RATE_LIMIT_WINDOW_MS: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 mins
  AUTH_RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || '10', 10),

  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
});

export default env;
