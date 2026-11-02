/**
 * @file app.js
 * @description Express Application Factory, Middleware Pipeline & Route Mounting.
 * @module backend/src/app
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './config/env.js';
import { corsConfig } from './config/cors.config.js';
import { helmetConfig } from './config/security.config.js';
import { requestIdMiddleware } from './middleware/request-id.middleware.js';
import { notFoundMiddleware } from './middleware/not-found.middleware.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import apiRoutes from './routes/index.js';

export const createApp = () => {
  const app = express();

  // 1. Trust proxy for rate limiting and secure cookies when behind reverse proxy
  app.set('trust proxy', 1);

  // 2. Security Headers via Helmet
  app.use(helmet(helmetConfig));

  // 3. CORS with Cookie/Credentials support
  app.use(cors(corsConfig));

  // 4. Request Tracing Identifier
  app.use(requestIdMiddleware);

  // 5. Body Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 6. Cookie Parser for secure HttpOnly refresh tokens
  app.use(cookieParser());

  // 7. Mount Core API Routes under /api/v1
  app.use(env.API_PREFIX, apiRoutes);

  // 8. Unmatched Route Handler (404)
  app.use(notFoundMiddleware);

  // 9. Centralized Error Handler (500)
  app.use(errorMiddleware);

  return app;
};

export const app = createApp();

export default app;
