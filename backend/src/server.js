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

    // 2. Start HTTP Listener on 0.0.0.0 to accept connections from localhost and all network interfaces
    server = app.listen(env.PORT, '0.0.0.0', () => {
      console.log(`\n======================================================================`);
      console.log(`🌟 KASHI SERVICE MULTI-BUSINESS PLATFORM LIVE ON PORT ${env.PORT}`);
      console.log(`======================================================================`);
      console.log(`🚀 API Base URL:       ${env.APP_URL}${env.API_PREFIX}`);
      console.log(`⚡ Cloudflare Images:  ENABLED (Direct In-Memory Streaming)`);
      console.log(`----------------------------------------------------------------------`);
      console.log(`🔑 ADMIN & USER ACCESS PORTALS:`);
      console.log(`----------------------------------------------------------------------`);
      console.log(`1. 🏢 MASTER ADMIN DASHBOARD:`);
      console.log(`   URL:      http://localhost:3000/admin/dashboard`);
      console.log(`   Email:    admin@parlour.local   (or admin@blossom.com)`);
      console.log(`   Password: Password@123          (or Admin@123)`);
      console.log(`   * Includes 5 Business Dashboards:`);
      console.log(`     - Golden Beauty Parlour: http://localhost:3000/admin/golden-beauty-parlour`);
      console.log(`     - Event Decoration:      http://localhost:3000/admin/event-decoration`);
      console.log(`     - Plotting Real Estate:  http://localhost:3000/admin/plotting`);
      console.log(`     - Office / Rent Assets:  http://localhost:3000/admin/rent-office`);
      console.log(`     - RB Software Hub:       http://localhost:3000/admin/rb-software`);
      console.log(``);
      console.log(`2. ✂️ STAFF MEMBER PORTAL:`);
      console.log(`   URL:      http://localhost:3000/staff/login`);
      console.log(`   Email:    staff@blossom.com     (Phone: 9876543211)`);
      console.log(`   Password: Staff@123`);
      console.log(``);
      console.log(`3. 🎓 STUDENT ACADEMY PORTAL:`);
      console.log(`   URL:      http://localhost:3000/student/login`);
      console.log(`   Email:    student@blossom.com`);
      console.log(`   Password: Student@123`);
      console.log(``);
      console.log(`4. 💄 CUSTOMER BOOKING PORTAL:`);
      console.log(`   URL:      http://localhost:3000/customer/login`);
      console.log(`   Phone:    9876543210            (or customer@blossom.com)`);
      console.log(`   Password: Customer@123`);
      console.log(`======================================================================\n`);
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

process.on('uncaughtException', (err) => {
  console.error('[SERVER ERROR - UNCAUGHT EXCEPTION]:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[SERVER ERROR - UNHANDLED REJECTION]:', reason);
});

// Start server if directly executed
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  startServer();
}

export default startServer;
