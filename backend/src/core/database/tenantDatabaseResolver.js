/**
 * @file tenantDatabaseResolver.js
 * @description Dynamic Tenant Database Resolver supporting Hybrid Multi-Database Architecture.
 * @module backend/src/core/database/tenantDatabaseResolver
 */

import { sharedDatabaseStrategy } from './sharedDatabaseStrategy.js';
import { separateDatabaseStrategy } from './separateDatabaseStrategy.js';

export const tenantDatabaseResolver = {
  /**
   * Resolve strategy based on tenant databaseMode
   * @param {string} [databaseMode='shared']
   */
  getStrategy(databaseMode = 'shared') {
    if (databaseMode === 'separate' || databaseMode === 'custom_uri') {
      return separateDatabaseStrategy;
    }
    return sharedDatabaseStrategy;
  },

  /**
   * Resolve active connection and database context for a tenant
   * @param {object} tenant
   * @returns {Promise<{ strategy: object, connection: import('mongoose').Connection, databaseMode: string, databaseName: string }>}
   */
  async resolveDatabaseContext(tenant) {
    if (!tenant) {
      throw new Error('Tenant record is required for database resolution');
    }

    const databaseMode = tenant.databaseMode || 'shared';
    const strategy = this.getStrategy(databaseMode);
    const connection = await strategy.getConnection(tenant);

    const databaseName =
      databaseMode === 'separate'
        ? tenant.databaseConfig?.databaseName || `beauty_tenant_${tenant.code || tenant._id}`
        : connection.name || 'beauty_saas_shared';

    return {
      strategy,
      connection,
      databaseMode,
      databaseName,
    };
  },

  /**
   * Express middleware to attach resolved tenant database connection to `req.tenantDb`
   */
  middleware() {
    return async (req, res, next) => {
      try {
        if (!req.tenant) {
          return next();
        }

        const context = await this.resolveDatabaseContext(req.tenant);
        req.tenantDb = context.connection;
        req.tenantStrategy = context.strategy;
        req.tenantDatabaseMode = context.databaseMode;
        req.tenantDatabaseName = context.databaseName;

        return next();
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: `Tenant database resolution failed: ${error.message}`,
          errors: [],
        });
      }
    };
  },
};

export default tenantDatabaseResolver;
