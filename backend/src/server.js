/**
 * @file server.js
 * @description HTTP Server Bootstrap & Process Lifecycle Management.
 * @module backend/src/server
 */

import { app } from './app.js';
import { env } from './config/env.js';
import { connectCentralDB, disconnectCentralDB } from './database/central/central.connection.js';

let server;

export const startServer = async () => {
  try {
    console.log(`[BOOT] Initializing ${env.APP_NAME} in ${env.NODE_ENV} mode...`);

    // 1. Establish Central Database Connection
    await connectCentralDB();
    console.log('[DATABASE] Central MongoDB connected successfully.');

    // 2. Start HTTP Listener
    server = app.listen(env.PORT, () => {
      console.log(`[HTTP] Server listening on port ${env.PORT}`);
      console.log(`[HTTP] API Prefix: ${env.API_PREFIX}`);
      console.log(`[HTTP] SuperAdmin Auth Base: ${env.API_PREFIX}/superadmin/auth`);
    });

    return server;
  } catch (error) {
    console.error('[FATAL] Failed to start server:', error);
    process.exit(1);
  }
};

const handleGracefulShutdown = async (signal) => {
  console.log(`\n[SHUTDOWN] Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(() => {
      console.log('[HTTP] HTTP server closed.');
    });
  }

  try {
    await disconnectCentralDB();
    console.log('[DATABASE] Central MongoDB disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

// Start server if directly executed
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  startServer();
}

export default startServer;
