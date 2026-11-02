/**
 * @file staff.routes.js
 * @description Complete Staff Portal Routes under /api/v1/staff/*
 * Handles full staff lifecycle, authentication, role/permission, branch switching,
 * appointments, CRM, home services, attendance, leaves, finance, documents, requests,
 * tenant chat, tasks, calendar, performance, and security.
 */

import { Router } from 'express';
import { tenantResolverMiddleware } from '../middleware/tenant-resolver.middleware.js';
import { authenticateStaffUser, requireStaffPermission } from '../middleware/staff-auth.middleware.js';

// Controllers
import * as authCtrl from '../modules/staff/auth/staffAuth.controller.js';
import * as dashCtrl from '../modules/staff/dashboard/staffDashboard.controller.js';
import * as profileCtrl from '../modules/staff/profile/staffProfile.controller.js';
import * as attCtrl from '../modules/staff/attendance/staffAttendance.controller.js';
import * as leaveCtrl from '../modules/staff/leaves/staffLeavesHolidays.controller.js';
import * as apptCtrl from '../modules/staff/appointments/staffAppointments.controller.js';
import * as crmCtrl from '../modules/staff/crm/staffCustomerCrm.controller.js';
import * as serviceCtrl from '../modules/staff/services/staffServicesCatalog.controller.js';
import * as homeCtrl from '../modules/staff/homeServices/staffHomeServices.controller.js';
import * as invCtrl from '../modules/staff/inventory/staffInventoryUsage.controller.js';
import * as finCtrl from '../modules/staff/finance/staffFinance.controller.js';
import * as docCtrl from '../modules/staff/documents/staffDocsCerts.controller.js';
import * as reqCtrl from '../modules/staff/requests/staffUnifiedRequests.controller.js';
import * as chatCtrl from '../modules/staff/chat/staffChat.controller.js';
import * as notifCtrl from '../modules/staff/notifications/staffNotifications.controller.js';
import * as perfCtrl from '../modules/staff/performance/staffPerformanceTasks.controller.js';
import * as calCtrl from '../modules/staff/calendar/staffCalendarReportsSecurity.controller.js';

const router = Router();

// Resolve tenant for all staff endpoints
router.use(tenantResolverMiddleware);

/* ==========================================================================
   1. STAFF AUTHENTICATION (Public / Session Endpoints)
   ========================================================================== */
router.post('/auth/login', authCtrl.staffLogin);
router.post('/auth/refresh', authCtrl.staffRefreshToken);
router.post('/auth/forgot-password', authCtrl.staffForgotPassword);
router.post('/auth/reset-password', authCtrl.staffResetPassword);

/* ==========================================================================
   PROTECTED STAFF ROUTES (Require authenticateStaffUser)
   ========================================================================== */
router.use(authenticateStaffUser);

// Auth & Session Management
router.post('/auth/logout', authCtrl.staffLogout);
router.post('/auth/logout-all', authCtrl.staffLogoutAll);
router.get('/auth/me', authCtrl.staffGetMe);
router.post('/auth/change-password', authCtrl.staffChangePassword);

router.get('/auth/sessions', authCtrl.getStaffSessions);
router.get('/auth/sessions/:sessionId', authCtrl.getStaffSessionById);
router.delete('/auth/sessions/:sessionId', authCtrl.revokeStaffSession);
router.post('/auth/sessions/revoke-all', authCtrl.revokeAllOtherSessions);

/* ==========================================================================
   2. DASHBOARD
   ========================================================================== */
router.get('/dashboard/overview', dashCtrl.getDashboardOverview);
router.get('/dashboard/today', dashCtrl.getDashboardToday);
router.get('/dashboard/appointments', dashCtrl.getDashboardAppointments);
router.get('/dashboard/tasks', dashCtrl.getDashboardTasks);
router.get('/dashboard/customers', dashCtrl.getDashboardCustomers);
router.get('/dashboard/home-services', dashCtrl.getDashboardHomeServices);
router.get('/dashboard/earnings', dashCtrl.getDashboardEarnings);
router.get('/dashboard/attendance', dashCtrl.getDashboardAttendance);
router.get('/dashboard/notifications', dashCtrl.getDashboardNotifications);
router.get('/dashboard/upcoming', dashCtrl.getDashboardUpcoming);
router.get('/dashboard/birthdays', dashCtrl.getDashboardBirthdays);
router.get('/dashboard/leaves', dashCtrl.getDashboardLeaves);
router.get('/dashboard/pending-requests', dashCtrl.getDashboardPendingRequests);

/* ==========================================================================
   3. PROFILE & ROLE / PERMISSIONS / BRANCHES
   ========================================================================== */
router.get('/profile', profileCtrl.getProfile);
router.patch('/profile', profileCtrl.updateProfile);
router.post('/profile/photo', profileCtrl.uploadPhoto);
router.delete('/profile/photo', profileCtrl.deletePhoto);
router.get('/profile/summary', profileCtrl.getProfileSummary);
router.get('/profile/activity', profileCtrl.getProfileActivity);

router.get('/role', profileCtrl.getStaffRole);
router.get('/permissions', profileCtrl.getStaffPermissions);
router.get('/permissions/check', profileCtrl.checkStaffPermission);

router.get('/branches', profileCtrl.getStaffBranches);
router.get('/branches/:branchId', profileCtrl.getStaffBranchById);
router.get('/current-branch', profileCtrl.getCurrentBranch);
router.patch('/current-branch', profileCtrl.switchCurrentBranch);

/* ==========================================================================
   4. ATTENDANCE & CORRECTION REQUESTS
   ========================================================================== */
router.post('/attendance/check-in', attCtrl.checkIn);
router.post('/attendance/check-out', attCtrl.checkOut);
router.get('/attendance', attCtrl.getAttendanceRecords);
router.get('/attendance/today', attCtrl.getTodayAttendance);
router.get('/attendance/summary', attCtrl.getAttendanceSummary);
router.get('/attendance/monthly', attCtrl.getMonthlyAttendance);
router.get('/attendance/:attendanceId', attCtrl.getAttendanceById);

router.post('/attendance-corrections', attCtrl.createCorrectionRequest);
router.get('/attendance-corrections', attCtrl.getCorrectionRequests);
router.get('/attendance-corrections/:requestId', attCtrl.getCorrectionRequestById);
router.patch('/attendance-corrections/:requestId', attCtrl.updateCorrectionRequest);
router.post('/attendance-corrections/:requestId/cancel', attCtrl.cancelCorrectionRequest);

/* ==========================================================================
   5. LEAVES, HOLIDAYS & WORK SCHEDULE
   ========================================================================== */
router.post('/leaves', leaveCtrl.applyLeave);
router.get('/leaves', leaveCtrl.getLeaves);
router.get('/leaves/:leaveId', leaveCtrl.getLeaveById);
router.patch('/leaves/:leaveId', leaveCtrl.updateLeave);
router.delete('/leaves/:leaveId', leaveCtrl.deleteLeave);
router.post('/leaves/:leaveId/cancel', leaveCtrl.cancelLeave);

router.get('/holidays', leaveCtrl.getHolidays);
router.get('/holidays/upcoming', leaveCtrl.getUpcomingHolidays);
router.get('/holidays/:holidayId', leaveCtrl.getHolidayById);

router.get('/schedule', leaveCtrl.getSchedule);
router.get('/schedule/today', leaveCtrl.getTodaySchedule);
router.get('/schedule/week', leaveCtrl.getWeekSchedule);
router.get('/working-hours', leaveCtrl.getWorkingHours);

/* ==========================================================================
   6. APPOINTMENTS (Assigned & Lifecycle)
   ========================================================================== */
router.get('/appointments', apptCtrl.getAppointments);
router.get('/appointments/today', apptCtrl.getTodayAppointments);
router.get('/appointments/upcoming', apptCtrl.getUpcomingAppointments);
router.get('/appointments/history', apptCtrl.getAppointmentHistory);
router.get('/appointments/:appointmentId', apptCtrl.getAppointmentById);

router.post('/appointments/:appointmentId/accept', apptCtrl.acceptAppointment);
router.post('/appointments/:appointmentId/reject', apptCtrl.rejectAppointment);
router.post('/appointments/:appointmentId/confirm', apptCtrl.confirmAppointment);
router.post('/appointments/:appointmentId/check-in', apptCtrl.checkInAppointment);
router.post('/appointments/:appointmentId/start', apptCtrl.startAppointment);
router.post('/appointments/:appointmentId/pause', apptCtrl.pauseAppointment);
router.post('/appointments/:appointmentId/resume', apptCtrl.resumeAppointment);
router.post('/appointments/:appointmentId/complete', apptCtrl.completeAppointment);
router.post('/appointments/:appointmentId/cancel-request', apptCtrl.cancelAppointmentRequest);
router.post('/appointments/:appointmentId/reschedule-request', apptCtrl.rescheduleAppointmentRequest);

/* ==========================================================================
   7. CUSTOMER CRM & NOTES
   ========================================================================== */
router.get('/customers', crmCtrl.getCustomers);
router.get('/customers/:customerId', crmCtrl.getCustomerById);
router.get('/customers/:customerId/profile', crmCtrl.getCustomerProfile);
router.get('/customers/:customerId/appointments', crmCtrl.getCustomerAppointments);
router.get('/customers/:customerId/services', crmCtrl.getCustomerServices);
router.get('/customers/:customerId/packages', crmCtrl.getCustomerPackages);
router.get('/customers/:customerId/visits', crmCtrl.getCustomerVisits);
router.get('/customers/:customerId/notes', crmCtrl.getCustomerNotes);
router.get('/customers/:customerId/history', crmCtrl.getCustomerHistory);

router.post('/customers', crmCtrl.createCustomer);
router.patch('/customers/:customerId', crmCtrl.updateCustomer);
router.post('/customers/:customerId/notes', crmCtrl.addCustomerNote);
router.patch('/customers/:customerId/notes/:noteId', crmCtrl.updateCustomerNote);
router.delete('/customers/:customerId/notes/:noteId', crmCtrl.deleteCustomerNote);

/* ==========================================================================
   8. SERVICES, PACKAGES, OFFERS & SKILLS
   ========================================================================== */
router.get('/services', serviceCtrl.getServices);
router.get('/services/categories', serviceCtrl.getServiceCategories);
router.get('/services/options', serviceCtrl.getServiceOptions);
router.get('/services/:serviceId', serviceCtrl.getServiceById);

router.get('/skills', serviceCtrl.getSkills);
router.get('/specializations', serviceCtrl.getSpecializations);
router.post('/skill-requests', serviceCtrl.createSkillRequest);
router.get('/skill-requests', serviceCtrl.getSkillRequests);
router.get('/skill-requests/:requestId', serviceCtrl.getSkillRequestById);
router.post('/skill-requests/:requestId/cancel', serviceCtrl.cancelSkillRequest);

router.get('/packages', serviceCtrl.getPackages);
router.get('/packages/:packageId', serviceCtrl.getPackageById);

router.get('/offers', serviceCtrl.getOffers);
router.get('/offers/:offerId', serviceCtrl.getOfferById);

/* ==========================================================================
   9. HOME SERVICES (Lifecycle, GPS Tracking, Expenses, Work Reports)
   ========================================================================== */
router.get('/home-services', homeCtrl.getHomeServices);
router.get('/home-services/today', homeCtrl.getTodayHomeServices);
router.get('/home-services/upcoming', homeCtrl.getUpcomingHomeServices);
router.get('/home-services/history', homeCtrl.getHomeServicesHistory);
router.get('/home-services/:appointmentId', homeCtrl.getHomeServiceById);
router.get('/home-services/:appointmentId/tracking', homeCtrl.getHomeServiceTracking);

// Home Service Transitions
router.post('/home-services/:appointmentId/accept', homeCtrl.acceptHomeService);
router.post('/home-services/:appointmentId/reject', homeCtrl.rejectHomeService);
router.post('/home-services/:appointmentId/on-the-way', homeCtrl.onTheWayHomeService);
router.post('/home-services/:appointmentId/arrived', homeCtrl.arrivedHomeService);
router.post('/home-services/:appointmentId/start', homeCtrl.startHomeService);
router.post('/home-services/:appointmentId/pause', homeCtrl.pauseHomeService);
router.post('/home-services/:appointmentId/resume', homeCtrl.resumeHomeService);
router.post('/home-services/:appointmentId/complete', homeCtrl.completeHomeService);
router.post('/home-services/:appointmentId/depart', homeCtrl.departHomeService);

// GPS Location
router.post('/home-services/:appointmentId/location', homeCtrl.updateLocation);
router.get('/home-services/:appointmentId/location', homeCtrl.getLocation);

// Travel Expenses
router.post('/home-services/:appointmentId/expense', homeCtrl.addExpense);
router.get('/home-services/:appointmentId/expenses', homeCtrl.getExpenses);
router.patch('/home-services/:appointmentId/expenses/:expenseId', homeCtrl.updateExpense);
router.delete('/home-services/:appointmentId/expenses/:expenseId', homeCtrl.deleteExpense);

// Work Report
router.post('/home-services/:appointmentId/report', homeCtrl.submitWorkReport);
router.get('/home-services/:appointmentId/report', homeCtrl.getWorkReport);
router.patch('/home-services/:appointmentId/report', homeCtrl.updateWorkReport);

// Additional Work Requests
router.post('/additional-work-requests', homeCtrl.createAdditionalWorkRequest);
router.get('/additional-work-requests', homeCtrl.getAdditionalWorkRequests);
router.get('/additional-work-requests/:requestId', homeCtrl.getAdditionalWorkRequestById);
router.patch('/additional-work-requests/:requestId', homeCtrl.updateAdditionalWorkRequest);
router.post('/additional-work-requests/:requestId/cancel', homeCtrl.cancelAdditionalWorkRequest);

/* ==========================================================================
   10. INVENTORY, PRODUCTS & TREATMENT SERVICE USAGE
   ========================================================================== */
router.get('/products', invCtrl.getProducts);
router.get('/products/:productId', invCtrl.getProductById);
router.get('/inventory', invCtrl.getInventory);
router.get('/inventory/availability', invCtrl.getInventoryAvailability);

router.post('/inventory-requests', invCtrl.createInventoryRequest);
router.get('/inventory-requests', invCtrl.getInventoryRequests);
router.get('/inventory-requests/:requestId', invCtrl.getInventoryRequestById);
router.post('/inventory-requests/:requestId/cancel', invCtrl.cancelInventoryRequest);

router.post('/service-usage', invCtrl.logServiceUsage);
router.get('/service-usage', invCtrl.getServiceUsageList);
router.get('/service-usage/:usageId', invCtrl.getServiceUsageById);

/* ==========================================================================
   11. FINANCE, EARNINGS, SALARY, PAYSLIPS & COMMISSION
   ========================================================================== */
router.get('/earnings', finCtrl.getEarningsOverview);
router.get('/earnings/summary', finCtrl.getEarningsSummary);
router.get('/earnings/monthly', finCtrl.getMonthlyEarnings);
router.get('/earnings/commission', finCtrl.getCommissionSummary);
router.get('/earnings/history', finCtrl.getEarningsHistory);

router.get('/payments', finCtrl.getPayments);
router.get('/payments/:paymentId', finCtrl.getPaymentById);
router.get('/salary', finCtrl.getSalaryDetails);
router.get('/salary/history', finCtrl.getSalaryHistory);
router.get('/payslips', finCtrl.getPayslips);
router.get('/payslips/:payslipId', finCtrl.getPayslipById);
router.get('/payslips/:payslipId/download', finCtrl.downloadPayslip);

router.get('/commission', finCtrl.getCommission);
router.get('/commission/summary', finCtrl.getCommissionSummary);
router.get('/commission/history', finCtrl.getCommissionHistory);

/* ==========================================================================
   12. DOCUMENTS & CERTIFICATES
   ========================================================================== */
router.get('/documents', docCtrl.getDocuments);
router.get('/documents/:documentId', docCtrl.getDocumentById);
router.post('/documents', docCtrl.createDocument);
router.patch('/documents/:documentId', docCtrl.updateDocument);
router.delete('/documents/:documentId', docCtrl.deleteDocument);

router.get('/certificates', docCtrl.getCertificates);
router.get('/certificates/:certificateId', docCtrl.getCertificateById);
router.get('/certificates/:certificateId/download', docCtrl.downloadCertificate);
router.post('/certificates', docCtrl.createCertificate);
router.patch('/certificates/:certificateId', docCtrl.updateCertificate);
router.delete('/certificates/:certificateId', docCtrl.deleteCertificate);

/* ==========================================================================
   13. REUSABLE STAFF REQUEST SYSTEM (14 Request Types)
   ========================================================================== */
router.post('/requests', reqCtrl.createRequest);
router.get('/requests', reqCtrl.getRequests);
router.get('/requests/:requestId', reqCtrl.getRequestById);
router.patch('/requests/:requestId', reqCtrl.updateRequest);
router.post('/requests/:requestId/cancel', reqCtrl.cancelRequest);

/* ==========================================================================
   14. TENANT CHAT & MESSAGING
   ========================================================================== */
router.post('/chats', chatCtrl.createChat);
router.get('/chats', chatCtrl.getChats);
router.get('/chats/:chatId', chatCtrl.getChatById);
router.post('/chats/:chatId/messages', chatCtrl.sendMessage);
router.get('/chats/:chatId/messages', chatCtrl.getMessages);
router.patch('/chats/:chatId/read', chatCtrl.markAsRead);
router.post('/chats/:chatId/archive', chatCtrl.archiveChat);

/* ==========================================================================
   15. NOTIFICATIONS, PREFERENCES, ANNOUNCEMENTS & BIRTHDAYS
   ========================================================================== */
router.get('/notifications', notifCtrl.getNotifications);
router.get('/notifications/:notificationId', notifCtrl.getNotificationById);
router.patch('/notifications/:notificationId/read', notifCtrl.markNotificationRead);
router.post('/notifications/read-all', notifCtrl.markAllNotificationsRead);
router.delete('/notifications/:notificationId', notifCtrl.deleteNotification);

router.get('/notification-preferences', notifCtrl.getPreferences);
router.patch('/notification-preferences', notifCtrl.updatePreferences);

router.get('/announcements', notifCtrl.getAnnouncements);
router.get('/announcements/:announcementId', notifCtrl.getAnnouncementById);
router.patch('/announcements/:announcementId/read', notifCtrl.markAnnouncementRead);

router.get('/birthdays', notifCtrl.getBirthdays);
router.get('/birthdays/upcoming', notifCtrl.getUpcomingBirthdays);

/* ==========================================================================
   16. PERFORMANCE, FEEDBACK, REVIEWS, TASKS & COMMENTS
   ========================================================================== */
router.get('/performance', perfCtrl.getPerformance);
router.get('/performance/monthly', perfCtrl.getMonthlyPerformance);
router.get('/performance/services', perfCtrl.getServicesPerformance);
router.get('/performance/customers', perfCtrl.getCustomersPerformance);
router.get('/performance/attendance', perfCtrl.getAttendancePerformance);

router.get('/feedback', perfCtrl.getFeedback);
router.get('/feedback/:feedbackId', perfCtrl.getFeedbackById);
router.get('/reviews', perfCtrl.getReviews);
router.get('/reviews/:reviewId', perfCtrl.getReviewById);

router.get('/tasks', perfCtrl.getTasks);
router.get('/tasks/:taskId', perfCtrl.getTaskById);
router.post('/tasks/:taskId/accept', perfCtrl.acceptTask);
router.post('/tasks/:taskId/start', perfCtrl.startTask);
router.post('/tasks/:taskId/pause', perfCtrl.pauseTask);
router.post('/tasks/:taskId/complete', perfCtrl.completeTask);
router.post('/tasks/:taskId/reject', perfCtrl.rejectTask);

router.get('/tasks/:taskId/comments', perfCtrl.getTaskComments);
router.post('/tasks/:taskId/comments', perfCtrl.addTaskComment);
router.patch('/tasks/:taskId/comments/:commentId', perfCtrl.updateTaskComment);
router.delete('/tasks/:taskId/comments/:commentId', perfCtrl.deleteTaskComment);

/* ==========================================================================
   17. CALENDAR, REPORTS, SETTINGS, SECURITY & AUDIT LOGS
   ========================================================================== */
router.get('/calendar/day', calCtrl.getCalendarDay);
router.get('/calendar/week', calCtrl.getCalendarWeek);
router.get('/calendar/month', calCtrl.getCalendarMonth);

router.get('/reports/attendance', calCtrl.getAttendanceReport);
router.get('/reports/appointments', calCtrl.getAppointmentsReport);
router.get('/reports/services', calCtrl.getServicesReport);
router.get('/reports/earnings', calCtrl.getEarningsReport);
router.get('/reports/commission', calCtrl.getCommissionReport);
router.get('/reports/home-services', calCtrl.getHomeServicesReport);
router.get('/reports/performance', calCtrl.getPerformanceReport);

router.get('/settings', calCtrl.getSettings);
router.patch('/settings', calCtrl.updateSettings);
router.get('/settings/security', calCtrl.getSecuritySettings);
router.patch('/settings/security', calCtrl.updateSecuritySettings);
router.get('/settings/privacy', calCtrl.getPrivacySettings);
router.patch('/settings/privacy', calCtrl.updatePrivacySettings);

router.get('/security/login-history', calCtrl.getLoginHistory);
router.get('/security/devices', calCtrl.getDevices);
router.delete('/security/devices/:deviceId', calCtrl.removeDevice);
router.post('/security/logout-all', calCtrl.logoutAllDevices);
router.post('/security/mfa/setup', calCtrl.setupMfa);
router.post('/security/mfa/verify', calCtrl.verifyMfa);
router.post('/security/mfa/disable', calCtrl.disableMfa);

router.get('/activity', calCtrl.getActivityLogs);
router.get('/audit-logs', calCtrl.getAuditLogs);

export default router;
