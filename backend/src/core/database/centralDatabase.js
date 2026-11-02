/**
 * @file centralDatabase.js
 * @description Central Control-Plane Database Manager.
 * @module backend/src/core/database/centralDatabase
 */

import mongoose from 'mongoose';
import { env } from '../../config/env.js';

let centralConnection = null;

export const connectCentralDatabase = async (customUri = null) => {
  const uri = customUri || env.CENTRAL_MONGODB_URI || env.MONGODB_URI;
  if (centralConnection && centralConnection.readyState === 1) {
    return centralConnection;
  }

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      maxPoolSize: 50,
      minPoolSize: 5,
    });
    centralConnection = conn.connection;
    return centralConnection;
  } catch (error) {
    console.error('[DATABASE] Failed to connect to Central MongoDB:', error.message);
    throw error;
  }
};

export const getCentralDatabase = () => {
  return centralConnection || mongoose.connection;
};

export const isCentralDatabaseConnected = () => {
  return (centralConnection ? centralConnection.readyState : mongoose.connection.readyState) === 1;
};

export const disconnectCentralDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    centralConnection = null;
  }
};

export default {
  connectCentralDatabase,
  getCentralDatabase,
  isCentralDatabaseConnected,
  disconnectCentralDatabase,
};
