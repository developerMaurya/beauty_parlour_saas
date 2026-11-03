/**
 * @file TenantsList.jsx
 * @description All Tenants Management Screen with Search, Filters, Quick View, Quick Edit, and Lifecycle Actions
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { tenantsApi } from '../../../services/api/superadmin.api';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';
import ConfirmModal from '../../../components/ConfirmModal';
import Modal from '../../../components/Modal';
import { useToast } from '../../../context/ToastContext';
import {
  Building2,
  Plus,
  Eye,
  Edit2,
  CheckCircle,
  Slash,
  Trash2,
  Database,
  ExternalLink,
  Phone,
  Mail,
  User,
  Calendar,
  Globe,
  Layers,
  Sparkles,
} from 'lucide-react';

export const TenantsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get('status') || '';
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(statusParam);
  const [selectedDbMode, setSelectedDbMode] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  // Action Modals State
  const [viewModal, setViewModal] = useState({ isOpen: false, tenant: null });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    tenant: null,
    name: '',
    ownerName: '',
    email: '',
    phone: '',
    businessType: 'salon',
    databaseMode: 'shared',
    status: 'active',
  });
  const [suspendModal, setSuspendModal] = useState({ isOpen: false, tenant: null, reason: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, tenant: null });
  const [actionLoading, setActionLoading] = useState(false);

  const { success, error } = useToast();

  // Sync selectedStatus whenever statusParam changes in URL
  useEffect(() => {
    setSelectedStatus(statusParam);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [statusParam]);

  const fetchTenants = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await tenantsApi.list({
        page: pagination.page,
        limit: pagination.limit,
        search,
        status: selectedStatus || undefined,
        databaseMode: selectedDbMode || undefined,
      });
      const items = res.data?.items || res.data?.tenants || (Array.isArray(res.data) ? res.data : []);
      setTenants(items);
      setPagination((prev) => ({
        ...prev,
        total: res.data?.pagination?.total || items.length,
      }));
    } catch (err) {
      error(err.message || 'Failed to fetch tenants');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, selectedStatus, selectedDbMode, error]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const handleOpenEdit = (tenant) => {
    setEditModal({
      isOpen: true,
      tenant,
      name: tenant.name || '',
      ownerName: tenant.ownerName || '',
      email: tenant.email || '',
      phone: tenant.phone || '',
      businessType: tenant.businessType || 'salon',
      databaseMode: tenant.databaseMode || 'shared',
      status: tenant.status || 'active',
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editModal.tenant) return;
    setActionLoading(true);
    try {
      await tenantsApi.update(editModal.tenant._id || editModal.tenant.id, {
        name: editModal.name,
        ownerName: editModal.ownerName,
        email: editModal.email,
        phone: editModal.phone,
        businessType: editModal.businessType,
        databaseMode: editModal.databaseMode,
        status: editModal.status,
      });
      success(`Tenant "${editModal.name}" updated successfully in database!`);
      setEditModal({ isOpen: false, tenant: null });
      fetchTenants();
    } catch (err) {
      error(err.message || 'Failed to update tenant');
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivate = async (tenant) => {
    try {
      await tenantsApi.activate(tenant._id || tenant.id);
      success(`Tenant ${tenant.name} activated successfully`);
      fetchTenants();
    } catch (err) {
      error(err.message || 'Failed to activate tenant');
    }
  };

  const handleSuspendConfirm = async () => {
    if (!suspendModal.tenant) return;
    setActionLoading(true);
    try {
      await tenantsApi.suspend(suspendModal.tenant._id || suspendModal.tenant.id, suspendModal.reason);
      success(`Tenant ${suspendModal.tenant.name} suspended`);
      setSuspendModal({ isOpen: false, tenant: null, reason: '' });
      fetchTenants();
    } catch (err) {
      error(err.message || 'Failed to suspend tenant');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.tenant) return;
    setActionLoading(true);
    try {
      await tenantsApi.delete(deleteModal.tenant._id || deleteModal.tenant.id);
      success(`Tenant ${deleteModal.tenant.name} archived successfully`);
      setDeleteModal({ isOpen: false, tenant: null });
      fetchTenants();
    } catch (err) {
      error(err.message || 'Failed to delete tenant');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Business Name',
      accessor: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: '8px',
              background: 'rgba(99, 102, 241, 0.12)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
            }}
          >
            {row.name ? row.name.charAt(0).toUpperCase() : 'T'}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{row.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {row.slug}.beautysaas.local
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Owner & Contact',
      accessor: 'ownerName',
      render: (row) => (
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{row.ownerName || row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Business Type',
      accessor: 'businessType',
      render: (row) => (
        <span style={{ textTransform: 'capitalize', fontSize: '0.825rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)' }}>
          {row.businessType || 'Salon'}
        </span>
      ),
    },
    {
      header: 'DB Architecture',
      accessor: 'databaseMode',
      render: (row) => (
        <Badge
          status={row.databaseMode || 'SHARED'}
          variant={row.databaseMode === 'SEPARATE' || row.databaseMode === 'separate' ? 'separate' : 'shared'}
          text={row.databaseMode === 'SEPARATE' || row.databaseMode === 'separate' ? 'Separate DB' : 'Shared DB'}
        />
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status || 'ACTIVE'} />,
    },
    {
      header: 'Created Date',
      accessor: 'createdAt',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => {
        const id = row._id || row.id;
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
            <button
              onClick={() => setViewModal({ isOpen: true, tenant: row })}
              className="btn btn-secondary btn-sm"
              title="Quick View Tenant"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleOpenEdit(row)}
              className="btn btn-secondary btn-sm"
              title="Quick Edit Tenant"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <Link
              to={`/superadmin/tenants/${id}`}
              className="btn btn-secondary btn-sm"
              title="Open Tenant Control Center"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
            </Link>

            {row.status === 'SUSPENDED' || row.status === 'suspended' ? (
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleActivate(row)}
                title="Activate Tenant"
              >
                <CheckCircle className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setSuspendModal({ isOpen: true, tenant: row, reason: '' })}
                title="Suspend Tenant"
              >
                <Slash className="w-3.5 h-3.5 text-amber-400" />
              </button>
            )}

            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => setDeleteModal({ isOpen: true, tenant: row })}
              title="Delete / Archive Tenant"
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
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Tenant Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            White-label beauty parlours, salon chains, spas and training academies.
          </p>
        </div>
        <Link to="/superadmin/tenants/create" className="btn btn-primary">
          <Plus className="w-4 h-4" />
          <span>Provision Tenant</span>
        </Link>
      </div>


      {/* Table Card */}
      <div className="card" style={{ padding: 0 }}>
        <DataTable
          columns={columns}
          data={tenants}
          isLoading={isLoading}
          searchPlaceholder="Search by name, owner, email or slug..."
          searchValue={search}
          onSearchChange={setSearch}
          filters={
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                className="form-select form-select-sm"
                value={selectedDbMode}
                onChange={(e) => setSelectedDbMode(e.target.value)}
              >
                <option value="">All Architectures</option>
                <option value="SHARED">Mode A: Shared DB</option>
                <option value="SEPARATE">Mode B: Separate DB</option>
              </select>
            </div>
          }
          pagination={{
            page: pagination.page,
            limit: pagination.limit,
            total: pagination.total,
            onPageChange: (newPage) => setPagination((prev) => ({ ...prev, page: newPage })),
          }}
          emptyMessage="No tenants registered in the control plane."
        />
      </div>

      {/* QUICK VIEW MODAL */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, tenant: null })}
        title={`Tenant Profile: ${viewModal.tenant?.name || 'Details'}`}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Link
              to={`/superadmin/tenants/${viewModal.tenant?._id || viewModal.tenant?.id}`}
              className="btn btn-primary btn-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Full Control Center</span>
            </Link>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setViewModal({ isOpen: false, tenant: null })}
            >
              Close
            </button>
          </div>
        }
      >
        {viewModal.tenant && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div
                style={{
                  width: '3.25rem',
                  height: '3.25rem',
                  borderRadius: '10px',
                  background: 'var(--primary-gradient)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                }}
              >
                {viewModal.tenant.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.2rem' }}>{viewModal.tenant.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Slug: <strong>{viewModal.tenant.slug}</strong></span>
                  <span>•</span>
                  <Badge status={viewModal.tenant.status || 'ACTIVE'} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
              <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Owner / Administrator</div>
                <div style={{ fontWeight: 600 }}>{viewModal.tenant.ownerName || 'Not Assigned'}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '2px' }}>{viewModal.tenant.email}</div>
                {viewModal.tenant.phone && <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{viewModal.tenant.phone}</div>}
              </div>

              <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Architecture & Vertical</div>
                <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{viewModal.tenant.businessType || 'Salon & Spa'}</div>
                <div style={{ marginTop: '0.35rem' }}>
                  <Badge
                    status={viewModal.tenant.databaseMode || 'SHARED'}
                    variant={viewModal.tenant.databaseMode === 'SEPARATE' ? 'separate' : 'shared'}
                    text={viewModal.tenant.databaseMode === 'SEPARATE' ? 'Dedicated DB' : 'Shared Multi-Tenant DB'}
                  />
                </div>
              </div>

              <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Domain Address</div>
                <div style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#38BDF8' }}>
                  {viewModal.tenant.primaryDomain || `${viewModal.tenant.slug}.beautysaas.local`}
                </div>
              </div>

              <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Registered Date</div>
                <div style={{ fontWeight: 600 }}>{new Date(viewModal.tenant.createdAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* QUICK EDIT MODAL */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, tenant: null })}
        title={`Edit Tenant: ${editModal.tenant?.name || ''}`}
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditModal({ isOpen: false, tenant: null })}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveEdit}
              disabled={actionLoading}
            >
              {actionLoading ? 'Saving to Database...' : 'Save Changes'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveEdit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Business Name</label>
              <input
                type="text"
                className="form-input"
                value={editModal.name}
                onChange={(e) => setEditModal((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Owner Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={editModal.ownerName}
                  onChange={(e) => setEditModal((p) => ({ ...p, ownerName: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={editModal.phone}
                  onChange={(e) => setEditModal((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input
                type="email"
                className="form-input"
                value={editModal.email}
                onChange={(e) => setEditModal((p) => ({ ...p, email: e.target.value }))}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Vertical</label>
                <select
                  className="form-select"
                  value={editModal.businessType}
                  onChange={(e) => setEditModal((p) => ({ ...p, businessType: e.target.value }))}
                >
                  <option value="salon">Salon & Parlour</option>
                  <option value="spa">Spa & Wellness</option>
                  <option value="bridal">Bridal Studio</option>
                  <option value="academy">Academy / Training</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">DB Mode</label>
                <select
                  className="form-select"
                  value={editModal.databaseMode}
                  onChange={(e) => setEditModal((p) => ({ ...p, databaseMode: e.target.value }))}
                >
                  <option value="shared">Mode A: Shared</option>
                  <option value="separate">Mode B: Separate</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Lifecycle Status</label>
                <select
                  className="form-select"
                  value={editModal.status}
                  onChange={(e) => setEditModal((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="active">Active</option>
                  <option value="trial">Trial</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* Suspend Reason Modal */}
      <Modal
        isOpen={suspendModal.isOpen}
        onClose={() => setSuspendModal({ isOpen: false, tenant: null, reason: '' })}
        title={`Suspend Tenant: ${suspendModal.tenant?.name || ''}`}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setSuspendModal({ isOpen: false, tenant: null, reason: '' })}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={handleSuspendConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? 'Suspending...' : 'Confirm Suspension'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Suspension Reason</label>
          <textarea
            className="form-textarea"
            rows="3"
            placeholder="e.g. Terms violation, overdue payment, or administrative hold"
            value={suspendModal.reason}
            onChange={(e) => setSuspendModal((prev) => ({ ...prev, reason: e.target.value }))}
          />
          <div className="form-helper">
            Suspending will immediately disable customer and staff portal access for this tenant.
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, tenant: null })}
        onConfirm={handleDeleteConfirm}
        title={`Archive Tenant: ${deleteModal.tenant?.name || ''}`}
        message="Are you sure you want to archive this tenant? Their subscription will be terminated and data safely archived."
        confirmText="Archive Tenant"
        isLoading={actionLoading}
      />
    </div>
  );
};

export default TenantsList;
