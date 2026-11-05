/**
 * @file permissions.constants.js
 * @description Standardized Tenant Permission Matrix and Default Configurations
 */

export const DEFAULT_PERMISSIONS = {
  // Module Access
  appointments: true,
  customerManagement: true,
  staffManagement: true,
  inventory: false,
  financialReports: false,
  payroll: false,
  academyModule: false,
  marketing: false,
  // Infrastructure
  customDomain: false,
  customCloudflare: false,
  customDatabase: false,
  ipWhitelist: false,
  // Business
  multiBranch: false,
  apiAccess: false,
  webhooks: false,
  dataExport: true,
  whiteLabelBranding: true,
};

export const PERMISSION_DEFINITIONS = [
  {
    section: 'Module Access',
    icon: '📦',
    items: [
      { key: 'appointments', name: 'Appointments & Bookings', desc: 'Book, reschedule and manage appointments' },
      { key: 'customerManagement', name: 'Customer Management', desc: 'CRM and customer profile management' },
      { key: 'staffManagement', name: 'Staff Management', desc: 'Staff profiles, roles and scheduling' },
      { key: 'inventory', name: 'Inventory & Products', desc: 'Product catalog and stock management' },
      { key: 'financialReports', name: 'Financial Reports', desc: 'Revenue, billing and financial analytics' },
      { key: 'payroll', name: 'Payroll Module', desc: 'Staff payroll and salary management' },
      { key: 'academyModule', name: 'Student / Academy Module', desc: 'Beauty training courses and students' },
      { key: 'marketing', name: 'Marketing & Promotions', desc: 'Offers, coupons and campaign tools' },
    ],
  },
  {
    section: 'Infrastructure',
    icon: '☁️',
    items: [
      { key: 'customDomain', name: 'Custom Domain (White-Label)', desc: 'Point own domain to this tenant portal' },
      { key: 'customCloudflare', name: 'Custom Cloudflare Storage', desc: 'Bring own Cloudflare Images account' },
      { key: 'customDatabase', name: 'Custom Database (BYODB)', desc: 'Connect own MongoDB cluster URI' },
      { key: 'ipWhitelist', name: 'IP Whitelist / Geo-Restriction', desc: 'Restrict portal access by IP address' },
    ],
  },
  {
    section: 'Business Controls',
    icon: '💼',
    items: [
      { key: 'multiBranch', name: 'Multi-Branch / Chain Mode', desc: 'Manage multiple salon branches' },
      { key: 'apiAccess', name: 'API Access (Developer Mode)', desc: 'REST API access and developer tokens' },
      { key: 'webhooks', name: 'Webhook Integration', desc: 'Real-time event webhooks to external systems' },
      { key: 'dataExport', name: 'Data Export (CSV/PDF)', desc: 'Export reports and customer data' },
      { key: 'whiteLabelBranding', name: 'White-Label Branding', desc: 'Custom logo, colors and brand identity' },
    ],
  },
];
