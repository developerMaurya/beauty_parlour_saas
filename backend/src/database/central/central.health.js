/**
 * @file central.health.js
 * @description Central database connection health checking utility.
 * @module backend/src/database/central/health
 */

import mongoose from 'mongoose';

export const checkCentralDBHealth = () => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    status: state === 1 ? 'healthy' : 'unhealthy',
    state: states[state] || 'unknown',
    database: mongoose.connection.name || null,
    host: mongoose.connection.host || null,
  };
};

export default checkCentralDBHealth;
