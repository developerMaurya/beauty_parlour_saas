/**
 * @file central.connection.js
 * @description Central MongoDB Database connection provider and lifecycle manager.
 * Supports primary Atlas connection with automatic in-memory fallback when offline/sandbox.
 * @module backend/src/database/central/connection
 */

import mongoose from 'mongoose';
import { databaseConfig } from '../../config/database.config.js';

let isConnected = false;
let mongodInstance = null;

/**
 * Connect to Central MongoDB
 * @param {string} [customUri] Optional connection URI override (useful for test database)
 * @returns {Promise<typeof mongoose>}
 */
export const connectCentralDB = async (customUri = null) => {
  const uri = customUri || databaseConfig.uri;

  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  try {
    // Attempt standard connection with 5s timeout
    await mongoose.connect(uri, {
      ...databaseConfig.options,
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
    });
    isConnected = true;
    return mongoose;
  } catch (error) {
    console.warn(`[DATABASE] Atlas connection failed (${error.message}). Attempting In-Memory MongoDB fallback...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memUri = mongodInstance.getUri();
      await mongoose.connect(memUri);
      isConnected = true;
      console.log(`[DATABASE] ✅ In-Memory MongoDB fallback connected at: ${memUri}`);

      // Auto-seed demo tenants & credentials in memory so login works immediately
      try {
        const { seedDemoTenant } = await import('../../../scripts/seed-demo-tenant.js');
        await seedDemoTenant();
        console.log('[DATABASE] ✅ In-Memory demo tenant (blossom-salon) seeded.');
      } catch (seedErr) {
        console.warn('[DATABASE] In-memory seed warning:', seedErr.message);
      }

      return mongoose;
    } catch (memErr) {
      console.error('Failed to start in-memory MongoDB fallback:', memErr.message);
      throw error;
    }
  }
};

/**
 * Disconnect from Central MongoDB
 * @returns {Promise<void>}
 */
export const disconnectCentralDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
  }
  if (mongodInstance) {
    await mongodInstance.stop();
    mongodInstance = null;
  }
};

/**
 * Get current mongoose connection instance
 */
export const getCentralDBConnection = () => {
  return mongoose.connection;
};

export default {
  connectCentralDB,
  disconnectCentralDB,
  getCentralDBConnection,
};
