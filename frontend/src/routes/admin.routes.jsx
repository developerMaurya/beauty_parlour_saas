/**
 * @file admin.routes.jsx
 * @description Routing Definitions for Tenant Admin Panel.
 * Conforms to Section 65 requirements.
 * @module frontend/src/routes/admin.routes
 */

import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import TenantAdminLayout from '../layouts/TenantAdminLayout.jsx';
import AdminLoginPage from '../modules/admin/pages/AdminLoginPage.jsx';
import AdminDashboardPage from '../modules/admin/pages/AdminDashboardPage.jsx';
import BranchManagementPage from '../modules/admin/pages/BranchManagementPage.jsx';
import StructureManagementPage from '../modules/admin/pages/StructureManagementPage.jsx';
import RolePermissionPage from '../modules/admin/pages/RolePermissionPage.jsx';
import UserManagementPage from '../modules/admin/pages/UserManagementPage.jsx';
import StaffManagementPage from '../modules/admin/pages/StaffManagementPage.jsx';
import AttendanceLeavesPage from '../modules/admin/pages/AttendanceLeavesPage.jsx';
import StudentAcademyPage from '../modules/admin/pages/StudentAcademyPage.jsx';
import CustomerManagementPage from '../modules/admin/pages/CustomerManagementPage.jsx';
import ServiceCatalogPage from '../modules/admin/pages/ServiceCatalogPage.jsx';
import PackagesOffersPage from '../modules/admin/pages/PackagesOffersPage.jsx';
import AppointmentsCalendarPage from '../modules/admin/pages/AppointmentsCalendarPage.jsx';
import HomeServicesDispatchPage from '../modules/admin/pages/HomeServicesDispatchPage.jsx';
import BillingPOSPage from '../modules/admin/pages/BillingPOSPage.jsx';
import InventorySuppliersPage from '../modules/admin/pages/InventorySuppliersPage.jsx';
import FacilitiesExpensesPage from '../modules/admin/pages/FacilitiesExpensesPage.jsx';
import ReportsPage from '../modules/admin/pages/ReportsPage.jsx';
import WebsiteCMSPage from '../modules/admin/pages/WebsiteCMSPage.jsx';
import SettingsPage from '../modules/admin/pages/SettingsPage.jsx';
import CRMPage from '../modules/admin/pages/CRMPage.jsx';
import NotificationsPage from '../modules/admin/pages/NotificationsPage.jsx';
import SupportCenterPage from '../modules/admin/pages/SupportCenterPage.jsx';
import AdminProfilePage from '../modules/admin/pages/AdminProfilePage.jsx';
import LiveTrackingPage from '../modules/admin/pages/LiveTrackingPage.jsx';
import ReceptionistFrontDeskPage from '../modules/admin/pages/ReceptionistFrontDeskPage.jsx';

export const AdminRoutes = (
  <>
    {/* Public Tenant Login */}
    <Route path="/admin/login" element={<AdminLoginPage />} />

    {/* Protected Tenant Admin Workspace */}
    <Route path="/admin" element={<TenantAdminLayout />}>
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboardPage />} />
      <Route path="branches" element={<BranchManagementPage />} />
      <Route path="structure" element={<StructureManagementPage />} />
      <Route path="roles" element={<RolePermissionPage />} />
      <Route path="permissions" element={<RolePermissionPage />} />
      <Route path="users" element={<UserManagementPage />} />
      <Route path="crm" element={<CRMPage />} />
      <Route path="receptionist" element={<ReceptionistFrontDeskPage />} />
      <Route path="frontdesk" element={<ReceptionistFrontDeskPage />} />
      <Route path="tracking" element={<LiveTrackingPage />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="support" element={<SupportCenterPage />} />
      <Route path="profile" element={<AdminProfilePage />} />
      <Route path="staff" element={<StaffManagementPage />} />
      <Route path="attendance" element={<AttendanceLeavesPage />} />
      <Route path="leaves" element={<AttendanceLeavesPage />} />
      <Route path="students" element={<StudentAcademyPage />} />
      <Route path="student-plans" element={<StudentAcademyPage />} />
      <Route path="customers" element={<CustomerManagementPage />} />
      <Route path="services" element={<ServiceCatalogPage />} />
      <Route path="packages" element={<PackagesOffersPage />} />
      <Route path="offers" element={<PackagesOffersPage />} />
      <Route path="appointments" element={<AppointmentsCalendarPage />} />
      <Route path="calendar" element={<AppointmentsCalendarPage />} />
      <Route path="home-services" element={<HomeServicesDispatchPage />} />
      <Route path="billing" element={<BillingPOSPage />} />
      <Route path="payments" element={<BillingPOSPage />} />
      <Route path="inventory" element={<InventorySuppliersPage />} />
      <Route path="products" element={<InventorySuppliersPage />} />
      <Route path="facilities" element={<FacilitiesExpensesPage />} />
      <Route path="expenses" element={<FacilitiesExpensesPage />} />
      <Route path="reports" element={<ReportsPage />} />
      <Route path="website" element={<WebsiteCMSPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="audit-logs" element={<SettingsPage />} />
    </Route>
  </>
);

export default AdminRoutes;
