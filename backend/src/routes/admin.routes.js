/**
 * @file admin.routes.js
 * @description Master Router for all Tenant Admin APIs under /api/v1/admin/*
 * @module backend/src/routes/admin.routes
 */

import { Router } from 'express';
import { tenantResolverMiddleware } from '../middleware/tenant-resolver.middleware.js';
import { authenticateTenantUser, requireTenantAdmin } from '../middleware/tenant-admin-auth.middleware.js';
import { branchContextMiddleware } from '../middleware/branch-context.middleware.js';
import { checkPlanLimit } from '../middleware/plan-limit.middleware.js';
import { requirePermission } from '../middleware/permission.middleware.js';

// Import Controllers
import authCtrl from '../modules/admin/auth/tenantAdminAuth.controller.js';
import structCtrl from '../modules/admin/structure/structure.controller.js';
import roleCtrl from '../modules/admin/roles/rolePermission.controller.js';
import userCtrl from '../modules/admin/users/user.controller.js';
import branchCtrl from '../modules/admin/branches/branch.controller.js';
import staffCtrl from '../modules/admin/staff/staff.controller.js';
import attCtrl from '../modules/admin/attendance/attendance.controller.js';
import stuCtrl from '../modules/admin/students/student.controller.js';
import custCtrl from '../modules/admin/customers/customer.controller.js';
import servCtrl from '../modules/admin/services/service.controller.js';
import pkgCtrl from '../modules/admin/packages/packageOffer.controller.js';
import aptCtrl from '../modules/admin/appointments/appointment.controller.js';
import homeCtrl from '../modules/admin/homeServices/homeService.controller.js';
import billCtrl from '../modules/admin/billing/billing.controller.js';
import invCtrl from '../modules/admin/inventory/inventory.controller.js';
import facCtrl from '../modules/admin/facilities/facilities.controller.js';
import commCtrl from '../modules/admin/communication/communication.controller.js';
import webCtrl from '../modules/admin/website/website.controller.js';
import dashCtrl from '../modules/admin/dashboard/dashboard.controller.js';
import repCtrl from '../modules/admin/reports/report.controller.js';
import setCtrl from '../modules/admin/settings/settings.controller.js';

const router = Router();

// Apply Tenant Resolution to all admin routes
router.use(tenantResolverMiddleware);

// ==========================================
// 1. AUTHENTICATION (PUBLIC & PROTECTED)
// ==========================================
router.post('/auth/login', authCtrl.tenantLogin);
router.post('/auth/logout', authCtrl.tenantLogout);
router.post('/auth/refresh', authCtrl.tenantRefreshToken);
router.get('/auth/me', authenticateTenantUser, authCtrl.getMe);
router.post('/auth/switch-branch', authenticateTenantUser, authCtrl.switchBranch);

// ALL SUBSEQUENT ADMIN ROUTES REQUIRE AUTHENTICATION & BRANCH CONTEXT
router.use(authenticateTenantUser);
router.use(branchContextMiddleware);

// ==========================================
// 2. DASHBOARD
// ==========================================
router.get('/dashboard', requirePermission('dashboard.view'), dashCtrl.getDashboardOverview);
router.get('/dashboard/overview', requirePermission('dashboard.view'), dashCtrl.getDashboardOverview);
router.get('/dashboard/operations-queue', requirePermission('dashboard.view'), dashCtrl.getOperationsQueue);
router.post('/dashboard/assign-product', requirePermission('inventory.update'), dashCtrl.assignProductToStaff);
router.patch('/dashboard/home-services/:appointmentId/status', requirePermission('appointments.update'), dashCtrl.updateHomeServiceStatus);
router.post('/dashboard/attendance/punch', requirePermission('attendance.create'), dashCtrl.punchAttendance);
router.get('/dashboard/live-queue', requirePermission('dashboard.view'), dashCtrl.getLiveQueueStatus);
router.post('/dashboard/live-queue/call-next', requirePermission('dashboard.view'), dashCtrl.callNextToken);
router.post('/dashboard/live-queue/walkin-token', requirePermission('dashboard.view'), dashCtrl.createWalkInToken);
router.patch('/dashboard/live-queue/:tokenId/status', requirePermission('dashboard.view'), dashCtrl.updateTokenQueueStatus);

// ==========================================
// 3. DYNAMIC STRUCTURE: DEPARTMENTS, DESIGNATIONS, SKILLS
// ==========================================
router.post('/departments', requirePermission('staff.create'), structCtrl.createDepartment);
router.get('/departments', structCtrl.getDepartments);
router.get('/departments/:departmentId', structCtrl.getDepartmentById);
router.patch('/departments/:departmentId', requirePermission('staff.update'), structCtrl.updateDepartment);
router.delete('/departments/:departmentId', requirePermission('staff.delete'), structCtrl.deleteDepartment);
router.patch('/departments/:departmentId/status', requirePermission('staff.update'), structCtrl.updateDepartmentStatus);

router.post('/designations', requirePermission('staff.create'), structCtrl.createDesignation);
router.get('/designations', structCtrl.getDesignations);
router.get('/designations/:designationId', structCtrl.getDesignationById);
router.patch('/designations/:designationId', requirePermission('staff.update'), structCtrl.updateDesignation);
router.delete('/designations/:designationId', requirePermission('staff.delete'), structCtrl.deleteDesignation);
router.patch('/designations/:designationId/status', requirePermission('staff.update'), structCtrl.updateDesignationStatus);

router.post('/skills', requirePermission('staff.create'), structCtrl.createSkill);
router.get('/skills', structCtrl.getSkills);
router.get('/skills/:skillId', structCtrl.getSkillById);
router.patch('/skills/:skillId', requirePermission('staff.update'), structCtrl.updateSkill);
router.delete('/skills/:skillId', requirePermission('staff.delete'), structCtrl.deleteSkill);

// ==========================================
// 4. DYNAMIC ROLES & PERMISSIONS
// ==========================================
router.get('/permissions', roleCtrl.getPermissions);
router.get('/permissions/grouped', roleCtrl.getGroupedPermissions);

router.post('/roles', requirePermission('roles.manage'), roleCtrl.createRole);
router.get('/roles', roleCtrl.getRoles);
router.get('/roles/:roleId', roleCtrl.getRoleById);
router.patch('/roles/:roleId', requirePermission('roles.manage'), roleCtrl.updateRole);
router.delete('/roles/:roleId', requirePermission('roles.manage'), roleCtrl.deleteRole);
router.get('/roles/:roleId/permissions', roleCtrl.getRolePermissions);
router.put('/roles/:roleId/permissions', requirePermission('roles.manage'), roleCtrl.updateRolePermissions);

// ==========================================
// 5. USER TYPE MANAGEMENT
// ==========================================
router.post('/users', requireTenantAdmin, userCtrl.createUser);
router.get('/users', requireTenantAdmin, userCtrl.getUsers);
router.get('/users/:userId', requireTenantAdmin, userCtrl.getUserById);
router.patch('/users/:userId', requireTenantAdmin, userCtrl.updateUser);
router.delete('/users/:userId', requireTenantAdmin, userCtrl.deleteUser);
router.patch('/users/:userId/status', requireTenantAdmin, userCtrl.updateUserStatus);
router.post('/users/:userId/block', requireTenantAdmin, userCtrl.blockUser);
router.post('/users/:userId/unblock', requireTenantAdmin, userCtrl.unblockUser);
router.post('/users/:userId/reset-password', requireTenantAdmin, userCtrl.resetUserPassword);
router.post('/users/:userId/revoke-sessions', requireTenantAdmin, userCtrl.revokeUserSessions);

// ==========================================
// 6. BRANCH MANAGEMENT
// ==========================================
router.post('/branches', requireTenantAdmin, checkPlanLimit('branches'), branchCtrl.createBranch);
router.get('/branches', branchCtrl.getBranches);
router.get('/branches/:branchId', branchCtrl.getBranchById);
router.patch('/branches/:branchId', requireTenantAdmin, branchCtrl.updateBranch);
router.delete('/branches/:branchId', requireTenantAdmin, branchCtrl.deleteBranch);
router.patch('/branches/:branchId/status', requireTenantAdmin, branchCtrl.updateBranchStatus);
router.post('/branches/:branchId/set-default', requireTenantAdmin, branchCtrl.setDefaultBranch);
router.get('/branches/:branchId/dashboard', branchCtrl.getBranchDashboard);
router.get('/branches/:branchId/stats', branchCtrl.getBranchStats);
router.get('/branches/:branchId/hours', branchCtrl.getBranchHours);
router.patch('/branches/:branchId/hours', requireTenantAdmin, branchCtrl.updateBranchHours);

router.get('/business/hours', branchCtrl.getBusinessHours);
router.patch('/business/hours', requireTenantAdmin, branchCtrl.updateBusinessHours);

// ==========================================
// 7. STAFF MANAGEMENT & HR
// ==========================================
router.post('/staff', requirePermission('staff.create'), checkPlanLimit('staff'), staffCtrl.createStaff);
router.get('/staff', requirePermission('staff.view'), staffCtrl.getStaffList);
router.get('/staff/:staffId', requirePermission('staff.view'), staffCtrl.getStaffById);
router.patch('/staff/:staffId', requirePermission('staff.update'), staffCtrl.updateStaff);
router.delete('/staff/:staffId', requirePermission('staff.delete'), staffCtrl.deleteStaff);
router.post('/staff/:staffId/activate', requirePermission('staff.update'), staffCtrl.activateStaff);
router.post('/staff/:staffId/deactivate', requirePermission('staff.update'), staffCtrl.deactivateStaff);
router.post('/staff/:staffId/block', requirePermission('staff.update'), staffCtrl.blockStaff);
router.post('/staff/:staffId/unblock', requirePermission('staff.update'), staffCtrl.unblockStaff);

router.get('/staff/:staffId/profile', staffCtrl.getStaffProfile);
router.get('/staff/:staffId/activity', staffCtrl.getStaffActivity);
router.get('/staff/:staffId/services', staffCtrl.getStaffServices);
router.get('/staff/:staffId/appointments', staffCtrl.getStaffAppointments);
router.get('/staff/:staffId/commission', staffCtrl.getStaffCommission);
router.get('/staff/:staffId/salary', staffCtrl.getStaffSalary);
router.get('/staff/:staffId/performance', staffCtrl.getStaffPerformance);

// Staff Documents
router.post('/staff/:staffId/documents', requirePermission('staff.update'), staffCtrl.addStaffDocument);
router.get('/staff/:staffId/documents', staffCtrl.getStaffDocuments);
router.get('/staff/:staffId/documents/:documentId', staffCtrl.getStaffDocumentById);
router.patch('/staff/:staffId/documents/:documentId', requirePermission('staff.update'), staffCtrl.updateStaffDocument);
router.delete('/staff/:staffId/documents/:documentId', requirePermission('staff.update'), staffCtrl.deleteStaffDocument);

// Staff Certificates
router.post('/staff/:staffId/certificates', requirePermission('staff.update'), staffCtrl.addStaffCertificate);
router.get('/staff/:staffId/certificates', staffCtrl.getStaffCertificates);
router.get('/staff/:staffId/certificates/:certificateId', staffCtrl.getStaffCertificateById);
router.patch('/staff/:staffId/certificates/:certificateId', requirePermission('staff.update'), staffCtrl.updateStaffCertificate);
router.delete('/staff/:staffId/certificates/:certificateId', requirePermission('staff.update'), staffCtrl.deleteStaffCertificate);

// Calendar Birthdays & Important Dates
router.get('/calendar/birthdays', staffCtrl.getCalendarBirthdays);
router.get('/calendar/important-dates', staffCtrl.getCalendarImportantDates);

// ==========================================
// 8. STAFF ATTENDANCE, LEAVES, HOLIDAYS
// ==========================================
router.post('/attendance/check-in', attCtrl.checkIn);
router.post('/attendance/check-out', attCtrl.checkOut);
router.get('/attendance', attCtrl.getAttendanceList);
router.get('/attendance/reports', attCtrl.getAttendanceReports);
router.get('/attendance/:attendanceId', attCtrl.getAttendanceById);
router.get('/staff/:staffId/attendance', attCtrl.getStaffAttendanceHistory);

router.post('/leaves', attCtrl.createLeave);
router.get('/leaves', attCtrl.getLeaves);
router.get('/leaves/:leaveId', attCtrl.getLeaveById);
router.patch('/leaves/:leaveId', attCtrl.updateLeave);
router.delete('/leaves/:leaveId', attCtrl.deleteLeave);
router.post('/leaves/:leaveId/approve', requirePermission('attendance.manage'), attCtrl.approveLeave);
router.post('/leaves/:leaveId/reject', requirePermission('attendance.manage'), attCtrl.rejectLeave);

router.post('/holidays', requirePermission('settings.update'), attCtrl.createHoliday);
router.get('/holidays', attCtrl.getHolidays);
router.get('/holidays/:holidayId', attCtrl.getHolidayById);
router.patch('/holidays/:holidayId', requirePermission('settings.update'), attCtrl.updateHoliday);
router.delete('/holidays/:holidayId', requirePermission('settings.update'), attCtrl.deleteHoliday);

// ==========================================
// 9. STUDENT MANAGEMENT & ACADEMY PLANS
// ==========================================
router.post('/students', requirePermission('student.create'), checkPlanLimit('students'), stuCtrl.createStudent);
router.get('/students', requirePermission('student.view'), stuCtrl.getStudents);
router.get('/students/:studentId', requirePermission('student.view'), stuCtrl.getStudentById);
router.patch('/students/:studentId', requirePermission('student.update'), stuCtrl.updateStudent);
router.delete('/students/:studentId', requirePermission('student.delete'), stuCtrl.deleteStudent);
router.post('/students/:studentId/activate', requirePermission('student.update'), stuCtrl.activateStudent);
router.post('/students/:studentId/deactivate', requirePermission('student.update'), stuCtrl.deactivateStudent);
router.post('/students/:studentId/block', requirePermission('student.update'), stuCtrl.blockStudent);
router.post('/students/:studentId/unblock', requirePermission('student.update'), stuCtrl.unblockStudent);

// Student Plans
router.post('/student-plans', requirePermission('student.create'), stuCtrl.createStudentPlan);
router.get('/student-plans', stuCtrl.getStudentPlans);
router.get('/student-plans/:planId', stuCtrl.getStudentPlanById);
router.patch('/student-plans/:planId', requirePermission('student.update'), stuCtrl.updateStudentPlan);
router.delete('/student-plans/:planId', requirePermission('student.delete'), stuCtrl.deleteStudentPlan);
router.patch('/student-plans/:planId/status', requirePermission('student.update'), stuCtrl.updateStudentPlanStatus);

// Enrollments
router.post('/students/:studentId/enrollments', requirePermission('student.create'), stuCtrl.createEnrollment);
router.get('/students/:studentId/enrollments', stuCtrl.getStudentEnrollments);
router.get('/enrollments', requirePermission('student.view'), stuCtrl.getAllEnrollments);
router.get('/enrollments/:enrollmentId', stuCtrl.getEnrollmentById);
router.patch('/enrollments/:enrollmentId', requirePermission('student.update'), stuCtrl.updateEnrollment);
router.delete('/enrollments/:enrollmentId', requirePermission('student.delete'), stuCtrl.deleteEnrollment);

// Student Attendance
router.post('/student-attendance/check-in', stuCtrl.studentCheckIn);
router.post('/student-attendance/check-out', stuCtrl.studentCheckOut);
router.get('/student-attendance', stuCtrl.getStudentAttendanceList);
router.get('/students/:studentId/attendance', stuCtrl.getStudentAttendanceHistory);
router.get('/student-attendance/reports', stuCtrl.getStudentAttendanceReports);

// Student Certificates
router.post('/students/:studentId/certificates', requirePermission('student.update'), stuCtrl.issueStudentCertificate);
router.get('/students/:studentId/certificates', stuCtrl.getStudentCertificates);
router.get('/students/:studentId/certificates/:certificateId', stuCtrl.getStudentCertificateById);
router.patch('/students/:studentId/certificates/:certificateId', requirePermission('student.update'), stuCtrl.updateStudentCertificate);
router.delete('/students/:studentId/certificates/:certificateId', requirePermission('student.update'), stuCtrl.deleteStudentCertificate);

// ==========================================
// 10. CUSTOMER CRM
// ==========================================
router.post('/customers', requirePermission('customer.create'), checkPlanLimit('customers'), custCtrl.createCustomer);
router.get('/customers', requirePermission('customer.view'), custCtrl.getCustomers);
router.get('/customers/:customerId', requirePermission('customer.view'), custCtrl.getCustomerById);
router.patch('/customers/:customerId', requirePermission('customer.update'), custCtrl.updateCustomer);
router.delete('/customers/:customerId', requirePermission('customer.delete'), custCtrl.deleteCustomer);
router.post('/customers/:customerId/block', requirePermission('customer.update'), custCtrl.blockCustomer);
router.post('/customers/:customerId/unblock', requirePermission('customer.update'), custCtrl.unblockCustomer);

router.get('/customers/:customerId/appointments', custCtrl.getCustomerAppointments);
router.get('/customers/:customerId/services', custCtrl.getCustomerServices);
router.get('/customers/:customerId/packages', custCtrl.getCustomerPackages);
router.get('/customers/:customerId/bills', custCtrl.getCustomerBills);
router.get('/customers/:customerId/payments', custCtrl.getCustomerPayments);
router.get('/customers/:customerId/visits', custCtrl.getCustomerVisits);
router.get('/customers/:customerId/notes', custCtrl.getCustomerNotes);
router.post('/customers/:customerId/notes', custCtrl.addCustomerNote);
router.get('/customers/:customerId/activity', custCtrl.getCustomerActivity);

// ==========================================
// 11. DYNAMIC UNIFIED SERVICE CATALOGUE
// ==========================================
router.post('/service-categories', requirePermission('service.create'), servCtrl.createServiceCategory);
router.get('/service-categories', servCtrl.getServiceCategories);
router.get('/service-categories/:categoryId', servCtrl.getServiceCategoryById);
router.patch('/service-categories/:categoryId', requirePermission('service.update'), servCtrl.updateServiceCategory);
router.delete('/service-categories/:categoryId', requirePermission('service.delete'), servCtrl.deleteServiceCategory);

router.post('/service-subcategories', requirePermission('service.create'), servCtrl.createServiceSubcategory);
router.get('/service-subcategories', servCtrl.getServiceSubcategories);
router.get('/service-subcategories/:subcategoryId', servCtrl.getServiceSubcategoryById);
router.patch('/service-subcategories/:subcategoryId', requirePermission('service.update'), servCtrl.updateServiceSubcategory);
router.delete('/service-subcategories/:subcategoryId', requirePermission('service.delete'), servCtrl.deleteServiceSubcategory);

router.post('/services', requirePermission('service.create'), checkPlanLimit('services'), servCtrl.createService);
router.get('/services', servCtrl.getServices);
router.get('/services/:serviceId', servCtrl.getServiceById);
router.patch('/services/:serviceId', requirePermission('service.update'), servCtrl.updateService);
router.delete('/services/:serviceId', requirePermission('service.delete'), servCtrl.deleteService);
router.patch('/services/:serviceId/status', requirePermission('service.update'), servCtrl.updateServiceStatus);
router.post('/services/:serviceId/duplicate', requirePermission('service.create'), servCtrl.duplicateService);

// Options & Addons
router.post('/services/:serviceId/options', requirePermission('service.update'), servCtrl.createServiceOption);
router.get('/services/:serviceId/options', servCtrl.getServiceOptions);
router.get('/services/:serviceId/options/:optionId', servCtrl.getServiceOptionById);
router.patch('/services/:serviceId/options/:optionId', requirePermission('service.update'), servCtrl.updateServiceOption);
router.delete('/services/:serviceId/options/:optionId', requirePermission('service.update'), servCtrl.deleteServiceOption);

router.post('/services/:serviceId/addons', requirePermission('service.update'), servCtrl.createServiceAddon);
router.get('/services/:serviceId/addons', servCtrl.getServiceAddons);
router.patch('/services/:serviceId/addons/:addonId', requirePermission('service.update'), servCtrl.updateServiceAddon);
router.delete('/services/:serviceId/addons/:addonId', requirePermission('service.update'), servCtrl.deleteServiceAddon);

// ==========================================
// 12. PACKAGES, OFFERS, COUPONS
// ==========================================
router.post('/packages', requirePermission('package.create'), pkgCtrl.createPackage);
router.get('/packages', pkgCtrl.getPackages);
router.get('/packages/:packageId', pkgCtrl.getPackageById);
router.patch('/packages/:packageId', requirePermission('package.update'), pkgCtrl.updatePackage);
router.delete('/packages/:packageId', requirePermission('package.delete'), pkgCtrl.deletePackage);
router.patch('/packages/:packageId/status', requirePermission('package.update'), pkgCtrl.updatePackageStatus);
router.post('/packages/:packageId/duplicate', requirePermission('package.create'), pkgCtrl.duplicatePackage);

router.post('/offers', requirePermission('package.create'), pkgCtrl.createOffer);
router.get('/offers', pkgCtrl.getOffers);
router.get('/offers/:offerId', pkgCtrl.getOfferById);
router.patch('/offers/:offerId', requirePermission('package.update'), pkgCtrl.updateOffer);
router.delete('/offers/:offerId', requirePermission('package.delete'), pkgCtrl.deleteOffer);
router.post('/offers/:offerId/activate', requirePermission('package.update'), pkgCtrl.activateOffer);
router.post('/offers/:offerId/deactivate', requirePermission('package.update'), pkgCtrl.deactivateOffer);

router.post('/coupons', requirePermission('package.create'), pkgCtrl.createCoupon);
router.get('/coupons', pkgCtrl.getCoupons);
router.get('/coupons/:couponId', pkgCtrl.getCouponById);
router.patch('/coupons/:couponId', requirePermission('package.update'), pkgCtrl.updateCoupon);
router.delete('/coupons/:couponId', requirePermission('package.delete'), pkgCtrl.deleteCoupon);
router.patch('/coupons/:couponId/status', requirePermission('package.update'), pkgCtrl.updateCouponStatus);

// ==========================================
// 13. APPOINTMENTS & CALENDAR
// ==========================================
router.get('/appointments/availability', aptCtrl.getGeneralAvailability);
router.get('/services/:serviceId/availability', aptCtrl.getServiceAvailability);
router.get('/staff/:staffId/availability', aptCtrl.getStaffAvailability);

router.post('/appointments', requirePermission('appointment.create'), aptCtrl.createAppointment);
router.get('/appointments', requirePermission('appointment.view'), aptCtrl.getAppointments);
router.get('/appointments/:appointmentId', requirePermission('appointment.view'), aptCtrl.getAppointmentById);
router.patch('/appointments/:appointmentId', requirePermission('appointment.update'), aptCtrl.updateAppointment);
router.delete('/appointments/:appointmentId', requirePermission('appointment.delete'), aptCtrl.deleteAppointment);

// 13-stage actions
router.post('/appointments/:appointmentId/confirm', requirePermission('appointment.update'), aptCtrl.confirmAppointment);
router.post('/appointments/:appointmentId/check-in', requirePermission('appointment.update'), aptCtrl.checkInAppointment);
router.post('/appointments/:appointmentId/start', requirePermission('appointment.update'), aptCtrl.startAppointment);
router.post('/appointments/:appointmentId/pause', requirePermission('appointment.update'), aptCtrl.pauseAppointment);
router.post('/appointments/:appointmentId/resume', requirePermission('appointment.update'), aptCtrl.resumeAppointment);
router.post('/appointments/:appointmentId/complete', requirePermission('appointment.update'), aptCtrl.completeAppointment);
router.post('/appointments/:appointmentId/cancel', requirePermission('appointment.delete'), aptCtrl.cancelAppointment);
router.post('/appointments/:appointmentId/no-show', requirePermission('appointment.update'), aptCtrl.noShowAppointment);
router.post('/appointments/:appointmentId/reschedule', requirePermission('appointment.update'), aptCtrl.rescheduleAppointment);

// ==========================================
// 14. HOME SERVICES & LIVE DISPATCH
// ==========================================
router.post('/home-services/:appointmentId/assign', requirePermission('homeservice.dispatch'), homeCtrl.assignHomeServiceStaff);
router.post('/home-services/:appointmentId/reassign', requirePermission('homeservice.dispatch'), homeCtrl.reassignHomeServiceStaff);
router.get('/home-services/:appointmentId/status', homeCtrl.getHomeServiceStatus);
router.get('/home-services/:appointmentId/tracking', homeCtrl.getHomeServiceTracking);
router.get('/home-services/live', requirePermission('homeservice.dispatch'), homeCtrl.getLiveHomeServices);

router.get('/operations/delays', homeCtrl.getLateWorkDelays);
router.get('/operations/overtime', homeCtrl.getOvertimeOperations);

// ==========================================
// 15. POS / BILLING & PAYMENTS
// ==========================================
router.post('/bills', requirePermission('billing.create'), billCtrl.createBill);
router.get('/bills', requirePermission('billing.view'), billCtrl.getBills);
router.get('/bills/:billId', requirePermission('billing.view'), billCtrl.getBillById);
router.patch('/bills/:billId', requirePermission('billing.update'), billCtrl.updateBill);
router.delete('/bills/:billId', requirePermission('billing.update'), billCtrl.deleteBill);
router.post('/bills/:billId/pay', requirePermission('billing.create'), billCtrl.payBill);
router.post('/bills/:billId/refund', requirePermission('billing.update'), billCtrl.refundBill);
router.post('/bills/:billId/cancel', requirePermission('billing.update'), billCtrl.cancelBill);
router.get('/bills/:billId/receipt', billCtrl.getBillReceipt);

// Dynamic Payment Methods
router.get('/payment-methods', billCtrl.getPaymentMethods);
router.post('/payment-methods', requirePermission('settings.update'), billCtrl.createPaymentMethod);
router.patch('/payment-methods/:methodId', requirePermission('settings.update'), billCtrl.updatePaymentMethod);
router.delete('/payment-methods/:methodId', requirePermission('settings.update'), billCtrl.deletePaymentMethod);

// Payment Gateways
router.get('/payment-gateways', billCtrl.getPaymentGateways);
router.post('/payment-gateways', requireTenantAdmin, billCtrl.createPaymentGateway);
router.get('/payment-gateways/:gatewayId', billCtrl.getPaymentGatewayById);
router.patch('/payment-gateways/:gatewayId', requireTenantAdmin, billCtrl.updatePaymentGateway);
router.delete('/payment-gateways/:gatewayId', requireTenantAdmin, billCtrl.deletePaymentGateway);
router.post('/payment-gateways/:gatewayId/test', requireTenantAdmin, billCtrl.testPaymentGateway);
router.post('/payment-gateways/:gatewayId/activate', requireTenantAdmin, billCtrl.activatePaymentGateway);
router.post('/payment-gateways/:gatewayId/deactivate', requireTenantAdmin, billCtrl.deactivatePaymentGateway);

// ==========================================
// 16. INVENTORY & PURCHASES
// ==========================================
router.post('/products', requirePermission('inventory.create'), checkPlanLimit('products'), invCtrl.createProduct);
router.get('/products', requirePermission('inventory.view'), invCtrl.getProducts);
router.get('/products/:productId', requirePermission('inventory.view'), invCtrl.getProductById);
router.patch('/products/:productId', requirePermission('inventory.update'), invCtrl.updateProduct);
router.delete('/products/:productId', requirePermission('inventory.update'), invCtrl.deleteProduct);

router.get('/inventory', requirePermission('inventory.view'), invCtrl.getInventoryOverview);
router.get('/inventory/low-stock', requirePermission('inventory.view'), invCtrl.getLowStockProducts);
router.post('/inventory/stock-in', requirePermission('inventory.create'), invCtrl.stockIn);
router.post('/inventory/stock-out', requirePermission('inventory.update'), invCtrl.stockOut);
router.post('/inventory/adjust', requirePermission('inventory.update'), invCtrl.adjustStock);
router.post('/inventory/transfer', requirePermission('inventory.update'), invCtrl.transferStock);
router.get('/inventory/transactions', requirePermission('inventory.view'), invCtrl.getInventoryTransactions);

router.post('/suppliers', requirePermission('inventory.create'), invCtrl.createSupplier);
router.get('/suppliers', invCtrl.getSuppliers);
router.get('/suppliers/:supplierId', invCtrl.getSupplierById);
router.patch('/suppliers/:supplierId', requirePermission('inventory.update'), invCtrl.updateSupplier);
router.delete('/suppliers/:supplierId', requirePermission('inventory.update'), invCtrl.deleteSupplier);

router.post('/purchases', requirePermission('inventory.create'), invCtrl.createPurchase);
router.get('/purchases', requirePermission('inventory.view'), invCtrl.getPurchases);
router.get('/purchases/:purchaseId', requirePermission('inventory.view'), invCtrl.getPurchaseById);

// ==========================================
// 17. FACILITIES, UTILITIES, RENT, ASSETS & SCRAP
// ==========================================
router.post('/scrap', requirePermission('facilities.manage'), facCtrl.createScrapItem);
router.get('/scrap', requirePermission('facilities.view'), facCtrl.getScrapItems);
router.get('/scrap/:scrapId', facCtrl.getScrapItemById);
router.patch('/scrap/:scrapId', requirePermission('facilities.manage'), facCtrl.updateScrapItem);
router.delete('/scrap/:scrapId', requirePermission('facilities.manage'), facCtrl.deleteScrapItem);

router.post('/assets', requirePermission('facilities.manage'), facCtrl.createAsset);
router.get('/assets', requirePermission('facilities.view'), facCtrl.getAssets);
router.get('/assets/:assetId', facCtrl.getAssetById);
router.patch('/assets/:assetId', requirePermission('facilities.manage'), facCtrl.updateAsset);
router.delete('/assets/:assetId', requirePermission('facilities.manage'), facCtrl.deleteAsset);
router.post('/assets/:assetId/assign', requirePermission('facilities.manage'), facCtrl.assignAsset);
router.post('/assets/:assetId/repair', requirePermission('facilities.manage'), facCtrl.repairAsset);
router.post('/assets/:assetId/maintenance', requirePermission('facilities.manage'), facCtrl.maintainAsset);

router.post('/maintenance', requirePermission('facilities.manage'), facCtrl.createMaintenance);
router.get('/maintenance', requirePermission('facilities.view'), facCtrl.getMaintenanceList);
router.get('/maintenance/:maintenanceId', facCtrl.getMaintenanceById);
router.patch('/maintenance/:maintenanceId', requirePermission('facilities.manage'), facCtrl.updateMaintenance);
router.delete('/maintenance/:maintenanceId', requirePermission('facilities.manage'), facCtrl.deleteMaintenance);
router.post('/maintenance/:maintenanceId/start', requirePermission('facilities.manage'), facCtrl.startMaintenance);
router.post('/maintenance/:maintenanceId/complete', requirePermission('facilities.manage'), facCtrl.completeMaintenance);

router.post('/utilities/electricity', requirePermission('facilities.manage'), facCtrl.createElectricityBill);
router.get('/utilities/electricity', requirePermission('facilities.view'), facCtrl.getElectricityBills);
router.get('/utilities/electricity/:recordId', facCtrl.getElectricityBillById);
router.patch('/utilities/electricity/:recordId', requirePermission('facilities.manage'), facCtrl.updateElectricityBill);
router.delete('/utilities/electricity/:recordId', requirePermission('facilities.manage'), facCtrl.deleteElectricityBill);

router.post('/utilities', requirePermission('facilities.manage'), facCtrl.createUtility);
router.get('/utilities', requirePermission('facilities.view'), facCtrl.getUtilities);
router.get('/utilities/:utilityId', facCtrl.getUtilityById);
router.patch('/utilities/:utilityId', requirePermission('facilities.manage'), facCtrl.updateUtility);
router.delete('/utilities/:utilityId', requirePermission('facilities.manage'), facCtrl.deleteUtility);

router.post('/rent', requirePermission('facilities.manage'), facCtrl.createRent);
router.get('/rent', requirePermission('facilities.view'), facCtrl.getRentList);
router.get('/rent/:rentId', facCtrl.getRentById);
router.patch('/rent/:rentId', requirePermission('facilities.manage'), facCtrl.updateRent);
router.delete('/rent/:rentId', requirePermission('facilities.manage'), facCtrl.deleteRent);
router.post('/rent/:rentId/pay', requirePermission('facilities.manage'), facCtrl.payRent);

router.post('/expenses', requirePermission('facilities.manage'), facCtrl.createExpense);
router.get('/expenses', requirePermission('facilities.view'), facCtrl.getExpenses);
router.get('/expenses/:expenseId', facCtrl.getExpenseById);
router.patch('/expenses/:expenseId', requirePermission('facilities.manage'), facCtrl.updateExpense);
router.delete('/expenses/:expenseId', requirePermission('facilities.manage'), facCtrl.deleteExpense);

router.post('/additional-work', requirePermission('facilities.manage'), facCtrl.createAdditionalWork);
router.get('/additional-work', requirePermission('facilities.view'), facCtrl.getAdditionalWorkList);
router.get('/additional-work/:workId', facCtrl.getAdditionalWorkById);
router.patch('/additional-work/:workId', requirePermission('facilities.manage'), facCtrl.updateAdditionalWork);
router.delete('/additional-work/:workId', requirePermission('facilities.manage'), facCtrl.deleteAdditionalWork);
router.post('/additional-work/:workId/complete', requirePermission('facilities.manage'), facCtrl.completeAdditionalWork);

// ==========================================
// 18. COMMUNICATION & NOTIFICATIONS
// ==========================================
router.get('/communication/providers', commCtrl.getProviders);
router.post('/communication/providers', requireTenantAdmin, commCtrl.createProvider);
router.get('/communication/providers/:providerId', commCtrl.getProviderById);
router.patch('/communication/providers/:providerId', requireTenantAdmin, commCtrl.updateProvider);
router.delete('/communication/providers/:providerId', requireTenantAdmin, commCtrl.deleteProvider);
router.post('/communication/providers/:providerId/test', requireTenantAdmin, commCtrl.testProvider);
router.post('/communication/providers/:providerId/activate', requireTenantAdmin, commCtrl.activateProvider);
router.post('/communication/providers/:providerId/deactivate', requireTenantAdmin, commCtrl.deactivateProvider);

router.post('/notification-templates', requirePermission('communication.manage'), commCtrl.createNotificationTemplate);
router.get('/notification-templates', commCtrl.getNotificationTemplates);
router.get('/notification-templates/:templateId', commCtrl.getNotificationTemplateById);
router.patch('/notification-templates/:templateId', requirePermission('communication.manage'), commCtrl.updateNotificationTemplate);
router.delete('/notification-templates/:templateId', requirePermission('communication.manage'), commCtrl.deleteNotificationTemplate);
router.post('/notification-templates/:templateId/test', commCtrl.testNotificationTemplate);

// ==========================================
// 19. WEBSITE CMS
// ==========================================
router.get('/website', webCtrl.getWebsiteConfig);
router.patch('/website', requirePermission('website.manage'), webCtrl.updateWebsiteConfig);

router.get('/website/pages', webCtrl.getWebsitePages);
router.post('/website/pages', requirePermission('website.manage'), webCtrl.createWebsitePage);
router.get('/website/pages/:pageId', webCtrl.getWebsitePageById);
router.patch('/website/pages/:pageId', requirePermission('website.manage'), webCtrl.updateWebsitePage);
router.delete('/website/pages/:pageId', requirePermission('website.manage'), webCtrl.deleteWebsitePage);

router.get('/website/sections', webCtrl.getWebsiteSections);
router.post('/website/sections', requirePermission('website.manage'), webCtrl.createWebsiteSection);
router.patch('/website/sections/:sectionId', requirePermission('website.manage'), webCtrl.updateWebsiteSection);
router.delete('/website/sections/:sectionId', requirePermission('website.manage'), webCtrl.deleteWebsiteSection);

// ==========================================
// 20. REPORTS
// ==========================================
router.get('/reports/revenue', requirePermission('reports.view'), repCtrl.getRevenueReport);
router.get('/reports/sales', requirePermission('reports.view'), repCtrl.getSalesReport);
router.get('/reports/appointments', requirePermission('reports.view'), repCtrl.getAppointmentsReport);
router.get('/reports/customers', requirePermission('reports.view'), repCtrl.getCustomersReport);
router.get('/reports/staff', requirePermission('reports.view'), repCtrl.getStaffReport);
router.get('/reports/students', requirePermission('reports.view'), repCtrl.getStudentsReport);
router.get('/reports/services', requirePermission('reports.view'), repCtrl.getServicesReport);
router.get('/reports/packages', requirePermission('reports.view'), repCtrl.getPackagesReport);
router.get('/reports/inventory', requirePermission('reports.view'), repCtrl.getInventoryReport);
router.get('/reports/expenses', requirePermission('reports.view'), repCtrl.getExpensesReport);
router.get('/reports/profit-loss', requirePermission('reports.view'), repCtrl.getProfitLossReport);
router.get('/reports/attendance', requirePermission('reports.view'), repCtrl.getAttendanceReport);
router.get('/reports/leave', requirePermission('reports.view'), repCtrl.getLeaveReport);
router.get('/reports/commission', requirePermission('reports.view'), repCtrl.getCommissionReport);
router.get('/reports/payroll', requirePermission('reports.view'), repCtrl.getPayrollReport);
router.get('/reports/electricity', requirePermission('reports.view'), repCtrl.getElectricityReport);
router.get('/reports/rent', requirePermission('reports.view'), repCtrl.getRentReport);
router.get('/reports/maintenance', requirePermission('reports.view'), repCtrl.getMaintenanceReport);
router.get('/reports/scrap', requirePermission('reports.view'), repCtrl.getScrapReport);
router.get('/reports/home-services', requirePermission('reports.view'), repCtrl.getHomeServicesReport);
router.get('/reports/late-work', requirePermission('reports.view'), repCtrl.getLateWorkReport);

router.get('/reports/export/csv', requirePermission('reports.export'), repCtrl.exportReportCsv);
router.get('/reports/export/excel', requirePermission('reports.export'), repCtrl.exportReportExcel);
router.get('/reports/export/pdf', requirePermission('reports.export'), repCtrl.exportReportPdf);

// ==========================================
// 21. SETTINGS, AUDIT, SUBSCRIPTION & BULK
// ==========================================
router.get('/settings', requirePermission('settings.view'), setCtrl.getSettings);
router.patch('/settings', requirePermission('settings.update'), setCtrl.updateSettings);

router.get('/audit-logs', requirePermission('audit.view'), setCtrl.getAuditLogs);
router.get('/audit-logs/export', requirePermission('audit.view'), setCtrl.exportAuditLogs);
router.get('/audit-logs/:logId', requirePermission('audit.view'), setCtrl.getAuditLogById);

router.get('/subscription', setCtrl.getSubscriptionOverview);
router.get('/subscription/plan', setCtrl.getSubscriptionPlan);
router.get('/subscription/features', setCtrl.getSubscriptionFeatures);
router.get('/subscription/usage', setCtrl.getSubscriptionUsage);
router.get('/subscription/invoices', setCtrl.getSubscriptionInvoices);

// Bulk operations
router.post('/staff/bulk', requirePermission('staff.update'), setCtrl.bulkOperation('Staff'));
router.post('/customers/bulk', requirePermission('customer.update'), setCtrl.bulkOperation('Customer'));
router.post('/products/bulk', requirePermission('inventory.update'), setCtrl.bulkOperation('Product'));
router.post('/services/bulk', requirePermission('service.update'), setCtrl.bulkOperation('Service'));
router.post('/students/bulk', requirePermission('student.update'), setCtrl.bulkOperation('Student'));

// CSV Import / Export
router.post('/import/staff', requirePermission('staff.create'), setCtrl.importCsv('Staff'));
router.post('/import/customers', requirePermission('customer.create'), setCtrl.importCsv('Customer'));
router.post('/import/students', requirePermission('student.create'), setCtrl.importCsv('Student'));
router.post('/import/products', requirePermission('inventory.create'), setCtrl.importCsv('Product'));

router.get('/export/staff', requirePermission('staff.view'), setCtrl.exportCsv('Staff'));
router.get('/export/customers', requirePermission('customer.view'), setCtrl.exportCsv('Customer'));
router.get('/export/students', requirePermission('student.view'), setCtrl.exportCsv('Student'));
router.get('/export/products', requirePermission('inventory.view'), setCtrl.exportCsv('Product'));

export default router;
