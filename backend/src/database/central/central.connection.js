/**
 * @file central.connection.js
 * @description Central MongoDB Database connection provider and lifecycle manager.
 * @module backend/src/database/central/connection
 */

import mongoose from 'mongoose';
import { databaseConfig } from '../../config/database.config.js';

let isConnected = false;

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
    await mongoose.connect(uri, databaseConfig.options);
    isConnected = true;
    return mongoose;
  } catch (error) {
    console.error('Failed to connect to Central MongoDB:', error.message);
    throw error;
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
