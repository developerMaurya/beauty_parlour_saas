/**
 * @file UsageView.jsx
 * @description Super Admin Resource Quotas, Capacity Utilization, and Platform Telemetry
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usageApi } from '../../../services/api/superadmin.api';
import DataTable from '../../../components/DataTable';
import StatCard from '../../../components/StatCard';
import Modal from '../../../components/Modal';
import { useToast } from '../../../context/ToastContext';
import { Activity, Users, Database, HardDrive, Edit2 } from 'lucide-react';

export const UsageView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'platform';

  const [overview, setOverview] = useState({});
  const [tenantUsage, setTenantUsage] = useState([]);
  const [limits, setLimits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Tenant Limit Modal
  const [editLimitModal, setEditLimitModal] = useState({
    isOpen: false,
    tenantId: '',
    tenantName: '',
    maxStaff: 10,
    maxClients: 1000,
    maxStorageMb: 5000,
  });

  const [actionLoading, setActionLoading] = useState(false);
  const { success, error } = useToast();

  const fetchUsageData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [overRes, tenRes, limRes] = await Promise.all([
        usageApi.getOverview().catch(() => ({ data: {} })),
        usageApi.getTenantsUsage().catch(() => ({ data: { usage: [] } })),
        usageApi.listLimits().catch(() => ({ data: { limits: [] } })),
      ]);

      setOverview(overRes.data || {});
      setTenantUsage(tenRes.data?.usage || []);
      setLimits(limRes.data?.limits || []);
    } catch (err) {
      error(err.message || 'Failed to fetch usage data');
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchUsageData();
  }, [fetchUsageData]);

  const handleSaveTenantLimits = async (e) => {
    e.preventDefault();
    if (!editLimitModal.tenantId) return;
    setActionLoading(true);
    try {
      await usageApi.updateTenantLimits(editLimitModal.tenantId, {
        maxStaff: Number(editLimitModal.maxStaff),
        maxClients: Number(editLimitModal.maxClients),
        maxStorageMb: Number(editLimitModal.maxStorageMb),
      });
      success('Tenant resource limits updated');
      setEditLimitModal({ isOpen: false, tenantId: '', tenantName: '' });
      fetchUsageData();
    } catch (err) {
      error(err.message || 'Failed to update limits');
    } finally {
      setActionLoading(false);
    }
  };

  const tenantColumns = [
    {
      header: 'Tenant Name',
      accessor: 'tenantName',
      render: (row) => (
        <span style={{ fontWeight: 600 }}>{row.tenantName || 'Tenant'}</span>
      ),
    },
    {
      header: 'Staff Utilization',
      accessor: 'staffCount',
      render: (row) => (
        <div>
          <div style={{ fontSize: '0.85rem' }}>
            {row.staffCount || 0} / {row.maxStaff || 10} staff
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', marginTop: '4px', width: '120px' }}>
            <div
              style={{
                height: '100%',
                width: `${Math.min(100, ((row.staffCount || 0) / (row.maxStaff || 10)) * 100)}%`,
                background: 'var(--primary)',
                borderRadius: '4px',
              }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Client Records',
      accessor: 'clientsCount',
      render: (row) => (
        <span style={{ fontSize: '0.85rem' }}>
          {row.clientsCount || 0} / {row.maxClients || 1000}
        </span>
      ),
    },
    {
      header: 'Storage Used',
      accessor: 'storageMb',
      render: (row) => (
        <span style={{ fontSize: '0.85rem' }}>
          {row.storageMb || 0} MB / {row.maxStorageMb || 2048} MB
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <button
          onClick={() =>
            setEditLimitModal({
              isOpen: true,
              tenantId: row.tenantId || row._id,
              tenantName: row.tenantName || 'Tenant',
              maxStaff: row.maxStaff || 10,
              maxClients: row.maxClients || 1000,
              maxStorageMb: row.maxStorageMb || 2048,
            })
          }
          className="btn btn-secondary btn-sm"
        >
          <Edit2 className="w-3.5 h-3.5" /> Limits
        </button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Usage & Capacity Limits</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Platform infrastructure telemetry, tenant resource consumption, and fair-use enforcement.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid-cols-4">
        <StatCard
          title="Total Active Tenants"
          value={overview.totalTenants || tenantUsage.length || 0}
          icon={Activity}
        />
        <StatCard
          title="Staff Seats Allocated"
          value={overview.totalStaff || 0}
          icon={Users}
        />
        <StatCard
          title="Clients Managed"
          value={overview.totalClients || 0}
          icon={Users}
        />
        <StatCard
          title="Storage Consumed"
          value={`${(overview.totalStorageMb || 0).toLocaleString()} MB`}
          icon={HardDrive}
        />
      </div>

      {/* Tabs */}
      <div className="tabs-nav">
        {[
          { id: 'platform', label: 'Platform Telemetry' },
          { id: 'tenants', label: 'Tenant Resource Quotas' },
          { id: 'limits', label: 'Global Limits' },
          { id: 'reports', label: 'Usage Reports' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setSearchParams({ tab: tab.id })}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tenants Table */}
      <DataTable
        columns={tenantColumns}
        data={tenantUsage}
        isLoading={isLoading}
        emptyMessage="No tenant telemetry logged."
      />

      {/* Edit Limit Modal */}
      <Modal
        isOpen={editLimitModal.isOpen}
        onClose={() => setEditLimitModal((p) => ({ ...p, isOpen: false }))}
        title={`Adjust Limits: ${editLimitModal.tenantName}`}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setEditLimitModal((p) => ({ ...p, isOpen: false }))}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveTenantLimits} disabled={actionLoading}>
              {actionLoading ? 'Saving...' : 'Update Limits'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveTenantLimits}>
          <div className="form-group">
            <label className="form-label">Max Staff Accounts</label>
            <input
              type="number"
              className="form-input"
              value={editLimitModal.maxStaff}
              onChange={(e) => setEditLimitModal((p) => ({ ...p, maxStaff: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Max Clients Quota</label>
            <input
              type="number"
              className="form-input"
              value={editLimitModal.maxClients}
              onChange={(e) => setEditLimitModal((p) => ({ ...p, maxClients: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Storage Capacity (MB)</label>
            <input
              type="number"
              className="form-input"
              value={editLimitModal.maxStorageMb}
              onChange={(e) => setEditLimitModal((p) => ({ ...p, maxStorageMb: e.target.value }))}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsageView;
