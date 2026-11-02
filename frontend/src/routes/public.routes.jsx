/**
 * @file public.routes.jsx
 * @description Routing Definitions for the White-Label Multi-Tenant Public & Guest Portal.
 * Conforms to Phase 07 Section 52.
 * @module frontend/src/routes/public.routes
 */

import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout.jsx';
import PublicHomePage from '../modules/public/pages/PublicHomePage.jsx';
import PublicServicesPage from '../modules/public/pages/PublicServicesPage.jsx';
import PublicPackagesPage from '../modules/public/pages/PublicPackagesPage.jsx';
import PublicOffersPage from '../modules/public/pages/PublicOffersPage.jsx';
import PublicBranchesPage from '../modules/public/pages/PublicBranchesPage.jsx';
import PublicBookingPage from '../modules/public/pages/PublicBookingPage.jsx';

export const PublicRoutes = (
  <>
    {/* Public & Guest Showcase Portal */}
    <Route path="/public" element={<PublicLayout />}>
      <Route index element={<PublicHomePage />} />
      <Route path="services" element={<PublicServicesPage />} />
      <Route path="services/:id" element={<PublicServicesPage />} />
      <Route path="packages" element={<PublicPackagesPage />} />
      <Route path="packages/:id" element={<PublicPackagesPage />} />
      <Route path="offers" element={<PublicOffersPage />} />
      <Route path="offers/:id" element={<PublicOffersPage />} />
      <Route path="branches" element={<PublicBranchesPage />} />
      <Route path="branches/:id" element={<PublicBranchesPage />} />
      <Route path="book" element={<PublicBookingPage />} />
      <Route path="book/checkout" element={<PublicBookingPage />} />
      <Route path="book/success" element={<PublicBookingPage />} />
    </Route>

    {/* Guest Aliases */}
    <Route path="/guest" element={<Navigate to="/public" replace />} />
    <Route path="/guest/book" element={<Navigate to="/public/book" replace />} />
  </>
);

export default PublicRoutes;
