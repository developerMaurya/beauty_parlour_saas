/**
 * @file DomainsList.jsx
 * @description White-Label Custom Domains, Subdomain Allocation, DNS Routing & Automated SSL Verification
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { domainsApi, tenantsApi } from '../../../services/api/superadmin.api';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';
import Modal from '../../../components/Modal';
import ConfirmModal from '../../../components/ConfirmModal';
import { useToast } from '../../../context/ToastContext';
import {
  Globe,
  Plus,
  CheckCircle,
  RefreshCw,
  Shield,
  Trash2,
  ExternalLink,
  Edit2,
  Sparkles,
  Check,
  Radio,
  Sliders,
} from 'lucide-react';

export const DomainsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get('status') || '';
  const activeTabParam = searchParams.get('tab') || 'all';

  const [domains, setDomains] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(statusParam);
  const [domainTypeFilter, setDomainTypeFilter] = useState('ALL');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  // Modals
  const [createModal, setCreateModal] = useState({
    isOpen: false,
    tenantId: '',
    domain: '',
    isPrimary: false,
  });

  const [subdomainModal, setSubdomainModal] = useState({
    isOpen: false,
    tenantId: '',
    subdomain: '',
  });

  const [editModal, setEditModal] = useState({
    isOpen: false,
    domainId: '',
    domain: '',
    isPrimary: false,
    status: 'active',
    sslStatus: 'active',
    isCustom: false,
    tenantName: '',
  });

  const [dnsModal, setDnsModal] = useState({ isOpen: false, domain: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, domain: null });
  const [actionLoading, setActionLoading] = useState(false);

  const { success, error, warning } = useToast();

  useEffect(() => {
    setSelectedStatus(statusParam);
    setPagination((p) => ({ ...p, page: 1 }));
  }, [statusParam]);

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setCreateModal({
        isOpen: true,
        tenantId: tenants[0]?._id || tenants[0]?.id || '',
        domain: '',
        isPrimary: false,
      });
    }
  }, [searchParams, tenants]);

  const fetchDomains = useCallback(async () => {
    setIsLoading(true);
    try {
      const [domRes, tenRes] = await Promise.all([
        domainsApi.list({
          page: pagination.page,
          limit: pagination.limit,
          search,
          status: selectedStatus || undefined,
        }),
        tenantsApi.list({ limit: 100 }).catch(() => ({ data: { tenants: [] } })),
      ]);

      const domItems = Array.isArray(domRes.data) ? domRes.data : (domRes.data?.domains || domRes.data?.items || []);
      setDomains(domItems);

      const tenItems = Array.isArray(tenRes.data) ? tenRes.data : (tenRes.data?.tenants || tenRes.data?.items || []);
      setTenants(tenItems);

      setPagination((p) => ({ ...p, total: domRes.data?.pagination?.total || domItems.length }));
    } catch (err) {
      error(err.message || 'Failed to fetch domains');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, selectedStatus, error]);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  // Handlers
  const handleVerify = async (domainId) => {
    try {
      const res = await domainsApi.verify(domainId);
      if (res.data?.status === 'verified' || res.data?.status === 'active' || res.data?.status === 'ACTIVE') {
        success('Domain ownership & DNS verified successfully');
      } else {
        warning('DNS verification pending propagation. Please check your CNAME/TXT records.');
      }
      fetchDomains();
    } catch (err) {
      error(err.message || 'Verification failed');
    }
  };

  const handleRefreshSsl = async (domainId) => {
    try {
      await domainsApi.refreshSsl(domainId);
      success('SSL certificate renewed and verified successfully');
      fetchDomains();
    } catch (err) {
      error(err.message || 'SSL check error');
    }
  };

  const handleSetPrimary = async (domainId) => {
    try {
      await domainsApi.setPrimary(domainId);
      success('Domain set as primary routing target for tenant!');
      fetchDomains();
    } catch (err) {
      error(err.message || 'Failed to set primary domain');
    }
  };

  const handleCreateDomain = async (e) => {
    e.preventDefault();
    if (!createModal.tenantId || !createModal.domain.trim()) return;
    setActionLoading(true);
    try {
      await domainsApi.addTenantDomain(createModal.tenantId, {
        domain: createModal.domain.trim().toLowerCase(),
        isPrimary: createModal.isPrimary,
      });
      success(`Domain "${createModal.domain.trim()}" added to tenant successfully`);
      setCreateModal({ isOpen: false, tenantId: '', domain: '', isPrimary: false });
      fetchDomains();
    } catch (err) {
      error(err.message || 'Failed to add domain');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateSubdomain = async (e) => {
    e.preventDefault();
    if (!subdomainModal.tenantId || !subdomainModal.subdomain.trim()) return;
    setActionLoading(true);
    try {
      const cleanSub = subdomainModal.subdomain.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      const fullDomain = `${cleanSub}.yourplatform.com`;
      await domainsApi.addTenantDomain(subdomainModal.tenantId, {
        domain: fullDomain,
        isPrimary: true,
      });
      success(`Platform test subdomain "${fullDomain}" assigned and activated!`);
      setSubdomainModal({ isOpen: false, tenantId: '', subdomain: '' });
      fetchDomains();
    } catch (err) {
      error(err.message || 'Failed to provision subdomain');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenEdit = (dom) => {
    const tName = typeof dom.tenantId === 'object' ? dom.tenantId?.name : (dom.tenantName || 'Tenant');
    setEditModal({
      isOpen: true,
      domainId: dom._id || dom.id,
      domain: dom.domain || '',
      isPrimary: Boolean(dom.isPrimary),
      status: dom.status || 'active',
      sslStatus: dom.sslStatus || 'active',
      isCustom: Boolean(dom.isCustom),
      tenantName: tName,
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editModal.domain.trim()) return;
    setActionLoading(true);
    try {
      await domainsApi.update(editModal.domainId, {
        domain: editModal.domain.trim().toLowerCase(),
        isPrimary: editModal.isPrimary,
        status: editModal.status,
        sslStatus: editModal.sslStatus,
        isCustom: editModal.isCustom,
      });
      success(`Domain "${editModal.domain}" updated and synchronized!`);
      setEditModal((p) => ({ ...p, isOpen: false }));
      fetchDomains();
    } catch (err) {
      error(err.message || 'Failed to update domain');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.domain) return;
    setActionLoading(true);
    try {
      await domainsApi.delete(deleteModal.domain._id || deleteModal.domain.id);
      success('Domain mapping removed');
      setDeleteModal({ isOpen: false, domain: null });
      fetchDomains();
    } catch (err) {
      error(err.message || 'Failed to delete domain');
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered domains
  const filteredDomains = domains.filter((d) => {
    if (domainTypeFilter === 'CUSTOM') return d.isCustom === true;
    if (domainTypeFilter === 'SUBDOMAIN') return d.isCustom === false || d.domain?.includes('yourplatform.com');
    return true;
  });

  const columns = [
    {
      header: 'Domain Hostname',
      accessor: 'domain',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Globe className={`w-4 h-4 ${row.isCustom ? 'text-indigo-400' : 'text-emerald-400'}`} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>{row.domain}</span>
              {row.isPrimary && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    background: 'rgba(99, 102, 241, 0.2)',
                    color: 'var(--primary)',
                    fontWeight: 700,
                  }}
                >
                  PRIMARY
                </span>
              )}
            </div>
            <a
              href={`https://${row.domain}`}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
            >
              <span>Visit Portal</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Tenant',
      accessor: 'tenantId',
      render: (row) => {
        const tenantObj = typeof row.tenantId === 'object' ? row.tenantId : null;
        const tenantName = tenantObj?.name || row.tenantName || 'Salon Tenant';
        const tenantSlug = tenantObj?.slug || '';
        return (
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{tenantName}</div>
            {tenantSlug && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                /{tenantSlug}
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: 'Architecture Type',
      accessor: 'isCustom',
      render: (row) => (
        <span
          style={{
            fontSize: '0.75rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '999px',
            background: row.isCustom ? 'rgba(168, 85, 247, 0.12)' : 'rgba(16, 185, 129, 0.12)',
            color: row.isCustom ? '#C084FC' : '#34D399',
            fontWeight: 700,
          }}
        >
          {row.isCustom ? 'Custom White-Label' : 'Platform Subdomain'}
        </span>
      ),
    },
    {
      header: 'DNS Verification',
      accessor: 'status',
      render: (row) => (
        <Badge
          status={row.status === 'verified' || row.status === 'active' ? 'ACTIVE' : 'WARNING'}
          text={row.status?.toUpperCase() || 'PENDING'}
        />
      ),
    },
    {
      header: 'SSL Security',
      accessor: 'sslStatus',
      render: (row) => (
        <Badge
          status={row.sslStatus === 'active' ? 'ACTIVE' : 'WARNING'}
          text={row.sslStatus === 'active' ? 'TLS 1.3 Active' : 'Issuing SSL'}
        />
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => {
        const id = row._id || row.id;
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
            {/* Edit Button */}
            <button
              onClick={() => handleOpenEdit(row)}
              className="btn btn-secondary btn-sm"
              title="Edit Domain Name & Status"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            {/* Verify Now Button */}
            {row.status !== 'verified' && row.status !== 'active' && (
              <button
                onClick={() => handleVerify(id)}
                className="btn btn-primary btn-sm"
                title="Verify DNS Ownership"
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Verify</span>
              </button>
            )}

            {/* Set Primary Button */}
            {!row.isPrimary && (
              <button
                onClick={() => handleSetPrimary(id)}
                className="btn btn-secondary btn-sm"
                title="Set as Primary Domain"
                style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
              >
                Set Primary
              </button>
            )}

            {/* DNS Instructions Modal Trigger */}
            <button
              onClick={() => setDnsModal({ isOpen: true, domain: row })}
              className="btn btn-secondary btn-sm"
              title="View DNS Records & Instructions"
              style={{ padding: '0.3rem 0.5rem' }}
            >
              DNS Info
            </button>

            {/* Delete Button */}
            <button
              onClick={() => setDeleteModal({ isOpen: true, domain: row })}
              className="btn btn-outline-danger btn-sm"
              title="Remove domain"
              style={{ padding: '0.3rem 0.5rem' }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Domains & Subdomain Routing</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            White-label custom domains, zero-config platform subdomains, and automated Cloudflare SSL certificates.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Quick Subdomain Provision Button */}
          <button
            onClick={() =>
              setSubdomainModal({
                isOpen: true,
                tenantId: tenants[0]?._id || tenants[0]?.id || '',
                subdomain: '',
              })
            }
            className="btn btn-secondary"
            title="Instantly generate a testing platform subdomain"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Allow Platform Subdomain</span>
          </button>

          {/* Add Custom Domain Button */}
          <button
            onClick={() =>
              setCreateModal({
                isOpen: true,
                tenantId: tenants[0]?._id || tenants[0]?.id || '',
                domain: '',
                isPrimary: false,
              })
            }
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Domain</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="tabs-nav" style={{ margin: 0 }}>
          <button
            className={`tab-btn ${domainTypeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setDomainTypeFilter('ALL')}
          >
            All Hostnames ({domains.length})
          </button>
          <button
            className={`tab-btn ${domainTypeFilter === 'CUSTOM' ? 'active' : ''}`}
            onClick={() => setDomainTypeFilter('CUSTOM')}
          >
            Custom Domains ({domains.filter((d) => d.isCustom).length})
          </button>
          <button
            className={`tab-btn ${domainTypeFilter === 'SUBDOMAIN' ? 'active' : ''}`}
            onClick={() => setDomainTypeFilter('SUBDOMAIN')}
          >
            Platform Subdomains ({domains.filter((d) => !d.isCustom).length})
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select
            className="form-select form-select-sm"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Verification Statuses</option>
            <option value="verified">Verified & Active</option>
            <option value="pending">Pending DNS Verification</option>
            <option value="failed">Verification Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredDomains}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPagination((p) => ({ ...p, page: 1 }));
        }}
        searchPlaceholder="Search domains, subdomains or assigned tenants..."
        pagination={{
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          onPageChange: (newPage) => setPagination((p) => ({ ...p, page: newPage })),
        }}
        emptyMessage="No domains registered in the platform routing registry."
      />

      {/* ══════════════════════════════════════════════════════════════════
          MODAL 1: ADD CUSTOM DOMAIN
          ══════════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={() => setCreateModal((p) => ({ ...p, isOpen: false }))}
        title="Register Custom White-Label Domain"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setCreateModal((p) => ({ ...p, isOpen: false }))}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateDomain} disabled={actionLoading}>
              {actionLoading ? 'Assigning...' : 'Register Domain'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateDomain}>
          <div className="form-group">
            <label className="form-label">Select Tenant Business</label>
            <select
              className="form-select"
              value={createModal.tenantId}
              onChange={(e) => setCreateModal((p) => ({ ...p, tenantId: e.target.value }))}
              required
            >
              <option value="">Select a salon tenant...</option>
              {tenants.map((t) => (
                <option key={t._id || t.id} value={t._id || t.id}>
                  {t.name} ({t.slug})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Custom Domain Hostname</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. blossom-salon.com or booking.blossom.in"
              value={createModal.domain}
              onChange={(e) => setCreateModal((p) => ({ ...p, domain: e.target.value }))}
              required
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Enter the exact domain or subdomain without http:// or trailing slashes.
            </span>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              id="isPrimaryModal"
              checked={createModal.isPrimary}
              onChange={(e) => setCreateModal((p) => ({ ...p, isPrimary: e.target.checked }))}
            />
            <label htmlFor="isPrimaryModal" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Set as primary production domain for this tenant
            </label>
          </div>
        </form>
      </Modal>

      {/* ══════════════════════════════════════════════════════════════════
          MODAL 2: PLATFORM SUBDOMAIN ALLOCATION
          ══════════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={subdomainModal.isOpen}
        onClose={() => setSubdomainModal((p) => ({ ...p, isOpen: false }))}
        title="Allow Platform Testing Subdomain"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setSubdomainModal((p) => ({ ...p, isOpen: false }))}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateSubdomain} disabled={actionLoading}>
              {actionLoading ? 'Allocating...' : 'Activate Subdomain'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateSubdomain}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Assign an instant pre-verified platform subdomain on your domain (e.g. <code>.yourplatform.com</code>) so the tenant can operate, book appointments, and test immediately without buying a domain.
          </p>

          <div className="form-group">
            <label className="form-label">Select Tenant</label>
            <select
              className="form-select"
              value={subdomainModal.tenantId}
              onChange={(e) => {
                const tId = e.target.value;
                const sel = tenants.find((t) => (t._id || t.id) === tId);
                setSubdomainModal((p) => ({
                  ...p,
                  tenantId: tId,
                  subdomain: sel?.slug || p.subdomain,
                }));
              }}
              required
            >
              <option value="">Select a tenant...</option>
              {tenants.map((t) => (
                <option key={t._id || t.id} value={t._id || t.id}>
                  {t.name} (Slug: {t.slug})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Subdomain Prefix</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                className="form-input"
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                placeholder="e.g. blossom-salon"
                value={subdomainModal.subdomain}
                onChange={(e) => setSubdomainModal((p) => ({ ...p, subdomain: e.target.value }))}
                required
              />
              <span
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-subtle)',
                  borderLeft: 'none',
                  padding: '0.625rem 0.85rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  borderTopRightRadius: 'var(--radius-md)',
                  borderBottomRightRadius: 'var(--radius-md)',
                  whiteSpace: 'nowrap',
                }}
              >
                .yourplatform.com
              </span>
            </div>
          </div>
        </form>
      </Modal>

      {/* ══════════════════════════════════════════════════════════════════
          MODAL 3: EDIT DOMAIN NAME & VERIFICATION STATUS
          ══════════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal((p) => ({ ...p, isOpen: false }))}
        title={`Edit Domain Settings: ${editModal.domain}`}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setEditModal((p) => ({ ...p, isOpen: false }))}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveEdit} disabled={actionLoading}>
              {actionLoading ? 'Saving...' : 'Update Domain'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveEdit}>
          <div className="form-group">
            <label className="form-label">Assigned Tenant</label>
            <input
              type="text"
              className="form-input"
              value={editModal.tenantName}
              disabled
              style={{ opacity: 0.7 }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Domain Hostname</label>
            <input
              type="text"
              className="form-input"
              value={editModal.domain}
              onChange={(e) => setEditModal((p) => ({ ...p, domain: e.target.value }))}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">DNS Status</label>
              <select
                className="form-select"
                value={editModal.status}
                onChange={(e) => setEditModal((p) => ({ ...p, status: e.target.value }))}
              >
                <option value="active">Active (Verified)</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending Verification</option>
                <option value="failed">Failed / Misconfigured</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">SSL Certificate Status</label>
              <select
                className="form-select"
                value={editModal.sslStatus}
                onChange={(e) => setEditModal((p) => ({ ...p, sslStatus: e.target.value }))}
              >
                <option value="active">TLS 1.3 Active (Auto-Renew)</option>
                <option value="pending">Pending Certificate Issuance</option>
                <option value="failed">SSL Failed</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="editIsPrimary"
                checked={editModal.isPrimary}
                onChange={(e) => setEditModal((p) => ({ ...p, isPrimary: e.target.checked }))}
              />
              <label htmlFor="editIsPrimary" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Set as Primary Production Domain
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="editIsCustom"
                checked={editModal.isCustom}
                onChange={(e) => setEditModal((p) => ({ ...p, isCustom: e.target.checked }))}
              />
              <label htmlFor="editIsCustom" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Is Custom White-Label Domain (Uncheck for Platform Subdomain)
              </label>
            </div>
          </div>
        </form>
      </Modal>

      {/* ══════════════════════════════════════════════════════════════════
          MODAL 4: DNS INSTRUCTIONS
          ══════════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={dnsModal.isOpen}
        onClose={() => setDnsModal({ isOpen: false, domain: null })}
        title={`DNS Routing Instructions: ${dnsModal.domain?.domain || ''}`}
        footer={
          <button className="btn btn-secondary" onClick={() => setDnsModal({ isOpen: false, domain: null })}>
            Close
          </button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Configure these DNS records at your domain registrar (GoDaddy, Cloudflare, Namecheap, etc.):
          </p>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '0.25rem' }}>
              CNAME Record (Primary Traffic Routing)
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Host / Name: <code>@</code> or <code>www</code></div>
            <div>Target Value: <code style={{ color: 'var(--primary)' }}>cname.yourplatform.com</code></div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '0.25rem' }}>
              TXT Record (SSL & Ownership Verification)
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Host / Name: <code>_verify.{dnsModal.domain?.domain}</code></div>
            <div>Target Value: <code style={{ color: 'var(--primary)' }}>verify-token-{dnsModal.domain?._id || 'beautysaas'}</code></div>
          </div>
        </div>
      </Modal>

      {/* ══════════════════════════════════════════════════════════════════
          MODAL 5: DELETE CONFIRMATION
          ══════════════════════════════════════════════════════════════════ */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, domain: null })}
        onConfirm={handleDeleteConfirm}
        title={`Remove Domain: ${deleteModal.domain?.domain || ''}`}
        message="Are you sure you want to remove this domain mapping? Any traffic routed to this domain will immediately cease to resolve."
        confirmText="Remove Domain"
        isLoading={actionLoading}
      />
    </div>
  );
};

export default DomainsList;
