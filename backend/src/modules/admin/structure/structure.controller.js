/**
 * @file structure.controller.js
 * @description Dynamic Organizational Structure: Departments, Designations, and Skills.
 * Allows Admin to configure business roles (e.g. Hair Stylist, Makeup Expert) without code changes.
 * @module backend/src/modules/admin/structure/structure.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';
import { getPagination, getSort, buildTenantFilter } from '../../../utils/query.utils.js';

// ==========================================
// 1. DEPARTMENTS
// ==========================================

export const createDepartment = async (req, res) => {
  try {
    const { name, description, branchId, status } = req.body;
    if (!name) return sendError(res, 'Department name is required', [], 400);

    const Department = getTenantModel(req, 'Department');
    const existing = await Department.findOne({ tenantId: req.tenantId, name: name.trim() });
    if (existing) return sendError(res, 'A department with this name already exists', [], 409);

    const doc = await Department.create({
      tenantId: req.tenantId,
      branchId: branchId || null,
      name: name.trim(),
      description: description || '',
      status: status || 'active',
    });

    return sendSuccess(res, 'Department created successfully', doc, 201);
  } catch (error) {
    return sendError(res, `Failed to create department: ${error.message}`, [], 500);
  }
};

export const getDepartments = async (req, res) => {
  try {
    const Department = getTenantModel(req, 'Department');
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, 'name');
    const filter = buildTenantFilter(req);

    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }

    const [items, total] = await Promise.all([
      Department.find(filter).sort(sort).skip(skip).limit(limit),
      Department.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, `Failed to retrieve departments: ${error.message}`, [], 500);
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const Department = getTenantModel(req, 'Department');
    const doc = await Department.findOne({ _id: req.params.departmentId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Department not found', [], 404);
    return sendSuccess(res, 'Department retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const Department = getTenantModel(req, 'Department');
    const doc = await Department.findOneAndUpdate(
      { _id: req.params.departmentId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Department not found', [], 404);
    return sendSuccess(res, 'Department updated successfully', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateDepartmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'inactive'].includes(status)) {
      return sendError(res, 'Status must be active or inactive', [], 400);
    }
    const Department = getTenantModel(req, 'Department');
    const doc = await Department.findOneAndUpdate(
      { _id: req.params.departmentId, tenantId: req.tenantId },
      { status },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Department not found', [], 404);
    return sendSuccess(res, `Department status updated to ${status}`, doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const Department = getTenantModel(req, 'Department');
    const doc = await Department.findOneAndDelete({ _id: req.params.departmentId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Department not found', [], 404);
    return sendSuccess(res, 'Department deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 2. DESIGNATIONS
// ==========================================

export const createDesignation = async (req, res) => {
  try {
    const { name, departmentId, department, description, status } = req.body;
    if (!name) return sendError(res, 'Designation name is required', [], 400);

    const Designation = getTenantModel(req, 'Designation');
    const doc = await Designation.create({
      tenantId: req.tenantId,
      departmentId: departmentId || department || null,
      name: name.trim(),
      description: description || '',
      status: status || 'active',
    });

    return sendSuccess(res, 'Designation created successfully', doc, 201);
  } catch (error) {
    return sendError(res, `Failed to create designation: ${error.message}`, [], 500);
  }
};

export const getDesignations = async (req, res) => {
  try {
    const Designation = getTenantModel(req, 'Designation');
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, 'name');
    const filter = buildTenantFilter(req);

    if (req.query.departmentId) filter.departmentId = req.query.departmentId;
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }

    const [items, total] = await Promise.all([
      Designation.find(filter).populate('departmentId', 'name').sort(sort).skip(skip).limit(limit),
      Designation.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, `Failed to retrieve designations: ${error.message}`, [], 500);
  }
};

export const getDesignationById = async (req, res) => {
  try {
    const Designation = getTenantModel(req, 'Designation');
    const doc = await Designation.findOne({ _id: req.params.designationId, tenantId: req.tenantId }).populate('departmentId');
    if (!doc) return sendError(res, 'Designation not found', [], 404);
    return sendSuccess(res, 'Designation retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateDesignation = async (req, res) => {
  try {
    const Designation = getTenantModel(req, 'Designation');
    const doc = await Designation.findOneAndUpdate(
      { _id: req.params.designationId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Designation not found', [], 404);
    return sendSuccess(res, 'Designation updated successfully', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateDesignationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const Designation = getTenantModel(req, 'Designation');
    const doc = await Designation.findOneAndUpdate(
      { _id: req.params.designationId, tenantId: req.tenantId },
      { status },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Designation not found', [], 404);
    return sendSuccess(res, `Designation status updated to ${status}`, doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteDesignation = async (req, res) => {
  try {
    const Designation = getTenantModel(req, 'Designation');
    const doc = await Designation.findOneAndDelete({ _id: req.params.designationId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Designation not found', [], 404);
    return sendSuccess(res, 'Designation deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 3. SKILLS
// ==========================================

export const createSkill = async (req, res) => {
  try {
    const { name, category, description } = req.body;
    if (!name) return sendError(res, 'Skill name is required', [], 400);

    const Skill = getTenantModel(req, 'Skill');
    const doc = await Skill.create({
      tenantId: req.tenantId,
      name: name.trim(),
      category: category || 'General',
      description: description || '',
    });

    return sendSuccess(res, 'Skill created successfully', doc, 201);
  } catch (error) {
    return sendError(res, `Failed to create skill: ${error.message}`, [], 500);
  }
};

export const getSkills = async (req, res) => {
  try {
    const Skill = getTenantModel(req, 'Skill');
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, 'name');
    const filter = buildTenantFilter(req);

    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }

    const [items, total] = await Promise.all([
      Skill.find(filter).sort(sort).skip(skip).limit(limit),
      Skill.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, `Failed to retrieve skills: ${error.message}`, [], 500);
  }
};

export const getSkillById = async (req, res) => {
  try {
    const Skill = getTenantModel(req, 'Skill');
    const doc = await Skill.findOne({ _id: req.params.skillId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Skill not found', [], 404);
    return sendSuccess(res, 'Skill retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateSkill = async (req, res) => {
  try {
    const Skill = getTenantModel(req, 'Skill');
    const doc = await Skill.findOneAndUpdate(
      { _id: req.params.skillId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Skill not found', [], 404);
    return sendSuccess(res, 'Skill updated successfully', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const Skill = getTenantModel(req, 'Skill');
    const doc = await Skill.findOneAndDelete({ _id: req.params.skillId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Skill not found', [], 404);
    return sendSuccess(res, 'Skill deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export default {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  updateDepartmentStatus,
  deleteDepartment,
  createDesignation,
  getDesignations,
  getDesignationById,
  updateDesignation,
  updateDesignationStatus,
  deleteDesignation,
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
};
