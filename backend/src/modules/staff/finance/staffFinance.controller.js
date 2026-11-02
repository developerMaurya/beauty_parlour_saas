import { getTenantModel } from '../../../database/tenant/tenantModels.js';

/**
 * Staff Finance & Earnings Controller
 * Enforces staff ownership isolation: Staff can only query their own earnings, commission, salary, payslips.
 * Staff cannot modify financial/payroll records.
 */

// 1. Overall Earnings
export const getEarningsOverview = async (req, res) => {
  try {
    const Staff = getTenantModel(req, 'Staff');
    const Payslip = getTenantModel(req, 'Payslip');
    const Commission = getTenantModel(req, 'Commission');
    const StaffEarning = getTenantModel(req, 'StaffEarning');

    const staffId = req.staff._id;

    // Aggregate payslips net paid
    const payslips = await Payslip.find({ staffId, paymentStatus: 'paid' }).lean();
    const totalSalaryPaid = payslips.reduce((acc, p) => acc + (p.netAmount || 0), 0);

    // Aggregate commissions
    const commissions = await Commission.find({ staffId }).lean();
    const totalCommissionEarned = commissions.reduce((acc, c) => acc + (c.commissionAmount || 0), 0);
    const pendingCommission = commissions.filter((c) => c.status === 'pending').reduce((acc, c) => acc + (c.commissionAmount || 0), 0);
    const paidCommission = commissions.filter((c) => c.status === 'paid').reduce((acc, c) => acc + (c.commissionAmount || 0), 0);

    // Latest earnings records
    const recentEarnings = await StaffEarning.find({ staffId }).sort({ date: -1 }).limit(10).lean();

    return res.status(200).json({
      success: true,
      data: {
        totalSalaryPaid,
        totalCommissionEarned,
        pendingCommission,
        paidCommission,
        netTotal: totalSalaryPaid + paidCommission,
        commissionRate: req.staff.commissionRate || 0,
        salaryAllowed: true,
        recentEarnings,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEarningsSummary = async (req, res) => {
  try {
    const Payslip = getTenantModel(req, 'Payslip');
    const Commission = getTenantModel(req, 'Commission');
    const staffId = req.staff._id;

    const payslips = await Payslip.find({ staffId }).sort({ createdAt: -1 }).limit(12).lean();
    const commissions = await Commission.find({ staffId }).lean();

    return res.status(200).json({
      success: true,
      data: {
        payslipsCount: payslips.length,
        totalCommissions: commissions.length,
        approvedCommissions: commissions.filter((c) => c.status === 'approved' || c.status === 'paid').length,
        pendingCommissions: commissions.filter((c) => c.status === 'pending').length,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMonthlyEarnings = async (req, res) => {
  try {
    const Payslip = getTenantModel(req, 'Payslip');
    const staffId = req.staff._id;

    const payslips = await Payslip.find({ staffId }).sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      data: payslips.map((p) => ({
        id: p._id,
        month: p.month,
        year: p.year,
        baseSalary: p.baseSalary,
        commissionAmount: p.commissionAmount,
        serviceEarnings: p.serviceEarnings,
        bonus: p.bonus,
        overtime: p.overtime,
        deductions: p.deductions,
        netAmount: p.netAmount,
        status: p.paymentStatus,
        paidDate: p.paidDate,
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEarningsHistory = async (req, res) => {
  try {
    const StaffEarning = getTenantModel(req, 'StaffEarning');
    const staffId = req.staff._id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [earnings, total] = await Promise.all([
      StaffEarning.find({ staffId }).sort({ date: -1 }).skip(skip).limit(parseInt(limit, 10)).lean(),
      StaffEarning.countDocuments({ staffId }),
    ]);

    return res.status(200).json({
      success: true,
      data: earnings,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Payments & Salary Records
export const getPayments = async (req, res) => {
  try {
    const Payslip = getTenantModel(req, 'Payslip');
    const staffId = req.staff._id;
    const { status, page = 1, limit = 20 } = req.query;

    const query = { staffId };
    if (status) query.paymentStatus = status;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [payments, total] = await Promise.all([
      Payslip.find(query).sort({ paidDate: -1, createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)).lean(),
      Payslip.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: payments,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const Payslip = getTenantModel(req, 'Payslip');
    const payment = await Payslip.findOne({ _id: req.params.paymentId, staffId: req.staff._id }).lean();
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }
    return res.status(200).json({ success: true, data: payment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSalaryDetails = async (req, res) => {
  try {
    const Salary = getTenantModel(req, 'Salary');
    const staffId = req.staff._id;

    let salary = await Salary.findOne({ staffId, status: 'active' }).lean();
    if (!salary) {
      salary = {
        baseSalary: req.staff.salary || 0,
        commissionRate: req.staff.commissionRate || 0,
        paymentFrequency: 'monthly',
        bankDetails: req.staff.bankDetails || {},
        effectiveFrom: req.staff.joiningDate || new Date(),
      };
    }

    return res.status(200).json({
      success: true,
      data: salary,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSalaryHistory = async (req, res) => {
  try {
    const Payslip = getTenantModel(req, 'Payslip');
    const history = await Payslip.find({ staffId: req.staff._id }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPayslips = async (req, res) => {
  try {
    const Payslip = getTenantModel(req, 'Payslip');
    const { year, page = 1, limit = 20 } = req.query;

    const query = { staffId: req.staff._id };
    if (year) query.year = parseInt(year, 10);

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [payslips, total] = await Promise.all([
      Payslip.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)).lean(),
      Payslip.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: payslips,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPayslipById = async (req, res) => {
  try {
    const Payslip = getTenantModel(req, 'Payslip');
    const payslip = await Payslip.findOne({ _id: req.params.payslipId, staffId: req.staff._id }).lean();
    if (!payslip) {
      return res.status(404).json({ success: false, message: 'Payslip not found' });
    }
    return res.status(200).json({ success: true, data: payslip });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadPayslip = async (req, res) => {
  try {
    const Payslip = getTenantModel(req, 'Payslip');
    const payslip = await Payslip.findOne({ _id: req.params.payslipId, staffId: req.staff._id }).lean();
    if (!payslip) {
      return res.status(404).json({ success: false, message: 'Payslip not found' });
    }

    // In a real setup, generate PDF or return downloadable document payload
    return res.status(200).json({
      success: true,
      data: {
        payslipId: payslip._id,
        downloadUrl: `/api/v1/staff/payslips/${payslip._id}/download`,
        document: {
          staffName: req.staff.name,
          employeeId: req.staff.employeeId,
          month: payslip.month,
          year: payslip.year,
          netAmount: payslip.netAmount,
          breakdown: {
            baseSalary: payslip.baseSalary,
            commissionAmount: payslip.commissionAmount,
            serviceEarnings: payslip.serviceEarnings,
            bonus: payslip.bonus,
            overtime: payslip.overtime,
            deductions: payslip.deductions,
          },
          generatedAt: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Commission Records
export const getCommission = async (req, res) => {
  try {
    const Commission = getTenantModel(req, 'Commission');
    const { status, page = 1, limit = 20 } = req.query;

    const query = { staffId: req.staff._id };
    if (status) query.status = status;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [commissions, total] = await Promise.all([
      Commission.find(query)
        .populate('serviceId', 'name price')
        .populate('customerId', 'name phone')
        .populate('appointmentId', 'appointmentNumber appointmentDate')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .lean(),
      Commission.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: commissions,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCommissionSummary = async (req, res) => {
  try {
    const Commission = getTenantModel(req, 'Commission');
    const staffId = req.staff._id;

    const all = await Commission.find({ staffId }).lean();
    const totalEarned = all.reduce((sum, c) => sum + (c.commissionAmount || 0), 0);
    const paid = all.filter((c) => c.status === 'paid').reduce((sum, c) => sum + (c.commissionAmount || 0), 0);
    const pending = all.filter((c) => c.status === 'pending').reduce((sum, c) => sum + (c.commissionAmount || 0), 0);

    return res.status(200).json({
      success: true,
      data: {
        totalEarned,
        paid,
        pending,
        commissionRate: req.staff.commissionRate || 0,
        totalRecords: all.length,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCommissionHistory = async (req, res) => {
  return getCommission(req, res);
};
