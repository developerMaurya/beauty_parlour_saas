/**
 * @file bootstrap.test.js
 * @description Automated test for Super Admin initial account bootstrap script.
 */

process.env.NODE_ENV = 'test';

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { bootstrapSuperAdmin } from '../scripts/bootstrap-superadmin.js';
import { SuperAdmin } from '../src/modules/auth/models/super-admin.model.js';
import { comparePassword } from '../src/modules/auth/services/password.service.js';

describe('Bootstrap Super Admin Script', () => {
  let mongoServer;

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoose.connect(uri);
  });

  after(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  test('Creates initial Super Admin account when none exists', async () => {
    const result = await bootstrapSuperAdmin({
      name: 'Initial Admin',
      email: 'initadmin@beautysaas.local',
      username: 'initadmin',
      password: 'BootstrapPassword@2026!',
    });

    assert.equal(result.success, true);
    assert.equal(result.created, true);

    const createdAdmin = await SuperAdmin.findOne({ email: 'initadmin@beautysaas.local' }).select('+passwordHash');
    assert.ok(createdAdmin);
    assert.equal(createdAdmin.role, 'superadmin');
    assert.equal(createdAdmin.status, 'active');

    // Verify password was hashed with bcrypt
    const passwordMatches = await comparePassword('BootstrapPassword@2026!', createdAdmin.passwordHash);
    assert.equal(passwordMatches, true);
    assert.notEqual(createdAdmin.passwordHash, 'BootstrapPassword@2026!');
  });

  test('Is idempotent and safely skips creation on re-run without duplicate accounts', async () => {
    const secondRun = await bootstrapSuperAdmin({
      name: 'Initial Admin',
      email: 'initadmin@beautysaas.local',
      username: 'initadmin',
      password: 'BootstrapPassword@2026!',
    });

    assert.equal(secondRun.success, true);
    assert.equal(secondRun.created, false);

    const totalAdmins = await SuperAdmin.countDocuments({ email: 'initadmin@beautysaas.local' });
    assert.equal(totalAdmins, 1, 'Must never duplicate bootstrap account');
  });

  test('Rejects weak password', async () => {
    const weakRun = await bootstrapSuperAdmin({
      name: 'Weak Admin',
      email: 'weakadmin@beautysaas.local',
      username: 'weakadmin',
      password: 'weak',
    });

    assert.equal(weakRun.success, false);
    assert.equal(weakRun.reason, 'WEAK_PASSWORD');
  });
});
