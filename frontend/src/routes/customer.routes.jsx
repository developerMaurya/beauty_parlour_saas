/**
 * @file customer.routes.jsx
 * @description Routing Definitions for the White-Label Multi-Tenant Customer Portal.
 * Conforms to Phase 07 Section 47.
 * @module frontend/src/routes/customer.routes
 */

import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import CustomerLayout from '../layouts/CustomerLayout.jsx';
import CustomerLoginPage from '../modules/customer/pages/CustomerLoginPage.jsx';
import CustomerRegisterPage from '../modules/customer/pages/CustomerRegisterPage.jsx';
import CustomerForgotPasswordPage from '../modules/customer/pages/CustomerForgotPasswordPage.jsx';
import CustomerDashboardPage from '../modules/customer/pages/CustomerDashboardPage.jsx';
import CustomerProfilePage from '../modules/customer/pages/CustomerProfilePage.jsx';
import CustomerServicesPage from '../modules/customer/pages/CustomerServicesPage.jsx';
import CustomerPackagesPage from '../modules/customer/pages/CustomerPackagesPage.jsx';
import CustomerMyPackagesPage from '../modules/customer/pages/CustomerMyPackagesPage.jsx';
import CustomerOffersPage from '../modules/customer/pages/CustomerOffersPage.jsx';
import CustomerBookingPage from '../modules/customer/pages/CustomerBookingPage.jsx';
import CustomerAppointmentsPage from '../modules/customer/pages/CustomerAppointmentsPage.jsx';
import CustomerAppointmentDetailPage from '../modules/customer/pages/CustomerAppointmentDetailPage.jsx';
import CustomerTrackingPage from '../modules/customer/pages/CustomerTrackingPage.jsx';
import CustomerPaymentsPage from '../modules/customer/pages/CustomerPaymentsPage.jsx';
import CustomerInvoicesPage from '../modules/customer/pages/CustomerInvoicesPage.jsx';
import CustomerHistoryPage from '../modules/customer/pages/CustomerHistoryPage.jsx';
import CustomerVisitsPage from '../modules/customer/pages/CustomerVisitsPage.jsx';
import CustomerReviewsPage from '../modules/customer/pages/CustomerReviewsPage.jsx';
import CustomerFavoritesPage from '../modules/customer/pages/CustomerFavoritesPage.jsx';
import CustomerChatPage from '../modules/customer/pages/CustomerChatPage.jsx';
import CustomerNotificationsPage from '../modules/customer/pages/CustomerNotificationsPage.jsx';
import CustomerRequestsPage from '../modules/customer/pages/CustomerRequestsPage.jsx';
import CustomerAddressesPage from '../modules/customer/pages/CustomerAddressesPage.jsx';
import CustomerCalendarPage from '../modules/customer/pages/CustomerCalendarPage.jsx';
import CustomerReportsPage from '../modules/customer/pages/CustomerReportsPage.jsx';
import CustomerTimelinePage from '../modules/customer/pages/CustomerTimelinePage.jsx';
import CustomerSettingsPage from '../modules/customer/pages/CustomerSettingsPage.jsx';
import CustomerDocumentsPage from '../modules/customer/pages/CustomerDocumentsPage.jsx';

export const CustomerRoutes = (
  <>
    {/* Public Customer Authentication */}
    <Route path="/customer/login" element={<CustomerLoginPage />} />
    <Route path="/customer/register" element={<CustomerRegisterPage />} />
    <Route path="/customer/forgot-password" element={<CustomerForgotPasswordPage />} />
    <Route path="/customer/reset-password" element={<CustomerForgotPasswordPage />} />

    {/* Protected Customer Portal Workspace */}
    <Route path="/customer" element={<CustomerLayout />}>
      <Route index element={<Navigate to="/customer/dashboard" replace />} />
      <Route path="dashboard" element={<CustomerDashboardPage />} />

      {/* Profile & Settings */}
      <Route path="profile" element={<CustomerProfilePage />} />
      <Route path="profile/edit" element={<CustomerProfilePage />} />
      <Route path="settings" element={<CustomerSettingsPage />} />
      <Route path="security" element={<CustomerSettingsPage />} />

      {/* Treatments & Packages */}
      <Route path="services" element={<CustomerServicesPage />} />
      <Route path="services/:id" element={<CustomerServicesPage />} />
      <Route path="packages" element={<CustomerPackagesPage />} />
      <Route path="packages/:id" element={<CustomerPackagesPage />} />
      <Route path="packages/my" element={<CustomerMyPackagesPage />} />
      <Route path="packages/my/:id" element={<CustomerMyPackagesPage />} />
      <Route path="offers" element={<CustomerOffersPage />} />
      <Route path="offers/:id" element={<CustomerOffersPage />} />

      {/* Booking & Checkout */}
      <Route path="book" element={<CustomerBookingPage />} />
      <Route path="book/checkout" element={<CustomerBookingPage />} />
      <Route path="book/success" element={<CustomerBookingPage />} />

      {/* Appointments & Live Tracking */}
      <Route path="appointments" element={<CustomerAppointmentsPage />} />
      <Route path="appointments/history" element={<CustomerAppointmentsPage />} />
      <Route path="appointments/:id" element={<CustomerAppointmentDetailPage />} />
      <Route path="appointments/:id/tracking" element={<CustomerTrackingPage />} />
      <Route path="appointments/:id/payment" element={<CustomerPaymentsPage />} />
      <Route path="appointments/:id/invoice" element={<CustomerInvoicesPage />} />

      {/* Direct Tracking Routes */}
      <Route path="tracking/:id" element={<CustomerTrackingPage />} />
      <Route path="home-services/:id/tracking" element={<CustomerTrackingPage />} />

      {/* Financials & Receipts */}
      <Route path="payments" element={<CustomerPaymentsPage />} />
      <Route path="payments/:id" element={<CustomerPaymentsPage />} />
      <Route path="payments/invoices" element={<CustomerInvoicesPage />} />
      <Route path="payments/invoices/:id" element={<CustomerInvoicesPage />} />
      <Route path="refund-requests" element={<CustomerPaymentsPage />} />

      {/* Vault Documents */}
      <Route path="documents" element={<CustomerDocumentsPage />} />
      <Route path="documents/:id" element={<CustomerDocumentsPage />} />

      {/* Service History & Visits */}
      <Route path="services/history" element={<CustomerHistoryPage />} />
      <Route path="visits" element={<CustomerVisitsPage />} />
      <Route path="visits/:id" element={<CustomerVisitsPage />} />

      {/* Reviews, Ratings & Feedback */}
      <Route path="reviews" element={<CustomerReviewsPage />} />
      <Route path="reviews/:id" element={<CustomerReviewsPage />} />

      {/* Favorites & Saved Items */}
      <Route path="favorites" element={<CustomerFavoritesPage />} />

      {/* Concierge & Support */}
      <Route path="chat" element={<CustomerChatPage />} />
      <Route path="chat/:id" element={<CustomerChatPage />} />
      <Route path="notifications" element={<CustomerNotificationsPage />} />
      <Route path="requests" element={<CustomerRequestsPage />} />
      <Route path="requests/:id" element={<CustomerRequestsPage />} />

      {/* Addresses & Logistics */}
      <Route path="addresses" element={<CustomerAddressesPage />} />

      {/* Schedule, Analytics & Journey */}
      <Route path="calendar" element={<CustomerCalendarPage />} />
      <Route path="reports" element={<CustomerReportsPage />} />
      <Route path="timeline" element={<CustomerTimelinePage />} />
    </Route>
  </>
);

export default CustomerRoutes;
