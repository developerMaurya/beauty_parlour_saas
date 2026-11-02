/**
 * @file student.routes.js
 * @description Master Student Portal Routes under /api/v1/student/*
 * Conforms to Phase 06 Section 1 through 39.
 * Handles Student Authentication, Course Catalogs, Plan Purchases, Academic Enrollments,
 * Timetable, Attendance, Corrections, Materials, Assignments, Tests, Progress,
 * Financial Ledgers, Invoices, Certificates, Documents, Requests, Leaves, Chat, Reports & Security.
 * @module backend/src/routes/student.routes
 */

import { Router } from 'express';
import { tenantResolverMiddleware } from '../middleware/tenant-resolver.middleware.js';
import { authenticateStudentUser } from '../middleware/student-auth.middleware.js';

// Controllers
import * as authCtrl from '../modules/student/auth/studentAuth.controller.js';
import * as dashCtrl from '../modules/student/dashboard/studentDashboard.controller.js';
import * as profileCtrl from '../modules/student/profile/studentProfile.controller.js';
import * as planCtrl from '../modules/student/plans/studentPlans.controller.js';
import * as courseCtrl from '../modules/student/courses/studentCourses.controller.js';
import * as serviceCtrl from '../modules/student/services/studentServices.controller.js';
import * as purchaseCtrl from '../modules/student/purchases/studentPurchases.controller.js';
import * as enrollCtrl from '../modules/student/enrollments/studentEnrollments.controller.js';
import * as scheduleCtrl from '../modules/student/schedule/studentSchedule.controller.js';
import * as attCtrl from '../modules/student/attendance/studentAttendance.controller.js';
import * as acadCtrl from '../modules/student/academics/studentAcademics.controller.js';
import * as progCtrl from '../modules/student/progress/studentProgress.controller.js';
import * as payCtrl from '../modules/student/payments/studentPayments.controller.js';
import * as certCtrl from '../modules/student/certificates/studentCertificates.controller.js';
import * as docCtrl from '../modules/student/documents/studentDocuments.controller.js';
import * as reqCtrl from '../modules/student/requests/studentRequestsLeaves.controller.js';
import * as commCtrl from '../modules/student/communication/studentChatNotif.controller.js';
import * as repCtrl from '../modules/student/reports/studentReports.controller.js';

const router = Router();

// Resolve tenant context on all student endpoints
router.use(tenantResolverMiddleware);

/* ==========================================================================
   1. PUBLIC / AUTHENTICATION (Section 2)
   ========================================================================== */
router.post('/auth/login', authCtrl.studentLogin);
router.post('/auth/refresh', authCtrl.studentRefreshToken);
router.post('/auth/forgot-password', authCtrl.studentForgotPassword);
router.post('/auth/reset-password', authCtrl.studentResetPassword);

/* ==========================================================================
   PROTECTED STUDENT PORTAL ROUTES (Require authenticateStudentUser)
   ========================================================================== */
router.use(authenticateStudentUser);

// Sessions & Auth
router.post('/auth/logout', authCtrl.studentLogout);
router.post('/auth/logout-all', authCtrl.studentLogoutAll);
router.get('/auth/me', authCtrl.studentGetMe);
router.post('/auth/change-password', authCtrl.studentChangePassword);
router.get('/auth/sessions', authCtrl.getStudentSessions);
router.get('/auth/sessions/:sessionId', authCtrl.getStudentSessionById);
router.delete('/auth/sessions/:sessionId', authCtrl.revokeStudentSession);
router.post('/auth/sessions/revoke-all', authCtrl.revokeAllOtherSessions);

// Dashboard (Section 3)
router.get('/dashboard/overview', dashCtrl.getDashboardOverview);
router.get('/dashboard/today', dashCtrl.getDashboardToday);

// Profile (Section 4)
router.get('/profile', profileCtrl.getProfile);
router.put('/profile', profileCtrl.updateProfile);
router.patch('/profile', profileCtrl.updateProfile);
router.post('/profile/photo', profileCtrl.uploadPhoto);
router.delete('/profile/photo', profileCtrl.deletePhoto);

// Plans (Section 5)
router.get('/plans', planCtrl.getPlans);
router.get('/plans/:id', planCtrl.getPlanById);
router.get('/plans/:id/features', planCtrl.getPlanFeatures);
router.get('/plans/:id/courses', planCtrl.getPlanCourses);
router.get('/plans/:id/services', planCtrl.getPlanServices);

// Course Catalog (Section 6)
router.get('/courses', courseCtrl.getCourses);
router.get('/courses/:id', courseCtrl.getCourseById);
router.get('/courses/:id/modules', courseCtrl.getCourseModules);
router.get('/courses/:id/topics', courseCtrl.getCourseTopics);
router.get('/courses/:id/trainers', courseCtrl.getCourseTrainers);
router.get('/courses/:id/schedule', courseCtrl.getCourseSchedule);

// Additional Services (Section 7)
router.get('/services/categories', serviceCtrl.getServiceCategories);
router.get('/services', serviceCtrl.getServices);
router.get('/services/:id', serviceCtrl.getServiceById);

// Purchases (Section 8)
router.post('/purchases', purchaseCtrl.createPurchase);
router.get('/purchases', purchaseCtrl.getPurchases);
router.get('/purchases/:id', purchaseCtrl.getPurchaseById);
router.post('/purchases/:id/cancel', purchaseCtrl.cancelPurchase);

// Enrollments (Section 9)
router.get('/enrollments', enrollCtrl.getEnrollments);
router.get('/enrollments/:id', enrollCtrl.getEnrollmentById);
router.get('/enrollments/:id/overview', enrollCtrl.getEnrollmentOverview);
router.get('/enrollments/:id/timeline', enrollCtrl.getEnrollmentTimeline);
router.get('/enrollments/:id/status', enrollCtrl.getEnrollmentStatus);

// Class Schedule (Section 12)
router.get('/schedule', scheduleCtrl.getSchedule);
router.get('/schedule/today', scheduleCtrl.getTodaySchedule);
router.get('/schedule/week', scheduleCtrl.getWeekSchedule);
router.get('/schedule/month', scheduleCtrl.getMonthSchedule);
router.get('/classes', scheduleCtrl.getClasses);
router.get('/classes/:id', scheduleCtrl.getClassById);

// Attendance & Corrections (Section 13 & 14)
router.get('/attendance', attCtrl.getAttendance);
router.get('/attendance/today', attCtrl.getTodayAttendance);
router.get('/attendance/monthly', attCtrl.getMonthlyAttendance);
router.get('/attendance/summary', attCtrl.getAttendanceSummary);
router.get('/attendance-corrections', attCtrl.getAttendanceCorrections);
router.post('/attendance-corrections', attCtrl.createAttendanceCorrection);
router.get('/attendance-corrections/:id', attCtrl.getAttendanceCorrectionById);
router.put('/attendance-corrections/:id', attCtrl.updateAttendanceCorrection);
router.delete('/attendance-corrections/:id', attCtrl.deleteAttendanceCorrection);
router.post('/attendance-corrections/:id/cancel', attCtrl.cancelAttendanceCorrection);
router.get('/attendance/:id', attCtrl.getAttendanceById);

// Modules & Materials (Section 15 & 16)
router.get('/modules', acadCtrl.getModules);
router.get('/modules/:id', acadCtrl.getModuleById);
router.get('/modules/:id/topics', acadCtrl.getModuleTopics);
router.get('/modules/:id/progress', acadCtrl.getModuleProgress);
router.get('/materials', acadCtrl.getMaterials);
router.get('/materials/:id', acadCtrl.getMaterialById);
router.get('/materials/:id/download', acadCtrl.downloadMaterial);

// Assignments (Section 17)
router.get('/assignments', acadCtrl.getAssignments);
router.get('/assignments/:id', acadCtrl.getAssignmentById);
router.post('/assignments/:id/submit', acadCtrl.submitAssignment);
router.put('/assignments/:id/submission', acadCtrl.updateSubmission);
router.get('/assignments/:id/result', acadCtrl.getAssignmentResult);

// Tests & Exams (Section 18)
router.get('/tests', acadCtrl.getTests);
router.get('/tests/:id', acadCtrl.getTestById);
router.post('/tests/:id/start', acadCtrl.startTest);
router.post('/tests/:id/submit', acadCtrl.submitTest);
router.get('/tests/:id/result', acadCtrl.getTestResult);
router.get('/exams', acadCtrl.getExams);
router.get('/exams/:id', acadCtrl.getExamById);
router.get('/exams/:id/result', acadCtrl.getExamResult);

// Progress (Section 19)
router.get('/progress', progCtrl.getProgress);
router.get('/progress/summary', progCtrl.getProgressSummary);
router.get('/progress/history', progCtrl.getProgressHistory);
router.get('/progress/course/:courseId', progCtrl.getCourseProgress);
router.get('/progress/module/:moduleId', progCtrl.getModuleProgress);

// Payments & Invoices (Section 20, 21, 22 & 23)
router.get('/payments/summary', payCtrl.getPaymentSummary);
router.get('/payments/history', payCtrl.getPaymentHistory);
router.get('/payments/due', payCtrl.getDuePayments);
router.get('/payments/upcoming', payCtrl.getUpcomingPayments);
router.get('/payments/invoices', payCtrl.getInvoices);
router.get('/payments/invoices/:id/download', payCtrl.downloadInvoice);
router.get('/payments/invoices/:id', payCtrl.getInvoiceById);
router.get('/payments', payCtrl.getPayments);
router.get('/payments/:id', payCtrl.getPaymentById);

// Certificates (Section 24, 25, 26, 27)
router.get('/certificates', certCtrl.getCertificates);
router.get('/certificates/:id/status', certCtrl.getCertificateStatus);
router.get('/certificates/:id/download', certCtrl.downloadCertificate);
router.get('/certificates/:id/verify', certCtrl.verifyCertificate);
router.get('/certificates/:id', certCtrl.getCertificateById);

// Documents (Section 28)
router.get('/documents', docCtrl.getDocuments);
router.post('/documents', docCtrl.uploadDocument);
router.get('/documents/:id/download', docCtrl.downloadDocument);
router.get('/documents/:id', docCtrl.getDocumentById);
router.put('/documents/:id', docCtrl.updateDocument);
router.delete('/documents/:id', docCtrl.deleteDocument);

// Requests (Section 29)
router.get('/requests', reqCtrl.getRequests);
router.post('/requests', reqCtrl.createRequest);
router.get('/requests/:id', reqCtrl.getRequestById);
router.put('/requests/:id', reqCtrl.updateRequest);
router.delete('/requests/:id', reqCtrl.deleteRequest);
router.post('/requests/:id/cancel', reqCtrl.cancelRequest);

// Leaves (Section 30)
router.get('/leaves', reqCtrl.getLeaves);
router.post('/leaves', reqCtrl.createLeave);
router.get('/leaves/:id', reqCtrl.getLeaveById);
router.put('/leaves/:id', reqCtrl.updateLeave);
router.delete('/leaves/:id', reqCtrl.deleteLeave);
router.post('/leaves/:id/cancel', reqCtrl.cancelLeave);

// Trainers (Section 31)
router.get('/trainers', commCtrl.getTrainers);
router.get('/trainers/:id/profile', commCtrl.getTrainerProfile);
router.get('/trainers/:id', commCtrl.getTrainerById);

// Chat (Section 32)
router.get('/chats', commCtrl.getChats);
router.post('/chats', commCtrl.createChat);
router.get('/chats/:id', commCtrl.getChatById);
router.get('/chats/:id/messages', commCtrl.getChatMessages);
router.post('/chats/:id/messages', commCtrl.sendMessage);
router.put('/chats/:id/read', commCtrl.markChatRead);
router.post('/chats/:id/archive', commCtrl.archiveChat);

// Notifications (Section 33)
router.get('/notifications', commCtrl.getNotifications);
router.post('/notifications/read-all', commCtrl.markAllNotificationsRead);
router.get('/notifications/:id', commCtrl.getNotificationById);
router.put('/notifications/:id/read', commCtrl.markNotificationRead);
router.delete('/notifications/:id', commCtrl.deleteNotification);

// Announcements (Section 34)
router.get('/announcements', commCtrl.getAnnouncements);
router.get('/announcements/:id', commCtrl.getAnnouncementById);
router.put('/announcements/:id/read', commCtrl.markAnnouncementRead);

// Reports (Section 35 & 47)
router.get('/reports/overview', repCtrl.getOverviewReport);
router.get('/reports/course', repCtrl.getCourseReport);
router.get('/reports/attendance', repCtrl.getAttendanceReport);
router.get('/reports/progress', repCtrl.getProgressReport);
router.get('/reports/payment', repCtrl.getPaymentReport);
router.get('/reports/assignment', repCtrl.getAssignmentReport);
router.get('/reports/test', repCtrl.getTestReport);
router.get('/reports/exam', repCtrl.getExamReport);
router.get('/reports/certificate', repCtrl.getCertificateReport);
router.get('/reports/timeline', repCtrl.getTimelineReport);
router.get('/reports/complete', repCtrl.getCompleteReport);

// Timeline & Calendar (Section 36 & 37)
router.get('/timeline', repCtrl.getTimeline);
router.get('/calendar', repCtrl.getCalendar);

// Settings & Security (Section 38 & 39)
router.get('/settings', repCtrl.getSettings);
router.put('/settings', repCtrl.updateSettings);
router.get('/security/login-history', repCtrl.getLoginHistory);
router.get('/security/devices', repCtrl.getDevices);
router.delete('/security/devices/:id', repCtrl.revokeDevice);
router.post('/security/revoke-all', repCtrl.revokeAllDevices);

export default router;
