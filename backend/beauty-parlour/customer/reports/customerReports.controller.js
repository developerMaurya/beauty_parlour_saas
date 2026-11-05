/**
 * @file customerReports.controller.js
 * @description Customer Unified Reports, Chronological Timeline, Calendar, Documents & Security Controllers.
 * Generates the complete 21-section transcript and holistic customer ledger.
 * @module backend/src/modules/customer/reports/customerReports.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

// ==========================================
// REPORTS
// ==========================================

export const getOverviewReport = async (req, res) => {
  try {
    const CustomerModel = getTenantModel(req, 'Customer');
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const PaymentModel = getTenantModel(req, 'Payment');
    const ReviewModel = getTenantModel(req, 'CustomerReview');

    const customerId = req.customerId;
    const tenantId = req.tenantId;

    const [customer, appointments, payments, reviews] = await Promise.all([
      CustomerModel.findOne({ _id: customerId, tenantId }),
      AppointmentModel.find({ customerId, tenantId }),
      PaymentModel.find({ customerId, tenantId }),
      ReviewModel.find({ customerId, tenantId }),
    ]);

    const completed = appointments.filter((a) => a.status === 'completed');
    const upcoming = appointments.filter((a) => a.status === 'confirmed' || a.status === 'pending');
    const cancelled = appointments.filter((a) => a.status === 'cancelled');

    const totalPaid = payments
      .filter((p) => p.status === 'COMPLETED' || p.status === 'completed')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    return sendSuccess(res, 'Overview report generated successfully', {
      totalAppointments: appointments.length,
      completedAppointments: completed.length,
      upcomingAppointments: upcoming.length,
      cancelledAppointments: cancelled.length,
      totalSpent: customer?.totalSpent || totalPaid,
      totalPayments: payments.length,
      totalReviews: reviews.length,
      lastVisitDate: customer?.lastVisitDate || (completed[0]?.date) || null,
      registrationDate: customer?.registrationDate || customer?.createdAt,
    });
  } catch (error) {
    return sendError(res, `Failed to generate overview report: ${error.message}`, [], 500);
  }
};

export const getAppointmentsReport = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const items = await AppointmentModel.find({
      customerId: req.customerId,
      tenantId: req.tenantId,
    })
      .populate('branchId', 'name')
      .populate('staffId', 'name')
      .sort({ date: -1 });

    return sendSuccess(res, 'Appointments report generated', items);
  } catch (error) {
    return sendError(res, `Failed to generate report: ${error.message}`, [], 500);
  }
};

export const getServicesReport = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const appointments = await AppointmentModel.find({
      customerId: req.customerId,
      tenantId: req.tenantId,
      status: 'completed',
    });

    const serviceCounts = {};
    let totalServicesCount = 0;

    appointments.forEach((apt) => {
      (apt.services || []).forEach((s) => {
        const name = s.name || 'Service';
        serviceCounts[name] = (serviceCounts[name] || 0) + 1;
        totalServicesCount += 1;
      });
    });

    return sendSuccess(res, 'Services report generated', {
      totalServicesCount,
      uniqueServicesCount: Object.keys(serviceCounts).length,
      frequency: serviceCounts,
    });
  } catch (error) {
    return sendError(res, `Failed to generate report: ${error.message}`, [], 500);
  }
};

export const getPaymentsReport = async (req, res) => {
  try {
    const PaymentModel = getTenantModel(req, 'Payment');
    const payments = await PaymentModel.find({
      customerId: req.customerId,
      tenantId: req.tenantId,
    }).sort({ createdAt: -1 });

    let onlinePaid = 0;
    let offlinePaid = 0;
    let pending = 0;
    let refunded = 0;

    payments.forEach((p) => {
      const isCompleted = p.status === 'COMPLETED' || p.status === 'completed';
      const isOnline = p.paymentMethod === 'ONLINE' || p.paymentMethod === 'CARD' || p.paymentMethod === 'UPI';

      if (p.status === 'REFUNDED') {
        refunded += p.amount || 0;
      } else if (isCompleted) {
        if (isOnline) onlinePaid += p.amount || 0;
        else offlinePaid += p.amount || 0;
      } else if (p.status === 'PENDING') {
        pending += p.amount || 0;
      }
    });

    return sendSuccess(res, 'Payments report generated', {
      totalTransactions: payments.length,
      totalPaid: onlinePaid + offlinePaid,
      onlinePaid,
      offlinePaid,
      pending,
      refunded,
      ledger: payments,
    });
  } catch (error) {
    return sendError(res, `Failed to generate report: ${error.message}`, [], 500);
  }
};

export const getVisitsReport = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const visits = await AppointmentModel.find({
      customerId: req.customerId,
      tenantId: req.tenantId,
      status: 'completed',
    })
      .populate('branchId', 'name')
      .populate('staffId', 'name')
      .sort({ date: -1 });

    return sendSuccess(res, 'Visits report generated', {
      totalVisits: visits.length,
      visits,
    });
  } catch (error) {
    return sendError(res, `Failed to generate report: ${error.message}`, [], 500);
  }
};

export const getReviewsReport = async (req, res) => {
  try {
    const ReviewModel = getTenantModel(req, 'CustomerReview');
    const reviews = await ReviewModel.find({
      customerId: req.customerId,
      tenantId: req.tenantId,
    }).sort({ createdAt: -1 });

    const avgRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + (r.overallRating || 0), 0) / reviews.length).toFixed(1)
      : '0.0';

    return sendSuccess(res, 'Reviews report generated', {
      totalReviews: reviews.length,
      averageRating: parseFloat(avgRating),
      reviews,
    });
  } catch (error) {
    return sendError(res, `Failed to generate report: ${error.message}`, [], 500);
  }
};

export const getPackagesReport = async (req, res) => {
  try {
    const PackagePurchaseModel = getTenantModel(req, 'PackagePurchase');
    const packages = await PackagePurchaseModel.find({
      customerId: req.customerId,
      tenantId: req.tenantId,
    }).sort({ purchaseDate: -1 });

    return sendSuccess(res, 'Packages report generated', {
      totalPurchased: packages.length,
      active: packages.filter((p) => p.status === 'ACTIVE').length,
      packages,
    });
  } catch (error) {
    return sendError(res, `Failed to generate report: ${error.message}`, [], 500);
  }
};

/**
 * Unified 21-Section Complete Customer Report & Dossier.
 */
export const getCompleteReport = async (req, res) => {
  try {
    const customerId = req.customerId;
    const tenantId = req.tenantId;

    const CustomerModel = getTenantModel(req, 'Customer');
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const PaymentModel = getTenantModel(req, 'Payment');
    const ReviewModel = getTenantModel(req, 'CustomerReview');
    const RequestModel = getTenantModel(req, 'CustomerRequest');
    const AddressModel = getTenantModel(req, 'CustomerAddress');
    const PackagePurchaseModel = getTenantModel(req, 'PackagePurchase');
    const RefundRequestModel = getTenantModel(req, 'RefundRequest');
    const DocumentModel = getTenantModel(req, 'CustomerDocument');
    const NotificationModel = getTenantModel(req, 'CustomerNotification');

    const [
      customer,
      appointments,
      payments,
      reviews,
      requests,
      addresses,
      packages,
      refunds,
      documents,
      notifications,
    ] = await Promise.all([
      CustomerModel.findOne({ _id: customerId, tenantId }),
      AppointmentModel.find({ customerId, tenantId }).populate('branchId', 'name').populate('staffId', 'name').sort({ date: -1 }),
      PaymentModel.find({ customerId, tenantId }).sort({ createdAt: -1 }),
      ReviewModel.find({ customerId, tenantId }).sort({ createdAt: -1 }),
      RequestModel.find({ customerId, tenantId }).sort({ createdAt: -1 }),
      AddressModel.find({ customerId, tenantId }),
      PackagePurchaseModel.find({ customerId, tenantId }),
      RefundRequestModel.find({ customerId, tenantId }),
      DocumentModel.find({ customerId, tenantId }),
      NotificationModel.find({ customerId, tenantId }).sort({ createdAt: -1 }).limit(10),
    ]);

    const completed = appointments.filter((a) => a.status === 'completed');
    const upcoming = appointments.filter((a) => a.status === 'confirmed' || a.status === 'pending');
    const totalPaid = payments
      .filter((p) => p.status === 'COMPLETED' || p.status === 'completed')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    return sendSuccess(res, 'Complete customer report generated successfully', {
      profile: customer,
      metrics: {
        totalAppointments: appointments.length,
        completedAppointments: completed.length,
        upcomingAppointments: upcoming.length,
        totalVisits: completed.length,
        totalSpent: customer?.totalSpent || totalPaid,
        totalPackages: packages.length,
        totalReviews: reviews.length,
        totalSupportRequests: requests.length,
        totalAddresses: addresses.length,
      },
      appointments,
      services: completed.flatMap((a) => a.services || []),
      payments,
      invoices: payments.filter((p) => p.invoiceNumber),
      packages,
      reviews,
      refunds,
      requests,
      addresses,
      documents,
      recentNotifications: notifications,
      generatedAt: new Date(),
    });
  } catch (error) {
    return sendError(res, `Failed to generate complete dossier: ${error.message}`, [], 500);
  }
};

// ==========================================
// TIMELINE
// ==========================================

export const getTimeline = async (req, res) => {
  try {
    const customerId = req.customerId;
    const tenantId = req.tenantId;

    const CustomerModel = getTenantModel(req, 'Customer');
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const ReviewModel = getTenantModel(req, 'CustomerReview');
    const PaymentModel = getTenantModel(req, 'Payment');

    const [customer, appointments, reviews, payments] = await Promise.all([
      CustomerModel.findOne({ _id: customerId, tenantId }),
      AppointmentModel.find({ customerId, tenantId }).sort({ date: 1, createdAt: 1 }),
      ReviewModel.find({ customerId, tenantId }).sort({ createdAt: 1 }),
      PaymentModel.find({ customerId, tenantId }).sort({ createdAt: 1 }),
    ]);

    const timeline = [];

    // Registration event
    if (customer) {
      timeline.push({
        type: 'REGISTRATION',
        title: 'Customer Profile Created',
        description: `Welcome to the salon! Registered with mobile ${customer.phone || ''}`,
        timestamp: customer.registrationDate || customer.createdAt,
      });
    }

    // Appointment events
    appointments.forEach((apt) => {
      timeline.push({
        type: 'BOOKING_CREATED',
        title: `Booked Appointment #${apt.appointmentNumber}`,
        description: `Scheduled for ${apt.date} at ${apt.scheduledStartTime || 'scheduled time'} (${apt.serviceMode || 'In Store'})`,
        timestamp: apt.createdAt,
        appointmentId: apt._id,
      });

      if (apt.status === 'completed') {
        timeline.push({
          type: 'SERVICE_COMPLETED',
          title: `Service Completed #${apt.appointmentNumber}`,
          description: `All services finished successfully. Total ₹${apt.totalAmount}`,
          timestamp: apt.completedAt || apt.updatedAt,
          appointmentId: apt._id,
        });
      } else if (apt.status === 'cancelled') {
        timeline.push({
          type: 'BOOKING_CANCELLED',
          title: `Appointment Cancelled #${apt.appointmentNumber}`,
          description: apt.cancellationReason || 'Appointment cancelled',
          timestamp: apt.updatedAt,
          appointmentId: apt._id,
        });
      }
    });

    // Payment events
    payments.forEach((p) => {
      if (p.status === 'COMPLETED' || p.status === 'completed') {
        timeline.push({
          type: 'PAYMENT_COMPLETED',
          title: `Payment Received: ₹${p.amount}`,
          description: `Method: ${p.paymentMethod || 'Online'}. Invoice: ${p.invoiceNumber || 'N/A'}`,
          timestamp: p.paidAt || p.createdAt,
        });
      }
    });

    // Review events
    reviews.forEach((r) => {
      timeline.push({
        type: 'REVIEW_SUBMITTED',
        title: `Rated Service ${r.overallRating} ★`,
        description: r.comment || 'Submitted verified rating',
        timestamp: r.createdAt,
      });
    });

    // Sort descending by timestamp
    timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return sendSuccess(res, 'Customer chronological timeline retrieved', timeline);
  } catch (error) {
    return sendError(res, `Failed to generate timeline: ${error.message}`, [], 500);
  }
};

// ==========================================
// CALENDAR
// ==========================================

export const getCalendar = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const { startDate, endDate } = req.query;

    const query = {
      tenantId: req.tenantId,
      customerId: req.customerId,
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const appointments = await AppointmentModel.find(query)
      .populate('branchId', 'name address')
      .populate('staffId', 'name')
      .sort({ date: 1, scheduledStartTime: 1 });

    const events = appointments.map((apt) => ({
      id: apt._id,
      title: `${apt.services?.[0]?.name || 'Appointment'} (${apt.status.toUpperCase()})`,
      date: apt.date,
      startTime: apt.scheduledStartTime,
      endTime: apt.scheduledEndTime,
      status: apt.status,
      serviceMode: apt.serviceMode,
      branchName: apt.branchId?.name,
      staffName: apt.staffId?.name,
      totalAmount: apt.totalAmount,
    }));

    return sendSuccess(res, 'Customer calendar events retrieved', events);
  } catch (error) {
    return sendError(res, `Failed to retrieve calendar: ${error.message}`, [], 500);
  }
};

export const getTodayCalendar = async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  req.query.startDate = today;
  req.query.endDate = today;
  return getCalendar(req, res);
};

export const getWeekCalendar = async (req, res) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  req.query.startDate = today;
  req.query.endDate = nextWeek;
  return getCalendar(req, res);
};

export const getMonthCalendar = async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  req.query.startDate = startOfMonth;
  req.query.endDate = endOfMonth;
  return getCalendar(req, res);
};

// ==========================================
// SETTINGS
// ==========================================

export const getSettings = async (req, res) => {
  try {
    const SettingsModel = getTenantModel(req, 'CustomerSettings');
    let settings = await SettingsModel.findOne({
      tenantId: req.tenantId,
      customerId: req.customerId,
    });

    if (!settings) {
      settings = await SettingsModel.create({
        tenantId: req.tenantId,
        customerId: req.customerId,
        language: 'en',
        theme: 'system',
        marketingEmails: true,
        smsAlerts: true,
      });
    }

    return sendSuccess(res, 'Customer settings retrieved', settings);
  } catch (error) {
    return sendError(res, `Failed to retrieve settings: ${error.message}`, [], 500);
  }
};

export const updateSettings = async (req, res) => {
  try {
    const SettingsModel = getTenantModel(req, 'CustomerSettings');

    const updated = await SettingsModel.findOneAndUpdate(
      { tenantId: req.tenantId, customerId: req.customerId },
      { $set: req.body },
      { new: true, upsert: true }
    );

    return sendSuccess(res, 'Settings updated successfully', updated);
  } catch (error) {
    return sendError(res, `Failed to update settings: ${error.message}`, [], 500);
  }
};

// ==========================================
// SECURITY & SESSIONS
// ==========================================

export const getLoginHistory = async (req, res) => {
  try {
    const SessionModel = getTenantModel(req, 'CustomerSession');
    const sessions = await SessionModel.find({
      tenantId: req.tenantId,
      customerId: req.customerId,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    return sendSuccess(res, 'Login history retrieved', sessions);
  } catch (error) {
    return sendError(res, `Failed to retrieve login history: ${error.message}`, [], 500);
  }
};

export const getDevices = async (req, res) => {
  try {
    const SessionModel = getTenantModel(req, 'CustomerSession');
    const devices = await SessionModel.find({
      tenantId: req.tenantId,
      customerId: req.customerId,
      isActive: true,
    }).sort({ lastActiveAt: -1 });

    return sendSuccess(res, 'Active devices retrieved', devices);
  } catch (error) {
    return sendError(res, `Failed to retrieve devices: ${error.message}`, [], 500);
  }
};

export const removeDevice = async (req, res) => {
  try {
    const SessionModel = getTenantModel(req, 'CustomerSession');
    const session = await SessionModel.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId, customerId: req.customerId },
      { $set: { isActive: false, revokedAt: new Date() } },
      { new: true }
    );

    if (!session) {
      return sendError(res, 'Session/device not found', [], 404);
    }

    return sendSuccess(res, 'Device session revoked successfully', { sessionId: req.params.id });
  } catch (error) {
    return sendError(res, `Failed to revoke device: ${error.message}`, [], 500);
  }
};

export const revokeAllDevices = async (req, res) => {
  try {
    const SessionModel = getTenantModel(req, 'CustomerSession');
    await SessionModel.updateMany(
      { tenantId: req.tenantId, customerId: req.customerId },
      { $set: { isActive: false, revokedAt: new Date() } }
    );

    return sendSuccess(res, 'All active sessions revoked successfully', { revokedAll: true });
  } catch (error) {
    return sendError(res, `Failed to revoke sessions: ${error.message}`, [], 500);
  }
};

// ==========================================
// DOCUMENTS
// ==========================================

export const getDocuments = async (req, res) => {
  try {
    const DocumentModel = getTenantModel(req, 'CustomerDocument');
    const documents = await DocumentModel.find({
      tenantId: req.tenantId,
      customerId: req.customerId,
    }).sort({ createdAt: -1 });

    return sendSuccess(res, 'Customer documents retrieved', documents);
  } catch (error) {
    return sendError(res, `Failed to retrieve documents: ${error.message}`, [], 500);
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const DocumentModel = getTenantModel(req, 'CustomerDocument');
    const doc = await DocumentModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    });

    if (!doc) {
      return sendError(res, 'Document not found', [], 404);
    }

    return sendSuccess(res, 'Document retrieved', doc);
  } catch (error) {
    return sendError(res, `Failed to retrieve document: ${error.message}`, [], 500);
  }
};

export const uploadDocument = async (req, res) => {
  try {
    const { title, documentType = 'GENERAL', fileUrl, notes } = req.body;
    if (!title || !fileUrl) {
      return sendError(res, 'Document title and file URL are required', [], 400);
    }

    const DocumentModel = getTenantModel(req, 'CustomerDocument');
    const doc = await DocumentModel.create({
      tenantId: req.tenantId,
      customerId: req.customerId,
      title: title.trim(),
      documentType,
      fileUrl,
      notes: (notes || '').trim(),
      uploadedAt: new Date(),
    });

    return sendSuccess(res, 'Document uploaded successfully', doc, 201);
  } catch (error) {
    return sendError(res, `Failed to upload document: ${error.message}`, [], 500);
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const DocumentModel = getTenantModel(req, 'CustomerDocument');
    const doc = await DocumentModel.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    });

    if (!doc) {
      return sendError(res, 'Document not found or unauthorized', [], 404);
    }

    return sendSuccess(res, 'Document deleted successfully', { documentId: req.params.id });
  } catch (error) {
    return sendError(res, `Failed to delete document: ${error.message}`, [], 500);
  }
};

export const updateDocument = async (req, res) => {
  try {
    const { title, documentType, description, notes } = req.body;
    const DocumentModel = getTenantModel(req, 'CustomerDocument');
    const update = {};
    if (title) update.title = title.trim();
    if (documentType) update.documentType = documentType;
    if (description !== undefined) update.description = description.trim();
    if (notes !== undefined) update.description = notes.trim();

    const doc = await DocumentModel.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId, customerId: req.customerId },
      { $set: update },
      { new: true }
    );

    if (!doc) {
      return sendError(res, 'Document not found or unauthorized', [], 404);
    }

    return sendSuccess(res, 'Document updated successfully', doc);
  } catch (error) {
    return sendError(res, `Failed to update document: ${error.message}`, [], 500);
  }
};

export const downloadDocument = async (req, res) => {
  return getDocumentById(req, res);
};

export default {
  getOverviewReport,
  getAppointmentsReport,
  getServicesReport,
  getPaymentsReport,
  getVisitsReport,
  getReviewsReport,
  getPackagesReport,
  getCompleteReport,
  getTimeline,
  getCalendar,
  getTodayCalendar,
  getWeekCalendar,
  getMonthCalendar,
  getSettings,
  updateSettings,
  getLoginHistory,
  getDevices,
  removeDevice,
  revokeAllDevices,
  getDocuments,
  getDocumentById,
  uploadDocument,
  updateDocument,
  deleteDocument,
  downloadDocument,
};
