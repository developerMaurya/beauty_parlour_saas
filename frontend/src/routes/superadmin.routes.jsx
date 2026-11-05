/**
 * @file superadmin.routes.jsx
 * @description Super Admin Routing Definitions
 */

import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import SuperAdminLayout from '../layouts/SuperAdminLayout';
import Login from '../modules/superadmin/pages/Login';
import Dashboard from '../modules/superadmin/pages/Dashboard';
import TenantsList from '../modules/superadmin/pages/TenantsList';
import TenantCreateWizard from '../modules/superadmin/pages/TenantCreateWizard';
import TenantDetail from '../modules/superadmin/pages/TenantDetail';
import PlansList from '../modules/superadmin/pages/PlansList';
import SubscriptionsList from '../modules/superadmin/pages/SubscriptionsList';
import FeaturesList from '../modules/superadmin/pages/FeaturesList';
import AddonsList from '../modules/superadmin/pages/AddonsList';
import DomainsList from '../modules/superadmin/pages/DomainsList';
import DatabasesList from '../modules/superadmin/pages/DatabasesList';
import BillingView from '../modules/superadmin/pages/BillingView';
import CouponsList from '../modules/superadmin/pages/CouponsList';
import UsageView from '../modules/superadmin/pages/UsageView';
import NotificationsView from '../modules/superadmin/pages/NotificationsView';
import SupportView from '../modules/superadmin/pages/SupportView';
import AuditLogsView from '../modules/superadmin/pages/AuditLogsView';
import SettingsView from '../modules/superadmin/pages/SettingsView';
import ProfileView from '../modules/superadmin/pages/ProfileView';
import VerticalsList from '../modules/superadmin/pages/VerticalsList';
import ThemesList from '../modules/superadmin/pages/ThemesList';
import UnifiedAccessManagementCenter from '../modules/superadmin/pages/UnifiedAccessManagementCenter';
import MasterDataManagement from '../modules/superadmin/pages/MasterDataManagement';
import CustomerJourneyGovernanceView from '../modules/superadmin/pages/CustomerJourneyGovernanceView';

export const SuperAdminRoutes = (
  <>
    {/* Public Login Route */}
    <Route path="/superadmin/login" element={<Login />} />

    {/* Protected Super Admin Dashboard Routes */}
    <Route path="/superadmin" element={<SuperAdminLayout />}>
      <Route index element={<Navigate to="/superadmin/dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="requests" element={<CustomerJourneyGovernanceView />} />
      <Route path="verifications" element={<CustomerJourneyGovernanceView />} />
      <Route path="governance" element={<CustomerJourneyGovernanceView />} />
      <Route path="tenants" element={<TenantsList />} />
      <Route path="tenants/create" element={<TenantCreateWizard />} />
      <Route path="tenants/:tenantId" element={<TenantDetail />} />
      <Route path="access-control" element={<UnifiedAccessManagementCenter />} />
      <Route path="management-center" element={<UnifiedAccessManagementCenter />} />
      <Route path="masters" element={<MasterDataManagement />} />
      <Route path="master-data" element={<MasterDataManagement />} />
      <Route path="verticals" element={<VerticalsList />} />
      <Route path="themes" element={<ThemesList />} />
      <Route path="plans" element={<PlansList />} />
      <Route path="subscriptions" element={<SubscriptionsList />} />
      <Route path="features" element={<FeaturesList />} />
      <Route path="addons" element={<AddonsList />} />
      <Route path="domains" element={<DomainsList />} />
      <Route path="databases" element={<DatabasesList />} />
      <Route path="billing" element={<BillingView />} />
      <Route path="coupons" element={<CouponsList />} />
      <Route path="usage" element={<UsageView />} />
      <Route path="notifications" element={<NotificationsView />} />
      <Route path="support" element={<SupportView />} />
      <Route path="audit-logs" element={<AuditLogsView />} />
      <Route path="settings" element={<SettingsView />} />
      <Route path="profile" element={<ProfileView />} />
    </Route>
  </>
);

export default SuperAdminRoutes;

