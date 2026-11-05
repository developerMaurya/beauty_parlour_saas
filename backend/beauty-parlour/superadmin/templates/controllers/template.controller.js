/**
 * @file template.controller.js
 * @description Super Admin Controller for Pre-Seeded Industry Service Catalogues (Salon, Spa, Makeup, Academy)
 */

import { ServiceTemplate } from '../models/service-template.model.js';
import { Tenant } from '../../tenants/models/tenant.model.js';
import { tenantConnectionManager } from '../../../../core/database/tenantConnectionManager.js';
import { logAuditEvent } from '../../../../utils/audit.utils.js';

const SYSTEM_DEFAULT_TEMPLATES = [
  // 1. Spa & Massage
  {
    verticalCode: 'SPA_MASSAGE',
    category: 'Full Body Massage',
    name: 'Swedish Deep Tissue Massage (60 Min)',
    description: 'Therapeutic pressure technique targeting muscle knots, chronic aches, and posture tension.',
    durationMinutes: 60,
    recommendedPrice: 80,
    requirements: ['Private Massage Room', 'Organic Jojoba Oil', 'Towels'],
  },
  {
    verticalCode: 'SPA_MASSAGE',
    category: 'Aromatherapy & Wellness',
    name: 'Aromatherapy Stress Relief Ritual (90 Min)',
    description: 'Holistic healing massage infused with therapeutic lavender and eucalyptus essential oils.',
    durationMinutes: 90,
    recommendedPrice: 110,
    requirements: ['Aroma Diffuser', 'Warm Heated Bed', 'Calming Music'],
  },
  {
    verticalCode: 'SPA_MASSAGE',
    category: 'Foot Reflexology',
    name: 'Thai Herbal Foot Reflexology (45 Min)',
    description: 'Pressure point stimulation on soles and calves to stimulate energy flow and relieve fatigue.',
    durationMinutes: 45,
    recommendedPrice: 50,
    requirements: ['Reflexology Chair', 'Herbal Foot Soak Tub'],
  },

  // 2. Hair & Beauty Salon
  {
    verticalCode: 'SALON',
    category: 'Hair Care & Styling',
    name: 'Signature Haircut & Moroccan Oil Blowdry',
    description: 'Customized consultation, precision hair sculpting, wash, conditioning, and bouncy blow-out.',
    durationMinutes: 45,
    recommendedPrice: 45,
    requirements: ['Styling Chair', 'Professional Dryer'],
  },
  {
    verticalCode: 'SALON',
    category: 'Chemical Treatments',
    name: 'Brazilian Keratin Hair Smoothing Treatment',
    description: 'Frizz-free protein infusion providing mirror shine and manageable silkiness for up to 4 months.',
    durationMinutes: 120,
    recommendedPrice: 180,
    requirements: ['Ventilated Station', 'Keratin Formula', 'Titanium Flat Iron'],
  },
  {
    verticalCode: 'SALON',
    category: 'Hair Coloring',
    name: 'Balayage Highlighting & Gloss Toner',
    description: 'Hand-painted sun-kissed dimension highlights customized to skin undertone.',
    durationMinutes: 150,
    recommendedPrice: 220,
    requirements: ['Color Bar', 'Foil Wraps', 'Lightener'],
  },

  // 3. Beauty Parlour
  {
    verticalCode: 'BEAUTY_PARLOUR',
    category: 'Facial & Skincare',
    name: 'O3+ Bridal Glow Radiant Facial',
    description: 'Multi-step skin brightening, deep pore extraction, ultrasonic rejuvenation, and peel-off mask.',
    durationMinutes: 60,
    recommendedPrice: 65,
    requirements: ['Facial Bed', 'Steamer', 'Ultrasonic Scrubber'],
  },
  {
    verticalCode: 'BEAUTY_PARLOUR',
    category: 'Waxing & Grooming',
    name: 'Rica Italian White Chocolate Full Body Wax',
    description: 'Colophony-free painless strip wax enriched with cocoa butter and almond oil.',
    durationMinutes: 60,
    recommendedPrice: 70,
    requirements: ['Wax Heater', 'Disposable Strips', 'Soothing Gel'],
  },

  // 4. Bridal & Makeup Studio
  {
    verticalCode: 'MAKEUP_STUDIO',
    category: 'Bridal Artistry',
    name: 'HD Ultra-Glam Bridal Makeup & Hair Styling',
    description: 'Camera-ready high-definition bridal look with 3D mink eyelashes, contouring, draping, and setting.',
    durationMinutes: 180,
    recommendedPrice: 350,
    targetAudience: 'BRIDAL',
    requirements: ['Vanity Ring Light', 'Airbrush Kit', 'Luxury Makeup Palette'],
  },
  {
    verticalCode: 'MAKEUP_STUDIO',
    category: 'Party & Occasion',
    name: 'Cocktail & Engagement Glam Makeup',
    description: 'Modern smokey eye or dewy glass skin with soft waves or Hollywood curls.',
    durationMinutes: 90,
    recommendedPrice: 150,
    requirements: ['Vanity Station', 'Professional Brushes'],
  },

  // 5. Training Academy
  {
    verticalCode: 'TRAINING_ACADEMY',
    category: 'Diploma Programs',
    name: 'Diploma in Professional Cosmetology & Skin Science (6 Months)',
    description: 'Comprehensive certified curriculum: Dermatology basics, advanced chemical peels, laser facials, and parlour business.',
    durationMinutes: 7200, // 120 hours
    recommendedPrice: 1500,
    targetAudience: 'STUDENTS',
    requirements: ['Classroom Projector', 'Student Practice Kits', 'Lab Workstations'],
  },
  {
    verticalCode: 'TRAINING_ACADEMY',
    category: 'Masterclasses',
    name: 'Certified Bridal Makeup & Hair Artistry Masterclass (4 Weeks)',
    description: 'Hands-on practical training on real models covering HD, Airbrush, Contouring, and portfolio building.',
    durationMinutes: 2400,
    recommendedPrice: 750,
    targetAudience: 'STUDENTS',
    requirements: ['Model Vanity Stations', 'Airbrush Compressors'],
  },
];

export const templateController = {
  async listServiceTemplates(req, res, next) {
    try {
      let count = await ServiceTemplate.countDocuments();
      if (count === 0) {
        await ServiceTemplate.insertMany(SYSTEM_DEFAULT_TEMPLATES);
      }

      const { verticalCode, category, search } = req.query;
      const query = { status: 'ACTIVE' };

      if (verticalCode) query.verticalCode = verticalCode.toUpperCase();
      if (category) query.category = category;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      const templates = await ServiceTemplate.find(query).sort({ verticalCode: 1, category: 1, name: 1 });

      return res.status(200).json({
        success: true,
        data: { templates },
      });
    } catch (err) {
      next(err);
    }
  },

  async getTemplateById(req, res, next) {
    try {
      const { templateId } = req.params;
      const template = await ServiceTemplate.findById(templateId);
      if (!template) {
        return res.status(404).json({ success: false, message: 'Template not found' });
      }

      return res.status(200).json({
        success: true,
        data: { template },
      });
    } catch (err) {
      next(err);
    }
  },

  async createServiceTemplate(req, res, next) {
    try {
      const template = await ServiceTemplate.create(req.body);
      await logAuditEvent(req, 'CREATE_SERVICE_TEMPLATE', 'ServiceTemplate', template._id, {
        name: template.name,
        verticalCode: template.verticalCode,
      });

      return res.status(201).json({
        success: true,
        message: 'Service template created successfully',
        data: { template },
      });
    } catch (err) {
      next(err);
    }
  },

  async updateServiceTemplate(req, res, next) {
    try {
      const { templateId } = req.params;
      const template = await ServiceTemplate.findByIdAndUpdate(
        templateId,
        { $set: req.body },
        { returnDocument: 'after' }
      );

      if (!template) {
        return res.status(404).json({ success: false, message: 'Template not found' });
      }

      await logAuditEvent(req, 'UPDATE_SERVICE_TEMPLATE', 'ServiceTemplate', template._id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Template updated successfully',
        data: { template },
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteServiceTemplate(req, res, next) {
    try {
      const { templateId } = req.params;
      await ServiceTemplate.findByIdAndDelete(templateId);
      await logAuditEvent(req, 'DELETE_SERVICE_TEMPLATE', 'ServiceTemplate', templateId);

      return res.status(200).json({
        success: true,
        message: 'Service template removed',
      });
    } catch (err) {
      next(err);
    }
  },

  // Seed default vertical catalogue into tenant database
  async seedCatalogToTenant(req, res, next) {
    try {
      const { tenantId } = req.params;
      const tenant = await Tenant.findById(tenantId);
      if (!tenant) {
        return res.status(404).json({ success: false, message: 'Tenant not found' });
      }

      const verticalCode = req.body.verticalCode || tenant.businessType || 'SALON';
      const templates = await ServiceTemplate.find({ verticalCode, status: 'ACTIVE' });

      if (templates.length === 0) {
        return res.status(400).json({
          success: false,
          message: `No service templates available for vertical: ${verticalCode}`,
        });
      }

      // Connect to tenant DB and insert services into tenant's `services` collection
      const tenantDb = await tenantConnectionManager.getConnection(
        tenant.databaseName || (tenant.databaseMode === 'SEPARATE' ? `beauty_tenant_${tenant.slug}` : 'beauty_saas_shared')
      );

      const servicesColl = tenantDb.collection('services');
      const docsToInsert = templates.map((t) => ({
        tenantId: tenant._id,
        name: t.name,
        category: t.category,
        description: t.description,
        durationMinutes: t.durationMinutes,
        price: t.recommendedPrice,
        targetAudience: t.targetAudience,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await servicesColl.insertMany(docsToInsert);
      await logAuditEvent(req, 'SEED_TENANT_CATALOG', 'Tenant', tenant._id, {
        verticalCode,
        servicesCount: docsToInsert.length,
      });

      return res.status(200).json({
        success: true,
        message: `Successfully seeded ${docsToInsert.length} standard ${verticalCode} services into tenant database!`,
        data: { seededCount: docsToInsert.length },
      });
    } catch (err) {
      next(err);
    }
  },
};

export default templateController;
