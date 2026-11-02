/**
 * @file session.service.js
 * @description Session management, refresh token rotation, and reuse attack detection.
 * @module backend/src/modules/auth/services/session.service
 */

import { Session } from '../models/session.model.js';

/**
 * Create a new user session
 * @param {object} params
 * @param {string} params.userId
 * @param {string} params.userRole
 * @param {string} [params.userModel='SuperAdmin']
 * @param {string} params.sessionId
 * @param {string} params.refreshTokenHash
 * @param {Date} params.expiresAt
 * @param {string} [params.userAgent='']
 * @param {string} [params.ipAddress='']
 * @returns {Promise<Session>}
 */
export const createSession = async ({
  userId,
  userRole,
  userModel = 'SuperAdmin',
  sessionId,
  refreshTokenHash,
  expiresAt,
  userAgent = '',
  ipAddress = '',
}) => {
  return Session.create({
    userId,
    userRole,
    userModel,
    sessionId,
    refreshTokenHash,
    expiresAt,
    userAgent,
    ipAddress,
  });
};

/**
 * Validate session and check for refresh token reuse
 * @param {string} sessionId
 * @param {string} incomingTokenHash
 * @returns {Promise<{ session: Session|null, status: 'VALID'|'REUSED'|'REVOKED'|'EXPIRED'|'NOT_FOUND' }>}
 */
export const validateSessionAndCheckReuse = async (sessionId, incomingTokenHash) => {
  const session = await Session.findOne({ sessionId });

  if (!session) {
    return { session: null, status: 'NOT_FOUND' };
  }

  // Check if session was already revoked
  if (session.revokedAt) {
    return { session, status: 'REVOKED' };
  }

  // Check if session has expired
  if (session.expiresAt.getTime() < Date.now()) {
    return { session, status: 'EXPIRED' };
  }

  // Check for Token Reuse:
  // If the incoming token matches a token that was already replaced in this session,
  // someone is replaying an old refresh token!
  if (session.replacedByTokenHash === incomingTokenHash || session.refreshTokenHash !== incomingTokenHash) {
    // Immediate mitigation: Revoke this entire session
    session.revokedAt = new Date();
    session.revokedReason = 'TOKEN_REUSE_DETECTED';
    await session.save();

    return { session, status: 'REUSED' };
  }

  return { session, status: 'VALID' };
};

/**
 * Rotate refresh token for an existing active session
 * @param {string} sessionId
 * @param {string} oldTokenHash
 * @param {string} newTokenHash
 * @param {Date} newExpiresAt
 * @returns {Promise<Session>}
 */
export const rotateSessionToken = async (sessionId, oldTokenHash, newTokenHash, newExpiresAt) => {
  return Session.findOneAndUpdate(
    { sessionId, revokedAt: null },
    {
      $set: {
        refreshTokenHash: newTokenHash,
        replacedByTokenHash: oldTokenHash,
        expiresAt: newExpiresAt,
        lastUsedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );
};

/**
 * Revoke a single session
 * @param {string} sessionId
 * @param {string} [reason='LOGOUT']
 * @returns {Promise<Session|null>}
 */
export const revokeSession = async (sessionId, reason = 'LOGOUT') => {
  return Session.findOneAndUpdate(
    { sessionId, revokedAt: null },
    {
      $set: {
        revokedAt: new Date(),
        revokedReason: reason,
      },
    },
    { returnDocument: 'after' }
  );
};

/**
 * Revoke all active sessions for a user
 * @param {string} userId
 * @param {string} [reason='LOGOUT_ALL']
 * @returns {Promise<number>} Number of revoked sessions
 */
export const revokeAllUserSessions = async (userId, reason = 'LOGOUT_ALL') => {
  const result = await Session.updateMany(
    { userId, revokedAt: null },
    {
      $set: {
        revokedAt: new Date(),
        revokedReason: reason,
      },
    }
  );

  return result.modifiedCount;
};

/**
 * Verify if a session is currently active
 * @param {string} sessionId
 * @returns {Promise<boolean>}
 */
export const isSessionActive = async (sessionId) => {
  const session = await Session.findOne({
    sessionId,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });

  return Boolean(session);
};

export default {
  createSession,
  validateSessionAndCheckReuse,
  rotateSessionToken,
  revokeSession,
  revokeAllUserSessions,
  isSessionActive,
};
