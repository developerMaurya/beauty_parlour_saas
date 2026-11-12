/**
 * @file staff.routes.jsx
 * @description Routing Definitions for the White-Label Multi-Tenant Staff Portal.
 * Conforms to Phase 05 Section 52.
 * @module frontend/src/routes/staff.routes
 */

import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import StaffLayout from '../layouts/StaffLayout.jsx';
import StaffLoginPage from '../modules/staff/pages/StaffLoginPage.jsx';
import StaffDashboardPage from '../modules/staff/pages/StaffDashboardPage.jsx';
import StaffEventDashboardPage from '../modules/staff/pages/StaffEventDashboardPage.jsx';
import StaffPlottingDashboardPage from '../modules/staff/pages/StaffPlottingDashboardPage.jsx';
import StaffSoftwareDashboardPage from '../modules/staff/pages/StaffSoftwareDashboardPage.jsx';
import StaffProfilePage from '../modules/staff/pages/StaffProfilePage.jsx';
import StaffProfileEditPage from '../modules/staff/pages/StaffProfileEditPage.jsx';
import StaffCalendarPage from '../modules/staff/pages/StaffCalendarPage.jsx';
import StaffAppointmentsPage from '../modules/staff/pages/StaffAppointmentsPage.jsx';
import StaffAppointmentDetailPage from '../modules/staff/pages/StaffAppointmentDetailPage.jsx';
import StaffHomeServicesPage from '../modules/staff/pages/StaffHomeServicesPage.jsx';
import StaffHomeServiceDetailPage from '../modules/staff/pages/StaffHomeServiceDetailPage.jsx';
import StaffCustomersPage from '../modules/staff/pages/StaffCustomersPage.jsx';
import StaffCustomerDetailPage from '../modules/staff/pages/StaffCustomerDetailPage.jsx';
import StaffServicesPage from '../modules/staff/pages/StaffServicesPage.jsx';
import StaffPackagesOffersPage from '../modules/staff/pages/StaffPackagesOffersPage.jsx';
import StaffTasksPage from '../modules/staff/pages/StaffTasksPage.jsx';
import StaffTaskDetailPage from '../modules/staff/pages/StaffTaskDetailPage.jsx';
import StaffAttendancePage from '../modules/staff/pages/StaffAttendancePage.jsx';
import StaffLeavesPage from '../modules/staff/pages/StaffLeavesPage.jsx';
import StaffSchedulePage from '../modules/staff/pages/StaffSchedulePage.jsx';
import StaffEarningsPage from '../modules/staff/pages/StaffEarningsPage.jsx';
import StaffPayslipsPage from '../modules/staff/pages/StaffPayslipsPage.jsx';
import StaffDocumentsPage from '../modules/staff/pages/StaffDocumentsPage.jsx';
import StaffInventoryPage from '../modules/staff/pages/StaffInventoryPage.jsx';
import StaffRequestsPage from '../modules/staff/pages/StaffRequestsPage.jsx';
import StaffChatPage from '../modules/staff/pages/StaffChatPage.jsx';
import StaffNotificationsPage from '../modules/staff/pages/StaffNotificationsPage.jsx';
import StaffPerformancePage from '../modules/staff/pages/StaffPerformancePage.jsx';
import StaffReportsPage from '../modules/staff/pages/StaffReportsPage.jsx';
import StaffSettingsPage from '../modules/staff/pages/StaffSettingsPage.jsx';
import StaffSecurityPage from '../modules/staff/pages/StaffSecurityPage.jsx';
import StaffCRMPage from '../modules/staff/pages/StaffCRMPage.jsx';

function StaffIndexRedirect() {
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('staff_user') || '{}');
    } catch {
      return {};
    }
  })();
  const biz = (storedUser?.targetBusiness || 'PARLOUR').toUpperCase();
  if (biz === 'EVENTS') return <Navigate to="/staff/event-dashboard" replace />;
  if (biz === 'PLOTTING') return <Navigate to="/staff/plotting-dashboard" replace />;
  if (biz === 'SOFTWARE') return <Navigate to="/staff/software-dashboard" replace />;
  return <Navigate to="/staff/dashboard" replace />;
}

export const StaffRoutes = (
  <>
    {/* Public Staff Login */}
    <Route path="/staff/login" element={<StaffLoginPage />} />

    {/* Protected Staff Member Portal Workspace */}
    <Route path="/staff" element={<StaffLayout />}>
      <Route index element={<StaffIndexRedirect />} />
      <Route path="dashboard" element={<StaffDashboardPage />} />
      <Route path="event-dashboard" element={<StaffEventDashboardPage />} />
      <Route path="plotting-dashboard" element={<StaffPlottingDashboardPage />} />
      <Route path="software-dashboard" element={<StaffSoftwareDashboardPage />} />

      {/* Profile & Settings */}
      <Route path="profile" element={<StaffProfilePage />} />
      <Route path="profile/edit" element={<StaffProfileEditPage />} />
      <Route path="settings" element={<StaffSettingsPage />} />
      <Route path="security" element={<StaffSecurityPage />} />

      {/* Work, Appointments & Schedule */}
      <Route path="calendar" element={<StaffCalendarPage />} />
      <Route path="appointments" element={<StaffAppointmentsPage />} />
      <Route path="appointments/:id" element={<StaffAppointmentDetailPage />} />
      <Route path="home-services" element={<StaffHomeServicesPage />} />
      <Route path="home-services/:id" element={<StaffHomeServiceDetailPage />} />
      <Route path="tasks" element={<StaffTasksPage />} />
      <Route path="tasks/:id" element={<StaffTaskDetailPage />} />

      {/* Clients CRM & Catalog */}
      <Route path="crm" element={<StaffCRMPage />} />
      <Route path="customers" element={<StaffCustomersPage />} />
      <Route path="customers/:id" element={<StaffCustomerDetailPage />} />
      <Route path="services" element={<StaffServicesPage />} />
      <Route path="packages" element={<StaffPackagesOffersPage />} />
      <Route path="offers" element={<StaffPackagesOffersPage />} />

      {/* Time & Attendance */}
      <Route path="attendance" element={<StaffAttendancePage />} />
      <Route path="attendance/corrections" element={<StaffAttendancePage />} />
      <Route path="leaves" element={<StaffLeavesPage />} />
      <Route path="holidays" element={<StaffLeavesPage />} />
      <Route path="schedule" element={<StaffSchedulePage />} />

      {/* Finance, Payslips & Commission */}
      <Route path="earnings" element={<StaffEarningsPage />} />
      <Route path="commission" element={<StaffEarningsPage />} />
      <Route path="salary" element={<StaffEarningsPage />} />
      <Route path="payments" element={<StaffEarningsPage />} />
      <Route path="payslips" element={<StaffPayslipsPage />} />

      {/* Credentials, Inventory & Requests */}
      <Route path="documents" element={<StaffDocumentsPage />} />
      <Route path="certificates" element={<StaffDocumentsPage />} />
      <Route path="inventory" element={<StaffInventoryPage />} />
      <Route path="inventory-requests" element={<StaffInventoryPage />} />
      <Route path="requests" element={<StaffRequestsPage />} />

      {/* Collaboration, Performance & Analytics */}
      <Route path="chat" element={<StaffChatPage />} />
      <Route path="chat/:id" element={<StaffChatPage />} />
      <Route path="notifications" element={<StaffNotificationsPage />} />
      <Route path="announcements" element={<StaffNotificationsPage />} />
      <Route path="performance" element={<StaffPerformancePage />} />
      <Route path="reports" element={<StaffReportsPage />} />
    </Route>
  </>
);

export default StaffRoutes;
