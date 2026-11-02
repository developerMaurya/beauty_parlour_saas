/**
 * @file auth.test.js
 * @description Comprehensive automated test suite for Super Admin JWT Authentication System.
 */

process.env.NODE_ENV = 'test';

import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import { createApp } from '../src/app.js';
import { env } from '../src/config/env.js';
import { SuperAdmin } from '../src/modules/auth/models/super-admin.model.js';
import { Session } from '../src/modules/auth/models/session.model.js';
import { PasswordReset } from '../src/modules/auth/models/password-reset.model.js';
import { hashPassword } from '../src/modules/auth/services/password.service.js';
import { hashToken, generateRandomToken } from '../src/modules/auth/utils/crypto.utils.js';
import { ROLES, ACCOUNT_STATUS, TOKEN_TYPES } from '../src/modules/auth/constants/auth.constants.js';

describe('Phase 02 — Super Admin JWT Authentication API System', () => {
  let mongoServer;
  let app;

  const defaultPassword = 'SuperAdmin@Secure2026!';
  const defaultEmail = 'superadmin@beautysaas.local';
  const defaultUsername = 'superadmin';

  before(async () => {
    // Start isolated in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoose.connect(uri);

    // Initialize express application
    app = createApp();
  });

  after(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  beforeEach(async () => {
    // Reset collections before each test for clean test isolation
    await SuperAdmin.deleteMany({});
    await Session.deleteMany({});
    await PasswordReset.deleteMany({});

    // Seed standard test Super Admin
    const passwordHash = await hashPassword(defaultPassword);
    await SuperAdmin.create({
      name: 'Test Super Admin',
      email: defaultEmail,
      username: defaultUsername,
      passwordHash,
      role: ROLES.SUPER_ADMIN,
      status: ACCOUNT_STATUS.ACTIVE,
      isEmailVerified: true,
    });
  });

  // Helper to extract cookie value
  const extractCookie = (res, cookieName) => {
    const cookies = res.headers['set-cookie'];
    if (!cookies) return null;
    const cookieHeader = Array.isArray(cookies) ? cookies.find((c) => c.startsWith(`${cookieName}=`)) : cookies;
    if (!cookieHeader) return null;
    return cookieHeader.split(';')[0].split('=')[1];
  };

  // 1. Successful login
  test('1. Successful login returns access token, user profile, and sets HttpOnly refresh cookie', async () => {
    const res = await request(app)
      .post('/api/v1/superadmin/auth/login')
      .send({ email: defaultEmail, password: defaultPassword });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.accessToken);
    assert.equal(res.body.data.user.email, defaultEmail);
    assert.equal(res.body.data.user.role, 'superadmin');
    assert.equal(res.body.data.user.passwordHash, undefined, 'passwordHash must never be returned');

    // Check HttpOnly cookie
    const refreshCookie = extractCookie(res, 'refreshToken');
    assert.ok(refreshCookie, 'refreshToken cookie must be set');
    assert.ok(res.headers['set-cookie'][0].includes('HttpOnly'));

    // Verify session was created in DB
    const session = await Session.findOne({ userId: res.body.data.user.id });
    assert.ok(session);
    assert.equal(session.revokedAt, null);
  });

  // 2. Incorrect password
  test('2. Incorrect password returns 401 with generic message and increments failed attempts', async () => {
    const res = await request(app)
      .post('/api/v1/superadmin/auth/login')
      .send({ email: defaultEmail, password: 'WrongPassword123!' });

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.message, 'Invalid credentials');

    const admin = await SuperAdmin.findOne({ email: defaultEmail });
    assert.equal(admin.loginAttempts, 1);
  });

  // 3. Invalid email or username
  test('3. Invalid email or username returns 401 with generic message', async () => {
    const res = await request(app)
      .post('/api/v1/superadmin/auth/login')
      .send({ email: 'nonexistent@beautysaas.local', password: defaultPassword });

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.message, 'Invalid credentials');
  });

  // 4. Inactive account
  test('4. Inactive account is rejected with 403 Forbidden', async () => {
    await SuperAdmin.updateOne({ email: defaultEmail }, { status: ACCOUNT_STATUS.INACTIVE });

    const res = await request(app)
      .post('/api/v1/superadmin/auth/login')
      .send({ email: defaultEmail, password: defaultPassword });

    assert.equal(res.status, 403);
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /inactive/i);
  });

  // 5. Suspended account
  test('5. Suspended account is rejected with 403 Forbidden', async () => {
    await SuperAdmin.updateOne({ email: defaultEmail }, { status: ACCOUNT_STATUS.SUSPENDED });

    const res = await request(app)
      .post('/api/v1/superadmin/auth/login')
      .send({ email: defaultEmail, password: defaultPassword });

    assert.equal(res.status, 403);
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /suspended/i);
  });

  // 6. Account lockout after repeated failed attempts
  test('6. Account lockout after repeated failed attempts locks account for 15 minutes', async () => {
    // 5 consecutive failed attempts
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/v1/superadmin/auth/login')
        .send({ email: defaultEmail, password: 'WrongPassword123!' });
    }

    const admin = await SuperAdmin.findOne({ email: defaultEmail });
    assert.equal(admin.loginAttempts, 5);
    assert.ok(admin.lockUntil);
    assert.ok(admin.lockUntil.getTime() > Date.now());

    // 6th attempt with correct password should still be rejected as Locked (423)
    const lockedRes = await request(app)
      .post('/api/v1/superadmin/auth/login')
      .send({ email: defaultEmail, password: defaultPassword });

    assert.equal(lockedRes.status, 423);
    assert.equal(lockedRes.body.success, false);
    assert.match(lockedRes.body.message, /locked/i);
  });

  // 7. Successful token refresh
  test('7. Successful token refresh rotates refresh token and returns new access token', async () => {
    const loginRes = await request(app)
      .post('/api/v1/superadmin/auth/login')
      .send({ email: defaultEmail, password: defaultPassword });

    const initialRefreshToken = extractCookie(loginRes, 'refreshToken');
    const initialAccessToken = loginRes.body.data.accessToken;

    // Send refresh request with cookie
    const refreshRes = await request(app)
      .post('/api/v1/superadmin/auth/refresh')
      .set('Cookie', `refreshToken=${initialRefreshToken}`);

    assert.equal(refreshRes.status, 200);
    assert.equal(refreshRes.body.success, true);
    assert.ok(refreshRes.body.data.accessToken);
    assert.notEqual(refreshRes.body.data.accessToken, initialAccessToken);

    const rotatedRefreshToken = extractCookie(refreshRes, 'refreshToken');
    assert.ok(rotatedRefreshToken);
    assert.notEqual(rotatedRefreshToken, initialRefreshToken, 'Refresh token must be rotated');
  });

  // 8. Expired refresh token
  test('8. Expired refresh token is rejected with 401 Unauthorized', async () => {
    const loginRes = await request(app)
      .post('/api/v1/superadmin/auth/login')
      .send({ email: defaultEmail, password: defaultPassword });

    const user = await SuperAdmin.findOne({ email: defaultEmail });

    // Manually create an expired JWT refresh token
    const expiredToken = jwt.sign(
      { sub: user._id.toString(), sessionId: 'fake-session', tokenType: TOKEN_TYPES.REFRESH },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '-10s', issuer: env.JWT_ISSUER, audience: env.JWT_AUDIENCE }
    );

    const res = await request(app)
      .post('/api/v1/superadmin/auth/refresh')
      .set('Cookie', `refreshToken=${expiredToken}`);

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /expired/i);
  });

  // 9. Refresh token reuse detection
  test('9. Refresh token reuse triggers security mitigation and revokes the compromised session', async () => {
    // 1. Initial Login
    const loginRes = await request(app)
      .post('/api/v1/superadmin/auth/login')
      .send({ email: defaultEmail, password: defaultPassword });

    const token1 = extractCookie(loginRes, 'refreshToken');

    // 2. Legitimate Refresh -> token1 is rotated to token2
    const refreshRes1 = await request(app)
      .post('/api/v1/superadmin/auth/refresh')
      .set('Cookie', `refreshToken=${token1}`);

    assert.equal(refreshRes1.status, 200);
    const token2 = extractCookie(refreshRes1, 'refreshToken');

    // 3. Attacker replays OLD token1!
    const reuseAttackRes = await request(app)
      .post('/api/v1/superadmin/auth/refresh')
      .set('Cookie', `refreshToken=${token1}`);

    assert.equal(reuseAttackRes.status, 403);
    assert.equal(reuseAttackRes.body.success, false);
    assert.match(reuseAttackRes.body.message, /reuse detected/i);

    // 4. Verify session is now revoked in database
    const session = await Session.findOne({ replacedByTokenHash: hashToken(token1) });
    assert.ok(session);
    assert.ok(session.revokedAt);
    assert.equal(session.revokedReason, 'TOKEN_REUSE_DETECTED');

    // 5. Even legitimate token2 should now be rejected because the session was compromised
    const subsequentRes = await request(app)
      .post('/api/v1/superadmin/auth/refresh')
      .set('Cookie', `refreshToken=${token2}`);

    assert.equal(subsequentRes.status, 401);
    assert.match(subsequentRes.body.message, /revoked/i);
  });

  // 10. Logout
  test('10. Logout revokes the current session and clears the refresh cookie', async () => {
    const loginRes = await request(app)
      .post('/api/v1/superadmin/auth/login')
      .send({ email: defaultEmail, password: defaultPassword });

    const refreshToken = extractCookie(loginRes, 'refreshToken');
    const accessToken = loginRes.body.data.accessToken;

    const logoutRes = await request(app)
      .post('/api/v1/superadmin/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Cookie', `refreshToken=${refreshToken}`);

    assert.equal(logoutRes.status, 200);
    assert.equal(logoutRes.body.success, true);

    // Cookie must be cleared
    const setCookie = logoutRes.headers['set-cookie'][0];
    assert.ok(setCookie.includes('refreshToken=;') || setCookie.includes('Expires=Thu, 01 Jan 1970'));

    // Verify session revoked in database
    const session = await Session.findOne({ refreshTokenHash: hashToken(refreshToken) });
    assert.ok(session.revokedAt);

    // Trying to refresh with logged-out session fails
    const refreshRes = await request(app)
      .post('/api/v1/superadmin/auth/refresh')
      .set('Cookie', `refreshToken=${refreshToken}`);

    assert.equal(refreshRes.status, 401);
  });

  // 11. Logout-all
  test('11. Logout-all revokes all active sessions for the authenticated Super Admin', async () => {
    // Session 1 (Device A)
    const login1 = await request(app)
      .post('/api/v1/superadmin/auth/login')
      .send({ email: defaultEmail, password: defaultPassword });

    const tokenA = extractCookie(login1, 'refreshToken');
    const accessA = login1.body.data.accessToken;

    // Session 2 (Device B)
    const login2 = await request(app)
      .post('/api/v1/superadmin/auth/login')
      .send({ email: defaultEmail, password: defaultPassword });

    const tokenB = extractCookie(login2, 'refreshToken');

    // Both sessions should be active
    const activeCountBefore = await Session.countDocuments({ revokedAt: null });
    assert.equal(activeCountBefore, 2);

    // Call logout-all using Access Token from Device A
    const logoutAllRes = await request(app)
      .post('/api/v1/superadmin/auth/logout-all')
      .set('Authorization', `Bearer ${accessA}`);

    assert.equal(logoutAllRes.status, 200);
    assert.equal(logoutAllRes.body.success, true);

    // Verify all sessions are revoked
    const activeCountAfter = await Session.countDocuments({ revokedAt: null });
    assert.equal(activeCountAfter, 0);

    // Neither Device A nor Device B can refresh
    const refreshA = await request(app)
      .post('/api/v1/superadmin/auth/refresh')
      .set('Cookie', `refreshToken=${tokenA}`);
    assert.equal(refreshA.status, 401);

    const refreshB = await request(app)
      .post('/api/v1/superadmin/auth/refresh')
      .set('Cookie', `refreshToken=${tokenB}`);
    assert.equal(refreshB.status, 401);
  });

  // 12. Invalid access token
  test('12. Invalid or malformed access token returns 401 Unauthorized', async () => {
    const res = await request(app)
      .get('/api/v1/superadmin/auth/me')
      .set('Authorization', 'Bearer invalid.bogus.jwt');

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /invalid|malformed/i);
  });

  // 13. Change password
  test('13. Change password validates current password, updates hash, and revokes all active sessions', async () => {
    const loginRes = await request(app)
      .post('/api/v1/superadmin/auth/login')
      .send({ email: defaultEmail, password: defaultPassword });

    const accessToken = loginRes.body.data.accessToken;
    const refreshToken = extractCookie(loginRes, 'refreshToken');

    const newPassword = 'NewSuperAdmin@Secure2026!';

    // Change password
    const changeRes = await request(app)
      .post('/api/v1/superadmin/auth/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: defaultPassword,
        newPassword,
        confirmPassword: newPassword,
      });

    assert.equal(changeRes.status, 200);
    assert.equal(changeRes.body.success, true);

    // Old password must fail
    const oldLogin = await request(app)
      .post('/api/v1/superadmin/auth/login')
      .send({ email: defaultEmail, password: defaultPassword });
    assert.equal(oldLogin.status, 401);

    // Old refresh token must fail
    const oldRefresh = await request(app)
      .post('/api/v1/superadmin/auth/refresh')
      .set('Cookie', `refreshToken=${refreshToken}`);
    assert.equal(oldRefresh.status, 401);

    // New password must succeed
    const newLogin = await request(app)
      .post('/api/v1/superadmin/auth/login')
      .send({ email: defaultEmail, password: newPassword });
    assert.equal(newLogin.status, 200);
    assert.equal(newLogin.body.success, true);
  });

  // 14. Forgot password
  test('14. Forgot password generates single-use token and returns generic enumeration-safe response', async () => {
    const res = await request(app)
      .post('/api/v1/superadmin/auth/forgot-password')
      .send({ email: defaultEmail });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.match(res.body.message, /instructions have been sent/i);

    // Verify token hash record was created
    const resetRecord = await PasswordReset.findOne({ email: defaultEmail, usedAt: null });
    assert.ok(resetRecord);
    assert.ok(resetRecord.tokenHash);
    assert.ok(resetRecord.expiresAt.getTime() > Date.now());
  });

  // 15. Reset password
  test('15. Reset password verifies token hash, updates password, and marks token as used', async () => {
    // Generate known reset token and hash
    const rawResetToken = generateRandomToken(32);
    const tokenHash = hashToken(rawResetToken);
    const user = await SuperAdmin.findOne({ email: defaultEmail });

    await PasswordReset.create({
      userId: user._id,
      email: user.email,
      tokenHash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const newPassword = 'ResetPassword@Secure2026!';

    // Reset password using the raw token
    const resetRes = await request(app)
      .post('/api/v1/superadmin/auth/reset-password')
      .send({
        token: rawResetToken,
        newPassword,
        confirmPassword: newPassword,
      });

    assert.equal(resetRes.status, 200);
    assert.equal(resetRes.body.success, true);

    // Verify record is marked as used
    const updatedRecord = await PasswordReset.findOne({ tokenHash });
    assert.ok(updatedRecord.usedAt);

    // Replay attack with same token must fail
    const replayRes = await request(app)
      .post('/api/v1/superadmin/auth/reset-password')
      .send({
        token: rawResetToken,
        newPassword: 'AnotherPassword@Secure2026!',
        confirmPassword: 'AnotherPassword@Secure2026!',
      });
    assert.equal(replayRes.status, 400);

    // Login with new password must succeed
    const loginRes = await request(app)
      .post('/api/v1/superadmin/auth/login')
      .send({ email: defaultEmail, password: newPassword });
    assert.equal(loginRes.status, 200);
    assert.equal(loginRes.body.success, true);
  });

  // 16. Unauthorized access
  test('16. Unauthorized access without Authorization header returns 401', async () => {
    const res = await request(app).get('/api/v1/superadmin/auth/me');

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /Authorization header missing/i);
  });
});
