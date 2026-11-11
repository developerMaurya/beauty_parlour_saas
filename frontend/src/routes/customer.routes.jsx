/**
 * @file customer.routes.jsx
 * @description Customer Navigation Routes (Amazon / Flipkart Style Unified Frontend).
 * As requested, customer does NOT have an isolated separate portal dashboard.
 * Customer authentication and profiles live seamlessly on the default main page and header.
 * @module frontend/src/routes/customer.routes
 */

import React from 'react';
import { Route, Navigate } from 'react-router-dom';

export const CustomerRoutes = (
  <>
    {/* Customer Authentication redirects directly to Main Hub with Auth Modal */}
    <Route path="/customer/login" element={<Navigate to="/?auth=login" replace />} />
    <Route path="/customer/register" element={<Navigate to="/?auth=register" replace />} />
    <Route path="/customer/forgot-password" element={<Navigate to="/?auth=forgot" replace />} />
    <Route path="/customer/reset-password" element={<Navigate to="/?auth=reset" replace />} />

    {/* All customer sub-paths redirect directly to Default Main Page */}
    <Route path="/customer/*" element={<Navigate to="/" replace />} />
  </>
);

export default CustomerRoutes;
