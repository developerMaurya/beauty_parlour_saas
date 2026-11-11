/**
 * @file customer.routes.js
 * @description Master Customer Routes under /api/v1/customer/*
 * Enforces Tenant Isolation, Customer JWT Verification, and Granular Permission Validation.
 * @module backend/src/routes/customer.routes
 */

import { Router } from 'express';
import { tenantResolverMiddleware } from '../middleware/tenant-resolver.middleware.js';
import { authenticateCustomerUser } from '../middleware/customer-auth.middleware.js';

// Customer Controllers
import authCtrl from '../modules/customer/auth/customerAuth.controller.js';
import dashboardCtrl from '../modules/customer/dashboard/customerDashboard.controller.js';
import profileCtrl from '../modules/customer/profile/customerProfile.controller.js';
import catalogCtrl from '../modules/customer/catalog/customerCatalog.controller.js';
import aptCtrl from '../modules/customer/appointments/customerAppointments.controller.js';
import trackingCtrl from '../modules/customer/tracking/customerTracking.controller.js';
import paymentCtrl from '../modules/customer/payments/customerPayments.controller.js';
import historyCtrl from '../modules/customer/history/customerHistory.controller.js';
import reviewCtrl from '../modules/customer/reviews/customerReviews.controller.js';
import favoriteCtrl from '../modules/customer/favorites/customerFavorites.controller.js';
import pkgCtrl from '../modules/customer/packages/customerPackages.controller.js';
import commCtrl from '../modules/customer/communication/customerCommunication.controller.js';
import requestCtrl from '../modules/customer/requests/customerRequests.controller.js';
import addressCtrl from '../modules/customer/addresses/customerAddresses.controller.js';
import reportCtrl from '../modules/customer/reports/customerReports.controller.js';

const router = Router();

// Apply Tenant Resolution to all customer routes
router.use(tenantResolverMiddleware);

// ==========================================
// 1. PUBLIC CUSTOMER AUTHENTICATION (No Bearer Token Required)
// ==========================================
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);
router.post('/auth/refresh', authCtrl.refreshToken);
router.post('/auth/forgot-password', authCtrl.forgotPassword);
router.post('/auth/reset-password', authCtrl.resetPassword);
router.post('/auth/google-login', authCtrl.googleLogin);
router.post('/auth/google', authCtrl.googleLogin);

// ==========================================
// PROTECTED CUSTOMER ROUTES (Requires Valid Customer Bearer Token)
// ==========================================
router.use(authenticateCustomerUser);

// Auth Me & Session Management
router.get('/auth/me', authCtrl.getMe);
router.post('/auth/logout', authCtrl.logout);
router.post('/auth/logout-all', authCtrl.logoutAll);
router.post('/auth/change-password', authCtrl.changePassword);
router.get('/auth/sessions', authCtrl.getSessions);
router.get('/auth/sessions/:sessionId', authCtrl.getSessionById);
router.delete('/auth/sessions/:sessionId', authCtrl.revokeSession);
router.post('/auth/sessions/revoke-all', authCtrl.revokeAllSessions);

// Dashboard
router.get('/dashboard', dashboardCtrl.getCustomerDashboard);

// Profile
router.get('/profile', profileCtrl.getProfile);
router.put('/profile', profileCtrl.updateProfile);
router.patch('/profile', profileCtrl.updateProfile);
router.post('/profile/photo', profileCtrl.uploadProfilePhoto);
router.delete('/profile/photo', profileCtrl.deleteProfilePhoto);

// Catalog (Branch & Customer contextual)
router.get('/services/history', historyCtrl.getServiceHistory);
router.get('/services/history/:id', historyCtrl.getServiceHistoryById);
router.get('/services', catalogCtrl.getServices);
router.get('/services/:id', catalogCtrl.getServiceById);
router.get('/service-categories', catalogCtrl.getServiceCategories);
router.get('/service-categories/:id', catalogCtrl.getServiceCategoryById);
router.get('/packages/my', pkgCtrl.getMyPackages);
router.get('/packages/my/:id', pkgCtrl.getPackageById);
router.get('/packages', catalogCtrl.getPackages);
router.post('/packages/:id/purchase', pkgCtrl.purchasePackage);
router.get('/packages/:id/usage', pkgCtrl.getPackageUsage);
router.get('/packages/:id/remaining-services', pkgCtrl.getRemainingServices);
router.get('/packages/:id', catalogCtrl.getPackageById);
router.get('/offers', catalogCtrl.getOffers);
router.get('/offers/:id', catalogCtrl.getOfferById);
router.get('/coupons', catalogCtrl.getCoupons);
router.post('/coupons/validate', catalogCtrl.validateCoupon);

// Appointment Lifecycle & Filtering
router.post('/appointments', aptCtrl.createAppointment);
router.get('/appointments', aptCtrl.getAppointments);
router.get('/appointments/upcoming', aptCtrl.getUpcomingAppointments);
router.get('/appointments/today', aptCtrl.getTodayAppointments);
router.get('/appointments/completed', aptCtrl.getCompletedAppointments);
router.get('/appointments/cancelled', aptCtrl.getCancelledAppointments);
router.get('/appointments/history', aptCtrl.getAppointmentHistory);
router.get('/appointments/:id', aptCtrl.getAppointmentById);
router.put('/appointments/:id', aptCtrl.updateAppointment);
router.patch('/appointments/:id', aptCtrl.updateAppointment);
router.post('/appointments/:id/cancel', aptCtrl.cancelAppointment);
router.post('/appointments/:id/reschedule', aptCtrl.rescheduleAppointment);
router.get('/appointments/:id/reschedule-options', aptCtrl.getRescheduleOptions);
router.post('/appointments/:id/confirm', aptCtrl.confirmAppointment);
router.post('/appointments/:id/rebook', aptCtrl.rebookAppointment);

// Live Service & Location Tracking
router.get('/appointments/:id/tracking', trackingCtrl.getAppointmentTracking);
router.get('/appointments/:id/status', trackingCtrl.getAppointmentStatus);
router.get('/appointments/:id/timeline', trackingCtrl.getAppointmentTimeline);
router.get('/home-services', trackingCtrl.getCustomerHomeServices);
router.get('/home-services/:id', trackingCtrl.getCustomerHomeServiceDetail);
router.get('/home-services/:id/tracking', trackingCtrl.getCustomerHomeServiceTracking);
router.get('/home-services/:id/location', trackingCtrl.getCustomerHomeServiceLocation);
router.get('/home-services/:id/timeline', trackingCtrl.getCustomerHomeServiceTimeline);

// Financial Ledger & Payments
router.get('/payments', paymentCtrl.getPayments);
router.get('/payments/summary', paymentCtrl.getPaymentSummary);
router.get('/payments/history', paymentCtrl.getPaymentHistory);
router.get('/payments/pending', paymentCtrl.getPendingPayments);
router.get('/payments/invoices', paymentCtrl.getInvoices);
router.get('/payments/invoices/:id', paymentCtrl.getInvoiceById);
router.get('/payments/invoices/:id/download', paymentCtrl.downloadInvoice);
router.get('/payments/receipts', paymentCtrl.getReceipts);
router.get('/payments/receipts/:id/download', paymentCtrl.downloadReceipt);
router.post('/payments/create-order', paymentCtrl.createPaymentOrder);
router.post('/payments/verify', paymentCtrl.verifyPayment);
router.post('/payments/offline', paymentCtrl.recordOfflinePayment);
router.get('/payments/:id', paymentCtrl.getPaymentById);

// Refund Requests
router.post('/refund-requests', paymentCtrl.createRefundRequest);
router.get('/refund-requests', paymentCtrl.getRefundRequests);
router.get('/refund-requests/:id', paymentCtrl.getRefundRequestById);
router.post('/refund-requests/:id/cancel', paymentCtrl.cancelRefundRequest);

// Visits
router.get('/visits', historyCtrl.getVisits);
router.get('/visits/:id', historyCtrl.getVisitById);

// Verified Reviews & Ratings
router.post('/reviews', reviewCtrl.createReview);
router.get('/reviews', reviewCtrl.getReviews);
router.get('/reviews/:id', reviewCtrl.getReviewById);
router.put('/reviews/:id', reviewCtrl.updateReview);
router.delete('/reviews/:id', reviewCtrl.deleteReview);

// Favorites
router.get('/favorites', favoriteCtrl.getFavorites);
router.post('/favorites/services/:serviceId', favoriteCtrl.addFavoriteService);
router.delete('/favorites/services/:serviceId', favoriteCtrl.removeFavoriteService);
router.post('/favorites/staff/:staffId', favoriteCtrl.addFavoriteStaff);
router.delete('/favorites/staff/:staffId', favoriteCtrl.removeFavoriteStaff);
router.post('/favorites/packages/:packageId', favoriteCtrl.addFavoritePackage);
router.delete('/favorites/packages/:packageId', favoriteCtrl.removeFavoritePackage);

// Communication (Chats, Notifications & Preferences)
router.get('/chats', commCtrl.getChats);
router.post('/chats', commCtrl.createChat);
router.get('/chats/:id', commCtrl.getChatById);
router.get('/chats/:id/messages', commCtrl.getChatMessages);
router.post('/chats/:id/messages', commCtrl.sendMessage);
router.put('/chats/:id/read', commCtrl.markChatRead);
router.post('/chats/:id/archive', commCtrl.archiveChat);

router.get('/notifications', commCtrl.getNotifications);
router.get('/notifications/:id', commCtrl.getNotificationById);
router.put('/notifications/:id/read', commCtrl.markNotificationRead);
router.post('/notifications/read-all', commCtrl.markAllNotificationsRead);
router.delete('/notifications/:id', commCtrl.deleteNotification);

router.get('/settings/notifications', commCtrl.getNotificationPreferences);
router.put('/settings/notifications', commCtrl.updateNotificationPreferences);

// Support Requests
router.get('/requests', requestCtrl.getRequests);
router.post('/requests', requestCtrl.createRequest);
router.get('/requests/:id', requestCtrl.getRequestById);
router.put('/requests/:id', requestCtrl.updateRequest);
router.delete('/requests/:id', requestCtrl.deleteRequest);
router.post('/requests/:id/cancel', requestCtrl.cancelRequest);

// Saved Addresses
router.get('/addresses', addressCtrl.getAddresses);
router.post('/addresses', addressCtrl.createAddress);
router.get('/addresses/:id', addressCtrl.getAddressById);
router.put('/addresses/:id', addressCtrl.updateAddress);
router.delete('/addresses/:id', addressCtrl.deleteAddress);
router.post('/addresses/:id/default', addressCtrl.setDefaultAddress);

// Documents
router.get('/documents', reportCtrl.getDocuments);
router.get('/documents/:id', reportCtrl.getDocumentById);
router.post('/documents', reportCtrl.uploadDocument);
router.put('/documents/:id', reportCtrl.updateDocument);
router.delete('/documents/:id', reportCtrl.deleteDocument);
router.get('/documents/:id/download', reportCtrl.downloadDocument);

// Calendar
router.get('/calendar', reportCtrl.getCalendar);
router.get('/calendar/today', reportCtrl.getTodayCalendar);
router.get('/calendar/week', reportCtrl.getWeekCalendar);
router.get('/calendar/month', reportCtrl.getMonthCalendar);

// Reports
router.get('/reports/overview', reportCtrl.getOverviewReport);
router.get('/reports/appointments', reportCtrl.getAppointmentsReport);
router.get('/reports/services', reportCtrl.getServicesReport);
router.get('/reports/payments', reportCtrl.getPaymentsReport);
router.get('/reports/visits', reportCtrl.getVisitsReport);
router.get('/reports/reviews', reportCtrl.getReviewsReport);
router.get('/reports/packages', reportCtrl.getPackagesReport);
router.get('/reports/complete', reportCtrl.getCompleteReport);

// Timeline
router.get('/timeline', reportCtrl.getTimeline);

// Settings
router.get('/settings', reportCtrl.getSettings);
router.put('/settings', reportCtrl.updateSettings);

// Security
router.get('/security/login-history', reportCtrl.getLoginHistory);
router.get('/security/devices', reportCtrl.getDevices);
router.delete('/security/devices/:id', reportCtrl.removeDevice);
router.post('/security/revoke-all', reportCtrl.revokeAllDevices);

export default router;
