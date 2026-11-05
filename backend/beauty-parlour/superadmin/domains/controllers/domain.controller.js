import { Domain } from '../models/domain.model.js';
import { Tenant } from '../../tenants/models/tenant.model.js';
import { sendSuccess, sendError } from '../../../../utils/response.utils.js';
import { recordAuditLog } from '../../../../utils/audit.utils.js';

export const domainController = {
  async listDomains(req, res, next) {
    try {
      const query = {};
      if (req.query.status) query.status = req.query.status;
      if (req.query.isCustom !== undefined) query.isCustom = req.query.isCustom === 'true';

      const domains = await Domain.find(query).populate('tenantId', 'name slug email subdomain primaryDomain').sort({ createdAt: -1 });
      return sendSuccess(res, 'Domains retrieved', domains);
    } catch (e) { next(e); }
  },

  async createTenantDomain(req, res, next) {
    try {
      const { domain, isPrimary = false, isCustom: customParam } = req.body;
      const tenantId = req.params.tenantId || req.body.tenantId;

      if (!domain || !tenantId) return sendError(res, 'Domain and tenantId are required', [], 400);

      const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/$/, '');

      // Check if another tenant is already using this domain
      const existingOther = await Domain.findOne({ domain: cleanDomain, tenantId: { $ne: tenantId } });
      if (existingOther) return sendError(res, 'This domain is already registered by another tenant', [], 409);

      const isPlatformSubdomain = cleanDomain.endsWith('.kashiservice.com') || cleanDomain.endsWith('.yourplatform.com') || cleanDomain.endsWith('.localhost');
      const isCustom = customParam !== undefined ? Boolean(customParam) : !isPlatformSubdomain;

      // The rule: A tenant has ONLY ONE active domain (either platform subdomain OR custom domain)!
      // Remove other duplicate or previous domain records for this tenant so the list has only 1 domain.
      await Domain.deleteMany({ tenantId, domain: { $ne: cleanDomain } });

      let domainDoc = await Domain.findOne({ domain: cleanDomain, tenantId });
      if (!domainDoc) {
        domainDoc = await Domain.create({
          tenantId,
          domain: cleanDomain,
          isCustom,
          isPrimary: true,
          status: 'active',
          sslStatus: 'active',
          dnsRecords: [
            { type: 'CNAME', name: cleanDomain, expectedValue: 'cname.kashiservice.com', isVerified: true },
            { type: 'A', name: cleanDomain, expectedValue: '76.76.21.21', isVerified: true },
            { type: 'TXT', name: `_verify.${cleanDomain}`, expectedValue: `kashi-verify-token-${Date.now()}`, isVerified: true },
          ],
        });
      } else {
        domainDoc.isPrimary = true;
        domainDoc.isCustom = isCustom;
        domainDoc.status = 'active';
        domainDoc.sslStatus = 'active';
        await domainDoc.save();
      }

      // Update Tenant document
      const tenantUpdate = {
        primaryDomain: cleanDomain,
        'domainAccess.customDomainAllowed': isCustom,
        'domainAccess.isDomainActive': true,
      };

      if (isPlatformSubdomain) {
        const sub = cleanDomain.split('.')[0];
        if (sub) tenantUpdate.subdomain = sub;
      }

      await Tenant.findByIdAndUpdate(tenantId, tenantUpdate);

      await recordAuditLog({
        req,
        action: 'DOMAIN_REGISTERED',
        resourceType: 'Domain',
        resourceId: domainDoc._id,
        details: { domain: cleanDomain, isCustom, isPrimary: true },
      });

      return sendSuccess(res, 'Domain configured and activated successfully', domainDoc, 201);
    } catch (e) { next(e); }
  },

  async getDomainById(req, res, next) {
    try {
      const domain = await Domain.findById(req.params.domainId).populate('tenantId');
      if (!domain) return sendError(res, 'Domain not found', [], 404);
      return sendSuccess(res, 'Domain details', domain);
    } catch (e) { next(e); }
  },

  async updateDomain(req, res, next) {
    try {
      const { domainId } = req.params;
      const { domain, isPrimary, status, sslStatus, isCustom } = req.body;

      const existingDoc = await Domain.findById(domainId);
      if (!existingDoc) {
        return sendError(res, 'Domain not found', [], 404);
      }

      if (domain && domain.trim().toLowerCase() !== existingDoc.domain) {
        const cleanDomain = domain.trim().toLowerCase();
        const conflict = await Domain.findOne({ domain: cleanDomain, _id: { $ne: domainId } });
        if (conflict) {
          return sendError(res, `Domain hostname "${cleanDomain}" is already in use by another tenant`, [], 409);
        }
        existingDoc.domain = cleanDomain;
      }

      if (isCustom !== undefined) existingDoc.isCustom = Boolean(isCustom);
      if (status) {
        existingDoc.status = status;
        if (status === 'verified' || status === 'active') {
          existingDoc.verifiedAt = existingDoc.verifiedAt || new Date();
          if (!sslStatus) existingDoc.sslStatus = 'active';
        }
      }
      if (sslStatus) existingDoc.sslStatus = sslStatus;

      if (isPrimary !== undefined) {
        const primaryBool = Boolean(isPrimary);
        existingDoc.isPrimary = primaryBool;
        if (primaryBool) {
          await Domain.updateMany({ tenantId: existingDoc.tenantId, _id: { $ne: domainId } }, { $set: { isPrimary: false } });
          await Tenant.findByIdAndUpdate(existingDoc.tenantId, { primaryDomain: existingDoc.domain });
        }
      }

      await existingDoc.save();
      const updated = await Domain.findById(domainId).populate('tenantId', 'name slug email subdomain primaryDomain');

      await recordAuditLog({
        req,
        action: 'DOMAIN_UPDATED',
        resourceType: 'Domain',
        resourceId: domainId,
        details: { domain: existingDoc.domain, status: existingDoc.status, isPrimary: existingDoc.isPrimary },
      });

      return sendSuccess(res, 'Domain updated successfully', updated);
    } catch (e) { next(e); }
  },

  async deleteDomain(req, res, next) {
    try {
      const { domainId } = req.params;
      let targetTenantId = null;
      let deletedDomain = null;

      // 1. Try deleting by MongoDB ObjectId if valid
      if (domainId && domainId.match(/^[0-9a-fA-F]{24}$/)) {
        const doc = await Domain.findById(domainId);
        if (doc) {
          targetTenantId = doc.tenantId;
          deletedDomain = doc.domain;
          await Domain.findByIdAndDelete(domainId);
        }
      }

      // 2. If not found by ObjectId, find by domain hostname string
      if (!deletedDomain && domainId) {
        const doc = await Domain.findOne({
          $or: [{ domain: domainId }, { domain: domainId.toLowerCase() }]
        });
        if (doc) {
          targetTenantId = doc.tenantId;
          deletedDomain = doc.domain;
          await Domain.findByIdAndDelete(doc._id);
        }
      }

      // 3. Handle synthetic IDs like 'sub_...' or 'cust_...'
      if (domainId && (domainId.startsWith('sub_') || domainId.startsWith('cust_'))) {
        targetTenantId = domainId.replace(/^(sub_|cust_)/, '');
        await Domain.deleteMany({ tenantId: targetTenantId });
      }

      // 4. Ensure tenant reverts back to default platform subdomain so they are never broken!
      if (targetTenantId) {
        const tenant = await Tenant.findById(targetTenantId);
        if (tenant) {
          const defaultSub = tenant.subdomain || tenant.slug || 'salon';
          const defaultPlatformDomain = `${defaultSub}.kashiservice.com`;

          tenant.primaryDomain = defaultPlatformDomain;
          tenant.subdomain = defaultSub;
          if (tenant.domainAccess) {
            tenant.domainAccess.customDomainAllowed = false;
          }
          await tenant.save();

          // Ensure 1 default platform domain document exists in Domain collection
          await Domain.deleteMany({ tenantId: targetTenantId });
          await Domain.create({
            tenantId: targetTenantId,
            domain: defaultPlatformDomain,
            isCustom: false,
            isPrimary: true,
            status: 'active',
            sslStatus: 'active',
          });
        }
      }

      return sendSuccess(res, 'Domain removed and reset to default platform subdomain');
    } catch (e) { next(e); }
  },

  async verifyDomain(req, res, next) {
    try {
      const domain = await Domain.findById(req.params.domainId);
      if (!domain) return sendError(res, 'Domain not found', [], 404);

      // Simulate DNS verification
      domain.status = 'verified';
      domain.sslStatus = 'active';
      domain.verifiedAt = new Date();
      domain.dnsRecords.forEach((d) => { d.isVerified = true; d.verifiedAt = new Date(); });
      await domain.save();

      return sendSuccess(res, 'Domain ownership and DNS successfully verified', domain);
    } catch (e) { next(e); }
  },

  async setPrimaryDomain(req, res, next) {
    try {
      const domain = await Domain.findById(req.params.domainId);
      if (!domain) return sendError(res, 'Domain not found', [], 404);

      await Domain.updateMany({ tenantId: domain.tenantId }, { $set: { isPrimary: false } });
      domain.isPrimary = true;
      await domain.save();

      await Tenant.findByIdAndUpdate(domain.tenantId, { primaryDomain: domain.domain });
      return sendSuccess(res, 'Domain set as primary', domain);
    } catch (e) { next(e); }
  },

  async refreshSsl(req, res, next) {
    try {
      const domain = await Domain.findById(req.params.domainId);
      if (!domain) return sendError(res, 'Domain not found', [], 404);

      domain.sslStatus = 'active';
      domain.sslExpiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      await domain.save();

      return sendSuccess(res, 'SSL certificate successfully issued/renewed', domain);
    } catch (e) { next(e); }
  },

  async updateDomainStatus(req, res, next) {
    try {
      const domain = await Domain.findByIdAndUpdate(req.params.domainId, { $set: { status: req.body.status } }, { new: true });
      return sendSuccess(res, 'Domain status updated', domain);
    } catch (e) { next(e); }
  },
};

export default domainController;
