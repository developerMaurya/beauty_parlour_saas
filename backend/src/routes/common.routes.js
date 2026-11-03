/**
 * @file common.routes.js
 * @description System health and utility routes.
 * @module backend/src/routes/common.routes
 */

import { Router } from 'express';
import { Tenant } from '../modules/superadmin/tenants/models/tenant.model.js';
import { tenantDatabaseResolver } from '../core/database/tenantDatabaseResolver.js';
import { checkCentralDBHealth } from '../database/central/central.health.js';
import { sendSuccess } from '../utils/response.utils.js';

const router = Router();

router.get('/health', (_req, res) => {
  return sendSuccess(res, 'System operational', {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: checkCentralDBHealth(),
  });
});

/**
 * GET /api/v1/common/demo-credentials
 * Dynamically queries MongoDB for active demo tenant & users so frontend never relies on hardcoded strings.
 */
router.get('/demo-credentials', async (_req, res) => {
  try {
    let tenant = await Tenant.findOne({ slug: 'blossom-salon' });
    if (!tenant) {
      tenant = await Tenant.findOne({ status: { $in: ['active', 'trial'] } }).sort({ createdAt: 1 });
    }

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'No active tenant found in database. Please run demo seeder.',
      });
    }

    let adminEmail = 'admin@parlour.local';
    let staffEmail = 'staff@blossom.com';
    let studentEmail = 'student@blossom.com';
    let customerPhone = '9876543210';

    try {
      const dbContext = await tenantDatabaseResolver.resolveDatabaseContext(tenant);
      const conn = dbContext.connection;
      const UserModel = conn.model('User');
      const adminUser = await UserModel.findOne({ tenantId: tenant._id.toString(), role: { $in: ['TENANT_ADMIN', 'OWNER', 'BRANCH_MANAGER'] } });
      if (adminUser) {
        adminEmail = adminUser.email;
      }
    } catch {
      // Use standard seeded default if resolution is cached
    }

    return res.status(200).json({
      success: true,
      message: 'Demo credentials retrieved dynamically from MongoDB',
      data: {
        tenant: {
          id: tenant._id.toString(),
          name: tenant.name,
          slug: tenant.slug,
          primaryDomain: tenant.primaryDomain,
          status: tenant.status,
          isDomainActive: tenant.domainAccess?.isDomainActive ?? true,
          branding: tenant.branding,
        },
        credentials: {
          admin: {
            tenantSlug: tenant.slug,
            email: adminEmail,
            password: 'Password@123',
          },
          staff: {
            tenantSlug: tenant.slug,
            email: staffEmail,
            password: 'Staff@123',
          },
          student: {
            tenantSlug: tenant.slug,
            email: studentEmail,
            password: 'Student@123',
          },
          customer: {
            phoneOrEmail: customerPhone,
            password: 'Customer@123',
          },
          superadmin: {
            email: 'superadmin@beautysaas.local',
            password: 'SuperAdmin@Secure2026!',
          },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching demo credentials:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve demo credentials',
      error: error.message,
    });
  }
});

/**
 * GET /api/v1/common/domain-status
 * Check if a custom domain or slug is allowed and active by SuperAdmin.
 */
router.get('/domain-status', async (req, res) => {
  try {
    const { domain, slug } = req.query;
    const query = {};
    if (domain) query.primaryDomain = domain.toLowerCase();
    else if (slug) query.slug = slug.toLowerCase();
    else {
      return res.status(400).json({ success: false, message: 'domain or slug query parameter required' });
    }

    const tenant = await Tenant.findOne(query);
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant or domain not found' });
    }

    const isAllowed = tenant.domainAccess?.customDomainAllowed ?? false;
    const isActive = tenant.domainAccess?.isDomainActive ?? true;
    const isSuspended = tenant.status === 'suspended';

    return res.status(200).json({
      success: true,
      data: {
        tenantName: tenant.name,
        slug: tenant.slug,
        primaryDomain: tenant.primaryDomain,
        customDomainAllowed: isAllowed,
        isDomainActive: isActive,
        isSuspended,
        isOperational: !isSuspended && isActive,
        restrictedMessage:
          tenant.domainAccess?.restrictedMessage ||
          'Connect to Super Admin for access to your website portal.',
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
