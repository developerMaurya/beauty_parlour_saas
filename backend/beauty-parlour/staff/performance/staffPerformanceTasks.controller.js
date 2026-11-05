import { getTenantModel } from '../../../database/tenant/tenantModels.js';

/**
 * Staff Performance, Feedback, Reviews & Tasks Controller
 */

// 1. Performance Metrics
export const getPerformance = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const StaffFeedback = getTenantModel(req, 'StaffFeedback');
    const Attendance = getTenantModel(req, 'Attendance');
    const Commission = getTenantModel(req, 'Commission');

    const staffId = req.staff._id;

    const [appointments, feedbacks, attendances, commissions] = await Promise.all([
      Appointment.find({ staffId }).lean(),
      StaffFeedback.find({ staffId, status: 'published' }).lean(),
      Attendance.find({ staffId }).lean(),
      Commission.find({ staffId }).lean(),
    ]);

    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter((a) => a.status === 'completed').length;
    const cancelledAppointments = appointments.filter((a) => a.status === 'cancelled').length;

    const avgRating =
      feedbacks.length > 0
        ? feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length
        : 5.0;

    const totalDaysPresent = attendances.filter((att) => att.status === 'present').length;
    const totalLateDays = attendances.filter((att) => att.isLate || att.status === 'late').length;

    const totalCommission = commissions.reduce((sum, c) => sum + (c.commissionAmount || 0), 0);
    const revenueContribution = appointments
      .filter((a) => a.status === 'completed')
      .reduce((sum, a) => sum + (a.totalAmount || 0), 0);

    return res.status(200).json({
      success: true,
      data: {
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        completionRate: totalAppointments > 0 ? ((completedAppointments / totalAppointments) * 100).toFixed(1) : '100.0',
        customerSatisfaction: parseFloat(avgRating.toFixed(2)),
        totalFeedbacks: feedbacks.length,
        totalDaysPresent,
        totalLateDays,
        totalCommission,
        revenueContribution,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMonthlyPerformance = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const staffId = req.staff._id;

    const appointments = await Appointment.find({ staffId, status: 'completed' }).lean();

    const monthlyMap = {};
    for (const app of appointments) {
      const d = new Date(app.appointmentDate || app.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap[key]) {
        monthlyMap[key] = { month: key, completed: 0, revenue: 0 };
      }
      monthlyMap[key].completed += 1;
      monthlyMap[key].revenue += app.totalAmount || 0;
    }

    const monthlyList = Object.values(monthlyMap).sort((a, b) => b.month.localeCompare(a.month));
    return res.status(200).json({ success: true, data: monthlyList });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getServicesPerformance = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const appointments = await Appointment.find({ staffId: req.staff._id, status: 'completed' })
      .populate('serviceId', 'name price')
      .lean();

    const serviceMap = {};
    for (const app of appointments) {
      const sName = app.serviceId?.name || 'Standard Service';
      if (!serviceMap[sName]) {
        serviceMap[sName] = { name: sName, count: 0, totalAmount: 0 };
      }
      serviceMap[sName].count += 1;
      serviceMap[sName].totalAmount += app.totalAmount || 0;
    }

    return res.status(200).json({ success: true, data: Object.values(serviceMap) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomersPerformance = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const appointments = await Appointment.find({ staffId: req.staff._id, status: 'completed' })
      .populate('customerId', 'name phone')
      .lean();

    const customerMap = {};
    for (const app of appointments) {
      if (!app.customerId) continue;
      const cId = String(app.customerId._id);
      if (!customerMap[cId]) {
        customerMap[cId] = {
          customerId: cId,
          name: app.customerId.name,
          phone: app.customerId.phone,
          visitCount: 0,
          totalSpent: 0,
        };
      }
      customerMap[cId].visitCount += 1;
      customerMap[cId].totalSpent += app.totalAmount || 0;
    }

    return res.status(200).json({ success: true, data: Object.values(customerMap) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAttendancePerformance = async (req, res) => {
  try {
    const Attendance = getTenantModel(req, 'Attendance');
    const records = await Attendance.find({ staffId: req.staff._id }).lean();

    const summary = {
      present: records.filter((r) => r.status === 'present').length,
      late: records.filter((r) => r.status === 'late' || r.isLate).length,
      halfDay: records.filter((r) => r.status === 'half_day').length,
      absent: records.filter((r) => r.status === 'absent').length,
      leave: records.filter((r) => r.status === 'leave').length,
      totalWorkingHours: records.reduce((sum, r) => sum + (r.workingHours || 0), 0),
    };

    return res.status(200).json({ success: true, data: summary });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Feedback & Reviews
export const getFeedback = async (req, res) => {
  try {
    const StaffFeedback = getTenantModel(req, 'StaffFeedback');
    const feedbacks = await StaffFeedback.find({ staffId: req.staff._id, status: 'published' })
      .populate('customerId', 'name photo')
      .populate('serviceId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeedbackById = async (req, res) => {
  try {
    const StaffFeedback = getTenantModel(req, 'StaffFeedback');
    const feedback = await StaffFeedback.findOne({
      _id: req.params.feedbackId,
      staffId: req.staff._id,
      status: 'published',
    })
      .populate('customerId', 'name photo')
      .populate('serviceId', 'name')
      .lean();

    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    return res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviews = async (req, res) => {
  return getFeedback(req, res);
};

export const getReviewById = async (req, res) => {
  return getFeedbackById(req, res);
};

// 3. Task Management
export const getTasks = async (req, res) => {
  try {
    const Task = getTenantModel(req, 'Task');
    const { status, priority } = req.query;

    const filter = { assignedTo: req.staff._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter).sort({ dueDate: 1, createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const Task = getTenantModel(req, 'Task');
    const task = await Task.findOne({ _id: req.params.taskId, assignedTo: req.staff._id }).lean();
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    return res.status(200).json({ success: true, data: task });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const handleTaskTransition = async (req, res, targetStatus) => {
  try {
    const Task = getTenantModel(req, 'Task');
    const task = await Task.findOne({ _id: req.params.taskId, assignedTo: req.staff._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.status = targetStatus;
    if (targetStatus === 'completed') {
      task.completedAt = new Date();
    }
    await task.save();

    return res.status(200).json({
      success: true,
      message: `Task marked as ${targetStatus}`,
      data: task,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const acceptTask = (req, res) => handleTaskTransition(req, res, 'accepted');
export const startTask = (req, res) => handleTaskTransition(req, res, 'working');
export const pauseTask = (req, res) => handleTaskTransition(req, res, 'paused');
export const completeTask = (req, res) => handleTaskTransition(req, res, 'completed');
export const rejectTask = (req, res) => handleTaskTransition(req, res, 'rejected');

// 4. Task Comments
export const getTaskComments = async (req, res) => {
  try {
    const Task = getTenantModel(req, 'Task');
    const TaskComment = getTenantModel(req, 'TaskComment');

    const task = await Task.findOne({ _id: req.params.taskId, assignedTo: req.staff._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const comments = await TaskComment.find({ taskId: task._id }).sort({ createdAt: 1 }).lean();
    return res.status(200).json({ success: true, data: comments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addTaskComment = async (req, res) => {
  try {
    const Task = getTenantModel(req, 'Task');
    const TaskComment = getTenantModel(req, 'TaskComment');

    const task = await Task.findOne({ _id: req.params.taskId, assignedTo: req.staff._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const text = req.body.text || req.body.comment || '';
    if (!text) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const comment = await TaskComment.create({
      tenantId: req.tenantId || req.staff?.tenantId,
      taskId: task._id,
      authorId: req.user?._id || req.staff._id,
      authorName: req.staff.name || 'Staff Member',
      authorType: 'STAFF',
      text,
    });

    const responseData = {
      ...comment.toObject(),
      comment: text,
    };

    return res.status(201).json({ success: true, message: 'Comment posted', data: responseData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTaskComment = async (req, res) => {
  try {
    const TaskComment = getTenantModel(req, 'TaskComment');
    const authorId = req.user?._id || req.staff._id;

    const comment = await TaskComment.findOne({
      _id: req.params.commentId,
      taskId: req.params.taskId,
      authorId,
    });

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found or unauthorized' });
    }

    if (req.body.text) comment.text = req.body.text;
    await comment.save();

    return res.status(200).json({ success: true, message: 'Comment updated', data: comment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTaskComment = async (req, res) => {
  try {
    const TaskComment = getTenantModel(req, 'TaskComment');
    const authorId = req.user?._id || req.staff._id;

    const comment = await TaskComment.findOneAndDelete({
      _id: req.params.commentId,
      taskId: req.params.taskId,
      authorId,
    });

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found or unauthorized' });
    }

    return res.status(200).json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
