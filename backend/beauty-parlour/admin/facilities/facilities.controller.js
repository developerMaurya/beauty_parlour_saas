/**
 * @file facilities.controller.js
 * @description Facilities, Utilities, Electricity Meter Comparisons, Rent, Maintenance, Scrap, Assets, and Additional Event Work.
 * @module backend/src/modules/admin/facilities/facilities.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';
import { getPagination, getSort, buildTenantFilter } from '../../../utils/query.utils.js';

// ==========================================
// 1. SCRAP & WASTE MANAGEMENT
// ==========================================

export const createScrapItem = async (req, res) => {
  try {
    const { branchId, item, category, quantity, reason, estimatedValue, disposalMethod, date, photoUrl, notes } = req.body;
    if (!item || !reason) return sendError(res, 'Item name and reason are required', [], 400);

    const ScrapItem = getTenantModel(req, 'ScrapItem');
    const doc = await ScrapItem.create({
      tenantId: req.tenantId,
      branchId: branchId || null,
      item: item.trim(),
      category: category || 'Broken Item',
      quantity: Number(quantity) || 1,
      reason,
      estimatedValue: Number(estimatedValue) || 0,
      disposalMethod: disposalMethod || 'Recycle',
      date: date ? new Date(date) : new Date(),
      photoUrl: photoUrl || '',
      notes: notes || '',
    });

    return sendSuccess(res, 'Scrap record created successfully', doc, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getScrapItems = async (req, res) => {
  try {
    const ScrapItem = getTenantModel(req, 'ScrapItem');
    const { page, limit, skip } = getPagination(req.query);
    const filter = buildTenantFilter(req);

    const [items, total] = await Promise.all([
      ScrapItem.find(filter).populate('branchId', 'name').sort({ date: -1 }).skip(skip).limit(limit),
      ScrapItem.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getScrapItemById = async (req, res) => {
  try {
    const ScrapItem = getTenantModel(req, 'ScrapItem');
    const doc = await ScrapItem.findOne({ _id: req.params.scrapId, tenantId: req.tenantId }).populate('branchId');
    if (!doc) return sendError(res, 'Scrap item not found', [], 404);
    return sendSuccess(res, 'Scrap item retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateScrapItem = async (req, res) => {
  try {
    const ScrapItem = getTenantModel(req, 'ScrapItem');
    const doc = await ScrapItem.findOneAndUpdate(
      { _id: req.params.scrapId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Scrap item not found', [], 404);
    return sendSuccess(res, 'Scrap item updated', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteScrapItem = async (req, res) => {
  try {
    const ScrapItem = getTenantModel(req, 'ScrapItem');
    const doc = await ScrapItem.findOneAndDelete({ _id: req.params.scrapId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Scrap item not found', [], 404);
    return sendSuccess(res, 'Scrap item deleted');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 2. ASSET MANAGEMENT
// ==========================================

export const createAsset = async (req, res) => {
  try {
    const { branchId, name, assetTag, category, modelNumber, serialNumber, purchaseDate, cost, assignedStaffId, warrantyExpiry } = req.body;
    if (!branchId || !name) return sendError(res, 'Branch and asset name are required', [], 400);

    const Asset = getTenantModel(req, 'Asset');
    const doc = await Asset.create({
      tenantId: req.tenantId,
      branchId,
      name: name.trim(),
      assetTag: assetTag || `AST-${Date.now().toString().slice(-6)}`,
      category: category || 'Equipment',
      modelNumber: modelNumber || '',
      serialNumber: serialNumber || '',
      purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
      cost: Number(cost) || 0,
      assignedStaffId: assignedStaffId || null,
      status: 'active',
      warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : null,
    });

    return sendSuccess(res, 'Asset created successfully', doc, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getAssets = async (req, res) => {
  try {
    const Asset = getTenantModel(req, 'Asset');
    const { page, limit, skip } = getPagination(req.query);
    const filter = buildTenantFilter(req);

    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { assetTag: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Asset.find(filter).populate('branchId', 'name code').populate('assignedStaffId', 'name phone').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Asset.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getAssetById = async (req, res) => {
  try {
    const Asset = getTenantModel(req, 'Asset');
    const doc = await Asset.findOne({ _id: req.params.assetId, tenantId: req.tenantId })
      .populate('branchId')
      .populate('assignedStaffId');
    if (!doc) return sendError(res, 'Asset not found', [], 404);
    return sendSuccess(res, 'Asset retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateAsset = async (req, res) => {
  try {
    const Asset = getTenantModel(req, 'Asset');
    const doc = await Asset.findOneAndUpdate(
      { _id: req.params.assetId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Asset not found', [], 404);
    return sendSuccess(res, 'Asset updated successfully', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteAsset = async (req, res) => {
  try {
    const Asset = getTenantModel(req, 'Asset');
    const doc = await Asset.findOneAndDelete({ _id: req.params.assetId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Asset not found', [], 404);
    return sendSuccess(res, 'Asset deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const assignAsset = async (req, res) => {
  try {
    const { assignedStaffId } = req.body;
    const Asset = getTenantModel(req, 'Asset');
    const doc = await Asset.findOneAndUpdate(
      { _id: req.params.assetId, tenantId: req.tenantId },
      { assignedStaffId: assignedStaffId || null },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Asset not found', [], 404);
    return sendSuccess(res, 'Asset assigned successfully', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const repairAsset = async (req, res) => {
  try {
    const Asset = getTenantModel(req, 'Asset');
    const doc = await Asset.findOneAndUpdate(
      { _id: req.params.assetId, tenantId: req.tenantId },
      { status: 'in_repair' },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Asset not found', [], 404);
    return sendSuccess(res, 'Asset marked for repair', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const maintainAsset = async (req, res) => {
  try {
    const Asset = getTenantModel(req, 'Asset');
    const doc = await Asset.findOneAndUpdate(
      { _id: req.params.assetId, tenantId: req.tenantId },
      { status: 'maintenance' },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Asset not found', [], 404);
    return sendSuccess(res, 'Asset marked for maintenance', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 3. REPAIR & MAINTENANCE RECORDS
// ==========================================

export const createMaintenance = async (req, res) => {
  try {
    const { assetId, branchId, item, problem, vendor, cost, date, warranty, nextMaintenanceDate, notes } = req.body;
    if (!item || !problem) return sendError(res, 'Item name and problem description are required', [], 400);

    const Maintenance = getTenantModel(req, 'Maintenance');
    const doc = await Maintenance.create({
      tenantId: req.tenantId,
      assetId: assetId || null,
      branchId: branchId || null,
      item: item.trim(),
      problem: problem.trim(),
      vendor: vendor || '',
      cost: Number(cost) || 0,
      date: date ? new Date(date) : new Date(),
      status: 'scheduled',
      warranty: warranty || '',
      nextMaintenanceDate: nextMaintenanceDate ? new Date(nextMaintenanceDate) : null,
      notes: notes || '',
    });

    return sendSuccess(res, 'Maintenance record created', doc, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getMaintenanceList = async (req, res) => {
  try {
    const Maintenance = getTenantModel(req, 'Maintenance');
    const { page, limit, skip } = getPagination(req.query);
    const filter = buildTenantFilter(req);

    const [items, total] = await Promise.all([
      Maintenance.find(filter).populate('assetId').populate('branchId', 'name').sort({ date: -1 }).skip(skip).limit(limit),
      Maintenance.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getMaintenanceById = async (req, res) => {
  try {
    const Maintenance = getTenantModel(req, 'Maintenance');
    const doc = await Maintenance.findOne({ _id: req.params.maintenanceId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Record not found', [], 404);
    return sendSuccess(res, 'Maintenance record retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateMaintenance = async (req, res) => {
  try {
    const Maintenance = getTenantModel(req, 'Maintenance');
    const doc = await Maintenance.findOneAndUpdate(
      { _id: req.params.maintenanceId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Record not found', [], 404);
    return sendSuccess(res, 'Maintenance record updated', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteMaintenance = async (req, res) => {
  try {
    const Maintenance = getTenantModel(req, 'Maintenance');
    const doc = await Maintenance.findOneAndDelete({ _id: req.params.maintenanceId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Record not found', [], 404);
    return sendSuccess(res, 'Maintenance record deleted');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const startMaintenance = async (req, res) => {
  try {
    const Maintenance = getTenantModel(req, 'Maintenance');
    const doc = await Maintenance.findOneAndUpdate(
      { _id: req.params.maintenanceId, tenantId: req.tenantId },
      { status: 'in_progress' },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Record not found', [], 404);
    return sendSuccess(res, 'Maintenance marked as in progress', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const completeMaintenance = async (req, res) => {
  try {
    const Maintenance = getTenantModel(req, 'Maintenance');
    const doc = await Maintenance.findOneAndUpdate(
      { _id: req.params.maintenanceId, tenantId: req.tenantId },
      { status: 'completed' },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Record not found', [], 404);
    return sendSuccess(res, 'Maintenance marked as completed', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 4. ELECTRICITY BILLS WITH METER READING COMPARISONS
// ==========================================

export const createElectricityBill = async (req, res) => {
  try {
    const { branchId, month, previousMeterReading, currentMeterReading, ratePerUnit, fixedCharge, taxAmount, dueDate, paidDate, paymentStatus, billFileUrl } = req.body;

    if (!branchId || !month || previousMeterReading === undefined || currentMeterReading === undefined || ratePerUnit === undefined) {
      return sendError(res, 'Branch, month, meter readings, and rate are required', [], 400);
    }

    const prev = Number(previousMeterReading);
    const curr = Number(currentMeterReading);
    const units = Math.max(0, curr - prev);
    const rate = Number(ratePerUnit);
    const fixed = Number(fixedCharge) || 0;
    const tax = Number(taxAmount) || 0;
    const total = units * rate + fixed + tax;

    const ElectricityBill = getTenantModel(req, 'ElectricityBill');
    const doc = await ElectricityBill.create({
      tenantId: req.tenantId,
      branchId,
      month,
      previousMeterReading: prev,
      currentMeterReading: curr,
      unitsConsumed: units,
      ratePerUnit: rate,
      fixedCharge: fixed,
      taxAmount: tax,
      totalAmount: total,
      dueDate: dueDate ? new Date(dueDate) : null,
      paidDate: paidDate ? new Date(paidDate) : null,
      paymentStatus: paymentStatus || 'unpaid',
      billFileUrl: billFileUrl || '',
    });

    return sendSuccess(res, 'Electricity bill recorded successfully', doc, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getElectricityBills = async (req, res) => {
  try {
    const ElectricityBill = getTenantModel(req, 'ElectricityBill');
    const filter = buildTenantFilter(req);

    const items = await ElectricityBill.find(filter).populate('branchId', 'name code').sort({ month: -1 });

    // Build month-to-month comparison analytics
    const comparisons = items.map((bill, index) => {
      const prevBill = items[index + 1];
      let unitDifference = 0;
      let costDifference = 0;
      if (prevBill) {
        unitDifference = bill.unitsConsumed - prevBill.unitsConsumed;
        costDifference = bill.totalAmount - prevBill.totalAmount;
      }
      return {
        ...bill.toObject(),
        comparison: {
          previousMonthUnits: prevBill ? prevBill.unitsConsumed : null,
          unitDifference,
          costDifference,
          percentageChange: prevBill && prevBill.unitsConsumed > 0 ? Math.round((unitDifference / prevBill.unitsConsumed) * 100) : 0,
        },
      };
    });

    return sendSuccess(res, 'Electricity bills with month-to-month comparisons retrieved', comparisons);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getElectricityBillById = async (req, res) => {
  try {
    const ElectricityBill = getTenantModel(req, 'ElectricityBill');
    const doc = await ElectricityBill.findOne({ _id: req.params.recordId, tenantId: req.tenantId }).populate('branchId');
    if (!doc) return sendError(res, 'Electricity bill not found', [], 404);
    return sendSuccess(res, 'Electricity bill retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateElectricityBill = async (req, res) => {
  try {
    const ElectricityBill = getTenantModel(req, 'ElectricityBill');
    const doc = await ElectricityBill.findOneAndUpdate(
      { _id: req.params.recordId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Electricity bill not found', [], 404);
    return sendSuccess(res, 'Electricity bill updated', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteElectricityBill = async (req, res) => {
  try {
    const ElectricityBill = getTenantModel(req, 'ElectricityBill');
    const doc = await ElectricityBill.findOneAndDelete({ _id: req.params.recordId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Electricity bill not found', [], 404);
    return sendSuccess(res, 'Electricity bill deleted');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 5. OTHER UTILITY BILLS
// ==========================================

export const createUtility = async (req, res) => {
  try {
    const { branchId, utilityType, name, month, amount, dueDate, paidDate, paymentStatus, billFileUrl } = req.body;
    if (!branchId || !utilityType || !name || amount === undefined) {
      return sendError(res, 'Branch, utility type, name, and amount are required', [], 400);
    }

    const UtilityBill = getTenantModel(req, 'UtilityBill');
    const doc = await UtilityBill.create({
      tenantId: req.tenantId,
      branchId,
      utilityType,
      name: name.trim(),
      month: month || new Date().toISOString().slice(0, 7),
      amount: Number(amount),
      dueDate: dueDate ? new Date(dueDate) : null,
      paidDate: paidDate ? new Date(paidDate) : null,
      paymentStatus: paymentStatus || 'unpaid',
      billFileUrl: billFileUrl || '',
    });

    return sendSuccess(res, 'Utility bill recorded', doc, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getUtilities = async (req, res) => {
  try {
    const UtilityBill = getTenantModel(req, 'UtilityBill');
    const filter = buildTenantFilter(req);
    if (req.query.utilityType) filter.utilityType = req.query.utilityType;

    const items = await UtilityBill.find(filter).populate('branchId', 'name code').sort({ month: -1 });
    return sendSuccess(res, 'Utility bills retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getUtilityById = async (req, res) => {
  try {
    const UtilityBill = getTenantModel(req, 'UtilityBill');
    const doc = await UtilityBill.findOne({ _id: req.params.utilityId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Utility not found', [], 404);
    return sendSuccess(res, 'Utility retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateUtility = async (req, res) => {
  try {
    const UtilityBill = getTenantModel(req, 'UtilityBill');
    const doc = await UtilityBill.findOneAndUpdate(
      { _id: req.params.utilityId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Utility not found', [], 404);
    return sendSuccess(res, 'Utility updated', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteUtility = async (req, res) => {
  try {
    const UtilityBill = getTenantModel(req, 'UtilityBill');
    const doc = await UtilityBill.findOneAndDelete({ _id: req.params.utilityId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Utility not found', [], 404);
    return sendSuccess(res, 'Utility deleted');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 6. RENT MANAGEMENT
// ==========================================

export const createRent = async (req, res) => {
  try {
    const { branchId, month, rentAmount, dueDate, paidDate, lateFee, paymentMethod, status } = req.body;
    if (!branchId || !month || rentAmount === undefined) {
      return sendError(res, 'Branch, month, and rent amount are required', [], 400);
    }

    const Rent = getTenantModel(req, 'Rent');
    const doc = await Rent.create({
      tenantId: req.tenantId,
      branchId,
      month,
      rentAmount: Number(rentAmount),
      dueDate: dueDate ? new Date(dueDate) : new Date(),
      paidDate: paidDate ? new Date(paidDate) : null,
      lateFee: Number(lateFee) || 0,
      status: status || 'pending',
      paymentMethod: paymentMethod || 'Bank Transfer',
    });

    return sendSuccess(res, 'Rent record created', doc, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getRentList = async (req, res) => {
  try {
    const Rent = getTenantModel(req, 'Rent');
    const filter = buildTenantFilter(req);
    const items = await Rent.find(filter).populate('branchId', 'name code').sort({ month: -1 });
    return sendSuccess(res, 'Rent records retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getRentById = async (req, res) => {
  try {
    const Rent = getTenantModel(req, 'Rent');
    const doc = await Rent.findOne({ _id: req.params.rentId, tenantId: req.tenantId }).populate('branchId');
    if (!doc) return sendError(res, 'Rent record not found', [], 404);
    return sendSuccess(res, 'Rent record retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateRent = async (req, res) => {
  try {
    const Rent = getTenantModel(req, 'Rent');
    const doc = await Rent.findOneAndUpdate(
      { _id: req.params.rentId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Rent record not found', [], 404);
    return sendSuccess(res, 'Rent record updated', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteRent = async (req, res) => {
  try {
    const Rent = getTenantModel(req, 'Rent');
    const doc = await Rent.findOneAndDelete({ _id: req.params.rentId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Rent record not found', [], 404);
    return sendSuccess(res, 'Rent record deleted');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const payRent = async (req, res) => {
  try {
    const { paymentMethod, lateFee } = req.body;
    const Rent = getTenantModel(req, 'Rent');
    const doc = await Rent.findOneAndUpdate(
      { _id: req.params.rentId, tenantId: req.tenantId },
      {
        status: 'paid',
        paidDate: new Date(),
        paymentMethod: paymentMethod || 'Bank Transfer',
        lateFee: lateFee !== undefined ? Number(lateFee) : 0,
      },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Rent record not found', [], 404);
    return sendSuccess(res, 'Rent marked as paid successfully', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 7. BUSINESS EXPENSES
// ==========================================

export const createExpense = async (req, res) => {
  try {
    const { branchId, title, category, amount, date, paidTo, paymentMethod, receiptUrl, notes } = req.body;
    if (!title || amount === undefined) {
      return sendError(res, 'Title and amount are required', [], 400);
    }

    const Expense = getTenantModel(req, 'Expense');
    const doc = await Expense.create({
      tenantId: req.tenantId,
      branchId: branchId || null,
      title: title.trim(),
      category: category || 'other',
      amount: Number(amount),
      date: date ? new Date(date) : new Date(),
      paidTo: paidTo || '',
      paymentMethod: paymentMethod || 'Cash',
      receiptUrl: receiptUrl || '',
      notes: notes || '',
    });

    return sendSuccess(res, 'Expense recorded successfully', doc, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getExpenses = async (req, res) => {
  try {
    const Expense = getTenantModel(req, 'Expense');
    const { page, limit, skip } = getPagination(req.query);
    const filter = buildTenantFilter(req);

    if (req.query.category && req.query.category !== 'all') filter.category = req.query.category;

    const [items, total] = await Promise.all([
      Expense.find(filter).populate('branchId', 'name code').sort({ date: -1 }).skip(skip).limit(limit),
      Expense.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const Expense = getTenantModel(req, 'Expense');
    const doc = await Expense.findOne({ _id: req.params.expenseId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Expense not found', [], 404);
    return sendSuccess(res, 'Expense retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateExpense = async (req, res) => {
  try {
    const Expense = getTenantModel(req, 'Expense');
    const doc = await Expense.findOneAndUpdate(
      { _id: req.params.expenseId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Expense not found', [], 404);
    return sendSuccess(res, 'Expense updated', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const Expense = getTenantModel(req, 'Expense');
    const doc = await Expense.findOneAndDelete({ _id: req.params.expenseId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Expense not found', [], 404);
    return sendSuccess(res, 'Expense deleted');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 8. ADDITIONAL EVENT / PARTY WORK
// ==========================================

export const createAdditionalWork = async (req, res) => {
  try {
    const { branchId, title, customerName, phone, staffIds, date, location, workDetails, income, expenses } = req.body;
    if (!title || !customerName) return sendError(res, 'Title and Customer Name are required', [], 400);

    const inc = Number(income) || 0;
    const exp = Number(expenses) || 0;
    const prof = inc - exp;

    const AdditionalWork = getTenantModel(req, 'AdditionalWork');
    const doc = await AdditionalWork.create({
      tenantId: req.tenantId,
      branchId: branchId || null,
      title: title.trim(),
      customerName: customerName.trim(),
      phone: phone || '',
      staffIds: Array.isArray(staffIds) ? staffIds : [],
      date: date ? new Date(date) : new Date(),
      location: location || '',
      workDetails: workDetails || '',
      income: inc,
      expenses: exp,
      profit: prof,
      status: 'scheduled',
    });

    return sendSuccess(res, 'Additional work record created', doc, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getAdditionalWorkList = async (req, res) => {
  try {
    const AdditionalWork = getTenantModel(req, 'AdditionalWork');
    const { page, limit, skip } = getPagination(req.query);
    const filter = buildTenantFilter(req);

    const [items, total] = await Promise.all([
      AdditionalWork.find(filter).populate('staffIds', 'name phone').sort({ date: -1 }).skip(skip).limit(limit),
      AdditionalWork.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getAdditionalWorkById = async (req, res) => {
  try {
    const AdditionalWork = getTenantModel(req, 'AdditionalWork');
    const doc = await AdditionalWork.findOne({ _id: req.params.workId, tenantId: req.tenantId }).populate('staffIds');
    if (!doc) return sendError(res, 'Record not found', [], 404);
    return sendSuccess(res, 'Additional work record retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateAdditionalWork = async (req, res) => {
  try {
    const AdditionalWork = getTenantModel(req, 'AdditionalWork');
    const doc = await AdditionalWork.findOneAndUpdate(
      { _id: req.params.workId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Record not found', [], 404);
    return sendSuccess(res, 'Record updated', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteAdditionalWork = async (req, res) => {
  try {
    const AdditionalWork = getTenantModel(req, 'AdditionalWork');
    const doc = await AdditionalWork.findOneAndDelete({ _id: req.params.workId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Record not found', [], 404);
    return sendSuccess(res, 'Record deleted');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const completeAdditionalWork = async (req, res) => {
  try {
    const AdditionalWork = getTenantModel(req, 'AdditionalWork');
    const doc = await AdditionalWork.findOneAndUpdate(
      { _id: req.params.workId, tenantId: req.tenantId },
      { status: 'completed' },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Record not found', [], 404);
    return sendSuccess(res, 'Additional work completed', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export default {
  createScrapItem,
  getScrapItems,
  getScrapItemById,
  updateScrapItem,
  deleteScrapItem,
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
  assignAsset,
  repairAsset,
  maintainAsset,
  createMaintenance,
  getMaintenanceList,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
  startMaintenance,
  completeMaintenance,
  createElectricityBill,
  getElectricityBills,
  getElectricityBillById,
  updateElectricityBill,
  deleteElectricityBill,
  createUtility,
  getUtilities,
  getUtilityById,
  updateUtility,
  deleteUtility,
  createRent,
  getRentList,
  getRentById,
  updateRent,
  deleteRent,
  payRent,
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  createAdditionalWork,
  getAdditionalWorkList,
  getAdditionalWorkById,
  updateAdditionalWork,
  deleteAdditionalWork,
  completeAdditionalWork,
};
