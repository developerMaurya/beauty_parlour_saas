/**
 * @file adminApi.js
 * @description Centralized API Fetchers for Tenant Admin System.
 * Fully conforms to Phase 04 Section 64 requirements.
 * @module frontend/src/services/api/admin/adminApi
 */

import adminAxiosClient from './adminAxiosClient.js';

// Helper to convert params object to URLSearchParams / query string
const buildParams = (params = {}) => {
  const query = {};
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      query[key] = params[key];
    }
  });
  return query;
};

// 1. Auth Fetcher
export const authFetcher = {
  login: (data) => adminAxiosClient.post('/admin/auth/login', data),
  logout: () => adminAxiosClient.post('/admin/auth/logout'),
  refresh: (data) => adminAxiosClient.post('/admin/auth/refresh', data),
  me: () => adminAxiosClient.get('/admin/auth/me'),
  switchBranch: (branchId) => adminAxiosClient.post('/admin/auth/switch-branch', { branchId }),
};

// 2. Dashboard Fetcher
export const dashboardFetcher = {
  getOverview: (params) => adminAxiosClient.get('/admin/dashboard/overview', { params: buildParams(params) }),
  getOperationsQueue: (params) => adminAxiosClient.get('/admin/dashboard/operations-queue', { params: buildParams(params) }),
};

// 3. User Fetcher
export const userFetcher = {
  list: (params) => adminAxiosClient.get('/admin/users', { params: buildParams(params) }),
  get: (userId) => adminAxiosClient.get(`/admin/users/${userId}`),
  create: (data) => adminAxiosClient.post('/admin/users', data),
  update: (userId, data) => adminAxiosClient.patch(`/admin/users/${userId}`, data),
  delete: (userId) => adminAxiosClient.delete(`/admin/users/${userId}`),
  updateStatus: (userId, status) => adminAxiosClient.patch(`/admin/users/${userId}/status`, { status }),
  block: (userId, data) => adminAxiosClient.post(`/admin/users/${userId}/block`, data),
  unblock: (userId) => adminAxiosClient.post(`/admin/users/${userId}/unblock`),
  resetPassword: (userId, data) => adminAxiosClient.post(`/admin/users/${userId}/reset-password`, data),
  revokeSessions: (userId) => adminAxiosClient.post(`/admin/users/${userId}/revoke-sessions`),
};

// 4. Role Fetcher
export const roleFetcher = {
  list: (params) => adminAxiosClient.get('/admin/roles', { params: buildParams(params) }),
  get: (roleId) => adminAxiosClient.get(`/admin/roles/${roleId}`),
  create: (data) => adminAxiosClient.post('/admin/roles', data),
  update: (roleId, data) => adminAxiosClient.patch(`/admin/roles/${roleId}`, data),
  delete: (roleId) => adminAxiosClient.delete(`/admin/roles/${roleId}`),
  getPermissions: (roleId) => adminAxiosClient.get(`/admin/roles/${roleId}/permissions`),
  updatePermissions: (roleId, permissions) => adminAxiosClient.put(`/admin/roles/${roleId}/permissions`, { permissions }),
};

// 5. Permission Fetcher
export const permissionFetcher = {
  list: () => adminAxiosClient.get('/admin/permissions'),
  getGrouped: () => adminAxiosClient.get('/admin/permissions/grouped'),
};

// 6. Branch Fetcher
export const branchFetcher = {
  list: (params) => adminAxiosClient.get('/admin/branches', { params: buildParams(params) }),
  get: (branchId) => adminAxiosClient.get(`/admin/branches/${branchId}`),
  create: (data) => adminAxiosClient.post('/admin/branches', data),
  update: (branchId, data) => adminAxiosClient.patch(`/admin/branches/${branchId}`, data),
  delete: (branchId) => adminAxiosClient.delete(`/admin/branches/${branchId}`),
  updateStatus: (branchId, status) => adminAxiosClient.patch(`/admin/branches/${branchId}/status`, { status }),
  setDefault: (branchId) => adminAxiosClient.post(`/admin/branches/${branchId}/set-default`),
  getDashboard: (branchId) => adminAxiosClient.get(`/admin/branches/${branchId}/dashboard`),
  getStats: (branchId) => adminAxiosClient.get(`/admin/branches/${branchId}/stats`),
  getHours: (branchId) => adminAxiosClient.get(`/admin/branches/${branchId}/hours`),
  updateHours: (branchId, data) => adminAxiosClient.patch(`/admin/branches/${branchId}/hours`, data),
};

// 7. Department Fetcher
export const departmentFetcher = {
  list: (params) => adminAxiosClient.get('/admin/departments', { params: buildParams(params) }),
  get: (departmentId) => adminAxiosClient.get(`/admin/departments/${departmentId}`),
  create: (data) => adminAxiosClient.post('/admin/departments', data),
  update: (departmentId, data) => adminAxiosClient.patch(`/admin/departments/${departmentId}`, data),
  delete: (departmentId) => adminAxiosClient.delete(`/admin/departments/${departmentId}`),
  updateStatus: (departmentId, status) => adminAxiosClient.patch(`/admin/departments/${departmentId}/status`, { status }),
};

// 8. Designation Fetcher
export const designationFetcher = {
  list: (params) => adminAxiosClient.get('/admin/designations', { params: buildParams(params) }),
  get: (designationId) => adminAxiosClient.get(`/admin/designations/${designationId}`),
  create: (data) => adminAxiosClient.post('/admin/designations', data),
  update: (designationId, data) => adminAxiosClient.patch(`/admin/designations/${designationId}`, data),
  delete: (designationId) => adminAxiosClient.delete(`/admin/designations/${designationId}`),
  updateStatus: (designationId, status) => adminAxiosClient.patch(`/admin/designations/${designationId}/status`, { status }),
};

// 9. Skill Fetcher
export const skillFetcher = {
  list: (params) => adminAxiosClient.get('/admin/skills', { params: buildParams(params) }),
  get: (skillId) => adminAxiosClient.get(`/admin/skills/${skillId}`),
  create: (data) => adminAxiosClient.post('/admin/skills', data),
  update: (skillId, data) => adminAxiosClient.patch(`/admin/skills/${skillId}`, data),
  delete: (skillId) => adminAxiosClient.delete(`/admin/skills/${skillId}`),
};

// 10. Staff Fetcher
export const staffFetcher = {
  list: (params) => adminAxiosClient.get('/admin/staff', { params: buildParams(params) }),
  get: (staffId) => adminAxiosClient.get(`/admin/staff/${staffId}`),
  create: (data) => adminAxiosClient.post('/admin/staff', data),
  update: (staffId, data) => adminAxiosClient.patch(`/admin/staff/${staffId}`, data),
  delete: (staffId) => adminAxiosClient.delete(`/admin/staff/${staffId}`),
  activate: (staffId) => adminAxiosClient.post(`/admin/staff/${staffId}/activate`),
  deactivate: (staffId) => adminAxiosClient.post(`/admin/staff/${staffId}/deactivate`),
  block: (staffId, data) => adminAxiosClient.post(`/admin/staff/${staffId}/block`, data),
  unblock: (staffId) => adminAxiosClient.post(`/admin/staff/${staffId}/unblock`),
  getProfile: (staffId) => adminAxiosClient.get(`/admin/staff/${staffId}/profile`),
  getActivity: (staffId) => adminAxiosClient.get(`/admin/staff/${staffId}/activity`),
  getAttendance: (staffId) => adminAxiosClient.get(`/admin/staff/${staffId}/attendance`),
  getLeaves: (staffId) => adminAxiosClient.get(`/admin/staff/${staffId}/leaves`),
  getHolidays: (staffId) => adminAxiosClient.get(`/admin/staff/${staffId}/holidays`),
  getServices: (staffId) => adminAxiosClient.get(`/admin/staff/${staffId}/services`),
  getAppointments: (staffId) => adminAxiosClient.get(`/admin/staff/${staffId}/appointments`),
  getCommission: (staffId) => adminAxiosClient.get(`/admin/staff/${staffId}/commission`),
  getSalary: (staffId) => adminAxiosClient.get(`/admin/staff/${staffId}/salary`),
  getDocuments: (staffId) => adminAxiosClient.get(`/admin/staff/${staffId}/documents`),
  getCertificates: (staffId) => adminAxiosClient.get(`/admin/staff/${staffId}/certificates`),
  getBirthdays: (staffId) => adminAxiosClient.get(`/admin/staff/${staffId}/birthdays`),
  getPerformance: (staffId) => adminAxiosClient.get(`/admin/staff/${staffId}/performance`),
};

// 11. Student Fetcher
export const studentFetcher = {
  list: (params) => adminAxiosClient.get('/admin/students', { params: buildParams(params) }),
  get: (studentId) => adminAxiosClient.get(`/admin/students/${studentId}`),
  create: (data) => adminAxiosClient.post('/admin/students', data),
  update: (studentId, data) => adminAxiosClient.patch(`/admin/students/${studentId}`, data),
  delete: (studentId) => adminAxiosClient.delete(`/admin/students/${studentId}`),
  activate: (studentId) => adminAxiosClient.post(`/admin/students/${studentId}/activate`),
  deactivate: (studentId) => adminAxiosClient.post(`/admin/students/${studentId}/deactivate`),
  block: (studentId, data) => adminAxiosClient.post(`/admin/students/${studentId}/block`, data),
  unblock: (studentId) => adminAxiosClient.post(`/admin/students/${studentId}/unblock`),
  getAttendance: (studentId) => adminAxiosClient.get(`/admin/students/${studentId}/attendance`),
  getEnrollments: (studentId) => adminAxiosClient.get(`/admin/students/${studentId}/enrollments`),
  getCertificates: (studentId) => adminAxiosClient.get(`/admin/students/${studentId}/certificates`),
};

// 12. Student Plan Fetcher
export const studentPlanFetcher = {
  list: (params) => adminAxiosClient.get('/admin/student-plans', { params: buildParams(params) }),
  get: (planId) => adminAxiosClient.get(`/admin/student-plans/${planId}`),
  create: (data) => adminAxiosClient.post('/admin/student-plans', data),
  update: (planId, data) => adminAxiosClient.patch(`/admin/student-plans/${planId}`, data),
  delete: (planId) => adminAxiosClient.delete(`/admin/student-plans/${planId}`),
  updateStatus: (planId, status) => adminAxiosClient.patch(`/admin/student-plans/${planId}/status`, { status }),
};

// 13. Enrollment Fetcher
export const enrollmentFetcher = {
  list: (params) => adminAxiosClient.get('/admin/enrollments', { params: buildParams(params) }),
  get: (enrollmentId) => adminAxiosClient.get(`/admin/enrollments/${enrollmentId}`),
  create: (data) => adminAxiosClient.post('/admin/enrollments', data),
  update: (enrollmentId, data) => adminAxiosClient.patch(`/admin/enrollments/${enrollmentId}`, data),
  delete: (enrollmentId) => adminAxiosClient.delete(`/admin/enrollments/${enrollmentId}`),
  createForStudent: (studentId, data) => adminAxiosClient.post(`/admin/students/${studentId}/enrollments`, data),
  getForStudent: (studentId) => adminAxiosClient.get(`/admin/students/${studentId}/enrollments`),
};

// 14. Customer Fetcher
export const customerFetcher = {
  list: (params) => adminAxiosClient.get('/admin/customers', { params: buildParams(params) }),
  get: (customerId) => adminAxiosClient.get(`/admin/customers/${customerId}`),
  create: (data) => adminAxiosClient.post('/admin/customers', data),
  update: (customerId, data) => adminAxiosClient.patch(`/admin/customers/${customerId}`, data),
  delete: (customerId) => adminAxiosClient.delete(`/admin/customers/${customerId}`),
  block: (customerId, data) => adminAxiosClient.post(`/admin/customers/${customerId}/block`, data),
  unblock: (customerId) => adminAxiosClient.post(`/admin/customers/${customerId}/unblock`),
  getAppointments: (customerId) => adminAxiosClient.get(`/admin/customers/${customerId}/appointments`),
  getServices: (customerId) => adminAxiosClient.get(`/admin/customers/${customerId}/services`),
  getPackages: (customerId) => adminAxiosClient.get(`/admin/customers/${customerId}/packages`),
  getBills: (customerId) => adminAxiosClient.get(`/admin/customers/${customerId}/bills`),
  getPayments: (customerId) => adminAxiosClient.get(`/admin/customers/${customerId}/payments`),
  getVisits: (customerId) => adminAxiosClient.get(`/admin/customers/${customerId}/visits`),
  getNotes: (customerId) => adminAxiosClient.get(`/admin/customers/${customerId}/notes`),
  addNote: (customerId, data) => adminAxiosClient.post(`/admin/customers/${customerId}/notes`, data),
  getActivity: (customerId) => adminAxiosClient.get(`/admin/customers/${customerId}/activity`),
};

// 15. Service Category Fetcher
export const serviceCategoryFetcher = {
  list: (params) => adminAxiosClient.get('/admin/service-categories', { params: buildParams(params) }),
  get: (categoryId) => adminAxiosClient.get(`/admin/service-categories/${categoryId}`),
  create: (data) => adminAxiosClient.post('/admin/service-categories', data),
  update: (categoryId, data) => adminAxiosClient.patch(`/admin/service-categories/${categoryId}`, data),
  delete: (categoryId) => adminAxiosClient.delete(`/admin/service-categories/${categoryId}`),
};

// 16. Service Subcategory Fetcher
export const serviceSubcategoryFetcher = {
  list: (params) => adminAxiosClient.get('/admin/service-subcategories', { params: buildParams(params) }),
  get: (subcategoryId) => adminAxiosClient.get(`/admin/service-subcategories/${subcategoryId}`),
  create: (data) => adminAxiosClient.post('/admin/service-subcategories', data),
  update: (subcategoryId, data) => adminAxiosClient.patch(`/admin/service-subcategories/${subcategoryId}`, data),
  delete: (subcategoryId) => adminAxiosClient.delete(`/admin/service-subcategories/${subcategoryId}`),
};

// 17. Service Fetcher
export const serviceFetcher = {
  list: (params) => adminAxiosClient.get('/admin/services', { params: buildParams(params) }),
  get: (serviceId) => adminAxiosClient.get(`/admin/services/${serviceId}`),
  create: (data) => adminAxiosClient.post('/admin/services', data),
  update: (serviceId, data) => adminAxiosClient.patch(`/admin/services/${serviceId}`, data),
  delete: (serviceId) => adminAxiosClient.delete(`/admin/services/${serviceId}`),
  updateStatus: (serviceId, status) => adminAxiosClient.patch(`/admin/services/${serviceId}/status`, { status }),
  duplicate: (serviceId) => adminAxiosClient.post(`/admin/services/${serviceId}/duplicate`),
  getAvailability: (serviceId, params) => adminAxiosClient.get(`/admin/services/${serviceId}/availability`, { params: buildParams(params) }),
};

// 18. Service Option Fetcher
export const serviceOptionFetcher = {
  list: (serviceId) => adminAxiosClient.get(`/admin/services/${serviceId}/options`),
  get: (serviceId, optionId) => adminAxiosClient.get(`/admin/services/${serviceId}/options/${optionId}`),
  create: (serviceId, data) => adminAxiosClient.post(`/admin/services/${serviceId}/options`, data),
  update: (serviceId, optionId, data) => adminAxiosClient.patch(`/admin/services/${serviceId}/options/${optionId}`, data),
  delete: (serviceId, optionId) => adminAxiosClient.delete(`/admin/services/${serviceId}/options/${optionId}`),
};

// 19. Service Addon Fetcher
export const serviceAddonFetcher = {
  list: (serviceId) => adminAxiosClient.get(`/admin/services/${serviceId}/addons`),
  create: (serviceId, data) => adminAxiosClient.post(`/admin/services/${serviceId}/addons`, data),
  update: (serviceId, addonId, data) => adminAxiosClient.patch(`/admin/services/${serviceId}/addons/${addonId}`, data),
  delete: (serviceId, addonId) => adminAxiosClient.delete(`/admin/services/${serviceId}/addons/${addonId}`),
};

// 20. Package Fetcher
export const packageFetcher = {
  list: (params) => adminAxiosClient.get('/admin/packages', { params: buildParams(params) }),
  get: (packageId) => adminAxiosClient.get(`/admin/packages/${packageId}`),
  create: (data) => adminAxiosClient.post('/admin/packages', data),
  update: (packageId, data) => adminAxiosClient.patch(`/admin/packages/${packageId}`, data),
  delete: (packageId) => adminAxiosClient.delete(`/admin/packages/${packageId}`),
  updateStatus: (packageId, status) => adminAxiosClient.patch(`/admin/packages/${packageId}/status`, { status }),
  duplicate: (packageId) => adminAxiosClient.post(`/admin/packages/${packageId}/duplicate`),
};

// 21. Offer Fetcher
export const offerFetcher = {
  list: (params) => adminAxiosClient.get('/admin/offers', { params: buildParams(params) }),
  get: (offerId) => adminAxiosClient.get(`/admin/offers/${offerId}`),
  create: (data) => adminAxiosClient.post('/admin/offers', data),
  update: (offerId, data) => adminAxiosClient.patch(`/admin/offers/${offerId}`, data),
  delete: (offerId) => adminAxiosClient.delete(`/admin/offers/${offerId}`),
  activate: (offerId) => adminAxiosClient.post(`/admin/offers/${offerId}/activate`),
  deactivate: (offerId) => adminAxiosClient.post(`/admin/offers/${offerId}/deactivate`),
};

// 22. Coupon Fetcher
export const couponFetcher = {
  list: (params) => adminAxiosClient.get('/admin/coupons', { params: buildParams(params) }),
  get: (couponId) => adminAxiosClient.get(`/admin/coupons/${couponId}`),
  create: (data) => adminAxiosClient.post('/admin/coupons', data),
  update: (couponId, data) => adminAxiosClient.patch(`/admin/coupons/${couponId}`, data),
  delete: (couponId) => adminAxiosClient.delete(`/admin/coupons/${couponId}`),
  updateStatus: (couponId, status) => adminAxiosClient.patch(`/admin/coupons/${couponId}/status`, { status }),
};

// 23. Appointment Fetcher
export const appointmentFetcher = {
  list: (params) => adminAxiosClient.get('/admin/appointments', { params: buildParams(params) }),
  get: (appointmentId) => adminAxiosClient.get(`/admin/appointments/${appointmentId}`),
  create: (data) => adminAxiosClient.post('/admin/appointments', data),
  update: (appointmentId, data) => adminAxiosClient.patch(`/admin/appointments/${appointmentId}`, data),
  delete: (appointmentId) => adminAxiosClient.delete(`/admin/appointments/${appointmentId}`),
  confirm: (appointmentId) => adminAxiosClient.post(`/admin/appointments/${appointmentId}/confirm`),
  checkIn: (appointmentId) => adminAxiosClient.post(`/admin/appointments/${appointmentId}/check-in`),
  start: (appointmentId) => adminAxiosClient.post(`/admin/appointments/${appointmentId}/start`),
  pause: (appointmentId) => adminAxiosClient.post(`/admin/appointments/${appointmentId}/pause`),
  resume: (appointmentId) => adminAxiosClient.post(`/admin/appointments/${appointmentId}/resume`),
  complete: (appointmentId) => adminAxiosClient.post(`/admin/appointments/${appointmentId}/complete`),
  cancel: (appointmentId, data) => adminAxiosClient.post(`/admin/appointments/${appointmentId}/cancel`, data),
  noShow: (appointmentId) => adminAxiosClient.post(`/admin/appointments/${appointmentId}/no-show`),
  reschedule: (appointmentId, data) => adminAxiosClient.post(`/admin/appointments/${appointmentId}/reschedule`, data),
  getAvailability: (params) => adminAxiosClient.get('/admin/appointments/availability', { params: buildParams(params) }),
};

// 24. Home Service Fetcher
export const homeServiceFetcher = {
  getLive: (params) => adminAxiosClient.get('/admin/home-services/live', { params: buildParams(params) }),
  getStatus: (appointmentId) => adminAxiosClient.get(`/admin/home-services/${appointmentId}/status`),
  getTracking: (appointmentId) => adminAxiosClient.get(`/admin/home-services/${appointmentId}/tracking`),
  assign: (appointmentId, data) => adminAxiosClient.post(`/admin/home-services/${appointmentId}/assign`, data),
  reassign: (appointmentId, data) => adminAxiosClient.post(`/admin/home-services/${appointmentId}/reassign`, data),
  // Staff side
  staffList: () => adminAxiosClient.get('/staff/home-services'),
  staffGet: (appointmentId) => adminAxiosClient.get(`/staff/home-services/${appointmentId}`),
  staffAccept: (appointmentId) => adminAxiosClient.post(`/staff/home-services/${appointmentId}/accept`),
  staffReject: (appointmentId, data) => adminAxiosClient.post(`/staff/home-services/${appointmentId}/reject`, data),
  staffOnTheWay: (appointmentId) => adminAxiosClient.post(`/staff/home-services/${appointmentId}/on-the-way`),
  staffArrived: (appointmentId) => adminAxiosClient.post(`/staff/home-services/${appointmentId}/arrived`),
  staffStart: (appointmentId) => adminAxiosClient.post(`/staff/home-services/${appointmentId}/start`),
  staffPause: (appointmentId) => adminAxiosClient.post(`/staff/home-services/${appointmentId}/pause`),
  staffResume: (appointmentId) => adminAxiosClient.post(`/staff/home-services/${appointmentId}/resume`),
  staffComplete: (appointmentId) => adminAxiosClient.post(`/staff/home-services/${appointmentId}/complete`),
  staffDepart: (appointmentId) => adminAxiosClient.post(`/staff/home-services/${appointmentId}/depart`),
  // Customer side
  customerGet: (appointmentId) => adminAxiosClient.get(`/customer/home-services/${appointmentId}`),
  customerTracking: (appointmentId) => adminAxiosClient.get(`/customer/home-services/${appointmentId}/tracking`),
  customerStatus: (appointmentId) => adminAxiosClient.get(`/customer/home-services/${appointmentId}/status`),
};

// 25. Billing Fetcher
export const billingFetcher = {
  list: (params) => adminAxiosClient.get('/admin/bills', { params: buildParams(params) }),
  get: (billId) => adminAxiosClient.get(`/admin/bills/${billId}`),
  create: (data) => adminAxiosClient.post('/admin/bills', data),
  update: (billId, data) => adminAxiosClient.patch(`/admin/bills/${billId}`, data),
  delete: (billId) => adminAxiosClient.delete(`/admin/bills/${billId}`),
  pay: (billId, data) => adminAxiosClient.post(`/admin/bills/${billId}/pay`, data),
  refund: (billId, data) => adminAxiosClient.post(`/admin/bills/${billId}/refund`, data),
  cancel: (billId, data) => adminAxiosClient.post(`/admin/bills/${billId}/cancel`, data),
  getReceipt: (billId) => adminAxiosClient.get(`/admin/bills/${billId}/receipt`),
};

// 26. Payment Method Fetcher
export const paymentFetcher = {
  getMethods: (params) => adminAxiosClient.get('/admin/payment-methods', { params: buildParams(params) }),
  createMethod: (data) => adminAxiosClient.post('/admin/payment-methods', data),
  updateMethod: (methodId, data) => adminAxiosClient.patch(`/admin/payment-methods/${methodId}`, data),
  deleteMethod: (methodId) => adminAxiosClient.delete(`/admin/payment-methods/${methodId}`),
};

// 27. Payment Gateway Fetcher
export const paymentGatewayFetcher = {
  list: () => adminAxiosClient.get('/admin/payment-gateways'),
  get: (gatewayId) => adminAxiosClient.get(`/admin/payment-gateways/${gatewayId}`),
  create: (data) => adminAxiosClient.post('/admin/payment-gateways', data),
  update: (gatewayId, data) => adminAxiosClient.patch(`/admin/payment-gateways/${gatewayId}`, data),
  delete: (gatewayId) => adminAxiosClient.delete(`/admin/payment-gateways/${gatewayId}`),
  test: (gatewayId) => adminAxiosClient.post(`/admin/payment-gateways/${gatewayId}/test`),
  activate: (gatewayId) => adminAxiosClient.post(`/admin/payment-gateways/${gatewayId}/activate`),
  deactivate: (gatewayId) => adminAxiosClient.post(`/admin/payment-gateways/${gatewayId}/deactivate`),
};

// 28. Product Fetcher
export const productFetcher = {
  list: (params) => adminAxiosClient.get('/admin/products', { params: buildParams(params) }),
  get: (productId) => adminAxiosClient.get(`/admin/products/${productId}`),
  create: (data) => adminAxiosClient.post('/admin/products', data),
  update: (productId, data) => adminAxiosClient.patch(`/admin/products/${productId}`, data),
  delete: (productId) => adminAxiosClient.delete(`/admin/products/${productId}`),
};

// 29. Inventory Fetcher
export const inventoryFetcher = {
  getStock: (params) => adminAxiosClient.get('/admin/inventory', { params: buildParams(params) }),
  getLowStock: (params) => adminAxiosClient.get('/admin/inventory/low-stock', { params: buildParams(params) }),
  stockIn: (data) => adminAxiosClient.post('/admin/inventory/stock-in', data),
  stockOut: (data) => adminAxiosClient.post('/admin/inventory/stock-out', data),
  adjust: (data) => adminAxiosClient.post('/admin/inventory/adjust', data),
  transfer: (data) => adminAxiosClient.post('/admin/inventory/transfer', data),
  getTransactions: (params) => adminAxiosClient.get('/admin/inventory/transactions', { params: buildParams(params) }),
};

// 30. Supplier Fetcher
export const supplierFetcher = {
  list: (params) => adminAxiosClient.get('/admin/suppliers', { params: buildParams(params) }),
  get: (supplierId) => adminAxiosClient.get(`/admin/suppliers/${supplierId}`),
  create: (data) => adminAxiosClient.post('/admin/suppliers', data),
  update: (supplierId, data) => adminAxiosClient.patch(`/admin/suppliers/${supplierId}`, data),
  delete: (supplierId) => adminAxiosClient.delete(`/admin/suppliers/${supplierId}`),
};

// 31. Purchase Fetcher
export const purchaseFetcher = {
  list: (params) => adminAxiosClient.get('/admin/purchases', { params: buildParams(params) }),
  get: (purchaseId) => adminAxiosClient.get(`/admin/purchases/${purchaseId}`),
  create: (data) => adminAxiosClient.post('/admin/purchases', data),
  update: (purchaseId, data) => adminAxiosClient.patch(`/admin/purchases/${purchaseId}`, data),
  delete: (purchaseId) => adminAxiosClient.delete(`/admin/purchases/${purchaseId}`),
};

// 32. Attendance Fetcher
export const attendanceFetcher = {
  list: (params) => adminAxiosClient.get('/admin/attendance', { params: buildParams(params) }),
  get: (attendanceId) => adminAxiosClient.get(`/admin/attendance/${attendanceId}`),
  checkIn: (data) => adminAxiosClient.post('/admin/attendance/check-in', data),
  checkOut: (data) => adminAxiosClient.post('/admin/attendance/check-out', data),
  getStaffAttendance: (staffId, params) => adminAxiosClient.get(`/admin/staff/${staffId}/attendance`, { params: buildParams(params) }),
  getReports: (params) => adminAxiosClient.get('/admin/attendance/reports', { params: buildParams(params) }),
};

// 33. Leave Fetcher
export const leaveFetcher = {
  list: (params) => adminAxiosClient.get('/admin/leaves', { params: buildParams(params) }),
  get: (leaveId) => adminAxiosClient.get(`/admin/leaves/${leaveId}`),
  create: (data) => adminAxiosClient.post('/admin/leaves', data),
  update: (leaveId, data) => adminAxiosClient.patch(`/admin/leaves/${leaveId}`, data),
  delete: (leaveId) => adminAxiosClient.delete(`/admin/leaves/${leaveId}`),
  approve: (leaveId, data) => adminAxiosClient.post(`/admin/leaves/${leaveId}/approve`, data),
  reject: (leaveId, data) => adminAxiosClient.post(`/admin/leaves/${leaveId}/reject`, data),
};

// 34. Holiday Fetcher
export const holidayFetcher = {
  list: (params) => adminAxiosClient.get('/admin/holidays', { params: buildParams(params) }),
  get: (holidayId) => adminAxiosClient.get(`/admin/holidays/${holidayId}`),
  create: (data) => adminAxiosClient.post('/admin/holidays', data),
  update: (holidayId, data) => adminAxiosClient.patch(`/admin/holidays/${holidayId}`, data),
  delete: (holidayId) => adminAxiosClient.delete(`/admin/holidays/${holidayId}`),
};

// 35. Certificate Fetcher
export const certificateFetcher = {
  // Staff certificates
  getStaffCertificates: (staffId) => adminAxiosClient.get(`/admin/staff/${staffId}/certificates`),
  addStaffCertificate: (staffId, data) => adminAxiosClient.post(`/admin/staff/${staffId}/certificates`, data),
  updateStaffCertificate: (staffId, certId, data) => adminAxiosClient.patch(`/admin/staff/${staffId}/certificates/${certId}`, data),
  deleteStaffCertificate: (staffId, certId) => adminAxiosClient.delete(`/admin/staff/${staffId}/certificates/${certId}`),
  // Student certificates
  getStudentCertificates: (studentId) => adminAxiosClient.get(`/admin/students/${studentId}/certificates`),
  addStudentCertificate: (studentId, data) => adminAxiosClient.post(`/admin/students/${studentId}/certificates`, data),
  updateStudentCertificate: (studentId, certId, data) => adminAxiosClient.patch(`/admin/students/${studentId}/certificates/${certId}`, data),
  deleteStudentCertificate: (studentId, certId) => adminAxiosClient.delete(`/admin/students/${studentId}/certificates/${certId}`),
};

// 36. Document Fetcher
export const documentFetcher = {
  getStaffDocuments: (staffId) => adminAxiosClient.get(`/admin/staff/${staffId}/documents`),
  addStaffDocument: (staffId, data) => adminAxiosClient.post(`/admin/staff/${staffId}/documents`, data),
  updateStaffDocument: (staffId, docId, data) => adminAxiosClient.patch(`/admin/staff/${staffId}/documents/${docId}`, data),
  deleteStaffDocument: (staffId, docId) => adminAxiosClient.delete(`/admin/staff/${staffId}/documents/${docId}`),
};

// 37. Commission Fetcher
export const commissionFetcher = {
  getStaffCommission: (staffId, params) => adminAxiosClient.get(`/admin/staff/${staffId}/commission`, { params: buildParams(params) }),
  getReport: (params) => adminAxiosClient.get('/admin/reports/commission', { params: buildParams(params) }),
};

// 38. Payroll Fetcher
export const payrollFetcher = {
  getPayrollReport: (params) => adminAxiosClient.get('/admin/reports/payroll', { params: buildParams(params) }),
};

// 39. Loyalty Fetcher
export const loyaltyFetcher = {
  getCustomerPoints: (customerId) => adminAxiosClient.get(`/admin/customers/${customerId}/loyalty`),
  adjustPoints: (customerId, data) => adminAxiosClient.post(`/admin/customers/${customerId}/loyalty`, data),
};

// 40. Expense Fetcher
export const expenseFetcher = {
  list: (params) => adminAxiosClient.get('/admin/expenses', { params: buildParams(params) }),
  get: (expenseId) => adminAxiosClient.get(`/admin/expenses/${expenseId}`),
  create: (data) => adminAxiosClient.post('/admin/expenses', data),
  update: (expenseId, data) => adminAxiosClient.patch(`/admin/expenses/${expenseId}`, data),
  delete: (expenseId) => adminAxiosClient.delete(`/admin/expenses/${expenseId}`),
};

// 41. Utility Fetcher
export const utilityFetcher = {
  list: (params) => adminAxiosClient.get('/admin/utilities', { params: buildParams(params) }),
  get: (utilityId) => adminAxiosClient.get(`/admin/utilities/${utilityId}`),
  create: (data) => adminAxiosClient.post('/admin/utilities', data),
  update: (utilityId, data) => adminAxiosClient.patch(`/admin/utilities/${utilityId}`, data),
  delete: (utilityId) => adminAxiosClient.delete(`/admin/utilities/${utilityId}`),
  // Electricity specific
  getElectricity: (params) => adminAxiosClient.get('/admin/utilities/electricity', { params: buildParams(params) }),
  createElectricity: (data) => adminAxiosClient.post('/admin/utilities/electricity', data),
  getElectricityRecord: (recordId) => adminAxiosClient.get(`/admin/utilities/electricity/${recordId}`),
  updateElectricity: (recordId, data) => adminAxiosClient.patch(`/admin/utilities/electricity/${recordId}`, data),
  deleteElectricity: (recordId) => adminAxiosClient.delete(`/admin/utilities/electricity/${recordId}`),
};

// 42. Rent Fetcher
export const rentFetcher = {
  list: (params) => adminAxiosClient.get('/admin/rent', { params: buildParams(params) }),
  get: (rentId) => adminAxiosClient.get(`/admin/rent/${rentId}`),
  create: (data) => adminAxiosClient.post('/admin/rent', data),
  update: (rentId, data) => adminAxiosClient.patch(`/admin/rent/${rentId}`, data),
  delete: (rentId) => adminAxiosClient.delete(`/admin/rent/${rentId}`),
  pay: (rentId, data) => adminAxiosClient.post(`/admin/rent/${rentId}/pay`, data),
};

// 43. Maintenance Fetcher
export const maintenanceFetcher = {
  list: (params) => adminAxiosClient.get('/admin/maintenance', { params: buildParams(params) }),
  get: (maintenanceId) => adminAxiosClient.get(`/admin/maintenance/${maintenanceId}`),
  create: (data) => adminAxiosClient.post('/admin/maintenance', data),
  update: (maintenanceId, data) => adminAxiosClient.patch(`/admin/maintenance/${maintenanceId}`, data),
  delete: (maintenanceId) => adminAxiosClient.delete(`/admin/maintenance/${maintenanceId}`),
  start: (maintenanceId) => adminAxiosClient.post(`/admin/maintenance/${maintenanceId}/start`),
  complete: (maintenanceId, data) => adminAxiosClient.post(`/admin/maintenance/${maintenanceId}/complete`, data),
};

// 44. Asset Fetcher
export const assetFetcher = {
  list: (params) => adminAxiosClient.get('/admin/assets', { params: buildParams(params) }),
  get: (assetId) => adminAxiosClient.get(`/admin/assets/${assetId}`),
  create: (data) => adminAxiosClient.post('/admin/assets', data),
  update: (assetId, data) => adminAxiosClient.patch(`/admin/assets/${assetId}`, data),
  delete: (assetId) => adminAxiosClient.delete(`/admin/assets/${assetId}`),
  assign: (assetId, data) => adminAxiosClient.post(`/admin/assets/${assetId}/assign`, data),
  repair: (assetId, data) => adminAxiosClient.post(`/admin/assets/${assetId}/repair`, data),
  maintenance: (assetId, data) => adminAxiosClient.post(`/admin/assets/${assetId}/maintenance`, data),
};

// 45. Scrap Fetcher
export const scrapFetcher = {
  list: (params) => adminAxiosClient.get('/admin/scrap', { params: buildParams(params) }),
  get: (scrapId) => adminAxiosClient.get(`/admin/scrap/${scrapId}`),
  create: (data) => adminAxiosClient.post('/admin/scrap', data),
  update: (scrapId, data) => adminAxiosClient.patch(`/admin/scrap/${scrapId}`, data),
  delete: (scrapId) => adminAxiosClient.delete(`/admin/scrap/${scrapId}`),
};

// 46. Additional Work Fetcher
export const additionalWorkFetcher = {
  list: (params) => adminAxiosClient.get('/admin/additional-work', { params: buildParams(params) }),
  get: (workId) => adminAxiosClient.get(`/admin/additional-work/${workId}`),
  create: (data) => adminAxiosClient.post('/admin/additional-work', data),
  update: (workId, data) => adminAxiosClient.patch(`/admin/additional-work/${workId}`, data),
  delete: (workId) => adminAxiosClient.delete(`/admin/additional-work/${workId}`),
  complete: (workId, data) => adminAxiosClient.post(`/admin/additional-work/${workId}/complete`, data),
};

// 47. Notification Fetcher
export const notificationFetcher = {
  list: (params) => adminAxiosClient.get('/admin/notifications', { params: buildParams(params) }),
  markAsRead: (id) => adminAxiosClient.patch(`/admin/notifications/${id}/read`),
};

// 48. Communication Fetcher
export const communicationFetcher = {
  getProviders: () => adminAxiosClient.get('/admin/communication/providers'),
  createProvider: (data) => adminAxiosClient.post('/admin/communication/providers', data),
  getProvider: (providerId) => adminAxiosClient.get(`/admin/communication/providers/${providerId}`),
  updateProvider: (providerId, data) => adminAxiosClient.patch(`/admin/communication/providers/${providerId}`, data),
  deleteProvider: (providerId) => adminAxiosClient.delete(`/admin/communication/providers/${providerId}`),
  testProvider: (providerId, data) => adminAxiosClient.post(`/admin/communication/providers/${providerId}/test`, data),
  activateProvider: (providerId) => adminAxiosClient.post(`/admin/communication/providers/${providerId}/activate`),
  deactivateProvider: (providerId) => adminAxiosClient.post(`/admin/communication/providers/${providerId}/deactivate`),
  // Templates
  getTemplates: (params) => adminAxiosClient.get('/admin/notification-templates', { params: buildParams(params) }),
  createTemplate: (data) => adminAxiosClient.post('/admin/notification-templates', data),
  getTemplate: (templateId) => adminAxiosClient.get(`/admin/notification-templates/${templateId}`),
  updateTemplate: (templateId, data) => adminAxiosClient.patch(`/admin/notification-templates/${templateId}`, data),
  deleteTemplate: (templateId) => adminAxiosClient.delete(`/admin/notification-templates/${templateId}`),
  testTemplate: (templateId, data) => adminAxiosClient.post(`/admin/notification-templates/${templateId}/test`, data),
};

// 49. Website Fetcher
export const websiteFetcher = {
  getWebsite: () => adminAxiosClient.get('/admin/website'),
  updateWebsite: (data) => adminAxiosClient.patch('/admin/website', data),
  getPages: () => adminAxiosClient.get('/admin/website/pages'),
  createPage: (data) => adminAxiosClient.post('/admin/website/pages', data),
  getPage: (pageId) => adminAxiosClient.get(`/admin/website/pages/${pageId}`),
  updatePage: (pageId, data) => adminAxiosClient.patch(`/admin/website/pages/${pageId}`, data),
  deletePage: (pageId) => adminAxiosClient.delete(`/admin/website/pages/${pageId}`),
  getSections: () => adminAxiosClient.get('/admin/website/sections'),
  createSection: (data) => adminAxiosClient.post('/admin/website/sections', data),
  updateSection: (sectionId, data) => adminAxiosClient.patch(`/admin/website/sections/${sectionId}`, data),
  deleteSection: (sectionId) => adminAxiosClient.delete(`/admin/website/sections/${sectionId}`),
};

// 50. Report Fetcher
export const reportFetcher = {
  getRevenue: (params) => adminAxiosClient.get('/admin/reports/revenue', { params: buildParams(params) }),
  getSales: (params) => adminAxiosClient.get('/admin/reports/sales', { params: buildParams(params) }),
  getAppointments: (params) => adminAxiosClient.get('/admin/reports/appointments', { params: buildParams(params) }),
  getCustomers: (params) => adminAxiosClient.get('/admin/reports/customers', { params: buildParams(params) }),
  getStaff: (params) => adminAxiosClient.get('/admin/reports/staff', { params: buildParams(params) }),
  getStudents: (params) => adminAxiosClient.get('/admin/reports/students', { params: buildParams(params) }),
  getServices: (params) => adminAxiosClient.get('/admin/reports/services', { params: buildParams(params) }),
  getPackages: (params) => adminAxiosClient.get('/admin/reports/packages', { params: buildParams(params) }),
  getInventory: (params) => adminAxiosClient.get('/admin/reports/inventory', { params: buildParams(params) }),
  getExpenses: (params) => adminAxiosClient.get('/admin/reports/expenses', { params: buildParams(params) }),
  getProfitLoss: (params) => adminAxiosClient.get('/admin/reports/profit-loss', { params: buildParams(params) }),
  getAttendance: (params) => adminAxiosClient.get('/admin/reports/attendance', { params: buildParams(params) }),
  getLeave: (params) => adminAxiosClient.get('/admin/reports/leave', { params: buildParams(params) }),
  getCommission: (params) => adminAxiosClient.get('/admin/reports/commission', { params: buildParams(params) }),
  getPayroll: (params) => adminAxiosClient.get('/admin/reports/payroll', { params: buildParams(params) }),
  getElectricity: (params) => adminAxiosClient.get('/admin/reports/electricity', { params: buildParams(params) }),
  getRent: (params) => adminAxiosClient.get('/admin/reports/rent', { params: buildParams(params) }),
  getMaintenance: (params) => adminAxiosClient.get('/admin/reports/maintenance', { params: buildParams(params) }),
  getScrap: (params) => adminAxiosClient.get('/admin/reports/scrap', { params: buildParams(params) }),
  getHomeServices: (params) => adminAxiosClient.get('/admin/reports/home-services', { params: buildParams(params) }),
  getLateWork: (params) => adminAxiosClient.get('/admin/reports/late-work', { params: buildParams(params) }),
  exportCsv: (params) => adminAxiosClient.get('/admin/reports/export/csv', { params: buildParams(params), responseType: 'blob' }),
};

// 51. Settings Fetcher
export const settingsFetcher = {
  getSettings: () => adminAxiosClient.get('/admin/settings'),
  updateSettings: (data) => adminAxiosClient.patch('/admin/settings', data),
  getSubscription: () => adminAxiosClient.get('/admin/subscription'),
  getPlan: () => adminAxiosClient.get('/admin/subscription/plan'),
  getFeatures: () => adminAxiosClient.get('/admin/subscription/features'),
  getUsage: () => adminAxiosClient.get('/admin/subscription/usage'),
  getInvoices: () => adminAxiosClient.get('/admin/subscription/invoices'),
  bulkAction: (resource, data) => adminAxiosClient.post(`/admin/${resource}/bulk`, data),
  importData: (resource, data) => adminAxiosClient.post(`/admin/import/${resource}`, data),
  exportData: (resource) => adminAxiosClient.get(`/admin/export/${resource}`, { responseType: 'blob' }),
};

// 52. Support Fetcher
export const supportFetcher = {
  getTickets: (params) => adminAxiosClient.get('/admin/support/tickets', { params: buildParams(params) }),
  createTicket: (data) => adminAxiosClient.post('/admin/support/tickets', data),
};

// 53. Audit Fetcher
export const auditFetcher = {
  list: (params) => adminAxiosClient.get('/admin/audit-logs', { params: buildParams(params) }),
  get: (logId) => adminAxiosClient.get(`/admin/audit-logs/${logId}`),
  exportLogs: (params) => adminAxiosClient.get('/admin/audit-logs/export', { params: buildParams(params), responseType: 'blob' }),
};

// 54. Public Customer/Visitor Fetcher
export const publicFetcher = {
  getBusiness: (tenant) => adminAxiosClient.get('/public/business', { headers: { 'x-tenant-id': tenant } }),
  getBranches: (tenant) => adminAxiosClient.get('/public/branches', { headers: { 'x-tenant-id': tenant } }),
  getServices: (tenant, params) => adminAxiosClient.get('/public/services', { headers: { 'x-tenant-id': tenant }, params: buildParams(params) }),
  getPackages: (tenant) => adminAxiosClient.get('/public/packages', { headers: { 'x-tenant-id': tenant } }),
  getOffers: (tenant) => adminAxiosClient.get('/public/offers', { headers: { 'x-tenant-id': tenant } }),
  getAvailability: (tenant, params) => adminAxiosClient.get('/public/availability', { headers: { 'x-tenant-id': tenant }, params: buildParams(params) }),
  createBooking: (tenant, data) => adminAxiosClient.post('/public/bookings', data, { headers: { 'x-tenant-id': tenant } }),
};
