/**
 * @file PlansList.jsx
 * @description Super Admin Subscription Plans, Tiers, Feature Assignments, and Resource Limits
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { plansApi } from '../../../services/api/superadmin.api';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';
import Modal from '../../../components/Modal';
import ConfirmModal from '../../../components/ConfirmModal';
import { useToast } from '../../../context/ToastContext';
import { Layers, Plus, Edit2, Trash2, CheckCircle, Sliders, Shield } from 'lucide-react';

export const PlansList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'all';

  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  // Modals
  const [planModal, setPlanModal] = useState({
    isOpen: false,
    isEdit: false,
    id: null,
    name: '',
    code: '',
    description: '',
    price: 49,
    billingCycle: 'MONTHLY',
    isPopular: false,
    maxBranches: 1,
    maxStaff: 5,
    maxClients: 500,
    maxStorageMb: 2048,
  });

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, plan: null });
  const [actionLoading, setActionLoading] = useState(false);

  const { success, error } = useToast();

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await plansApi.list({
        page: pagination.page,
        limit: pagination.limit,
        search,
      });
      setPlans(res.data?.plans || []);
      setPagination((p) => ({ ...p, total: res.data?.pagination?.total || 0 }));
    } catch (err) {
      error(err.message || 'Failed to fetch plans');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, error]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleSavePlan = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        name: planModal.name,
        code: planModal.code || planModal.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: planModal.description,
        price: Number(planModal.price),
        billingCycle: planModal.billingCycle,
        isPopular: planModal.isPopular,
        limits: {
          maxBranches: Number(planModal.maxBranches),
          maxStaff: Number(planModal.maxStaff),
          maxClients: Number(planModal.maxClients),
          maxStorageMb: Number(planModal.maxStorageMb),
        },
      };

      if (planModal.isEdit && planModal.id) {
        await plansApi.update(planModal.id, payload);
        success('Subscription plan updated successfully');
      } else {
        await plansApi.create(payload);
        success('New subscription plan created successfully');
      }

      setPlanModal({ isOpen: false, isEdit: false, id: null });
      fetchPlans();
    } catch (err) {
      error(err.message || 'Failed to save plan');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.plan) return;
    setActionLoading(true);
    try {
      await plansApi.delete(deleteModal.plan._id || deleteModal.plan.id);
      success('Plan archived successfully');
      setDeleteModal({ isOpen: false, plan: null });
      fetchPlans();
    } catch (err) {
      error(err.message || 'Failed to delete plan');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Plan Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{row.name}</span>
            {row.isPopular && <Badge status="ACTIVE" text="Popular" />}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.code}</div>
        </div>
      ),
    },
    {
      header: 'Pricing',
      accessor: 'price',
      render: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>
          ${row.price} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>/{row.billingCycle?.toLowerCase() || 'mo'}</span>
        </span>
      ),
    },
    {
      header: 'Quotas & Limits',
      accessor: 'limits',
      render: (row) => (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          {row.limits?.maxStaff || 5} Staff • {row.limits?.maxBranches || 1} Branch • {row.limits?.maxClients || 500} Clients
        </div>
      ),
    },
    {
      header: 'Tenants Subscribed',
      accessor: 'tenantCount',
      render: (row) => (
        <span style={{ fontWeight: 600 }}>{row.tenantCount || 0}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status || 'ACTIVE'} />,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => {
        const id = row._id || row.id;
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button
              onClick={() =>
                setPlanModal({
                  isOpen: true,
                  isEdit: true,
                  id,
                  name: row.name,
                  code: row.code,
                  description: row.description || '',
                  price: row.price,
                  billingCycle: row.billingCycle || 'MONTHLY',
                  isPopular: !!row.isPopular,
                  maxBranches: row.limits?.maxBranches || 1,
                  maxStaff: row.limits?.maxStaff || 5,
                  maxClients: row.limits?.maxClients || 500,
                  maxStorageMb: row.limits?.maxStorageMb || 2048,
                })
              }
              className="btn btn-secondary btn-sm"
              title="Edit Plan"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeleteModal({ isOpen: true, plan: row })}
              className="btn btn-outline-danger btn-sm"
              title="Delete Plan"
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Plan Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Define subscription tiers, pricing packages, feature access matrices, and quotas.
          </p>
        </div>
        <button
          onClick={() =>
            setPlanModal({
              isOpen: true,
              isEdit: false,
              id: null,
              name: '',
              code: '',
              description: '',
              price: 49,
              billingCycle: 'MONTHLY',
              isPopular: false,
              maxBranches: 1,
              maxStaff: 5,
              maxClients: 500,
              maxStorageMb: 2048,
            })
          }
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Plan</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={plans}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPagination((p) => ({ ...p, page: 1 }));
        }}
        searchPlaceholder="Search plans by name or code..."
        pagination={{
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          onPageChange: (newPage) => setPagination((p) => ({ ...p, page: newPage })),
        }}
        emptyMessage="No subscription plans found."
      />

      {/* Create / Edit Plan Modal */}
      <Modal
        isOpen={planModal.isOpen}
        onClose={() => setPlanModal((p) => ({ ...p, isOpen: false }))}
        title={planModal.isEdit ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
        size="large"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setPlanModal((p) => ({ ...p, isOpen: false }))}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSavePlan} disabled={actionLoading}>
              {actionLoading ? 'Saving Plan...' : 'Save Plan'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSavePlan}>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Plan Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Enterprise Salon Chain"
                value={planModal.name}
                onChange={(e) => setPlanModal((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Plan Code (Unique Slug)</label>
              <input
                type="text"
                className="form-input"
                placeholder="enterprise-chain"
                value={planModal.code}
                onChange={(e) => setPlanModal((p) => ({ ...p, code: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Price ($)</label>
              <input
                type="number"
                className="form-input"
                min="0"
                value={planModal.price}
                onChange={(e) => setPlanModal((p) => ({ ...p, price: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Billing Cycle</label>
              <select
                className="form-select"
                value={planModal.billingCycle}
                onChange={(e) => setPlanModal((p) => ({ ...p, billingCycle: e.target.value }))}
              >
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Plan Description</label>
            <textarea
              className="form-textarea"
              rows="2"
              placeholder="Highlight key value propositions..."
              value={planModal.description}
              onChange={(e) => setPlanModal((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          <h4 style={{ fontSize: '0.95rem', marginTop: '1rem', marginBottom: '0.75rem' }}>Resource Limits</h4>
          <div className="grid-cols-4">
            <div className="form-group">
              <label className="form-label">Max Branches</label>
              <input
                type="number"
                className="form-input"
                value={planModal.maxBranches}
                onChange={(e) => setPlanModal((p) => ({ ...p, maxBranches: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Max Staff</label>
              <input
                type="number"
                className="form-input"
                value={planModal.maxStaff}
                onChange={(e) => setPlanModal((p) => ({ ...p, maxStaff: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Max Clients</label>
              <input
                type="number"
                className="form-input"
                value={planModal.maxClients}
                onChange={(e) => setPlanModal((p) => ({ ...p, maxClients: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Storage (MB)</label>
              <input
                type="number"
                className="form-input"
                value={planModal.maxStorageMb}
                onChange={(e) => setPlanModal((p) => ({ ...p, maxStorageMb: e.target.value }))}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, plan: null })}
        onConfirm={handleDeleteConfirm}
        title={`Archive Plan: ${deleteModal.plan?.name || ''}`}
        message="Are you sure you want to archive this plan? Existing subscriptions will remain active until end of term."
        confirmText="Archive Plan"
        isLoading={actionLoading}
      />
    </div>
  );
};

export default PlansList;
