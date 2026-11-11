import AdminUnifiedRequestsPage from '../modules/admin/pages/AdminUnifiedRequestsPage.jsx';
/**
 * @file admin.routes.jsx
 * @description Routing Definitions for Master Admin Panel & Multi-Vertical Business Dashboards.
 * Includes:
 *   1. Golden Beauty Parlour: Users, Staff, Students, Appointments, Billing, Products, History
 *   2. Jay Gurudev Event Decoration: Stage Decor, Lighting, Event Bookings, Clients & Crew
 *   3. Real Estate Plotting: Colony Layouts, Available/Sold Plots, Buyers, Agents & Commissions
 *   4. Office / Rent Commercial: Leased Units, Vacant Offices, Tenants & Rent Receipts
 *   5. RB Software Hub: Microservices, APIs, Cloud Clusters & Software Portfolio
 * @module frontend/src/routes/admin.routes
 */

import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import TenantAdminLayout from '../layouts/TenantAdminLayout.jsx';
import AdminLoginPage from '../modules/admin/pages/AdminLoginPage.jsx';
import GoldenBeautyAdminDashboard, { GoldenBeautyAdminDashboard as GoldenBeautyAdminDashboardNamed } from '../modules/admin/pages/GoldenBeautyAdminDashboard.jsx';
import AdminDashboardPage from '../modules/admin/pages/AdminDashboardPage.jsx';

const AdminParlourDashboard = GoldenBeautyAdminDashboard || GoldenBeautyAdminDashboardNamed;
import BusinessDirectoryManager from '../modules/admin/pages/BusinessDirectoryManager.jsx';
import EventDecorationDashboard, { EventDecorationDashboard as EventDecorationDashboardNamed } from '../modules/admin/pages/EventDecorationDashboard.jsx';
const AdminEventDashboard = EventDecorationDashboard || EventDecorationDashboardNamed;
import EventUsersManagement from '../modules/admin/pages/EventUsersManagement.jsx';
import PlottingDashboard from '../modules/admin/pages/PlottingDashboard.jsx';
import PlottingUsersManagement from '../modules/admin/pages/PlottingUsersManagement.jsx';
import RentOfficeDashboard, { RentOfficeDashboard as RentOfficeDashboardNamed } from '../modules/admin/pages/RentOfficeDashboard.jsx';
const AdminRentDashboard = RentOfficeDashboard || RentOfficeDashboardNamed;
import RentTenantsManagement from '../modules/admin/pages/RentTenantsManagement.jsx';
import RBSoftwareDashboard from '../modules/admin/pages/RBSoftwareDashboard.jsx';
import SoftwareClientsManagement from '../modules/admin/pages/SoftwareClientsManagement.jsx';

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
    {/* Public Admin Login */}
    <Route path="/admin/login" element={<AdminLoginPage />} />

    {/* Protected Master Admin Workspace */}
    <Route path="/admin" element={<TenantAdminLayout />}>
      <Route index element={<Navigate to="/admin/dashboard" replace />} />

      {/* ── 1. Golden Beauty Parlour Master View ── */}
      <Route path="dashboard" element={<AdminParlourDashboard />} />
      {/* ── Global Customer Service Requests & Inquiries ── */}
      <Route path="customer-requests" element={<AdminUnifiedRequestsPage />} />
      <Route path="service-requests" element={<AdminUnifiedRequestsPage />} />
      <Route path="inquiries" element={<AdminUnifiedRequestsPage />} />

      <Route path="golden-beauty-parlour" element={<AdminParlourDashboard />} />
      <Route path="ops-radar" element={<AdminDashboardPage />} />
      <Route path="parlour-users" element={<CustomerManagementPage />} />
      <Route path="parlour-staff" element={<StaffManagementPage />} />
      <Route path="parlour-students" element={<StudentAcademyPage />} />
      <Route path="parlour-appointments" element={<AppointmentsCalendarPage />} />
      <Route path="parlour-services" element={<ServiceCatalogPage />} />
      <Route path="parlour-billing" element={<BillingPOSPage />} />
      <Route path="parlour-inventory" element={<InventorySuppliersPage />} />
      <Route path="packages" element={<PackagesOffersPage />} />
      <Route path="offers" element={<PackagesOffersPage />} />
      <Route path="crm" element={<CRMPage />} />
      <Route path="support" element={<SupportCenterPage />} />
      <Route path="import-export" element={<ReportsPage />} />

      {/* ── 2. Jay Gurudev Event Decoration Sub-Routes ── */}
      <Route path="event-decoration" element={<AdminEventDashboard />} />
      <Route path="events" element={<AdminEventDashboard />} />
      <Route path="jay-gurudev" element={<AdminEventDashboard />} />
      <Route path="jay-gurudev-events" element={<AdminEventDashboard />} />
      <Route path="event-users" element={<EventUsersManagement />} />
      <Route path="event-clients" element={<EventUsersManagement />} />

      {/* ── 3. Real Estate Plotting Sub-Routes ── */}
      <Route path="plotting" element={<PlottingDashboard />} />
      <Route path="kashiplot" element={<PlottingDashboard />} />
      <Route path="real-estate" element={<PlottingDashboard />} />
      <Route path="plotting-users" element={<PlottingUsersManagement />} />
      <Route path="plotting-agents" element={<PlottingUsersManagement />} />

      {/* ── 4. Office & Commercial Rent Sub-Routes ── */}
      <Route path="rent-office" element={<AdminRentDashboard />} />
      <Route path="office-rent" element={<AdminRentDashboard />} />
      <Route path="rent" element={<AdminRentDashboard />} />
      <Route path="commercial" element={<AdminRentDashboard />} />
      <Route path="rent-tenants" element={<RentTenantsManagement />} />
      <Route path="tenants" element={<RentTenantsManagement />} />

      {/* ── 5. RB Software & Media Hub Sub-Routes ── */}
      <Route path="rb-software" element={<RBSoftwareDashboard />} />
      <Route path="software" element={<RBSoftwareDashboard />} />
      <Route path="media" element={<RBSoftwareDashboard />} />
      <Route path="rb-media" element={<RBSoftwareDashboard />} />
      <Route path="photography" element={<RBSoftwareDashboard />} />
      <Route path="software-clients" element={<SoftwareClientsManagement />} />

      {/* ── Business Overview Master Manager ── */}
      <Route path="business-folders" element={<BusinessDirectoryManager />} />
      <Route path="overview" element={<BusinessDirectoryManager />} />

      {/* ── Shared Modules ── */}
      <Route path="customers" element={<CustomerManagementPage />} />
      <Route path="staff" element={<StaffManagementPage />} />
      <Route path="students" element={<StudentAcademyPage />} />
      <Route path="services" element={<ServiceCatalogPage />} />
      <Route path="appointments" element={<AppointmentsCalendarPage />} />
      <Route path="billing" element={<BillingPOSPage />} />
      <Route path="inventory" element={<InventorySuppliersPage />} />
      <Route path="reports" element={<ReportsPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="profile" element={<AdminProfilePage />} />
      <Route path="notifications" element={<NotificationsPage />} />
    </Route>
  </>
);

export default AdminRoutes;
