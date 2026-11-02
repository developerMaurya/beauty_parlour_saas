import { Feature, FeatureCategory } from '../models/feature.model.js';
import { sendSuccess, sendError } from '../../../../utils/response.utils.js';

export const featureController = {
  async listFeatures(req, res, next) {
    try {
      const features = await Feature.find().populate('categoryId').sort({ name: 1 });
      return sendSuccess(res, 'Features retrieved', features);
    } catch (e) { next(e); }
  },

  async createFeature(req, res, next) {
    try {
      const { name, slug, categoryId, description, isAddon, addonPriceMonthly } = req.body;
      if (!name || !slug) return sendError(res, 'Name and slug are required', [], 400);

      const feature = await Feature.create({
        name,
        slug: slug.toLowerCase(),
        categoryId: categoryId || null,
        description: description || '',
        isAddon: Boolean(isAddon),
        addonPriceMonthly: addonPriceMonthly || 0,
      });
      return sendSuccess(res, 'Feature created', feature, 201);
    } catch (e) { next(e); }
  },

  async getFeatureById(req, res, next) {
    try {
      const feature = await Feature.findById(req.params.featureId).populate('categoryId');
      if (!feature) return sendError(res, 'Feature not found', [], 404);
      return sendSuccess(res, 'Feature details', feature);
    } catch (e) { next(e); }
  },

  async updateFeature(req, res, next) {
    try {
      const feature = await Feature.findByIdAndUpdate(req.params.featureId, { $set: req.body }, { new: true });
      if (!feature) return sendError(res, 'Feature not found', [], 404);
      return sendSuccess(res, 'Feature updated', feature);
    } catch (e) { next(e); }
  },

  async deleteFeature(req, res, next) {
    try {
      await Feature.findByIdAndDelete(req.params.featureId);
      return sendSuccess(res, 'Feature deleted');
    } catch (e) { next(e); }
  },

  async updateStatus(req, res, next) {
    try {
      const feature = await Feature.findByIdAndUpdate(req.params.featureId, { $set: { status: req.body.status } }, { new: true });
      return sendSuccess(res, 'Feature status updated', feature);
    } catch (e) { next(e); }
  },

  // Category endpoints
  async listCategories(_req, res, next) {
    try {
      const categories = await FeatureCategory.find().sort({ order: 1, name: 1 });
      return sendSuccess(res, 'Categories retrieved', categories);
    } catch (e) { next(e); }
  },

  async createCategory(req, res, next) {
    try {
      const { name, slug, description, order } = req.body;
      const cat = await FeatureCategory.create({ name, slug: slug.toLowerCase(), description, order });
      return sendSuccess(res, 'Category created', cat, 201);
    } catch (e) { next(e); }
  },

  async getCategoryById(req, res, next) {
    try {
      const cat = await FeatureCategory.findById(req.params.categoryId);
      if (!cat) return sendError(res, 'Category not found', [], 404);
      return sendSuccess(res, 'Category details', cat);
    } catch (e) { next(e); }
  },

  async updateCategory(req, res, next) {
    try {
      const cat = await FeatureCategory.findByIdAndUpdate(req.params.categoryId, { $set: req.body }, { new: true });
      return sendSuccess(res, 'Category updated', cat);
    } catch (e) { next(e); }
  },

  async deleteCategory(req, res, next) {
    try {
      await FeatureCategory.findByIdAndDelete(req.params.categoryId);
      return sendSuccess(res, 'Category deleted');
    } catch (e) { next(e); }
  },
};

export default featureController;
