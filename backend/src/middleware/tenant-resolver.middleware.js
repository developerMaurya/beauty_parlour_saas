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
    let tenantIdentifier = req.headers['x-tenant-id'] || 
                           req.headers['x-tenant-slug'] || 
                           req.headers['x-tenant-domain'] || 
                           req.query.tenantId || 
                           req.query.tenantSlug || 
                           req.query.tenant;

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

    // If not provided in headers, check login body for email or username to auto-resolve tenant
    if (!tenantIdentifier && req.body && (req.body.email || req.body.username || req.body.identifier)) {
      try {
        const { getTenantModel } = await import('../database/tenant/tenantModels.js');
        const TenantUserModel = getTenantModel(null, 'TenantUser');
        const lookupKey = (req.body.email || req.body.username || req.body.identifier).toLowerCase().trim();
        const matchedUser = await TenantUserModel.findOne({
          $or: [{ email: lookupKey }, { username: lookupKey }],
        });
        if (matchedUser && matchedUser.tenantId) {
          tenantIdentifier = matchedUser.tenantId.toString();
        }
      } catch (e) {
        // Safe fallback
      }
    }

    // Inspect Host header / Forwarded Host for Subdomain or Custom White-Label Domain
    const rawHost = (req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
    const host = rawHost.split(':')[0].toLowerCase();

    if (!tenantIdentifier && host) {
      // 1. Localhost Subdomain: e.g. glamour.localhost or glamour-academy.localhost
      if (host.endsWith('.localhost')) {
        const sub = host.replace('.localhost', '').trim();
        if (sub && !['api', 'admin', 'www', 'superadmin', 'app'].includes(sub)) {
          tenantIdentifier = sub;
        }
      }
      // 2. Kashi Service Platform Subdomain: e.g. glamour.kashiservice.com
      else if (host.endsWith('.kashiservice.com')) {
        const sub = host.replace('.kashiservice.com', '').trim();
        if (sub && !['api', 'admin', 'www', 'superadmin', 'app', 'cname'].includes(sub)) {
          tenantIdentifier = sub;
        }
      }
      // 3. Generic Multi-Part Subdomain (e.g. salon1.beautysaas.local)
      else if (host.includes('.')) {
        const parts = host.split('.');
        if (parts.length >= 3 && !['api', 'admin', 'www', 'superadmin', 'app'].includes(parts[0])) {
          tenantIdentifier = parts[0];
        } else if (host !== 'localhost' && !/^(\d{1,3}\.){3}\d{1,3}$/.test(host)) {
          // 4. White-Label Custom Domain: e.g. www.glamourbeauty.com or glamourbeauty.com
          tenantIdentifier = host.replace(/^www\./, '');
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
      const cleanIdent = String(tenantIdentifier).toLowerCase().trim();
      const cleanWithoutWww = cleanIdent.replace(/^www\./, '');
      tenant = await Tenant.findOne({
        $or: [
          { slug: cleanIdent },
          { slug: cleanWithoutWww },
          { subdomain: cleanIdent },
          { subdomain: cleanWithoutWww },
          { primaryDomain: cleanIdent },
          { primaryDomain: cleanWithoutWww },
          { primaryDomain: `www.${cleanWithoutWww}` },
          { code: cleanIdent.toUpperCase() },
        ],
      });
    }

    if (!tenant) {
      const cleanIdent = String(tenantIdentifier).toLowerCase().trim();
      const cleanWithoutWww = cleanIdent.replace(/^www\./, '');
      const { Domain } = await import('../modules/superadmin/domains/models/domain.model.js');
      const domainDoc = await Domain.findOne({
        domain: { $in: [cleanIdent, cleanWithoutWww, `www.${cleanWithoutWww}`] },
      });
      if (domainDoc && domainDoc.tenantId) {
        tenant = await Tenant.findById(domainDoc.tenantId);
      }
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

    // Domain Access Check (Controlled by Super Admin)
    const hostHeader = (req.headers.host || '').split(':')[0].toLowerCase();
    const isCustomDomainRequest = tenant.primaryDomain && hostHeader === tenant.primaryDomain.toLowerCase();

    if (isCustomDomainRequest && (!tenant.domainAccess?.customDomainAllowed || tenant.domainAccess?.isDomainActive === false)) {
      return res.status(403).json({
        success: false,
        code: 'DOMAIN_ACCESS_SUSPENDED',
        message: tenant.domainAccess?.restrictedMessage || 'Connect to Super Admin for access to your website portal.',
        details: {
          tenantName: tenant.name,
          domain: tenant.primaryDomain,
          contactAdmin: true,
        },
      });
    }

    // IP Whitelisting Check (Controlled by Tenant / Super Admin)
    if (tenant.securityConfig?.ipWhitelistEnabled && tenant.securityConfig?.whitelistedIps?.length > 0) {
      const clientIp = (req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || req.ip || '').trim();
      const isAllowed = tenant.securityConfig.whitelistedIps.some(
        (allowedIp) => allowedIp === clientIp || allowedIp === '127.0.0.1' || allowedIp === '::1' || clientIp.includes(allowedIp)
      );

      if (!isAllowed) {
        return res.status(403).json({
          success: false,
          code: 'IP_NOT_WHITELISTED',
          message: `Access denied. Your IP address (${clientIp}) is not authorized to access this portal. Please contact your administrator.`,
        });
      }
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
