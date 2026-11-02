/**
 * @file databaseHealthService.js
 * @description Health diagnostic service for central, shared, and separate tenant databases.
 * @module backend/src/core/database/databaseHealthService
 */

import { getCentralDatabase } from './centralDatabase.js';
import { tenantConnectionManager } from './tenantConnectionManager.js';

export const databaseHealthService = {
  /**
   * Check connection health of a specific Mongoose Connection
   * @param {import('mongoose').Connection} conn
   * @returns {Promise<object>}
   */
  async checkConnectionHealth(conn) {
    if (!conn) {
      return { status: 'unhealthy', message: 'No connection provided', readyState: 0 };
    }

    const start = Date.now();
    try {
      if (conn.readyState !== 1) {
        return {
          status: 'disconnected',
          readyState: conn.readyState,
          databaseName: conn.name,
          latencyMs: null,
        };
      }

      // Execute ping command
      const pingResult = await conn.db.admin().ping();
      const latencyMs = Date.now() - start;

      // Fetch collections
      const collections = await conn.db.listCollections().toArray();

      return {
        status: 'healthy',
        readyState: conn.readyState,
        databaseName: conn.name,
        host: conn.host,
        port: conn.port,
        latencyMs,
        collectionsCount: collections.length,
        collections: collections.map((c) => c.name),
        ping: pingResult,
      };
    } catch (error) {
      return {
        status: 'error',
        readyState: conn.readyState,
        databaseName: conn.name || 'unknown',
        error: error.message,
        latencyMs: Date.now() - start,
      };
    }
  },

  /**
   * Health check for Central Database
   */
  async checkCentralHealth() {
    const conn = getCentralDatabase();
    return this.checkConnectionHealth(conn);
  },

  /**
   * Health check for a tenant database
   * @param {string} databaseName
   * @param {string} [customUri]
   */
  async checkTenantDatabaseHealth(databaseName, customUri = null) {
    try {
      const conn = await tenantConnectionManager.getConnection(databaseName, customUri);
      return this.checkConnectionHealth(conn);
    } catch (error) {
      return {
        status: 'error',
        databaseName,
        error: error.message,
      };
    }
  },

  /**
   * Diagnostic summary across all managed databases
   */
  async getFullDiagnostics() {
    const central = await this.checkCentralHealth();
    const poolStats = tenantConnectionManager.getStats();

    return {
      timestamp: new Date().toISOString(),
      centralDatabase: central,
      connectionPool: poolStats,
    };
  },
};

export default databaseHealthService;
