/**
 * @file separateDatabaseStrategy.js
 * @description Database strategy for physically isolated per-tenant databases.
 * @module backend/src/core/database/separateDatabaseStrategy
 */

import { tenantConnectionManager } from './tenantConnectionManager.js';

export const separateDatabaseStrategy = {
  mode: 'separate',

  /**
   * Acquire isolated dedicated Mongoose connection for tenant
   * @param {object} tenant
   * @returns {Promise<import('mongoose').Connection>}
   */
  async getConnection(tenant) {
    if (!tenant) {
      throw new Error('Tenant context required to resolve separate database');
    }

    const dbName =
      tenant.databaseConfig?.databaseName ||
      tenant.databaseName ||
      `beauty_tenant_${tenant.code || tenant._id || tenant.id}`;

    const customUri =
      (tenant.databaseConfig?.allowCustomDatabase && tenant.databaseConfig?.customUri) ||
      tenant.databaseConfig?.uri ||
      null;

    return tenantConnectionManager.getConnection(dbName, customUri);
  },

  /**
   * In separate database, isolation is physical at the database level.
   * Query conditions don't strictly require tenantId, but passing it through is safe.
   */
  enforceTenantScope(_tenantId, queryConditions = {}) {
    return queryConditions;
  },

  enforceTenantPayload(_tenantId, payload = {}) {
    return payload;
  },

  verifyOwnership(_tenantId, _record) {
    return true;
  },
};

export default separateDatabaseStrategy;
