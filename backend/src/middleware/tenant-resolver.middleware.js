/**
 * @file tenant-resolver.middleware.js
 * @description Dynamic Tenant Resolver Middleware.
 * Identifies the tenant by x-tenant-id/slug header, custom domain, subdomain, or JWT,
 * and attaches the isolated database connection to req.tenantDb.
 * @module backend/src/middleware/tenant-resolver.middleware
 */

import { Tenant } from '../modules/superadmin/tenants/models/tenant.model.js';
import { tenantDatabaseResolver } from '../core/database/tenantDatabaseResolver.js';
import { verifyAccessToken } from '../modules/auth/services/token.service.js';

export const tenantResolverMiddleware = async (req, res, next) => {
  try {
    let tenantIdentifier = req.headers['x-tenant-id'] || req.headers['x-tenant-slug'] || req.query.tenantId || req.query.tenantSlug;

    // If not provided in headers, check Authorization JWT token if present
    if (!tenantIdentifier && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        try {
          const decoded = verifyAccessToken(parts[1]);
          if (decoded && (decoded.tenantId || decoded.tenantSlug)) {
            tenantIdentifier = decoded.tenantId || decoded.tenantSlug;
          }
        } catch {
          // Token expired or invalid, let auth middleware handle 401 later
        }
      }
    }

    // If still not found, inspect host/domain
    if (!tenantIdentifier && req.headers.host) {
      const host = req.headers.host.split(':')[0].toLowerCase();
      // If host is subdomain like tenant1.beautysaas.local
      if (host.includes('.')) {
        const parts = host.split('.');
        if (parts.length >= 3 && parts[0] !== 'api' && parts[0] !== 'admin' && parts[0] !== 'www') {
          tenantIdentifier = parts[0];
        }
      }
    }

    if (!tenantIdentifier) {
      // In development or test, allow falling back to first active tenant if available
      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
        const defaultTenant = await Tenant.findOne({ status: { $in: ['active', 'trial'] } }).sort({ createdAt: 1 });
        if (defaultTenant) {
          tenantIdentifier = defaultTenant._id.toString();
        }
      }
    }

    if (!tenantIdentifier) {
      return res.status(400).json({
        success: false,
        code: 'TENANT_REQUIRED',
        message: 'Tenant context could not be identified. Provide x-tenant-id or x-tenant-slug header.',
      });
    }

    // Resolve tenant document from Central DB
    let tenant = null;
    if (tenantIdentifier.match(/^[0-9a-fA-F]{24}$/)) {
      tenant = await Tenant.findById(tenantIdentifier);
    }
    if (!tenant) {
      tenant = await Tenant.findOne({
        $or: [
          { slug: String(tenantIdentifier).toLowerCase() },
          { code: String(tenantIdentifier).toUpperCase() },
          { primaryDomain: String(tenantIdentifier).toLowerCase() },
          { subdomain: String(tenantIdentifier).toLowerCase() },
        ],
      });
    }

    if (!tenant) {
      return res.status(404).json({
        success: false,
        code: 'TENANT_NOT_FOUND',
        message: `Tenant "${tenantIdentifier}" does not exist.`,
      });
    }

    if (tenant.status === 'suspended') {
      return res.status(403).json({
        success: false,
        code: 'TENANT_SUSPENDED',
        message: 'This salon / academy account is currently suspended. Please contact support.',
      });
    }

    // Resolve isolated or shared database connection
    const dbContext = await tenantDatabaseResolver.resolveDatabaseContext(tenant);

    req.tenant = tenant;
    req.tenantId = tenant._id.toString();
    req.tenantDb = dbContext.connection;
    req.tenantStrategy = dbContext.strategy;
    req.tenantDatabaseMode = dbContext.databaseMode;
    req.tenantDatabaseName = dbContext.databaseName;

    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      code: 'TENANT_RESOLUTION_ERROR',
      message: `Failed to resolve tenant context: ${error.message}`,
    });
  }
};

export default tenantResolverMiddleware;
