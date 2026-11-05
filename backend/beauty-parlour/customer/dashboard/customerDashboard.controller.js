/**
 * @file customerDashboard.controller.js
 * @description Customer Unified Real-Time Dashboard Controller.
 * @module backend/src/modules/customer/dashboard
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

export const getDashboard = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    const AppointmentModel = getTenantModel(req, 'Appointment');
    const PaymentModel = getTenantModel(req, 'Payment');
    const ServiceModel = getTenantModel(req, 'Service');
    const PackageModel = getTenantModel(req, 'Package');
    const OfferModel = getTenantModel(req, 'Offer');
    const CustomerReviewModel = getTenantModel(req, 'CustomerReview');
    const CustomerNotificationModel = getTenantModel(req, 'CustomerNotification');

    const [
      todayAppointments,
      upcomingAppointments,
      recentCompletedAppointments,
      customerPayments,
      recommendedServices,
      activeOffers,
      pendingReviewsCount,
      unreadNotifCount,
    ] = await Promise.all([
      AppointmentModel.find({
        tenantId: req.tenantId,
        customerId: req.customerId,
        date: todayStr,
        status: { $nin: ['cancelled', 'no_show'] },
      }).populate('branchId', 'name address phone').populate('staffId', 'name photo designation'),

      AppointmentModel.find({
        tenantId: req.tenantId,
        customerId: req.customerId,
        date: { $gte: todayStr },
        status: { $nin: ['completed', 'cancelled', 'no_show'] },
      }).sort({ date: 1, scheduledStartTime: 1 }).limit(5)
        .populate('branchId', 'name address phone')
        .populate('staffId', 'name photo designation'),

      AppointmentModel.find({
        tenantId: req.tenantId,
        customerId: req.customerId,
        status: 'completed',
      }).sort({ date: -1 }).limit(5)
        .populate('branchId', 'name')
        .populate('staffId', 'name photo'),

      PaymentModel.find({
        tenantId: req.tenantId,
        customerId: req.customerId,
      }).sort({ createdAt: -1 }),

      ServiceModel.find({
        tenantId: req.tenantId,
        status: 'active',
      }).limit(6),

      OfferModel.find({
        tenantId: req.tenantId,
        status: 'active',
        endDate: { $gte: new Date() },
      }).limit(4),

      CustomerReviewModel.countDocuments({
        tenantId: req.tenantId,
        customerId: req.customerId,
      }),

      CustomerNotificationModel.countDocuments({
        tenantId: req.tenantId,
        customerId: req.customerId,
        isRead: false,
      }),
    ]);

    // Financial totals
    let totalSpent = 0;
    let onlinePaid = 0;
    let offlinePaid = 0;
    let pendingPayment = 0;
    let lastPayment = null;

    if (customerPayments && customerPayments.length > 0) {
      lastPayment = customerPayments[0];
      for (const p of customerPayments) {
        const amt = Number(p.amount || p.totalAmount || 0);
        if (p.status === 'completed' || p.status === 'paid' || p.status === 'PAID') {
          totalSpent += amt;
          const method = (p.paymentMethod || p.method || '').toLowerCase();
          if (method.includes('online') || method.includes('razorpay') || method.includes('stripe') || method.includes('card') || method.includes('upi')) {
            onlinePaid += amt;
          } else {
            offlinePaid += amt;
          }
        } else if (p.status === 'pending' || p.status === 'partial') {
          pendingPayment += amt;
        }
      }
    }

    // Active tracking check
    const activeAppointment = todayAppointments.find(a =>
      ['on_the_way', 'reached', 'arrived', 'working', 'paused', 'assigned'].includes(a.status)
    ) || upcomingAppointments[0] || null;

    let trackingStatus = null;
    if (activeAppointment) {
      trackingStatus = {
        appointmentId: activeAppointment._id,
        appointmentNumber: activeAppointment.appointmentNumber,
        serviceMode: activeAppointment.serviceMode,
        status: activeAppointment.status,
        staff: activeAppointment.staffId ? {
          name: activeAppointment.staffId.name,
          photo: activeAppointment.staffId.photo,
          designation: activeAppointment.staffId.designation,
        } : null,
        scheduledStartTime: activeAppointment.scheduledStartTime,
        branch: activeAppointment.branchId?.name,
      };
    }

    return sendSuccess(res, 'Customer dashboard overview compiled', {
      todayAppointments,
      upcomingAppointments,
      recentCompletedAppointments,
      activeTracking: trackingStatus,
      financials: {
        totalSpent: req.customer.totalSpent || totalSpent,
        totalVisits: req.customer.totalVisits || recentCompletedAppointments.length,
        onlinePaid,
        offlinePaid,
        pendingPayment,
        lastPaymentAmount: lastPayment?.amount || 0,
        lastPaymentDate: lastPayment?.createdAt || null,
      },
      recommendedServices,
      activeOffers,
      unreadNotifCount,
      pendingReviewsCount,
      customer: {
        _id: req.customer._id,
        name: req.customer.name,
        customerNumber: req.customer.customerNumber,
        membership: req.customer.membership,
        loyaltyPoints: req.customer.loyaltyPoints || 0,
      },
    });
  } catch (err) {
    return sendError(res, 'Failed to compile dashboard: ' + err.message, [], 500);
  }
};

export const getCustomerDashboard = getDashboard;

export default {
  getDashboard,
  getCustomerDashboard,
};
