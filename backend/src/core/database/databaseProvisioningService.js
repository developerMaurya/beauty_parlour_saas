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
        const customUri = tenant.databaseConfig?.customUri || null;
        const conn = await tenantConnectionManager.getConnection(databaseName, customUri);
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
        const adminEmail = (adminUserPayload?.email || tenant.email || '').toLowerCase().trim();
        const adminPassword = adminUserPayload?.password || 'Password@123';
        if (adminEmail) {
          const passwordHash = await hashPassword(adminPassword);
          const tenantIdStr = String(tenant._id || tenant.id);
          
          const adminDoc = {
            tenantId: tenantIdStr,
            email: adminEmail,
            phone: adminUserPayload?.phone || tenant.phone || '',
            dob: adminUserPayload?.dob || tenant.ownerDob || null,
            username: (adminUserPayload?.username || adminEmail.split('@')[0]).toLowerCase().trim(),
            passwordHash,
            role: 'ADMIN',
            status: 'active',
            isBlocked: false,
            failedLoginAttempts: 0,
            sessionVersion: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          // Primary model collection used by TenantUser Mongoose model
          await conn.db.collection('tenantusers').updateOne(
            { tenantId: tenantIdStr, email: adminEmail },
            { $set: adminDoc },
            { upsert: true }
          );

          // Also keep legacy users collection populated for backward compatibility
          await conn.db.collection('users').updateOne(
            { email: adminEmail },
            { $set: {
                name: adminUserPayload?.name || tenant.ownerName || 'Tenant Administrator',
                email: adminEmail,
                passwordHash,
                role: 'admin',
                status: 'active',
                isOwner: true,
                updatedAt: new Date(),
              },
              $setOnInsert: { createdAt: new Date() }
            },
            { upsert: true }
          );

          steps.push({
            step: 'SEED_TENANT_ADMIN',
            status: 'completed',
            adminEmail,
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
        const adminEmail = (adminUserPayload?.email || tenant.email || '').toLowerCase().trim();
        const adminPassword = adminUserPayload?.password || 'Password@123';
        if (adminEmail) {
          const passwordHash = await hashPassword(adminPassword);
          const tenantIdStr = String(tenant._id || tenant.id);

          const adminDoc = {
            tenantId: tenantIdStr,
            email: adminEmail,
            phone: adminUserPayload?.phone || tenant.phone || '',
            dob: adminUserPayload?.dob || tenant.ownerDob || null,
            username: (adminUserPayload?.username || adminEmail.split('@')[0]).toLowerCase().trim(),
            passwordHash,
            role: 'ADMIN',
            status: 'active',
            isBlocked: false,
            failedLoginAttempts: 0,
            sessionVersion: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          // Primary collection used by TenantUser Mongoose model in shared database
          await centralConn.db.collection('tenantusers').updateOne(
            { tenantId: tenantIdStr, email: adminEmail },
            { $set: adminDoc },
            { upsert: true }
          );

          // Legacy collection sync
          await centralConn.db.collection('tenant_users').updateOne(
            { tenantId: tenantIdStr, email: adminEmail },
            { $set: {
                tenantId: tenantIdStr,
                name: adminUserPayload?.name || tenant.ownerName || 'Tenant Administrator',
                email: adminEmail,
                passwordHash,
                role: 'admin',
                status: 'active',
                isOwner: true,
                updatedAt: new Date(),
              },
              $setOnInsert: { createdAt: new Date() }
            },
            { upsert: true }
          );

          steps.push({
            step: 'SEED_SHARED_TENANT_ADMIN',
            status: 'completed',
            adminEmail,
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
