/**
 * @file theme.controller.js
 * @description Super Admin Controller for White-Label Branding Presets (Salon, Spa, Parlour, Makeup, Academy)
 */

import { WhiteLabelTheme } from '../models/whitelabel-theme.model.js';
import { Tenant } from '../../tenants/models/tenant.model.js';
import { logAuditEvent } from '../../../../utils/audit.utils.js';

const SYSTEM_DEFAULT_THEMES = [
  {
    name: 'Rose Gold Glamour',
    code: 'rose_gold_glamour',
    targetVertical: 'BEAUTY_PARLOUR,MAKEUP_STUDIO',
    previewImageUrl: '/themes/rose-gold.png',
    colors: {
      primary: '#F43F5E',
      secondary: '#FB7185',
      accent: '#FDA4AF',
      background: '#0F0913',
      surface: '#1A0E22',
      card: 'rgba(26, 14, 34, 0.85)',
    },
    typography: {
      fontFamily: 'Plus Jakarta Sans',
      headingFont: 'Outfit',
    },
    isDefault: true,
  },
  {
    name: 'Zen Emerald Spa',
    code: 'zen_emerald_spa',
    targetVertical: 'SPA_MASSAGE',
    previewImageUrl: '/themes/emerald-spa.png',
    colors: {
      primary: '#10B981',
      secondary: '#34D399',
      accent: '#6EE7B7',
      background: '#061412',
      surface: '#0A201D',
      card: 'rgba(10, 32, 29, 0.85)',
    },
    typography: {
      fontFamily: 'Plus Jakarta Sans',
      headingFont: 'Outfit',
    },
    isDefault: false,
  },
  {
    name: 'Midnight Noir Salon',
    code: 'midnight_noir_salon',
    targetVertical: 'SALON,CHAINS_FRANCHISE',
    previewImageUrl: '/themes/midnight-noir.png',
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#A855F7',
      background: '#080C15',
      surface: '#111827',
      card: 'rgba(17, 24, 39, 0.85)',
    },
    typography: {
      fontFamily: 'Plus Jakarta Sans',
      headingFont: 'Outfit',
    },
    isDefault: false,
  },
  {
    name: 'Royal Academy Blue',
    code: 'royal_academy_blue',
    targetVertical: 'TRAINING_ACADEMY',
    previewImageUrl: '/themes/academy-blue.png',
    colors: {
      primary: '#0EA5E9',
      secondary: '#38BDF8',
      accent: '#F59E0B',
      background: '#081325',
      surface: '#0F213E',
      card: 'rgba(15, 33, 62, 0.85)',
    },
    typography: {
      fontFamily: 'Inter',
      headingFont: 'Outfit',
    },
    isDefault: false,
  },
];

export const themeController = {
  async listThemes(req, res, next) {
    try {
      let count = await WhiteLabelTheme.countDocuments();
      if (count === 0) {
        await WhiteLabelTheme.insertMany(SYSTEM_DEFAULT_THEMES);
      }

      const themes = await WhiteLabelTheme.find({ status: 'ACTIVE' }).sort({ isDefault: -1, name: 1 });

      return res.status(200).json({
        success: true,
        data: { themes, items: themes },
      });
    } catch (err) {
      next(err);
    }
  },

  async getThemeById(req, res, next) {
    try {
      const { themeId } = req.params;
      const theme = await WhiteLabelTheme.findById(themeId);
      if (!theme) {
        return res.status(404).json({ success: false, message: 'Theme not found' });
      }

      return res.status(200).json({
        success: true,
        data: { theme },
      });
    } catch (err) {
      next(err);
    }
  },

  async createTheme(req, res, next) {
    try {
      const theme = await WhiteLabelTheme.create(req.body);
      await logAuditEvent(req, 'CREATE_WHITELABEL_THEME', 'WhiteLabelTheme', theme._id, { name: theme.name });

      return res.status(201).json({
        success: true,
        message: 'Theme created successfully',
        data: { theme },
      });
    } catch (err) {
      next(err);
    }
  },

  async updateTheme(req, res, next) {
    try {
      const { themeId } = req.params;
      const theme = await WhiteLabelTheme.findByIdAndUpdate(
        themeId,
        { $set: req.body },
        { returnDocument: 'after' }
      );

      if (!theme) {
        return res.status(404).json({ success: false, message: 'Theme not found' });
      }

      await logAuditEvent(req, 'UPDATE_WHITELABEL_THEME', 'WhiteLabelTheme', theme._id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Theme updated successfully',
        data: { theme },
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteTheme(req, res, next) {
    try {
      const { themeId } = req.params;
      await WhiteLabelTheme.findByIdAndDelete(themeId);
      await logAuditEvent(req, 'DELETE_WHITELABEL_THEME', 'WhiteLabelTheme', themeId);

      return res.status(200).json({
        success: true,
        message: 'Theme removed successfully',
      });
    } catch (err) {
      next(err);
    }
  },

  async applyThemeToTenant(req, res, next) {
    try {
      const { tenantId } = req.params;
      const { themeCode } = req.body;

      const tenant = await Tenant.findById(tenantId);
      if (!tenant) {
        return res.status(404).json({ success: false, message: 'Tenant not found' });
      }

      const theme = await WhiteLabelTheme.findOne({ code: themeCode });
      if (!theme) {
        return res.status(404).json({ success: false, message: 'Theme code not recognized' });
      }

      tenant.theme = themeCode;
      tenant.branding = {
        primaryColor: theme.colors.primary,
        secondaryColor: theme.colors.secondary,
        fontFamily: theme.typography.fontFamily,
      };
      await tenant.save();

      await logAuditEvent(req, 'APPLY_TENANT_THEME', 'Tenant', tenant._id, { themeCode });

      return res.status(200).json({
        success: true,
        message: `Theme '${theme.name}' applied to tenant ${tenant.name}`,
        data: { tenant },
      });
    } catch (err) {
      next(err);
    }
  },
};

export default themeController;
