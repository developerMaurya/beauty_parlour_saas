/**
 * @file authentication.middleware.js
 * @description Central authentication middleware re-exporter.
 * @module backend/src/middleware/authentication.middleware
 */

export {
  authenticateAccessToken,
  optionalAuthentication,
} from '../modules/auth/middlewares/auth.middleware.js';

export default {};
