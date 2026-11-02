/**
 * @file tenantConnectionManager.js
 * @description Multi-tenant dynamic Mongoose connection pool and cache manager.
 * @module backend/src/core/database/tenantConnectionManager
 */

import mongoose from 'mongoose';
import { env } from '../../config/env.js';

class TenantConnectionManager {
  constructor() {
    /** @type {Map<string, { connection: mongoose.Connection, lastUsed: number }>} */
    this.connectionPool = new Map();
    this.maxPoolSize = 30; // Max active cached connections
    this.idleTimeoutMs = 15 * 60 * 1000; // 15 mins idle connection timeout

    // Start background idle connection cleanup timer
    this.cleanupTimer = setInterval(() => this.cleanupIdleConnections(), 60 * 1000);
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  /**
   * Resolve MongoDB URI for a separate database
   * @param {string} databaseName
   * @param {string} [customUri]
   * @returns {string}
   */
  resolveTenantUri(databaseName, customUri = null) {
    if (customUri) return customUri;

    // In test environment or when connected to MongoMemoryServer, dynamically adapt to active host/port
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const activeString = mongoose.connection._connectionString;
      if (activeString) {
        try {
          const url = new URL(activeString.startsWith('mongodb') ? activeString : `mongodb://${activeString}`);
          url.pathname = `/${databaseName}`;
          return url.toString();
        } catch {
          // fallback to string replace
          const lastSlash = activeString.lastIndexOf('/');
          const questionMark = activeString.indexOf('?');
          if (lastSlash !== -1) {
            const base = activeString.slice(0, lastSlash + 1);
            const query = questionMark !== -1 ? activeString.slice(questionMark) : '';
            return `${base}${databaseName}${query}`;
          }
        }
      }
    }

    const template = env.TENANT_MONGODB_URI_TEMPLATE || 'mongodb://127.0.0.1:27017/{dbName}';
    return template.replace('{dbName}', databaseName);
  }

  /**
   * Acquire or create a cached Mongoose connection for a tenant database
   * @param {string} databaseName
   * @param {string} [customUri]
   * @returns {Promise<mongoose.Connection>}
   */
  async getConnection(databaseName, customUri = null) {
    if (!databaseName) {
      throw new Error('Database name is required for tenant connection');
    }

    const cacheKey = databaseName.toLowerCase().trim();

    // 1. Check existing connection in pool
    if (this.connectionPool.has(cacheKey)) {
      const entry = this.connectionPool.get(cacheKey);
      if (entry.connection && entry.connection.readyState === 1) {
        entry.lastUsed = Date.now();
        return entry.connection;
      }
      // If broken or disconnected, remove from pool
      try {
        await entry.connection.close();
      } catch {
        // ignore close error
      }
      this.connectionPool.delete(cacheKey);
    }

    // 2. Ensure pool size limit before establishing new connection
    if (this.connectionPool.size >= this.maxPoolSize) {
      this.evictOldestConnection();
    }

    // 3. Establish new isolated Mongoose connection
    const targetUri = this.resolveTenantUri(databaseName, customUri);

    try {
      const connection = mongoose.createConnection(targetUri, {
        serverSelectionTimeoutMS: 8000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 1,
      });

      // Wait until connection is open
      await new Promise((resolve, reject) => {
        connection.once('open', resolve);
        connection.once('error', reject);
      });

      // Register connection lifecycle listeners
      connection.on('error', (err) => {
        console.error(`[TENANT DB ERROR: ${databaseName}]:`, err.message);
      });

      connection.on('disconnected', () => {
        this.connectionPool.delete(cacheKey);
      });

      this.connectionPool.set(cacheKey, {
        connection,
        lastUsed: Date.now(),
      });

      return connection;
    } catch (error) {
      console.error(`[TENANT DB CONNECT FAILED: ${databaseName}]:`, error.message);
      throw error;
    }
  }

  /**
   * Close a specific tenant database connection
   * @param {string} databaseName
   */
  async closeConnection(databaseName) {
    const cacheKey = databaseName.toLowerCase().trim();
    if (this.connectionPool.has(cacheKey)) {
      const entry = this.connectionPool.get(cacheKey);
      try {
        await entry.connection.close();
      } catch (err) {
        console.warn(`Error closing tenant connection ${databaseName}:`, err.message);
      }
      this.connectionPool.delete(cacheKey);
      return true;
    }
    return false;
  }

  /**
   * Evict the least recently used connection
   */
  async evictOldestConnection() {
    let oldestKey = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.connectionPool.entries()) {
      if (entry.lastUsed < oldestTime) {
        oldestTime = entry.lastUsed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      await this.closeConnection(oldestKey);
    }
  }

  /**
   * Periodic idle connection cleanup
   */
  async cleanupIdleConnections() {
    const now = Date.now();
    for (const [key, entry] of this.connectionPool.entries()) {
      if (now - entry.lastUsed > this.idleTimeoutMs) {
        await this.closeConnection(key);
      }
    }
  }

  /**
   * Close all active pooled connections
   */
  async closeAll() {
    const promises = [];
    for (const [key, entry] of this.connectionPool.entries()) {
      promises.push(entry.connection.close().catch(() => {}));
    }
    await Promise.all(promises);
    this.connectionPool.clear();
  }

  /**
   * Get active connection stats
   */
  getStats() {
    const active = [];
    for (const [key, entry] of this.connectionPool.entries()) {
      active.push({
        databaseName: key,
        readyState: entry.connection.readyState,
        idleSeconds: Math.round((Date.now() - entry.lastUsed) / 1000),
      });
    }
    return {
      activeConnectionsCount: this.connectionPool.size,
      maxPoolSize: this.maxPoolSize,
      connections: active,
    };
  }
}

export const tenantConnectionManager = new TenantConnectionManager();
export default tenantConnectionManager;
