/**
 * @file public.routes.jsx
 * @description Public Portal Routes for Kashi Service Ecosystem.
 * Includes:
 *   - / -> Master Customer Portal (Kashi Service Multi-Business Hub)
 *   - /storefront -> Dedicated Golden Beauty Parlour Website
 *   - /events -> Dedicated Jay Gurudev Event Decoration Website
 *   - /booking & /book -> Appointment Booking
 * @module frontend/src/routes/public.routes
 */

import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout.jsx';
import PlatformHubPage from '../modules/public/pages/PlatformHubPage.jsx';
import GoldenBeautyWebsite from '../modules/public/pages/GoldenBeautyWebsite.jsx';
import EventDecorationWebsite from '../modules/public/pages/EventDecorationWebsite.jsx';
import RealEstatePlottingWebsite from '../modules/public/pages/RealEstatePlottingWebsite.jsx';
import RentOfficeWebsite from '../modules/public/pages/RentOfficeWebsite.jsx';
import RBSoftwareWebsite from '../modules/public/pages/RBSoftwareWebsite.jsx';
import PublicServicesPage from '../modules/public/pages/PublicServicesPage.jsx';
import PublicPackagesPage from '../modules/public/pages/PublicPackagesPage.jsx';
import PublicOffersPage from '../modules/public/pages/PublicOffersPage.jsx';
import PublicBranchesPage from '../modules/public/pages/PublicBranchesPage.jsx';
import PublicBookingPage from '../modules/public/pages/PublicBookingPage.jsx';
import PublicAboutPage from '../modules/public/pages/PublicAboutPage.jsx';
import PublicContactPage from '../modules/public/pages/PublicContactPage.jsx';
import PublicGalleryPage from '../modules/public/pages/PublicGalleryPage.jsx';
import PublicAcademyPage from '../modules/public/pages/PublicAcademyPage.jsx';

export const PublicRoutes = (
  <>
    {/* Root Domain Landing: Clean Multi-Business Customer Portal */}
    <Route path="/" element={<PlatformHubPage />} />

    {/* Dedicated Golden Beauty Parlour Hardcoded Website */}
    <Route path="/golden-beauty-parlour" element={<GoldenBeautyWebsite />} />
    <Route path="/storefront" element={<GoldenBeautyWebsite />} />
    <Route path="/parlour" element={<GoldenBeautyWebsite />} />

    {/* Dedicated Jay Gurudev Event Decoration Futuristic Website */}
    <Route path="/jay-gurudev-events" element={<EventDecorationWebsite />} />
    <Route path="/events" element={<EventDecorationWebsite />} />
    <Route path="/event-decoration" element={<EventDecorationWebsite />} />

    {/* Dedicated Real Estate Plotting & Colonies Website */}
    <Route path="/plotting" element={<RealEstatePlottingWebsite />} />
    <Route path="/real-estate" element={<RealEstatePlottingWebsite />} />
    <Route path="/colonies" element={<RealEstatePlottingWebsite />} />

    {/* Dedicated Office & Commercial Rent Website */}
    <Route path="/rent" element={<RentOfficeWebsite />} />
    <Route path="/office-rent" element={<RentOfficeWebsite />} />
    <Route path="/commercial" element={<RentOfficeWebsite />} />

    {/* Dedicated RB Software & Tech Hub Website */}
    <Route path="/software" element={<RBSoftwareWebsite />} />
    <Route path="/rb-software" element={<RBSoftwareWebsite />} />
    <Route path="/tech" element={<RBSoftwareWebsite />} />

    {/* Booking and Salon Inner Pages */}
    <Route element={<PublicLayout />}>
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
      <Route path="/gallery" element={<PublicGalleryPage />} />
      <Route path="/portfolio" element={<PublicGalleryPage />} />
      <Route path="/academy" element={<PublicAcademyPage />} />
      <Route path="/book" element={<PublicBookingPage />} />
      <Route path="/booking" element={<PublicBookingPage />} />
      <Route path="/book/checkout" element={<PublicBookingPage />} />
      <Route path="/book/success" element={<PublicBookingPage />} />
    </Route>
  </>
);

export default PublicRoutes;
