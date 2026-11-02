/**
 * @file TenantsList.jsx
 * @description All Tenants Management Screen with Search, Filters, and Lifecycle Actions
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
  CheckCircle,
  Slash,
  Trash2,
  Database,
  ExternalLink,
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
  const [suspendModal, setSuspendModal] = useState({ isOpen: false, tenant: null, reason: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, tenant: null });
  const [actionLoading, setActionLoading] = useState(false);

  const { success, error } = useToast();

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
      setTenants(res.data?.tenants || []);
      setPagination((prev) => ({
        ...prev,
        total: res.data?.pagination?.total || 0,
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
      header: 'Owner',
      accessor: 'ownerName',
      render: (row) => (
        <div>
          <div style={{ fontSize: '0.85rem' }}>{row.ownerName || row.email}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Business Type',
      accessor: 'businessType',
      render: (row) => <span style={{ textTransform: 'capitalize' }}>{row.businessType || 'Salon'}</span>,
    },
    {
      header: 'DB Architecture',
      accessor: 'databaseMode',
      render: (row) => (
        <Badge
          status={row.databaseMode || 'SHARED'}
          variant={row.databaseMode === 'SEPARATE' ? 'separate' : 'shared'}
          text={row.databaseMode === 'SEPARATE' ? 'Separate DB' : 'Shared DB'}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <Link
              to={`/superadmin/tenants/${id}`}
              className="btn btn-secondary btn-sm"
              title="View Tenant Control Panel"
            >
              <Eye className="w-3.5 h-3.5" />
            </Link>

            {row.status === 'SUSPENDED' ? (
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
          <span>Add New Tenant</span>
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="tabs-nav">
        {[
          { label: 'All Tenants', value: '' },
          { label: 'Active', value: 'ACTIVE' },
          { label: 'Trial', value: 'TRIAL' },
          { label: 'Suspended', value: 'SUSPENDED' },
        ].map((tab) => (
          <button
            key={tab.label}
            className={`tab-btn ${selectedStatus === tab.value ? 'active' : ''}`}
            onClick={() => {
              setSelectedStatus(tab.value);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={tenants}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPagination((p) => ({ ...p, page: 1 }));
        }}
        searchPlaceholder="Search by name, slug or email..."
        filters={
          <select
            className="form-select"
            style={{ width: '180px' }}
            value={selectedDbMode}
            onChange={(e) => {
              setSelectedDbMode(e.target.value);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
          >
            <option value="">All DB Modes</option>
            <option value="SHARED">Shared Database</option>
            <option value="SEPARATE">Separate Database</option>
          </select>
        }
        pagination={{
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          onPageChange: (newPage) => setPagination((p) => ({ ...p, page: newPage })),
        }}
        emptyMessage="No tenants found matching criteria."
      />

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
