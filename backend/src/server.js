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
      console.log(`\n======================================================================`);
      console.log(`🌟 BEAUTY SAAS MULTI-TENANT PLATFORM STARTED LIVE ON PORT ${env.PORT}`);
      console.log(`======================================================================`);
      console.log(`🚀 API Base URL:       ${env.APP_URL}${env.API_PREFIX}`);
      console.log(`⚡ Cloudflare Images:  ENABLED (Direct In-Memory Streaming)`);
      console.log(`📡 DB Credentials:     ${env.APP_URL}${env.API_PREFIX}/common/demo-credentials`);
      console.log(`----------------------------------------------------------------------`);
      console.log(`🔑 READY-TO-USE LOGIN CREDENTIALS FOR ALL PORTALS:`);
      console.log(`----------------------------------------------------------------------`);
      console.log(`1. 👑 SUPER ADMIN PORTAL:`);
      console.log(`   URL:      http://localhost:3000/superadmin/login`);
      console.log(`   Email:    superadmin@beautysaas.local`);
      console.log(`   Password: SuperAdmin@Secure2026!`);
      console.log(``);
      console.log(`2. 🏢 SALON / STUDIO ADMIN PORTAL:`);
      console.log(`   URL:      http://localhost:3000/admin/login`);
      console.log(`   Salon ID: blossom-salon`);
      console.log(`   Email:    admin@parlour.local   (or admin@blossom.com)`);
      console.log(`   Password: Password@123          (or Admin@123)`);
      console.log(``);
      console.log(`3. ✂️ STAFF MEMBER PORTAL:`);
      console.log(`   URL:      http://localhost:3000/staff/login`);
      console.log(`   Salon ID: blossom-salon`);
      console.log(`   Email:    staff@blossom.com     (Phone: 9876543211)`);
      console.log(`   Password: Staff@123`);
      console.log(``);
      console.log(`4. 🎓 STUDENT ACADEMY PORTAL:`);
      console.log(`   URL:      http://localhost:3000/student/login`);
      console.log(`   Salon ID: blossom-salon`);
      console.log(`   Email:    student@blossom.com`);
      console.log(`   Password: Student@123`);
      console.log(``);
      console.log(`5. 💄 CUSTOMER BOOKING PORTAL:`);
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

// Start server if directly executed
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  startServer();
}

export default startServer;
