/**
 * @file index.js
 * @description Frontend Modular Monolith Entrypoint for Software Services Suite.
 * @module frontend/software
 */

export { default as SoftwareServicesView } from './SoftwareServicesView.jsx';

export default {
  name: 'software',
  title: 'Multi-Tenant SaaS Software Suite',
  verticals: ['grocery', 'institute', 'electronics', 'boutique'],
};

