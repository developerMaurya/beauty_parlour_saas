/**
 * @file website.controller.js
 * @description Dynamic Public Website CMS Controller for Tenant Admin.
 * Manages branding, banners, pages, custom sections, gallery, testimonials, and FAQs.
 * @module backend/src/modules/admin/website/website.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

export const getWebsiteConfig = async (req, res) => {
  try {
    const WebsiteConfig = getTenantModel(req, 'WebsiteConfig');
    let config = await WebsiteConfig.findOne({ tenantId: req.tenantId });
    if (!config) {
      config = await WebsiteConfig.create({
        tenantId: req.tenantId,
        businessName: req.tenant.name,
        primaryColor: req.tenant.branding?.primaryColor || '#e11d48',
      });
    }
    return sendSuccess(res, 'Website CMS config retrieved', config);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateWebsiteConfig = async (req, res) => {
  try {
    const WebsiteConfig = getTenantModel(req, 'WebsiteConfig');
    const config = await WebsiteConfig.findOneAndUpdate(
      { tenantId: req.tenantId },
      { $set: req.body },
      { upsert: true, returnDocument: 'after' }
    );
    return sendSuccess(res, 'Website CMS configuration updated successfully', config);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getWebsitePages = async (req, res) => {
  try {
    const WebsitePage = getTenantModel(req, 'WebsitePage');
    const items = await WebsitePage.find({ tenantId: req.tenantId }).sort({ createdAt: 1 });
    return sendSuccess(res, 'Website pages retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const createWebsitePage = async (req, res) => {
  try {
    const { title, slug, content, isPublished } = req.body;
    if (!title || !slug) return sendError(res, 'Title and slug are required', [], 400);

    const WebsitePage = getTenantModel(req, 'WebsitePage');
    const doc = await WebsitePage.create({
      tenantId: req.tenantId,
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      content: content || '',
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    });

    return sendSuccess(res, 'Page created successfully', doc, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getWebsitePageById = async (req, res) => {
  try {
    const WebsitePage = getTenantModel(req, 'WebsitePage');
    const doc = await WebsitePage.findOne({ _id: req.params.pageId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Page not found', [], 404);
    return sendSuccess(res, 'Page retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateWebsitePage = async (req, res) => {
  try {
    const WebsitePage = getTenantModel(req, 'WebsitePage');
    const doc = await WebsitePage.findOneAndUpdate(
      { _id: req.params.pageId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Page not found', [], 404);
    return sendSuccess(res, 'Page updated successfully', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteWebsitePage = async (req, res) => {
  try {
    const WebsitePage = getTenantModel(req, 'WebsitePage');
    const doc = await WebsitePage.findOneAndDelete({ _id: req.params.pageId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Page not found', [], 404);
    return sendSuccess(res, 'Page deleted');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getWebsiteSections = async (req, res) => {
  try {
    const WebsiteSection = getTenantModel(req, 'WebsiteSection');
    const items = await WebsiteSection.find({ tenantId: req.tenantId }).sort({ order: 1 });
    return sendSuccess(res, 'Website sections retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const createWebsiteSection = async (req, res) => {
  try {
    const { sectionKey, title, subtitle, content, isVisible, order } = req.body;
    if (!sectionKey || !title) return sendError(res, 'SectionKey and title are required', [], 400);

    const WebsiteSection = getTenantModel(req, 'WebsiteSection');
    const doc = await WebsiteSection.create({
      tenantId: req.tenantId,
      sectionKey,
      title,
      subtitle: subtitle || '',
      content: content || '',
      isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
      order: Number(order) || 0,
    });

    return sendSuccess(res, 'Section created successfully', doc, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateWebsiteSection = async (req, res) => {
  try {
    const WebsiteSection = getTenantModel(req, 'WebsiteSection');
    const doc = await WebsiteSection.findOneAndUpdate(
      { _id: req.params.sectionId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Section not found', [], 404);
    return sendSuccess(res, 'Section updated successfully', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteWebsiteSection = async (req, res) => {
  try {
    const WebsiteSection = getTenantModel(req, 'WebsiteSection');
    const doc = await WebsiteSection.findOneAndDelete({ _id: req.params.sectionId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Section not found', [], 404);
    return sendSuccess(res, 'Section deleted');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export default {
  getWebsiteConfig,
  updateWebsiteConfig,
  getWebsitePages,
  createWebsitePage,
  getWebsitePageById,
  updateWebsitePage,
  deleteWebsitePage,
  getWebsiteSections,
  createWebsiteSection,
  updateWebsiteSection,
  deleteWebsiteSection,
};
