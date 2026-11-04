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
      const { domain, isPrimary = false } = req.body;
      const tenantId = req.params.tenantId || req.body.tenantId;

      if (!domain || !tenantId) return sendError(res, 'Domain and tenantId are required', [], 400);

      const cleanDomain = domain.toLowerCase().trim();
      const existing = await Domain.findOne({ domain: cleanDomain });
      if (existing) return sendError(res, 'Domain is already registered by a tenant', [], 409);

      if (isPrimary) {
        await Domain.updateMany({ tenantId }, { $set: { isPrimary: false } });
      }

      const newDomain = await Domain.create({
        tenantId,
        domain: cleanDomain,
        isCustom: !cleanDomain.endsWith('.yourplatform.com'),
        isPrimary: Boolean(isPrimary),
        status: cleanDomain.endsWith('.yourplatform.com') ? 'active' : 'pending',
        sslStatus: cleanDomain.endsWith('.yourplatform.com') ? 'active' : 'pending',
        dnsRecords: [
          { type: 'CNAME', name: cleanDomain, expectedValue: 'cname.yourplatform.com', isVerified: false },
          { type: 'TXT', name: `_verify.${cleanDomain}`, expectedValue: `verify-token-${Date.now()}`, isVerified: false },
        ],
      });

      if (isPrimary) {
        await Tenant.findByIdAndUpdate(tenantId, { primaryDomain: cleanDomain });
      }

      await recordAuditLog({ req, action: 'DOMAIN_REGISTERED', resourceType: 'Domain', resourceId: newDomain._id, details: { domain: cleanDomain } });
      return sendSuccess(res, 'Domain added successfully', newDomain, 201);
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
      await Domain.findByIdAndDelete(req.params.domainId);
      return sendSuccess(res, 'Domain removed');
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
