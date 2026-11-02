/**
 * @file database.config.js
 * @description Mongoose connection options and retry policies.
 * @module backend/src/config/database.config
 */

import { env } from './env.js';

export const databaseConfig = {
  uri: env.CENTRAL_MONGODB_URI,
  options: {
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 50,
    minPoolSize: 5,
  },
};

export default databaseConfig;
