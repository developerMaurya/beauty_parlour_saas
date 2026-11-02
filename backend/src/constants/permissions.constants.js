/**
 * @file permissions.constants.js
 * @description Standard System Permissions and Permission Groups for Tenant RBAC.
 * @module backend/src/constants/permissions.constants
 */

export const SYSTEM_PERMISSIONS = [
  // Dashboard
  { code: 'dashboard.view', name: 'View Dashboard & KPIs', group: 'Dashboard', description: 'Access to tenant metrics, analytics, and revenue cards' },

  // Staff & HR
  { code: 'staff.view', name: 'View Staff Members', group: 'Staff', description: 'View staff directory, profiles, and attendance' },
  { code: 'staff.create', name: 'Create Staff', group: 'Staff', description: 'Add new staff members and employees' },
  { code: 'staff.update', name: 'Update Staff', group: 'Staff', description: 'Edit staff profiles, documents, salary, and schedules' },
  { code: 'staff.delete', name: 'Delete Staff', group: 'Staff', description: 'Remove or deactivate staff members' },
  { code: 'attendance.manage', name: 'Manage Attendance', group: 'Staff', description: 'Check-in, check-out, and approve staff leaves' },

  // Students & Academy
  { code: 'student.view', name: 'View Students', group: 'Students', description: 'View student directory, plans, and enrollments' },
  { code: 'student.create', name: 'Create Students', group: 'Students', description: 'Enroll new students into academy plans' },
  { code: 'student.update', name: 'Update Students', group: 'Students', description: 'Edit student profiles, attendance, and certificates' },
  { code: 'student.delete', name: 'Delete Students', group: 'Students', description: 'Remove or drop student enrollments' },

  // Customers
  { code: 'customer.view', name: 'View Customers', group: 'Customers', description: 'View customer directory and history' },
  { code: 'customer.create', name: 'Create Customers', group: 'Customers', description: 'Add new customers to the directory' },
  { code: 'customer.update', name: 'Update Customers', group: 'Customers', description: 'Edit customer profiles, memberships, and notes' },
  { code: 'customer.delete', name: 'Delete Customers', group: 'Customers', description: 'Remove or block customers' },

  // Services
  { code: 'service.view', name: 'View Services', group: 'Services', description: 'View service catalogue, categories, and subcategories' },
  { code: 'service.create', name: 'Create Services', group: 'Services', description: 'Add new services, options, and add-ons' },
  { code: 'service.update', name: 'Update Services', group: 'Services', description: 'Modify service pricing, duration, and details' },
  { code: 'service.delete', name: 'Delete Services', group: 'Services', description: 'Delete services and categories' },

  // Packages & Offers
  { code: 'package.view', name: 'View Packages', group: 'Packages', description: 'View packages, offers, and coupons' },
  { code: 'package.create', name: 'Create Packages', group: 'Packages', description: 'Create dynamic packages and promotional offers' },
  { code: 'package.update', name: 'Update Packages', group: 'Packages', description: 'Update package items, pricing, and terms' },
  { code: 'package.delete', name: 'Delete Packages', group: 'Packages', description: 'Remove packages or discount coupons' },

  // Appointments & Home Services
  { code: 'appointment.view', name: 'View Appointments', group: 'Appointments', description: 'View appointment calendar and booking queue' },
  { code: 'appointment.create', name: 'Book Appointments', group: 'Appointments', description: 'Schedule new store and home service appointments' },
  { code: 'appointment.update', name: 'Manage Appointments', group: 'Appointments', description: 'Confirm, reschedule, assign, or advance status' },
  { code: 'appointment.delete', name: 'Cancel Appointments', group: 'Appointments', description: 'Cancel appointments and record reasons' },
  { code: 'homeservice.dispatch', name: 'Dispatch Home Services', group: 'Appointments', description: 'Live tracking and driver/staff dispatch for home services' },

  // Billing & POS
  { code: 'billing.view', name: 'View Invoices & Bills', group: 'Billing', description: 'View POS receipts and transactions' },
  { code: 'billing.create', name: 'Generate Bills', group: 'Billing', description: 'Create new bills, accept payments, and issue receipts' },
  { code: 'billing.update', name: 'Update & Refund Bills', group: 'Billing', description: 'Process refunds, discounts, and bill adjustments' },

  // Inventory & Products
  { code: 'inventory.view', name: 'View Inventory', group: 'Inventory', description: 'View products, stock levels, and purchase orders' },
  { code: 'inventory.create', name: 'Add Products & Purchases', group: 'Inventory', description: 'Create products, record stock-in, and purchase orders' },
  { code: 'inventory.update', name: 'Adjust Inventory', group: 'Inventory', description: 'Stock adjustments, transfers, and wastage records' },

  // Facilities & Expenses
  { code: 'facilities.view', name: 'View Facilities & Expenses', group: 'Facilities', description: 'View electricity bills, rent, assets, and expenses' },
  { code: 'facilities.manage', name: 'Manage Facilities', group: 'Facilities', description: 'Record meter readings, rent payments, maintenance, and scrap' },

  // Reports
  { code: 'reports.view', name: 'View Reports', group: 'Reports', description: 'Access financial, sales, staff, and operational reports' },
  { code: 'reports.export', name: 'Export Reports', group: 'Reports', description: 'Download CSV, Excel, and PDF reports' },

  // Website & CMS
  { code: 'website.manage', name: 'Manage Website', group: 'Website', description: 'Configure public website content, gallery, and testimonials' },

  // Communication & Providers
  { code: 'communication.manage', name: 'Manage Communication', group: 'Communication', description: 'Configure WhatsApp, SMS, email providers, and notification templates' },

  // Settings & System
  { code: 'settings.view', name: 'View Settings', group: 'Settings', description: 'View business settings, branches, and configurations' },
  { code: 'settings.update', name: 'Update Settings', group: 'Settings', description: 'Change business policies, hours, payment gateways, and branch setups' },
  { code: 'roles.manage', name: 'Manage Roles & Permissions', group: 'Settings', description: 'Create custom roles and assign dynamic permissions' },
  { code: 'audit.view', name: 'View Audit Logs', group: 'Audit', description: 'Inspect sensitive administrative audit trails' },
];

export const PERMISSION_GROUPS = [
  'Dashboard',
  'Staff',
  'Students',
  'Customers',
  'Services',
  'Packages',
  'Appointments',
  'Billing',
  'Inventory',
  'Facilities',
  'Reports',
  'Website',
  'Communication',
  'Settings',
  'Audit',
];

export default {
  SYSTEM_PERMISSIONS,
  PERMISSION_GROUPS,
};
