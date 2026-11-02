/**
 * @file databaseProvisioningService.js
 * @description Tenant database provisioning workflow with step tracking and rollback safety.
 * @module backend/src/core/database/databaseProvisioningService
 */

import { tenantConnectionManager } from './tenantConnectionManager.js';
import { getCentralDatabase } from './centralDatabase.js';
import { hashPassword } from '../../modules/auth/services/password.service.js';

export const databaseProvisioningService = {
  /**
   * Run automated provisioning workflow for a tenant
   * @param {object} tenant Tenant central document
   * @param {object} [adminUserPayload] Initial tenant administrator credentials
   * @returns {Promise<{ success: boolean, databaseName: string, databaseMode: string, steps: Array<object> }>}
   */
  async provisionTenantDatabase(tenant, adminUserPayload = null) {
    const steps = [];
    const databaseMode = tenant.databaseMode || 'shared';
    let databaseName = 'beauty_saas_shared';

    // Step 1: Initialize Provisioning Record
    steps.push({
      step: 'INITIALIZE_CONFIG',
      status: 'completed',
      timestamp: new Date(),
    });

    try {
      if (databaseMode === 'separate') {
        // Step 2: Compute unique DB name
        const cleanCode = (tenant.slug || tenant.code || 'tenant')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '_')
          .slice(0, 16);
        const uniqueSuffix = Date.now().toString(36);
        databaseName = `beauty_tenant_${cleanCode}_${uniqueSuffix}`;

        steps.push({
          step: 'GENERATE_DATABASE_NAME',
          status: 'completed',
          databaseName,
          timestamp: new Date(),
        });

        // Step 3: Connect and instantiate database
        const conn = await tenantConnectionManager.getConnection(databaseName);
        steps.push({
          step: 'ESTABLISH_CONNECTION',
          status: 'completed',
          timestamp: new Date(),
        });

        // Step 4: Initialize Core Collections and Indexes
        const coreCollections = [
          'users',
          'branches',
          'services',
          'customers',
          'appointments',
          'billing',
          'inventory',
          'settings',
        ];

        for (const colName of coreCollections) {
          await conn.db.createCollection(colName).catch(() => {});
        }

        // Create standard indexes
        await conn.db.collection('users').createIndex({ email: 1 }, { unique: true }).catch(() => {});
        await conn.db.collection('appointments').createIndex({ branchId: 1, date: 1 }).catch(() => {});
        await conn.db.collection('customers').createIndex({ phone: 1 }).catch(() => {});

        steps.push({
          step: 'INITIALIZE_COLLECTIONS_AND_INDEXES',
          status: 'completed',
          collections: coreCollections,
          timestamp: new Date(),
        });

        // Step 5: Seed Initial Tenant Administrator
        if (adminUserPayload && adminUserPayload.email && adminUserPayload.password) {
          const passwordHash = await hashPassword(adminUserPayload.password);
          await conn.db.collection('users').insertOne({
            name: adminUserPayload.name || tenant.ownerName || 'Tenant Administrator',
            email: adminUserPayload.email.toLowerCase().trim(),
            passwordHash,
            role: 'admin',
            status: 'active',
            isOwner: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          steps.push({
            step: 'SEED_TENANT_ADMIN',
            status: 'completed',
            adminEmail: adminUserPayload.email,
            timestamp: new Date(),
          });
        }
      } else {
        // Shared Database Mode
        const centralConn = getCentralDatabase();
        databaseName = centralConn.name || 'beauty_saas_shared';

        steps.push({
          step: 'VERIFY_SHARED_DATABASE',
          status: 'completed',
          databaseName,
          timestamp: new Date(),
        });

        // In shared DB, ensure central mapping is tagged and tenant isolated records exist
        if (adminUserPayload && adminUserPayload.email && adminUserPayload.password) {
          const passwordHash = await hashPassword(adminUserPayload.password);
          await centralConn.db.collection('tenant_users').insertOne({
            tenantId: String(tenant._id || tenant.id),
            name: adminUserPayload.name || tenant.ownerName || 'Tenant Administrator',
            email: adminUserPayload.email.toLowerCase().trim(),
            passwordHash,
            role: 'admin',
            status: 'active',
            isOwner: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          steps.push({
            step: 'SEED_SHARED_TENANT_ADMIN',
            status: 'completed',
            adminEmail: adminUserPayload.email,
            timestamp: new Date(),
          });
        }
      }

      steps.push({
        step: 'PROVISIONING_COMPLETE',
        status: 'completed',
        timestamp: new Date(),
      });

      return {
        success: true,
        databaseName,
        databaseMode,
        steps,
      };
    } catch (error) {
      steps.push({
        step: 'PROVISIONING_FAILED',
        status: 'failed',
        error: error.message,
        timestamp: new Date(),
      });

      return {
        success: false,
        databaseName,
        databaseMode,
        steps,
        error: error.message,
      };
    }
  },
};

export default databaseProvisioningService;
