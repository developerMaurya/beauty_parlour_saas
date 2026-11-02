# Super Admin Frontend Dashboard Architecture

## 1. Overview

The Super Admin Control Panel is built with **React 19**, **Vite**, **React Router v7**, and **Vanilla CSS** design system tokens. It provides a control plane interface for administering multi-tenant beauty businesses, database clusters, subscription plans, and platform settings.

---

## 2. Component Architecture

```
frontend/src/
├── app/
├── components/
│   ├── Badge.jsx            # Status & attribute indicators (Active, Trial, Suspended, Healthy, Mode A/B)
│   ├── ConfirmModal.jsx     # Destructive action safeguards (Delete, Suspend, Migration)
│   ├── DataTable.jsx        # Data table with live search, sorting, filtering, and pagination
│   ├── Header.jsx           # Top navigation bar, cluster status, user profile
│   ├── Modal.jsx            # Glassmorphic modal dialogs
│   ├── Sidebar.jsx          # Collapsible 16-section navigation hierarchy
│   └── StatCard.jsx         # KPI metric widgets with delta indicators
├── context/
│   ├── AuthContext.jsx      # Super Admin session, role enforcement, and token persistence
│   └── ToastContext.jsx     # Floating animated alert toast notification system
├── layouts/
│   └── SuperAdminLayout.jsx # Layout shell with sidebar, header, and route protection
├── modules/superadmin/pages/
│   ├── Login.jsx            # Split-screen luxury dark authentication portal
│   ├── Dashboard.jsx        # Executive dashboard with live MongoDB Atlas metrics
│   ├── TenantsList.jsx      # Tenant management, search, and lifecycle controls
│   ├── TenantCreateWizard.jsx # 6-Step multi-tenant provisioning wizard
│   ├── TenantDetail.jsx     # Tenant control center: DB health, domains, backups, migration
│   ├── DatabasesList.jsx    # Cluster nodes, connection tests, and health diagnostics
│   ├── PlansList.jsx        # Subscription tiers and feature matrix configurator
│   ├── SubscriptionsList.jsx# Tenant subscriptions, renewals, extensions, and cancellations
│   ├── FeaturesList.jsx     # Operational features and category catalogue
│   ├── AddonsList.jsx       # Quota top-up packages (SMS, storage, branches)
│   ├── DomainsList.jsx      # Hostname routing, DNS verification instructions, SSL checks
│   ├── BillingView.jsx      # Financial ledger, manual invoices, and refund settlements
│   ├── CouponsList.jsx      # Promotional discount codes and redemptions
│   ├── UsageView.jsx        # Platform telemetry, quotas, and limits editor
│   ├── NotificationsView.jsx# Broadcast dispatcher and delivery logs
│   ├── SupportView.jsx      # Support ticketing helpdesk with conversation threads
│   ├── AuditLogsView.jsx    # Immutable compliance audit log inspector
│   ├── SettingsView.jsx     # White-label branding, SMTP, payment gateways, security
│   └── ProfileView.jsx      # Master Super Admin identity & password security
├── routes/
│   └── superadmin.routes.jsx# Full route tree definition
├── services/api/
│   ├── axiosClient.js       # Central Axios instance with JWT interceptor & auto-refresh
│   └── superadmin.api.js    # Typed API client services for all modules
└── styles/
    └── index.css            # Complete design system with CSS custom properties
```

---

## 3. Aesthetic & UI Design Principles

- **Color Harmony**: Dark mode luxury slate palette (`#080C15`) with subtle Indigo/Rose accents, glassmorphic card overlays (`rgba(17, 24, 39, 0.75)` with `backdrop-filter: blur(16px)`), and high-contrast typography.
- **Typography**: Google Fonts Outfit for headings, Plus Jakarta Sans for body text, and JetBrains Mono for identifiers and code blocks.
- **Micro-Interactions**: Hover elevation, glowing borders on focus, smooth slide-up modal animations, and live loading spinners.
- **Zero Mock Data**: Every screen connects directly to backend APIs via `axiosClient` with real data from MongoDB Atlas.
