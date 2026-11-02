/**
 * @file sharedDatabaseStrategy.js
 * @description Database strategy for shared multi-tenant database isolation.
 * @module backend/src/core/database/sharedDatabaseStrategy
 */

import { getCentralDatabase } from './centralDatabase.js';

export const sharedDatabaseStrategy = {
  mode: 'shared',

  /**
   * Acquire database connection for shared mode (Central/Shared MongoDB instance)
   * @param {object} tenant
   * @returns {Promise<import('mongoose').Connection>}
   */
  async getConnection(_tenant) {
    return getCentralDatabase();
  },

  /**
   * Enforce tenantId isolation filter on query conditions
   * @param {string} tenantId
   * @param {object} [queryConditions={}]
   * @returns {object} Scoped query condition
   */
  enforceTenantScope(tenantId, queryConditions = {}) {
    if (!tenantId) {
      throw new Error('Tenant ID context is mandatory for shared database isolation');
    }
    return {
      ...queryConditions,
      tenantId: String(tenantId),
    };
  },

  /**
   * Enforce tenantId on insert/update payload
   * @param {string} tenantId
   * @param {object} payload
   * @returns {object} Payload with immutable tenantId
   */
  enforceTenantPayload(tenantId, payload = {}) {
    if (!tenantId) {
      throw new Error('Tenant ID context is mandatory for shared database isolation');
    }
    return {
      ...payload,
      tenantId: String(tenantId),
    };
  },

  /**
   * Verify an existing record belongs strictly to the authenticated tenant
   * @param {string} tenantId
   * @param {object} record
   * @returns {boolean}
   */
  verifyOwnership(tenantId, record) {
    if (!record || !record.tenantId) return false;
    return String(record.tenantId) === String(tenantId);
  },
};

export default sharedDatabaseStrategy;
