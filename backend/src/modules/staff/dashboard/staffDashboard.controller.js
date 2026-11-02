/**
 * @file staffDashboard.controller.js
 * @description Staff Dashboard Controller delivering personalized, permission-scoped operational metrics.
 * Conforms to Phase 05 Section 3.
 * @module backend/src/modules/staff/dashboard/staffDashboard.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

export const getStaffOverview = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const AttendanceModel = getTenantModel(req, 'Attendance');
    const TaskModel = getTenantModel(req, 'Task');
    const StaffRequestModel = getTenantModel(req, 'StaffRequest');
    const BillModel = getTenantModel(req, 'Bill');

    const staffId = req.staffId;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [todayAppts, activeHomeServices, todayAttendance, pendingTasks, pendingRequests] =
      await Promise.all([
        staffId
          ? AppointmentModel.countDocuments({
              tenantId: req.tenantId,
              assignedStaff: staffId,
              date: { $gte: todayStart, $lte: todayEnd },
              status: { $ne: 'cancelled' },
            })
          : 0,
        staffId
          ? AppointmentModel.countDocuments({
              tenantId: req.tenantId,
              assignedStaff: staffId,
              serviceMode: 'HOME',
              status: { $in: ['assigned', 'accepted', 'on_the_way', 'arrived', 'working'] },
            })
          : 0,
        staffId
          ? AttendanceModel.findOne({
              tenantId: req.tenantId,
              staff: staffId,
              date: { $gte: todayStart, $lte: todayEnd },
            })
          : null,
        staffId
          ? TaskModel.countDocuments({
              tenantId: req.tenantId,
              assignedTo: staffId,
              status: { $in: ['assigned', 'accepted', 'working'] },
            })
          : 0,
        staffId
          ? StaffRequestModel.countDocuments({
              tenantId: req.tenantId,
              staffId,
              status: { $in: ['pending', 'in_review'] },
            })
          : 0,
      ]);

    const overview = {
      staff: {
        id: req.staff?._id,
        name: req.staff?.name || req.user.name,
        employeeId: req.staff?.employeeId,
        designation: req.staff?.designationId,
        department: req.staff?.departmentId,
        status: req.staff?.status || 'active',
      },
      appointments: {
        todayCount: todayAppts,
      },
      homeServices: {
        activeCount: activeHomeServices,
      },
      attendance: {
        checkedIn: !!todayAttendance?.checkIn,
        checkInTime: todayAttendance?.checkIn || null,
        checkedOut: !!todayAttendance?.checkOut,
        status: todayAttendance?.status || 'not_marked',
        lateMinutes: todayAttendance?.lateMinutes || 0,
      },
      tasks: {
        pendingCount: pendingTasks,
      },
      requests: {
        pendingCount: pendingRequests,
      },
      earnings: {
        baseSalary: req.staff?.salary || 0,
        commissionRate: req.staff?.commissionRate || 0,
      },
    };

    return sendSuccess(res, overview, 'Staff overview loaded');
  } catch (error) {
    return sendError(res, 'Failed to load staff overview', [error.message], 500);
  }
};

export const getStaffToday = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const TaskModel = getTenantModel(req, 'Task');
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [appointments, tasks] = await Promise.all([
      AppointmentModel.find({
        tenantId: req.tenantId,
        ...(req.staffId ? { assignedStaff: req.staffId } : {}),
        date: { $gte: todayStart, $lte: todayEnd },
      })
        .populate('customer', 'name phone email')
        .populate('service', 'name duration price')
        .sort({ scheduledTime: 1 }),
      TaskModel.find({
        tenantId: req.tenantId,
        ...(req.staffId ? { assignedTo: req.staffId } : {}),
        status: { $ne: 'completed' },
      }).sort({ priority: -1, dueDate: 1 }),
    ]);

    return sendSuccess(res, { appointments, tasks }, "Today's staff schedule fetched");
  } catch (error) {
    return sendError(res, "Failed to load today's schedule", [error.message], 500);
  }
};

export const getStaffDashboardAppointments = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const appts = await AppointmentModel.find({
      tenantId: req.tenantId,
      ...(req.staffId ? { assignedStaff: req.staffId } : {}),
    })
      .populate('customer', 'name phone')
      .populate('service', 'name duration price')
      .sort({ date: -1, scheduledTime: -1 })
      .limit(10);

    return sendSuccess(res, appts, 'Staff appointments fetched');
  } catch (error) {
    return sendError(res, 'Failed to load appointments', [error.message], 500);
  }
};

export const getStaffDashboardTasks = async (req, res) => {
  try {
    const TaskModel = getTenantModel(req, 'Task');
    const tasks = await TaskModel.find({
      tenantId: req.tenantId,
      ...(req.staffId ? { assignedTo: req.staffId } : {}),
    })
      .sort({ createdAt: -1 })
      .limit(10);

    return sendSuccess(res, tasks, 'Staff tasks fetched');
  } catch (error) {
    return sendError(res, 'Failed to load tasks', [error.message], 500);
  }
};

export const getStaffDashboardCustomers = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const CustomerModel = getTenantModel(req, 'Customer');

    // Find customers serviced by this staff
    const appts = await AppointmentModel.find({
      tenantId: req.tenantId,
      ...(req.staffId ? { assignedStaff: req.staffId } : {}),
    })
      .select('customer')
      .limit(50);

    const customerIds = [...new Set(appts.map((a) => a.customer).filter(Boolean))];
    const customers = await CustomerModel.find({
      _id: { $in: customerIds },
      tenantId: req.tenantId,
    }).limit(10);

    return sendSuccess(res, customers, 'Serviced customers fetched');
  } catch (error) {
    return sendError(res, 'Failed to load customers', [error.message], 500);
  }
};

export const getStaffDashboardHomeServices = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const homeAppts = await AppointmentModel.find({
      tenantId: req.tenantId,
      serviceMode: 'HOME',
      ...(req.staffId ? { assignedStaff: req.staffId } : {}),
    })
      .populate('customer', 'name phone address')
      .populate('service', 'name duration price')
      .sort({ date: -1 })
      .limit(10);

    return sendSuccess(res, homeAppts, 'Assigned home services fetched');
  } catch (error) {
    return sendError(res, 'Failed to load home services', [error.message], 500);
  }
};

export const getStaffDashboardEarnings = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const rate = req.staff?.commissionRate || 10;
    const baseSalary = req.staff?.salary || 0;

    const completedAppts = await AppointmentModel.find({
      tenantId: req.tenantId,
      ...(req.staffId ? { assignedStaff: req.staffId } : {}),
      status: 'completed',
    }).populate('service', 'price');

    const totalServiceRevenue = completedAppts.reduce((acc, a) => acc + (a.service?.price || 0), 0);
    const estimatedCommission = (totalServiceRevenue * rate) / 100;

    return sendSuccess(
      res,
      {
        baseSalary,
        commissionRate: rate,
        totalServiceRevenue,
        estimatedCommission,
        netEstimatedEarnings: baseSalary + estimatedCommission,
        completedServicesCount: completedAppts.length,
      },
      'Staff earnings summary fetched'
    );
  } catch (error) {
    return sendError(res, 'Failed to load earnings', [error.message], 500);
  }
};

export const getStaffDashboardAttendance = async (req, res) => {
  try {
    const AttendanceModel = getTenantModel(req, 'Attendance');
    const history = await AttendanceModel.find({
      tenantId: req.tenantId,
      ...(req.staffId ? { staff: req.staffId } : {}),
    })
      .sort({ date: -1 })
      .limit(7);

    return sendSuccess(res, history, 'Recent attendance fetched');
  } catch (error) {
    return sendError(res, 'Failed to load attendance', [error.message], 500);
  }
};

export const getStaffDashboardNotifications = async (req, res) => {
  try {
    return sendSuccess(
      res,
      [
        { id: '1', title: 'Welcome to Staff Workspace', message: 'You are on active salon duty.', timestamp: new Date() },
      ],
      'Notifications fetched'
    );
  } catch (error) {
    return sendError(res, 'Failed to load notifications', [error.message], 500);
  }
};

export const getStaffDashboardUpcoming = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const now = new Date();
    const upcoming = await AppointmentModel.find({
      tenantId: req.tenantId,
      ...(req.staffId ? { assignedStaff: req.staffId } : {}),
      date: { $gte: now },
      status: { $in: ['confirmed', 'pending', 'assigned'] },
    })
      .populate('customer', 'name phone')
      .populate('service', 'name duration')
      .sort({ date: 1, scheduledTime: 1 })
      .limit(5);

    return sendSuccess(res, upcoming, 'Upcoming appointments fetched');
  } catch (error) {
    return sendError(res, 'Failed to load upcoming bookings', [error.message], 500);
  }
};

export const getStaffDashboardBirthdays = async (req, res) => {
  try {
    const StaffModel = getTenantModel(req, 'Staff');
    const CustomerModel = getTenantModel(req, 'Customer');

    const [staffList, customerList] = await Promise.all([
      StaffModel.find({ tenantId: req.tenantId, dateOfBirth: { $ne: null } })
        .select('name dateOfBirth photo')
        .limit(10),
      CustomerModel.find({ tenantId: req.tenantId, dob: { $ne: null } })
        .select('name dob phone')
        .limit(10),
    ]);

    return sendSuccess(res, { staffBirthdays: staffList, customerBirthdays: customerList }, 'Birthdays fetched');
  } catch (error) {
    return sendError(res, 'Failed to load birthdays', [error.message], 500);
  }
};

export const getStaffDashboardLeaves = async (req, res) => {
  try {
    const LeaveModel = getTenantModel(req, 'Leave');
    const leaves = await LeaveModel.find({
      tenantId: req.tenantId,
      ...(req.staffId ? { staff: req.staffId } : {}),
    })
      .sort({ createdAt: -1 })
      .limit(5);

    return sendSuccess(res, leaves, 'Staff leaves summary fetched');
  } catch (error) {
    return sendError(res, 'Failed to load leaves', [error.message], 500);
  }
};

export const getStaffDashboardPendingRequests = async (req, res) => {
  try {
    const StaffRequestModel = getTenantModel(req, 'StaffRequest');
    const requests = await StaffRequestModel.find({
      tenantId: req.tenantId,
      ...(req.staffId ? { staffId: req.staffId } : {}),
      status: { $in: ['pending', 'in_review'] },
    })
      .sort({ createdAt: -1 })
      .limit(5);

    return sendSuccess(res, requests, 'Pending staff requests fetched');
  } catch (error) {
    return sendError(res, 'Failed to load pending requests', [error.message], 500);
  }
};

export const getDashboardOverview = getStaffOverview;
export const getDashboardToday = getStaffToday;
export const getDashboardAppointments = getStaffDashboardAppointments;
export const getDashboardTasks = getStaffDashboardTasks;
export const getDashboardCustomers = getStaffDashboardCustomers;
export const getDashboardHomeServices = getStaffDashboardHomeServices;
export const getDashboardEarnings = getStaffDashboardEarnings;
export const getDashboardAttendance = getStaffDashboardAttendance;
export const getDashboardNotifications = getStaffDashboardNotifications;
export const getDashboardUpcoming = getStaffDashboardUpcoming;
export const getDashboardBirthdays = getStaffDashboardBirthdays;
export const getDashboardLeaves = getStaffDashboardLeaves;
export const getDashboardPendingRequests = getStaffDashboardPendingRequests;

export default {
  getStaffOverview,
  getDashboardOverview,
  getStaffToday,
  getDashboardToday,
  getStaffDashboardAppointments,
  getDashboardAppointments,
  getStaffDashboardTasks,
  getDashboardTasks,
  getStaffDashboardCustomers,
  getDashboardCustomers,
  getStaffDashboardHomeServices,
  getDashboardHomeServices,
  getStaffDashboardEarnings,
  getDashboardEarnings,
  getStaffDashboardAttendance,
  getDashboardAttendance,
  getStaffDashboardNotifications,
  getDashboardNotifications,
  getStaffDashboardUpcoming,
  getDashboardUpcoming,
  getStaffDashboardBirthdays,
  getDashboardBirthdays,
  getStaffDashboardLeaves,
  getDashboardLeaves,
  getStaffDashboardPendingRequests,
  getDashboardPendingRequests,
};

