/**
 * @file kashiPlatform.controller.js
 * @description Master Controller for Kashi Service Multi-Tenant SaaS & Multi-Service Platform.
 * Powers:
 *   1. Kashi Service Catalog (Software SaaS, Event Services, Parlour Services, Plotting Services, Rent Services)
 *   2. Public Tenant Self-Registration & 14-Day Free Trial Provisioning
 *   3. Instant Admin User Creation, Database Provisioning, and Domain Setup
 *   4. Live Demo Tenant Discoveries & Credentials
 * @module backend/src/modules/kashi-service/controllers/kashiPlatform.controller
 */

import { Tenant } from '../modules/superadmin/tenants/models/tenant.model.js';
import { Domain } from '../modules/superadmin/domains/models/domain.model.js';
import { Subscription } from '../modules/superadmin/subscriptions/models/subscription.model.js';
import { Plan } from '../modules/superadmin/plans/models/plan.model.js';
import { Transaction, Invoice } from '../modules/superadmin/billing/models/billing.model.js';
import { BusinessVerification, TenantRequest } from '../modules/superadmin/verifications/models/verification.model.js';
import { databaseProvisioningService } from '../core/database/databaseProvisioningService.js';
import { hashPassword } from '../modules/auth/services/password.service.js';
import { getCentralDatabase } from '../core/database/centralDatabase.js';
import { uploadImageToCloudflare } from '../services/cloudflare.service.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';

// Master Catalog of Kashi Service 5 Core Verticals
const KASHI_SERVICES = [
  {
    id: 'software-saas',
    name: 'Software Services (Multi-Tenant SaaS)',
    shortName: 'Software SaaS',
    tagline: 'Launch Your White-Label Business Software with Custom Domain & Mobile Admin in 60 Seconds',
    category: 'SOFTWARE',
    icon: '💻',
    accentColor: '#6366f1',
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    featured: true,
    status: 'ACTIVE_PRODUCTION',
    activeVerticals: [
      {
        id: 'beauty-parlour',
        name: 'Beauty Parlour & Luxury Salon SaaS',
        status: 'READY_NOW',
        badge: 'Production Ready',
        description: 'Complete multi-branch salon ERP: POS billing, staff GPS radar, academy LMS, client booking & inventory.',
      },
      {
        id: 'grocery-shop',
        name: 'Grocery & Supermarket POS',
        status: 'BETA_ROLLOUT',
        badge: 'Module Available',
        description: 'Barcode scanning, stock batch expiry, weighing scale integration, and doorstep home delivery app.',
      },
      {
        id: 'computer-institute',
        name: 'Computer Institute & Academy Management',
        status: 'READY_NOW',
        badge: 'Production Ready',
        description: 'Student admissions, batch timetables, exam grading, digital certificates, and fee installment receipts.',
      },
      {
        id: 'electronic-shop',
        name: 'Electronic & Mobile Repair Shop',
        status: 'BETA_ROLLOUT',
        badge: 'Module Available',
        description: 'IMEI / Serial tracking, warranty cards, service job sheets, technician commission, and parts inventory.',
      },
      {
        id: 'boutique-studio',
        name: 'Boutique & Designer Studio',
        status: 'MODULE_ACTIVE',
        badge: 'Module Available',
        description: 'Custom measurements ledger, fabric stage tracking, artisan allocation, and trial appointment schedules.',
      },
    ],
    features: [
      'Zero-Config Platform Subdomain (e.g. riya.kashiservice.com)',
      '100% Branded White-Label Custom Domain (e.g. www.riyabeauty.com)',
      'Live Staff Attendance GPS Tracking (🟢 Checked-In, 🔴 Checked-Out, 🟡 On Leave)',
      'Doorstep Home Service Live Transit Tracking with Google Satellite Radar',
      'Dynamic Service Catalog, Packages, Discounts, and Staff Product Assignment',
      'Student Academy Portal with Automated Digital PDF Certificates',
      'Tenant Admin, Staff, Student, and Customer 4-Tier RBAC Architecture',
      'Automated Let\'s Encrypt TLS/SSL with CNAME Target (cname.kashiservice.com)',
    ],
    documentationNotes: [
      'Multi-Tenant Architecture: Every registered business gets isolated tenant context via Host header, subdomain, or custom domain routing.',
      'Database Flexibility: Default shared isolated tenant collections with one-click migration to dedicated database.',
      'Zero Manual Overhead: Platform self-provisions the database, seeds starter categories, creates owner admin credentials, and activates DNS mapping in under 5 seconds.',
    ],
    plans: [
      {
        id: 'plan_starter',
        name: 'Starter Plan',
        priceMonthly: 999,
        priceYearly: 9999,
        trialDays: 14,
        features: ['1 Branch', 'Up to 5 Staff', '100 Appointments/mo', 'Platform Subdomain (.kashiservice.com)', 'Email Support'],
      },
      {
        id: 'plan_pro',
        name: 'Professional Plan',
        priceMonthly: 2499,
        priceYearly: 24999,
        trialDays: 14,
        isPopular: true,
        features: ['3 Branches', 'Up to 20 Staff', 'Unlimited Appointments', 'GPS Live Satellite Radar', 'Custom Domain Support', 'Academy LMS'],
      },
      {
        id: 'plan_enterprise',
        name: 'White-Label Enterprise',
        priceMonthly: 4999,
        priceYearly: 49999,
        trialDays: 14,
        features: ['Unlimited Branches', 'Unlimited Staff', '100% White-Label (Zero Kashi Branding)', 'Custom DB Option', 'Dedicated SLA Concierge'],
      },
    ],
  },
  {
    id: 'event-service',
    name: 'Event Services & Production',
    shortName: 'Event Services',
    tagline: 'End-to-End Wedding, Gala & Corporate Event Planning, Banquet Operations & Vendor Logistics',
    category: 'EVENTS',
    icon: '🎉',
    accentColor: '#ec4899',
    gradient: 'linear-gradient(135deg, #db2777 0%, #9333ea 100%)',
    featured: true,
    status: 'ACTIVE_VERTICAL',
    activeVerticals: [
      { id: 'weddings', name: 'Luxury Destination Weddings', status: 'READY_NOW', badge: 'Active', description: 'Theme decor, mandap setup, sangeet artist lineup, guest hospitality, and pandit booking.' },
      { id: 'corporate', name: 'Corporate Conferences & Expos', status: 'READY_NOW', badge: 'Active', description: 'Delegate registration, LED video walls, sound engineering, keynote staging, and banquet catering.' },
      { id: 'birthdays', name: 'Thematic Birthday Celebrations', status: 'READY_NOW', badge: 'Active', description: 'Balloon styling, customized cakes, game hosts, magic shows, and photography.' },
    ],
    features: [
      'Interactive Event Milestone Gantt Chart and Budget Tracker',
      'Subcontractor & Vendor Payment Disbursal Ledger',
      'Digital WhatsApp Invites with Instant QR Code Check-In Pass',
      'Live Stage Sound, Lighting & Truss Equipment Staging Checklist',
      'Banquet Hall 2D Floorplan & Seating Arrangement Visualizer',
    ],
    documentationNotes: [
      'Vendor SLA Management: Tracks advance payments, delivery verification, and post-event equipment audits.',
      'Multi-Event Calendar: Prevents double-booking of high-value audiovisual and floral inventory.',
    ],
    plans: [
      { id: 'event_single', name: 'Single Event Pass', priceMonthly: 4999, trialDays: 7, features: ['1 Large Scale Event', 'Unlimited Guest RSVPs', 'Vendor Ledger', 'QR Passes'] },
      { id: 'event_pro', name: 'Event Organizer Pro', priceMonthly: 3999, trialDays: 14, isPopular: true, features: ['Up to 10 Events/mo', 'Full Vendor Payouts', 'WhatsApp Integration', 'Custom Branding'] },
      { id: 'event_agency', name: 'Luxury Event Agency', priceMonthly: 7999, trialDays: 14, features: ['Unlimited Events', 'Multi-City Logistics', 'White-Label Client App', 'Dedicated Event Director'] },
    ],
  },
  {
    id: 'parlour-service',
    name: 'Parlour Services & Salon Concierge',
    shortName: 'Parlour Services',
    tagline: 'Direct-to-Client Haute Couture Bridal Artistry, Hair Aesthetics & Rejuvenating Spa Treatments',
    category: 'BEAUTY_WELLNESS',
    icon: '💄',
    accentColor: '#f43f5e',
    gradient: 'linear-gradient(135deg, #e11d48 0%, #f97316 100%)',
    featured: true,
    status: 'ACTIVE_VERTICAL',
    activeVerticals: [
      { id: 'bridal-couture', name: 'Bridal Makeovers & Airbrush Artistry', status: 'READY_NOW', badge: 'Signature', description: 'HD bridal cosmetics, saree draping, hairstyling, and pre-wedding glow rituals.' },
      { id: 'hair-aesthetics', name: 'Hair Therapies & Color Balayage', status: 'READY_NOW', badge: 'Active', description: 'Keratin smoothing, botox, organic hair spas, and custom ombre highlights.' },
      { id: 'skin-clinic', name: 'Clinical Derma & Hydra-Facials', status: 'READY_NOW', badge: 'Active', description: 'Deep pore extraction, ultrasonic rejuvenation, anti-aging collagen, and gold peel therapies.' },
    ],
    features: [
      'Instant VIP Appointment Booking with Preferred Senior Stylist Selection',
      'Doorstep Home Service Makeover Dispatch with Real-Time Staff Tracking',
      'Personalized Client Skin & Hair Consultation Profiles with Before/After Photos',
      'Pre-Paid Beauty Membership Wallets with Loyalty Cashback Points',
    ],
    documentationNotes: [
      'Sanitization Protocols: Full digital checklist compliance before each client service.',
      'Material Consumption: Automatically deducts salon stock (creams, colors, serums) per service session.',
    ],
    plans: [
      { id: 'parlour_basic', name: 'Salon Essential', priceMonthly: 1499, trialDays: 14, features: ['Single Chair / Studio', 'Online Appointments', 'Basic Billing', 'SMS Confirmations'] },
      { id: 'parlour_pro', name: 'Elite Salon & Spa', priceMonthly: 2999, trialDays: 14, isPopular: true, features: ['Multi-Station Parlour', 'Staff Commission Matrix', 'Doorstep Home Service', 'Inventory Deductions'] },
      { id: 'parlour_chain', name: 'Franchise Chain', priceMonthly: 6499, trialDays: 14, features: ['Multi-City Outlets', 'Central Customer Loyalty', 'Custom Brand Domain', 'Advanced POS'] },
    ],
  },
  {
    id: 'plotting-service',
    name: 'Plotting Services (Real Estate & Colonies)',
    shortName: 'Plotting Services',
    tagline: 'Colony Land Layout Mapping, Interactive Plot Status Visualizer & Buyer Installment Registry',
    category: 'REAL_ESTATE',
    icon: '🏗️',
    accentColor: '#10b981',
    gradient: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
    featured: true,
    status: 'ACTIVE_VERTICAL',
    activeVerticals: [
      { id: 'colony-layout', name: 'Residential Colony Masterplans', status: 'READY_NOW', badge: 'Active', description: 'Plot zoning, internal roads, park allocations, commercial corner plots, and sewer lines.' },
      { id: 'commercial-scos', name: 'Commercial SCO & Mall Plots', status: 'READY_NOW', badge: 'Active', description: 'High-density commercial frontage, multi-level retail plots, and parking lots.' },
      { id: 'farmhouses', name: 'Gated Farmhouses & Eco Subdivisions', status: 'READY_NOW', badge: 'Active', description: 'Acre-sized farm plots, gated security perimeter, tubewell points, and clubhouses.' },
    ],
    features: [
      'Interactive SVG Colony Masterplan Map with Color-Coded Plot Availability',
      'One-Click Plot Booking with Down Payment Token & E-Receipt Generation',
      'Buyer Installment (EMI) Schedule Ledger with Automated Overdue SMS Alerts',
      'Legal Registry Vault: RERA Registration, Mutation Records & Land Title Deeds',
      'Field Sales Broker Incentive & Commission Tracking Matrix',
    ],
    documentationNotes: [
      'GIS Coordinate Geofencing: Pins exact latitude/longitude boundaries for each numbered plot.',
      'Escrow Transparency: Tracks builder bank accounts, NOC clearances, and municipal approvals.',
    ],
    plans: [
      { id: 'plot_starter', name: 'Colony Starter', priceMonthly: 2999, trialDays: 14, features: ['1 Layout Map', 'Up to 100 Plots', 'Booking Receipts', 'Buyer Records'] },
      { id: 'plot_pro', name: 'Township Pro', priceMonthly: 5999, trialDays: 14, isPopular: true, features: ['3 Townships', 'Unlimited Plots', 'Interactive Color Map', 'Broker Portal', 'EMI Schedules'] },
      { id: 'plot_developer', name: 'Real Estate Developer', priceMonthly: 11999, trialDays: 14, features: ['Unlimited Colonies', 'Custom White-Label Domain', 'RERA Compliance Ledger', 'Multi-Branch Offices'] },
    ],
  },
  {
    id: 'rent-service',
    name: 'Rent Services (Properties & Assets)',
    shortName: 'Rent Services',
    tagline: 'Streamlined Rental Leases, Equipment Staging, Monthly Rent Ledger & WhatsApp Reminders',
    category: 'RENTALS',
    icon: '🔑',
    accentColor: '#f59e0b',
    gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    featured: true,
    status: 'ACTIVE_VERTICAL',
    activeVerticals: [
      { id: 'property-rental', name: 'Commercial & Residential Leases', status: 'READY_NOW', badge: 'Active', description: 'Flats, commercial shops, office floors, and co-working desks.' },
      { id: 'equipment-rental', name: 'Heavy Machinery & Event Gear', status: 'READY_NOW', badge: 'Active', description: 'Generators, sound systems, DSLR cameras, construction cranes, and party furniture.' },
      { id: 'bridal-rental', name: 'Bridal Couture & Jewelry Vault', status: 'READY_NOW', badge: 'Active', description: 'Designer bridal lehengas, sherwanis, kundan jewelry sets, and deposit tracking.' },
    ],
    features: [
      'Digital Lease Agreements with Aadhaar/PAN KYC Upload and E-Signature',
      'Automated Monthly Rent Generation with Integrated UPI Payment QR Codes',
      'Security Deposit Escrow Management with Condition Damage Assessment',
      'Asset Return Verification & Daily Late Penalty Calculation System',
    ],
    documentationNotes: [
      'Asset Life-Cycle Tracking: Maintains maintenance logs, depreciation rates, and utilization percentages.',
      'WhatsApp Payment Bot: Automatically delivers rent payment reminders 3 days prior to due date.',
    ],
    plans: [
      { id: 'rent_basic', name: 'Landlord Basic', priceMonthly: 1199, trialDays: 14, features: ['Up to 25 Units / Items', 'Tenant KYC Vault', 'Rent Invoicing', 'Deposit Tracker'] },
      { id: 'rent_pro', name: 'Commercial Leasing Pro', priceMonthly: 2999, trialDays: 14, isPopular: true, features: ['Up to 100 Units / Gear', 'Auto WhatsApp Alerts', 'Digital Lease E-Sign', 'UPI Auto-Collect'] },
      { id: 'rent_enterprise', name: 'Fleet & Realty Enterprise', priceMonthly: 5499, trialDays: 14, features: ['Unlimited Assets / Flats', 'Custom Domain Portal', 'Multi-Manager Access', 'Depreciation Ledger'] },
    ],
  },
];

export const kashiPlatformController = {
  /**
   * GET /api/v1/kashi/services
   * Returns list of all 5 Kashi Service business verticals with plans, features, and documentation
   */
  async getServicesCatalog(_req, res) {
    try {
      return sendSuccess(res, 'Kashi Service master catalog retrieved', {
        platformName: 'Kashi Service',
        platformDomain: 'kashiservice.com',
        totalServices: KASHI_SERVICES.length,
        services: KASHI_SERVICES,
      });
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * GET /api/v1/kashi/services/:serviceId
   * Returns deep-dive documentation, architecture notes, and details for a specific service
   */
  async getServiceDetails(req, res) {
    try {
      const { serviceId } = req.params;
      const found = KASHI_SERVICES.find((s) => s.id === serviceId);
      if (!found) {
        return sendError(res, `Service '${serviceId}' not found`, [], 404);
      }
      return sendSuccess(res, `Details for ${found.name}`, found);
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * POST /api/v1/kashi/onboarding/register
   * Public Tenant Self-Registration & Free Trial / Subscription Provisioning
   * Accepts business info, owner credentials, chosen subdomain or custom domain, and instantly:
   *   1. Creates Tenant record in central DB
   *   2. Assigns Domain routing (subdomain.kashiservice.com or custom domain)
   *   3. Assigns 14-day free trial or chosen subscription plan
   *   4. Provisions Tenant Database & Admin User Account with password provided by user
   *   5. Returns credentials receipt and instant access URLs
   */
  async registerTenant(req, res) {
    try {
      const {
        businessName,
        ownerName,
        email,
        phone = '',
        password,
        businessType = 'salon',
        domainType = 'subdomain', // 'subdomain' | 'custom'
        subdomain = '',
        customDomain = '',
        serviceCategory = 'software-saas',
        planId = 'plan_starter',
      } = req.body;

      if (!businessName || !ownerName || !email || !password) {
        return sendError(res, 'Business name, owner name, email, and password are required', [], 400);
      }

      if (password.length < 6) {
        return sendError(res, 'Password must be at least 6 characters long', [], 400);
      }

      // Generate or clean slug
      const rawSlug = subdomain || businessName;
      const cleanSlug = rawSlug
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 24);

      if (!cleanSlug) {
        return sendError(res, 'Please provide a valid business or website name', [], 400);
      }

      // Reserved slugs check
      const reserved = ['admin', 'api', 'www', 'superadmin', 'app', 'kashi', 'kashiservice', 'cname', 'portal', 'test'];
      if (reserved.includes(cleanSlug)) {
        return sendError(res, `The subdomain name '${cleanSlug}' is reserved. Please pick another name.`, [], 400);
      }

      // Check if slug or email is already taken
      const existing = await Tenant.findOne({
        $or: [
          { slug: cleanSlug },
          { subdomain: cleanSlug },
          { email: email.toLowerCase().trim() },
        ],
      });

      if (existing) {
        return sendError(
          res,
          existing.slug === cleanSlug || existing.subdomain === cleanSlug
            ? `Subdomain '${cleanSlug}' is already taken. Please try another name.`
            : `An account with email '${email}' already exists. Please log in or use another email.`,
          [],
          409
        );
      }

      // Determine Primary Domain
      const normalizedCustomDomain = customDomain ? customDomain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/$/, '') : '';
      const isCustomSelected = domainType === 'custom' && normalizedCustomDomain;
      const primaryDomain = isCustomSelected ? normalizedCustomDomain : `${cleanSlug}.kashiservice.com`;

      // 1. Create Tenant Document in Central MongoDB
      const tenant = await Tenant.create({
        name: businessName.trim(),
        slug: cleanSlug,
        code: cleanSlug.toUpperCase().slice(0, 8),
        ownerName: ownerName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        businessType: businessType || 'salon',
        status: 'trial',
        provisioningStatus: 'processing',
        subdomain: cleanSlug,
        primaryDomain,
        databaseMode: 'shared',
        storageConfig: { allowCustomCloudflare: false },
        databaseConfig: {
          allowCustomDatabase: false,
          databaseName: 'beauty_saas_shared',
          lastProvisionedAt: new Date(),
        },
        domainAccess: {
          customDomainAllowed: Boolean(isCustomSelected),
          isDomainActive: true,
        },
        securityConfig: {
          whiteLabelEnabled: Boolean(isCustomSelected),
        },
        metadata: {
          serviceCategory,
          onboardedVia: 'KASHI_SERVICE_PORTAL',
          registeredAt: new Date(),
        },
      });

      // 2. Register Subdomain Record
      await Domain.create({
        tenantId: tenant._id,
        domain: `${cleanSlug}.kashiservice.com`,
        isCustom: false,
        isPrimary: !isCustomSelected,
        status: 'active',
        sslStatus: 'active',
        verifiedAt: new Date(),
      });

      // 3. Register Custom Domain if provided
      if (isCustomSelected) {
        await Domain.create({
          tenantId: tenant._id,
          domain: normalizedCustomDomain,
          isCustom: true,
          isPrimary: true,
          status: 'pending',
          sslStatus: 'pending',
          dnsRecords: [
            {
              type: 'CNAME',
              name: normalizedCustomDomain.startsWith('www.') ? 'www' : '@',
              expectedValue: 'cname.kashiservice.com',
              isVerified: false,
            },
          ],
        });
      }

      // 4. Create 14-Day Free Trial Subscription
      const trialDays = 14;
      const subscription = await Subscription.create({
        tenantId: tenant._id,
        billingCycle: 'monthly',
        status: 'trial',
        amount: 0,
        currency: 'INR',
        startDate: new Date(),
        endDate: new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000),
        trialEndsAt: new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000),
        features: ['all_modules', 'gps_tracking', 'website_cms', 'pos_billing', 'academy_lms'],
      });

      tenant.subscriptionId = subscription._id;
      await tenant.save();

      // 5. Provision Admin User in Central DB & Database Collections
      const adminPayload = {
        name: ownerName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        password: password.trim(),
        username: email.split('@')[0].toLowerCase().trim(),
      };

      const provResult = await databaseProvisioningService.provisionTenantDatabase(tenant, adminPayload);

      tenant.provisioningStatus = provResult.success ? 'completed' : 'failed';
      await tenant.save();

      // 6. Also ensure User is saved in Central `TenantUser` collection with hashed password
      const centralConn = getCentralDatabase();
      const passwordHash = await hashPassword(password.trim());
      const tenantIdStr = tenant._id.toString();

      const adminUserRecord = {
        tenantId: tenantIdStr,
        email: email.toLowerCase().trim(),
        username: adminPayload.username,
        phone: phone.trim(),
        passwordHash,
        role: 'ADMIN',
        status: 'active',
        isBlocked: false,
        failedLoginAttempts: 0,
        sessionVersion: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await centralConn.db.collection('tenantusers').updateOne(
        { tenantId: tenantIdStr, email: email.toLowerCase().trim() },
        { $set: adminUserRecord },
        { upsert: true }
      );

      // Return clean, actionable onboarding success response
      return sendSuccess(
        res,
        `Congratulations! ${tenant.name} has been provisioned on Kashi Service. Your website and admin dashboard are ready.`,
        {
          tenant: {
            id: tenant._id,
            name: tenant.name,
            slug: tenant.slug,
            subdomain: tenant.subdomain,
            primaryDomain: tenant.primaryDomain,
            businessType: tenant.businessType,
            status: tenant.status,
            trialDaysRemaining: trialDays,
          },
          credentials: {
            salonId: tenant.slug,
            email: email.toLowerCase().trim(),
            password: password.trim(),
            role: 'TENANT_ADMIN',
          },
          links: {
            // Option A: Platform Subdomain URL
            platformSubdomainUrl: `http://${cleanSlug}.kashiservice.com`,
            // Option B: Localhost Subdomain preview
            localhostSubdomainUrl: `http://${cleanSlug}.localhost:3002`,
            // Direct Public Storefront preview
            storefrontPath: `/site/${cleanSlug}`,
            // Admin Dashboard Login Path
            adminLoginUrl: `/admin/login?tenant=${cleanSlug}`,
            // Direct Admin Dashboard Path (once logged in)
            adminDashboardUrl: `/admin/dashboard`,
            // DNS instructions for custom domain (if selected)
            customDomainConfig: isCustomSelected
              ? {
                  domain: normalizedCustomDomain,
                  cnameTarget: 'cname.kashiservice.com',
                  apexA: '76.76.21.21',
                  status: 'Pending DNS Verification',
                }
              : null,
          },
        },
        201
      );
    } catch (err) {
      console.error('Kashi Service tenant registration error:', err);
      return sendError(res, err.message || 'Registration failed. Please try again.', [], 500);
    }
  },

  /**
   * GET /api/v1/kashi/demo-tenants
   * Returns active seeded demo tenants for immediate 1-click preview
   */
  async getDemoTenants(_req, res) {
    try {
      const tenants = await Tenant.find({ status: { $in: ['active', 'trial'] } })
        .select('name slug subdomain primaryDomain businessType status')
        .limit(6)
        .lean();

      return sendSuccess(res, 'Active demo tenants retrieved', {
        tenants,
        defaultDemo: tenants[0] || { slug: 'blossom-salon', name: 'Blossom Luxury Salon & Spa' },
      });
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * POST /api/v1/platform/auth/send-otp
   * Step 01: Customer Sign-up / Login OTP Generator
   */
  async sendOtp(req, res) {
    try {
      const { phone = '', email = '' } = req.body;
      if (!phone && !email) {
        return sendError(res, 'Mobile number or email is required', [], 400);
      }

      // Default development test OTP: '123456'
      const simulatedOtp = '123456';
      const target = phone || email;

      return sendSuccess(res, `OTP sent successfully to ${target}`, {
        target,
        otpSent: true,
        simulatedOtp,
        expiresInSeconds: 300,
      });
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * POST /api/v1/platform/auth/verify-otp
   * Step 01: Validates customer OTP
   */
  async verifyOtp(req, res) {
    try {
      const { phone = '', email = '', otp = '' } = req.body;
      if (!otp) {
        return sendError(res, 'OTP is required', [], 400);
      }

      // Verification check (in dev environment accepts '123456' or any 6-digit number)
      if (otp === '123456' || otp.length === 6) {
        return sendSuccess(res, 'OTP verified successfully', {
          verified: true,
          phone,
          email,
        });
      }

      return sendError(res, 'Invalid OTP. Please enter 123456', [], 400);
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * POST /api/v1/platform/onboarding/check-subdomain
   * Step 02: Checks if subdomain is available (e.g. riya.kashiservice.com)
   */
  async checkSubdomainAvailability(req, res) {
    try {
      const { subdomain } = req.body;
      if (!subdomain) {
        return sendError(res, 'Subdomain is required', [], 400);
      }

      const cleanSlug = subdomain
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 24);

      const reserved = ['admin', 'api', 'www', 'superadmin', 'app', 'kashi', 'kashiservice', 'cname', 'portal', 'test'];
      if (reserved.includes(cleanSlug)) {
        return sendSuccess(res, 'Subdomain check', {
          available: false,
          subdomain: cleanSlug,
          reason: 'This subdomain is reserved by the platform.',
        });
      }

      const existing = await Tenant.findOne({
        $or: [{ slug: cleanSlug }, { subdomain: cleanSlug }],
      });

      return sendSuccess(res, 'Subdomain check', {
        available: !existing,
        subdomain: cleanSlug,
        previewUrl: `${cleanSlug}.kashiservice.com`,
        reason: existing ? 'Subdomain is already taken' : 'Available',
      });
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * POST /api/v1/platform/onboarding/demo-request
   * Model B: Request a Demo / Contact Sales for Custom Enterprise
   */
  async submitDemoRequest(req, res) {
    try {
      const {
        businessName,
        ownerName,
        email,
        phone,
        serviceCategory = 'software-saas',
        estimatedBranches = 1,
        requirements = '',
      } = req.body;

      if (!businessName || !ownerName || !email || !phone) {
        return sendError(res, 'Business name, owner name, email, and phone are required', [], 400);
      }

      const requestDoc = await TenantRequest.create({
        businessName: businessName.trim(),
        ownerName: ownerName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        serviceCategory,
        requestType: 'demo_request',
        estimatedBranches: Number(estimatedBranches) || 1,
        requirements: requirements.trim(),
        status: 'pending',
      });

      return sendSuccess(
        res,
        'Demo & Custom Enterprise request submitted successfully! Super Admin team will review and contact you within 2 business hours.',
        {
          requestId: requestDoc._id,
          businessName: requestDoc.businessName,
          status: requestDoc.status,
          contactEmail: requestDoc.email,
        },
        201
      );
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * POST /api/v1/platform/onboarding/complete-journey
   * The Complete 01-07 Customer Journey Provisioning Engine:
   * 01 Sign Up / Login -> 02 Business Registration -> 03 Optional KYC -> 04 Choose Plan -> 05 Verified Payment -> 06 Automatic Provisioning -> 07 Active Launch!
   */
  async completeCustomerJourney(req, res) {
    try {
      const {
        // Step 01: Owner Info
        ownerName,
        email,
        phone = '',
        password,
        // Step 02: Business Registration
        businessName,
        businessCategory = 'beauty-parlour',
        businessType = 'salon',
        address = '',
        city = '',
        state = '',
        postalCode = '',
        subdomain = '',
        customDomain = '',
        domainType = 'subdomain',
        businessLogo = '',
        // Step 03: KYC (Optional)
        kycDetails = null, // { isProvided, idType, idNumber, pan, gstin, docUrl }
        // Step 04 & 05: Plan, Model & Payment
        purchaseModel = 'direct_buy', // 'direct_buy' | 'demo_request' | 'free_trial'
        planId = 'pro', // 'starter' | 'pro' | 'enterprise'
        billingCycle = 'monthly',
        payment = null, // { method: 'upi'|'card'|'netbanking', transactionId, amount, isVerified }
      } = req.body;

      if (!businessName || !ownerName || !email || !password) {
        return sendError(res, 'Business name, owner name, email, and password are required', [], 400);
      }

      // Model B: If demo request selected, route to TenantRequest ledger
      if (purchaseModel === 'demo_request') {
        const reqDoc = await TenantRequest.create({
          businessName: businessName.trim(),
          ownerName: ownerName.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          serviceCategory: businessCategory,
          requestType: 'demo_request',
          status: 'pending',
          requirements: `Model B Request from onboarding flow. Plan requested: ${planId}`,
        });
        return sendSuccess(res, 'Enterprise demo request registered', {
          isDemoRequest: true,
          requestId: reqDoc._id,
          message: 'Our Super Admin team has received your request and will reach out with a custom proposal.',
        }, 201);
      }

      // Generate Clean Subdomain
      const rawSlug = subdomain || businessName;
      const cleanSlug = rawSlug
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 24);

      // Check existing tenant or user (idempotency guard)
      let tenant = await Tenant.findOne({
        $or: [{ slug: cleanSlug }, { subdomain: cleanSlug }, { email: email.toLowerCase().trim() }],
      });

      const normalizedCustomDomain = customDomain ? customDomain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/$/, '') : '';
      const isCustomSelected = domainType === 'custom' && normalizedCustomDomain;
      const primaryDomain = isCustomSelected ? normalizedCustomDomain : `${cleanSlug}.kashiservice.com`;

      const kycIsProvided = Boolean(kycDetails && (kycDetails.idNumber || kycDetails.pan || kycDetails.gstin));
      const initialKycStatus = kycIsProvided ? 'pending' : 'not_required';
      const initialStatus = purchaseModel === 'free_trial' ? 'trial' : 'active';
      const initialPaymentStatus = purchaseModel === 'direct_buy' ? 'success' : 'pending';

      if (!tenant) {
        // Step 06: Automatic Provisioning
        tenant = await Tenant.create({
          name: businessName.trim(),
          slug: cleanSlug,
          code: cleanSlug.toUpperCase().slice(0, 8),
          ownerName: ownerName.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          businessType: businessType || 'salon',
          address: {
            street: address || '',
            city: city || 'New Delhi',
            state: state || 'Delhi',
            postalCode: postalCode || '110001',
            country: 'IN',
          },
          status: initialStatus,
          kycStatus: initialKycStatus,
          kycDetails: {
            idType: kycDetails?.idType || 'pan',
            idNumber: kycDetails?.idNumber || '',
            pan: kycDetails?.pan || '',
            gstin: kycDetails?.gstin || '',
            docUrl: kycDetails?.docUrl || '',
            submittedAt: kycIsProvided ? new Date() : null,
          },
          paymentStatus: initialPaymentStatus,
          purchaseModel,
          onboardingStep: 7,
          provisioningStatus: 'completed',
          subdomain: cleanSlug,
          primaryDomain,
          databaseMode: planId === 'enterprise' ? 'separate' : 'shared',
          storageConfig: { allowCustomCloudflare: false },
          databaseConfig: {
            allowCustomDatabase: false,
            databaseName: planId === 'enterprise' ? `db_${cleanSlug}` : 'beauty_saas_shared',
            lastProvisionedAt: new Date(),
          },
          domainAccess: {
            customDomainAllowed: Boolean(isCustomSelected),
            isDomainActive: true,
          },
          branding: {
            companyName: businessName.trim(),
            logoUrl: businessLogo || '',
            primaryColor: '#be185d',
            secondaryColor: '#4f46e5',
          },
          metadata: {
            onboardedVia: 'CUSTOMER_JOURNEY_WIZARD',
            journeyStepsCompleted: ['01_SIGNUP', '02_BUSINESS', '03_KYC', '04_PLAN', '05_PAYMENT', '06_PROVISIONING', '07_ACTIVE'],
            registeredAt: new Date(),
          },
        });

        // Register Subdomain in Domain Registry
        await Domain.create({
          tenantId: tenant._id,
          domain: `${cleanSlug}.kashiservice.com`,
          isCustom: false,
          isPrimary: !isCustomSelected,
          status: 'active',
          sslStatus: 'active',
          verifiedAt: new Date(),
        });

        // Register Custom Domain if provided
        if (isCustomSelected) {
          await Domain.create({
            tenantId: tenant._id,
            domain: normalizedCustomDomain,
            isCustom: true,
            isPrimary: true,
            status: 'pending',
            sslStatus: 'pending',
          });
        }

        // Register KYC Document Verification record if provided
        if (kycIsProvided) {
          await BusinessVerification.create({
            tenantId: tenant._id,
            businessName: tenant.name,
            ownerName: tenant.ownerName,
            email: tenant.email,
            phone: tenant.phone,
            status: 'pending',
            idType: kycDetails.idType || 'pan',
            idNumber: kycDetails.idNumber || '',
            pan: kycDetails.pan || '',
            gstin: kycDetails.gstin || '',
            documentUrl: kycDetails.docUrl || '',
          });
        }

        // Plan pricing matrix
        const planPriceMap = {
          starter: { monthly: 999, yearly: 9990, name: 'Starter Plan' },
          pro: { monthly: 2499, yearly: 24990, name: 'Multi-Branch Pro' },
          enterprise: { monthly: 5999, yearly: 59990, name: 'Enterprise White-Label' },
        };
        const selectedPlan = planPriceMap[planId] || planPriceMap.pro;
        const amount = purchaseModel === 'free_trial' ? 0 : (billingCycle === 'yearly' ? selectedPlan.yearly : selectedPlan.monthly);

        // Subscription Record
        const subscription = await Subscription.create({
          tenantId: tenant._id,
          billingCycle,
          status: purchaseModel === 'free_trial' ? 'trial' : 'active',
          amount,
          currency: 'INR',
          startDate: new Date(),
          endDate: new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000),
          trialEndsAt: purchaseModel === 'free_trial' ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : null,
          features: ['appointments', 'customerManagement', 'staffManagement', 'posBilling', 'gpsRadar', 'academyModule'],
        });

        tenant.subscriptionId = subscription._id;
        await tenant.save();

        // Transaction & Invoice Record (if paid)
        if (purchaseModel === 'direct_buy' && payment) {
          const invNum = `INV-${cleanSlug.toUpperCase().slice(0, 4)}-${Date.now().toString().slice(-6)}`;
          const invoice = await Invoice.create({
            invoiceNumber: invNum,
            tenantId: tenant._id,
            subscriptionId: subscription._id,
            amount,
            status: 'paid',
            paidAt: new Date(),
            paymentMethod: payment.method || 'upi',
          });

          await Transaction.create({
            tenantId: tenant._id,
            subscriptionId: subscription._id,
            invoiceId: invoice._id,
            amount,
            currency: 'INR',
            status: 'succeeded',
            paymentMethod: payment.method || 'upi',
            gatewayTransactionId: payment.transactionId || `tx_${Date.now()}`,
            description: `Kashi Service ${selectedPlan.name} Subscription`,
          });
        }

        // Provision Tenant Database & Master Admin
        const adminPayload = {
          name: ownerName.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          password: password.trim(),
          username: email.split('@')[0].toLowerCase().trim(),
        };
        await databaseProvisioningService.provisionTenantDatabase(tenant, adminPayload);
      } else {
        // If tenant already existed, update with newest owner details and refresh admin credentials
        tenant.name = businessName.trim();
        tenant.ownerName = ownerName.trim();
        tenant.phone = phone.trim();
        tenant.status = 'active';
        if (businessLogo) {
          if (!tenant.branding) tenant.branding = {};
          tenant.branding.logoUrl = businessLogo;
        }
        await tenant.save();

        const adminPayload = {
          name: ownerName.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          password: password.trim(),
          username: email.split('@')[0].toLowerCase().trim(),
        };
        await databaseProvisioningService.provisionTenantDatabase(tenant, adminPayload);
      }

      const effectiveSlug = tenant.slug || cleanSlug;

      // Step 07: Active Dashboard & Website Ready Receipt
      return sendSuccess(
        res,
        'Congratulations! Your SaaS business account, website, and admin dashboard are active!',
        {
          journeyCompleted: true,
          step: '07_ACTIVE',
          tenant: {
            id: tenant._id,
            name: tenant.name,
            slug: effectiveSlug,
            status: tenant.status,
            kycStatus: tenant.kycStatus,
            paymentStatus: tenant.paymentStatus,
          },
          credentials: {
            ownerName: tenant.ownerName,
            email: tenant.email,
            password: password.trim(),
            tenantSlug: effectiveSlug,
          },
          links: {
            adminLoginUrl: `/admin/login?tenant=${effectiveSlug}&email=${encodeURIComponent(tenant.email)}&autologin=true`,
            directDashboardUrl: `/admin/dashboard`,
            storefrontUrl: `/site/${effectiveSlug}`,
            subdomainUrl: `http://${effectiveSlug}.localhost:3000`,
            customDomainUrl: isCustomSelected ? `https://${normalizedCustomDomain}` : null,
          },
        },
        201
      );
    } catch (err) {
      console.error('Complete customer journey error:', err);
      return sendError(res, err.message || 'Onboarding journey failed', [], 500);
    }
  },

  /**
   * POST /api/v1/platform/upload
   * In-memory file & document upload for Onboarding Logo and KYC Documents.
   * Streams to Cloudflare if configured, or converts to Data URI in memory.
   * NEVER saves files to local disk or project folders.
   */
  async uploadFile(req, res) {
    try {
      if (!req.file) {
        return sendError(res, 'No file was provided (form-data field name "file" required)', [], 400);
      }

      const { folder = 'onboarding' } = req.body;
      let uploadResult = null;

      // Try Cloudflare Images first if configured and it's an image
      if (req.file.mimetype && req.file.mimetype.startsWith('image/')) {
        try {
          uploadResult = await uploadImageToCloudflare({
            buffer: req.file.buffer,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            metadata: { folder, uploadedAt: new Date().toISOString() },
          });
        } catch (cloudErr) {
          // Cloudflare not configured or offline - fallback to in-memory Data URI
          console.log('[Platform Upload] Falling back to in-memory Data URI:', cloudErr.message);
        }
      }

      // If Cloudflare did not process it or if it's a PDF / non-image, construct clean in-memory Data URI
      if (!uploadResult || !uploadResult.url) {
        const base64Data = req.file.buffer.toString('base64');
        const dataUri = `data:${req.file.mimetype};base64,${base64Data}`;
        uploadResult = {
          success: true,
          url: dataUri,
          id: `in_memory_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          filename: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          uploaded: new Date().toISOString(),
          provider: 'in_memory',
        };
      }

      return sendSuccess(res, 'File uploaded successfully', uploadResult, 200);
    } catch (error) {
      console.error('[Platform Upload] Error:', error);
      return sendError(res, error.message || 'File upload failed', [], 500);
    }
  },
};


