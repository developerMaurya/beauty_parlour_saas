/**
 * @file index.js
 * @description Frontend Modular Monolith Entrypoint for Beauty Parlour SaaS Suite.
 * @module frontend/beauty-parlour
 */

export { default as BeautyParlourModuleHub } from './BeautyParlourModuleHub.jsx';

export default {
  name: 'beauty-parlour',
  title: 'Beauty Parlour & Luxury Salon SaaS',
  subModules: ['admin', 'staff', 'student', 'customer', 'guest', 'public', 'superadmin'],
};

