/**
 * @file public.routes.jsx
 * @description White-Label Multi-Tenant Public & Guest Portal Routing.
 * Mounts clean, professional routes at the root domain/subdomain level:
 *   - /            -> Store / Website Home
 *   - /services    -> Service Catalog
 *   - /packages    -> Beauty Packages
 *   - /offers      -> Promotions & Discounts
 *   - /branches    -> Salon Branches
 *   - /book        -> Instant Appointment Booking
 *   - /booking     -> Booking alias
 * Supports Option A (glamour.kashiservice.com / glamour.localhost:3000)
 * and Option B (www.glamourbeauty.com).
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
import PublicAboutPage from '../modules/public/pages/PublicAboutPage.jsx';
import PublicContactPage from '../modules/public/pages/PublicContactPage.jsx';
import PublicAcademyPage from '../modules/public/pages/PublicAcademyPage.jsx';
import PlatformHubPage from '../modules/public/pages/PlatformHubPage.jsx';
import MasterHomePage from '../modules/public/pages/MasterHomePage.jsx';
import PlatformDocsPage from '../modules/public/pages/PlatformDocsPage.jsx';

export const PublicRoutes = (
  <>
    {/* Standalone Root: Clean Master Homepage with Single Header */}
    <Route path="/" element={<MasterHomePage />} />

    {/* Platform Hub Direct Routes */}
    <Route path="/platform" element={<PlatformHubPage />} />
    <Route path="/kashi" element={<PlatformHubPage />} />
    <Route path="/kashiservice" element={<PlatformHubPage />} />
    <Route path="/docs" element={<PlatformDocsPage />} />

    {/* Clean White-Label Public Website at Root Level (SaaS Subdomain or Custom Domain) */}
    <Route element={<PublicLayout />}>
      <Route path="/storefront" element={<PublicHomePage />} />
      <Route path="/services" element={<PublicServicesPage />} />
      <Route path="/services/:id" element={<PublicServicesPage />} />
      <Route path="/packages" element={<PublicPackagesPage />} />
      <Route path="/packages/:id" element={<PublicPackagesPage />} />
      <Route path="/offers" element={<PublicOffersPage />} />
      <Route path="/offers/:id" element={<PublicOffersPage />} />
      <Route path="/branches" element={<PublicBranchesPage />} />
      <Route path="/branches/:id" element={<PublicBranchesPage />} />
      <Route path="/about" element={<PublicAboutPage />} />
      <Route path="/about-us" element={<PublicAboutPage />} />
      <Route path="/contact" element={<PublicContactPage />} />
      <Route path="/contact-us" element={<PublicContactPage />} />
      <Route path="/academy" element={<PublicAcademyPage />} />
      <Route path="/courses" element={<PublicAcademyPage />} />
      <Route path="/training" element={<PublicAcademyPage />} />
      <Route path="/book" element={<PublicBookingPage />} />
      <Route path="/booking" element={<PublicBookingPage />} />
      <Route path="/book/checkout" element={<PublicBookingPage />} />
      <Route path="/book/success" element={<PublicBookingPage />} />
    </Route>

    {/* Direct IP / Localhost Path Preview: /site/:tenantSlug */}
    <Route path="/site/:tenantSlug" element={<PublicLayout />}>
      <Route index element={<PublicHomePage />} />
      <Route path="services" element={<PublicServicesPage />} />
      <Route path="services/:id" element={<PublicServicesPage />} />
      <Route path="packages" element={<PublicPackagesPage />} />
      <Route path="packages/:id" element={<PublicPackagesPage />} />
      <Route path="offers" element={<PublicOffersPage />} />
      <Route path="offers/:id" element={<PublicOffersPage />} />
      <Route path="branches" element={<PublicBranchesPage />} />
      <Route path="branches/:id" element={<PublicBranchesPage />} />
      <Route path="about" element={<PublicAboutPage />} />
      <Route path="about-us" element={<PublicAboutPage />} />
      <Route path="contact" element={<PublicContactPage />} />
      <Route path="contact-us" element={<PublicContactPage />} />
      <Route path="academy" element={<PublicAcademyPage />} />
      <Route path="courses" element={<PublicAcademyPage />} />
      <Route path="training" element={<PublicAcademyPage />} />
      <Route path="book" element={<PublicBookingPage />} />
      <Route path="booking" element={<PublicBookingPage />} />
      <Route path="book/checkout" element={<PublicBookingPage />} />
      <Route path="book/success" element={<PublicBookingPage />} />
    </Route>

    {/* Legacy /public Aliases (For Backwards-Compatibility) */}
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
      <Route path="booking" element={<PublicBookingPage />} />
      <Route path="book/checkout" element={<PublicBookingPage />} />
      <Route path="book/success" element={<PublicBookingPage />} />
    </Route>

    {/* Guest Aliases */}
    <Route path="/guest" element={<Navigate to="/" replace />} />
    <Route path="/guest/book" element={<Navigate to="/book" replace />} />
    <Route path="/guest/booking" element={<Navigate to="/book" replace />} />
  </>
);

export default PublicRoutes;
