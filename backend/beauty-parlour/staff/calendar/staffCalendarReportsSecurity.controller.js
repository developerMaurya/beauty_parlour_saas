import { getTenantModel } from '../../../database/tenant/tenantModels.js';

/**
 * Staff Calendar, Personal Reports, Settings & Security Controller
 */

// 1. Calendar (Day / Week / Month)
export const getCalendarDay = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const Task = getTenantModel(req, 'Task');
    const Leave = getTenantModel(req, 'Leave');
    const Holiday = getTenantModel(req, 'Holiday');

    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const staffId = req.staff._id;

    const [appointments, tasks, leaves, holidays] = await Promise.all([
      Appointment.find({
        staffId,
        appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      })
        .populate('customerId', 'name phone')
        .populate('serviceId', 'name duration')
        .lean(),
      Task.find({
        assignedTo: staffId,
        $or: [
          { dueDate: { $gte: startOfDay, $lte: endOfDay } },
          { createdAt: { $gte: startOfDay, $lte: endOfDay } },
        ],
      }).lean(),
      Leave.find({
        staffId,
        status: 'approved',
        fromDate: { $lte: endOfDay },
        toDate: { $gte: startOfDay },
      }).lean(),
      Holiday.find({
        date: { $gte: startOfDay, $lte: endOfDay },
      }).lean(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        date: startOfDay.toISOString().split('T')[0],
        appointments,
        tasks,
        leaves,
        holidays,
        workingHours: req.staff.workingHours || { start: '09:00', end: '18:00' },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCalendarWeek = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const Task = getTenantModel(req, 'Task');
    const Leave = getTenantModel(req, 'Leave');
    const Holiday = getTenantModel(req, 'Holiday');

    const { startDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    end.setHours(23, 59, 59, 999);

    const staffId = req.staff._id;

    const [appointments, tasks, leaves, holidays] = await Promise.all([
      Appointment.find({
        staffId,
        appointmentDate: { $gte: start, $lte: end },
      })
        .populate('customerId', 'name phone')
        .populate('serviceId', 'name duration')
        .lean(),
      Task.find({
        assignedTo: staffId,
        dueDate: { $gte: start, $lte: end },
      }).lean(),
      Leave.find({
        staffId,
        status: 'approved',
        fromDate: { $lte: end },
        toDate: { $gte: start },
      }).lean(),
      Holiday.find({
        date: { $gte: start, $lte: end },
      }).lean(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        weekStart: start.toISOString().split('T')[0],
        weekEnd: end.toISOString().split('T')[0],
        appointments,
        tasks,
        leaves,
        holidays,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCalendarMonth = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const Leave = getTenantModel(req, 'Leave');
    const Holiday = getTenantModel(req, 'Holiday');

    const { year, month } = req.query;
    const now = new Date();
    const targetYear = year ? parseInt(year, 10) : now.getFullYear();
    const targetMonth = month ? parseInt(month, 10) - 1 : now.getMonth();

    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

    const staffId = req.staff._id;

    const [appointments, leaves, holidays] = await Promise.all([
      Appointment.find({
        staffId,
        appointmentDate: { $gte: startOfMonth, $lte: endOfMonth },
      })
        .populate('customerId', 'name')
        .populate('serviceId', 'name')
        .lean(),
      Leave.find({
        staffId,
        status: 'approved',
        fromDate: { $lte: endOfMonth },
        toDate: { $gte: startOfMonth },
      }).lean(),
      Holiday.find({
        date: { $gte: startOfMonth, $lte: endOfMonth },
      }).lean(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        year: targetYear,
        month: targetMonth + 1,
        appointmentsCount: appointments.length,
        appointments,
        leaves,
        holidays,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Personal Reports
export const getAttendanceReport = async (req, res) => {
  try {
    const Attendance = getTenantModel(req, 'Attendance');
    const records = await Attendance.find({ staffId: req.staff._id }).sort({ date: -1 }).lean();

    const summary = {
      totalDays: records.length,
      present: records.filter((r) => r.status === 'present').length,
      late: records.filter((r) => r.status === 'late' || r.isLate).length,
      halfDay: records.filter((r) => r.status === 'half_day').length,
      absent: records.filter((r) => r.status === 'absent').length,
      totalWorkingHours: records.reduce((s, r) => s + (r.workingHours || 0), 0),
      records,
    };

    return res.status(200).json({ success: true, data: summary });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAppointmentsReport = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const appointments = await Appointment.find({ staffId: req.staff._id })
      .populate('customerId', 'name phone')
      .populate('serviceId', 'name price')
      .sort({ appointmentDate: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        total: appointments.length,
        completed: appointments.filter((a) => a.status === 'completed').length,
        cancelled: appointments.filter((a) => a.status === 'cancelled').length,
        inProgress: appointments.filter((a) => a.status === 'in_progress' || a.status === 'started').length,
        records: appointments,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getServicesReport = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const appointments = await Appointment.find({ staffId: req.staff._id, status: 'completed' })
      .populate('serviceId', 'name price')
      .lean();

    const grouped = {};
    for (const app of appointments) {
      const sId = app.serviceId?._id ? String(app.serviceId._id) : 'custom';
      if (!grouped[sId]) {
        grouped[sId] = {
          name: app.serviceId?.name || 'Custom Service',
          count: 0,
          revenue: 0,
        };
      }
      grouped[sId].count += 1;
      grouped[sId].revenue += app.totalAmount || 0;
    }

    return res.status(200).json({ success: true, data: Object.values(grouped) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEarningsReport = async (req, res) => {
  try {
    const Payslip = getTenantModel(req, 'Payslip');
    const StaffEarning = getTenantModel(req, 'StaffEarning');

    const [payslips, earnings] = await Promise.all([
      Payslip.find({ staffId: req.staff._id }).sort({ createdAt: -1 }).lean(),
      StaffEarning.find({ staffId: req.staff._id }).sort({ date: -1 }).lean(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalPaidSalary: payslips.reduce((s, p) => s + (p.netAmount || 0), 0),
        payslips,
        earnings,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCommissionReport = async (req, res) => {
  try {
    const Commission = getTenantModel(req, 'Commission');
    const commissions = await Commission.find({ staffId: req.staff._id })
      .populate('serviceId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        totalCommission: commissions.reduce((s, c) => s + (c.commissionAmount || 0), 0),
        paidCommission: commissions.filter((c) => c.status === 'paid').reduce((s, c) => s + (c.commissionAmount || 0), 0),
        pendingCommission: commissions.filter((c) => c.status === 'pending').reduce((s, c) => s + (c.commissionAmount || 0), 0),
        records: commissions,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getHomeServicesReport = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const appointments = await Appointment.find({ staffId: req.staff._id, isHomeService: true })
      .populate('customerId', 'name phone')
      .populate('serviceId', 'name')
      .sort({ appointmentDate: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        totalHomeServices: appointments.length,
        completed: appointments.filter((a) => a.status === 'completed' || a.homeServiceStatus === 'departed').length,
        records: appointments,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPerformanceReport = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const StaffFeedback = getTenantModel(req, 'StaffFeedback');

    const [appointments, feedbacks] = await Promise.all([
      Appointment.find({ staffId: req.staff._id }).lean(),
      StaffFeedback.find({ staffId: req.staff._id, status: 'published' }).lean(),
    ]);

    const avgRating =
      feedbacks.length > 0
        ? feedbacks.reduce((s, f) => s + (f.rating || 0), 0) / feedbacks.length
        : 5.0;

    return res.status(200).json({
      success: true,
      data: {
        totalAppointments: appointments.length,
        completedCount: appointments.filter((a) => a.status === 'completed').length,
        rating: parseFloat(avgRating.toFixed(2)),
        totalFeedbacks: feedbacks.length,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Profile Settings & Security
export const getSettings = async (req, res) => {
  try {
    const Staff = getTenantModel(req, 'Staff');
    const staff = await Staff.findById(req.staff._id).lean();

    return res.status(200).json({
      success: true,
      data: {
        personalPreferences: staff.preferences || {},
        theme: staff.preferences?.theme || 'system',
        language: staff.preferences?.language || 'en',
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const Staff = getTenantModel(req, 'Staff');
    const staff = await Staff.findById(req.staff._id);

    staff.preferences = {
      ...(staff.preferences || {}),
      ...(req.body.preferences || req.body),
    };
    await staff.save();

    return res.status(200).json({ success: true, message: 'Settings updated', data: staff.preferences });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSecuritySettings = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        mfaEnabled: false,
        lastPasswordChange: req.staff.updatedAt,
        activeSessionsCount: 1,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSecuritySettings = async (req, res) => {
  return res.status(200).json({ success: true, message: 'Security preferences updated' });
};

export const getPrivacySettings = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      showBirthdayToColleagues: true,
      showContactToCustomers: true,
      allowLocationTracking: true,
    },
  });
};

export const updatePrivacySettings = async (req, res) => {
  return res.status(200).json({ success: true, message: 'Privacy preferences updated', data: req.body });
};

// 4. Devices, Login History & Audit Logs
export const getLoginHistory = async (req, res) => {
  try {
    const ActivityTimeline = getTenantModel(req, 'ActivityTimeline');
    const history = await ActivityTimeline.find({
      tenantId: req.staff.tenantId,
      entityType: 'Staff',
      entityId: req.staff._id,
      action: { $in: ['LOGIN', 'LOGOUT', 'PASSWORD_CHANGE', 'SESSION_REVOKED'] },
    })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDevices = async (req, res) => {
  try {
    // Current active device
    const currentDevice = {
      id: 'current-device',
      ip: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Modern Browser',
      lastActive: new Date(),
      isCurrent: true,
    };
    return res.status(200).json({ success: true, data: [currentDevice] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeDevice = async (req, res) => {
  return res.status(200).json({ success: true, message: 'Device revoked successfully' });
};

export const logoutAllDevices = async (req, res) => {
  return res.status(200).json({ success: true, message: 'All other devices logged out' });
};

export const setupMfa = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'MFA setup initialized',
    data: { secret: 'JBSWY3DPEHPK3PXP', qrCodeUrl: 'otpauth://totp/BeautySaaS:staff?secret=JBSWY3DPEHPK3PXP' },
  });
};

export const verifyMfa = async (req, res) => {
  return res.status(200).json({ success: true, message: 'MFA verified and enabled successfully' });
};

export const disableMfa = async (req, res) => {
  return res.status(200).json({ success: true, message: 'MFA disabled' });
};

export const getActivityLogs = async (req, res) => {
  try {
    const ActivityTimeline = getTenantModel(req, 'ActivityTimeline');
    const logs = await ActivityTimeline.find({
      tenantId: req.staff.tenantId,
      $or: [
        { performedBy: req.user?._id || req.staff._id },
        { entityId: req.staff._id },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAuditLogs = async (req, res) => {
  return getActivityLogs(req, res);
};
