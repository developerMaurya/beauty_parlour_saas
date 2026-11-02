#!/usr/bin/env node

/**
 * @file bootstrap-superadmin.js
 * @description Secure bootstrap script to provision the initial Super Admin account.
 *
 * Usage:
 *   node scripts/bootstrap-superadmin.js
 *   npm run bootstrap:superadmin
 *
 * Environment variables:
 *   SUPERADMIN_BOOTSTRAP_NAME (default: 'Master Super Admin')
 *   SUPERADMIN_BOOTSTRAP_EMAIL (required or via env)
 *   SUPERADMIN_BOOTSTRAP_USERNAME (required or via env)
 *   SUPERADMIN_BOOTSTRAP_PASSWORD (required or via env)
 */

import { env } from '../src/config/env.js';
import { connectCentralDB, disconnectCentralDB } from '../src/database/central/central.connection.js';
import { SuperAdmin } from '../src/modules/auth/models/super-admin.model.js';
import { hashPassword, validatePasswordStrength } from '../src/modules/auth/services/password.service.js';
import { ROLES, ACCOUNT_STATUS } from '../src/modules/auth/constants/auth.constants.js';

export const bootstrapSuperAdmin = async (customParams = null) => {
  const name = customParams?.name || env.SUPERADMIN_BOOTSTRAP_NAME || 'Master Super Admin';
  const email = (customParams?.email || env.SUPERADMIN_BOOTSTRAP_EMAIL || '').toLowerCase().trim();
  const username = (customParams?.username || env.SUPERADMIN_BOOTSTRAP_USERNAME || '').toLowerCase().trim();
  const password = customParams?.password || env.SUPERADMIN_BOOTSTRAP_PASSWORD;

  if (!email || !username || !password) {
    console.error('[ERROR] Missing bootstrap credentials.');
    console.error('Please configure SUPERADMIN_BOOTSTRAP_EMAIL, SUPERADMIN_BOOTSTRAP_USERNAME, and SUPERADMIN_BOOTSTRAP_PASSWORD in your .env');
    return { success: false, reason: 'MISSING_CREDENTIALS' };
  }

  // Validate email format
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    console.error(`[ERROR] Invalid email address: ${email}`);
    return { success: false, reason: 'INVALID_EMAIL' };
  }

  // Validate password strength
  const strength = validatePasswordStrength(password);
  if (!strength.isValid) {
    console.error(`[ERROR] Password does not meet security requirements: ${strength.message}`);
    return { success: false, reason: 'WEAK_PASSWORD' };
  }

  try {
    // 1. Check if Super Admin already exists by email or username
    const existing = await SuperAdmin.findOne({
      $or: [{ email }, { username }],
    });

    if (existing) {
      console.log(`[INFO] Super Admin account already exists (ID: ${existing._id}, Email: ${existing.email}).`);
      console.log('[INFO] Skipping creation. No duplicate account created.');
      return { success: true, created: false, user: existing };
    }

    // 2. Hash password securely using bcrypt
    const passwordHash = await hashPassword(password);

    // 3. Create Super Admin
    const superAdmin = await SuperAdmin.create({
      name,
      email,
      username,
      passwordHash,
      role: ROLES.SUPER_ADMIN,
      status: ACCOUNT_STATUS.ACTIVE,
      isEmailVerified: true,
    });

    console.log('[SUCCESS] Super Admin account successfully created!');
    console.log(`  ID:       ${superAdmin._id}`);
    console.log(`  Name:     ${superAdmin.name}`);
    console.log(`  Email:    ${superAdmin.email}`);
    console.log(`  Username: ${superAdmin.username}`);
    console.log(`  Role:     ${superAdmin.role}`);
    console.log('  Password: [PROTECTED]');

    return { success: true, created: true, user: superAdmin };
  } catch (error) {
    console.error('[ERROR] Failed to bootstrap Super Admin:', error.message);
    throw error;
  }
};

// If run directly from CLI
if (process.argv[1] && process.argv[1].endsWith('bootstrap-superadmin.js')) {
  (async () => {
    try {
      await connectCentralDB();
      await bootstrapSuperAdmin();
      await disconnectCentralDB();
      process.exit(0);
    } catch {
      await disconnectCentralDB();
      process.exit(1);
    }
  })();
}

export default bootstrapSuperAdmin;
