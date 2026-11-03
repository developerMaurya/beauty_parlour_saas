/**
 * @file SubscriptionsList.jsx
 * @description Super Admin Tenant Subscriptions, Lifecycle Renewals, Extensions, Assignments, and Cancellations
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { subscriptionsApi, tenantsApi, plansApi } from '../../../services/api/superadmin.api';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';
import Modal from '../../../components/Modal';
import ConfirmModal from '../../../components/ConfirmModal';
import { useToast } from '../../../context/ToastContext';
import { CreditCard, RefreshCw, Calendar, Slash, Plus, Trash2, CheckCircle, Eye } from 'lucide-react';

export const SubscriptionsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get('status') || '';
  const activeTabParam = searchParams.get('tab') || '';

  const [subscriptions, setSubscriptions] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(statusParam);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  // Modals
  const [viewModal, setViewModal] = useState({ isOpen: false, sub: null });
  const [assignModal, setAssignModal] = useState({
    isOpen: false,
    tenantId: '',
    planId: '',
    billingCycle: 'monthly',
    status: 'active',
  });

  // Action Modals
  const [renewModal, setRenewModal] = useState({ isOpen: false, sub: null, billingCycle: 'MONTHLY' });
  const [extendModal, setExtendModal] = useState({ isOpen: false, sub: null, days: 14 });
  const [cancelModal, setCancelModal] = useState({ isOpen: false, sub: null, reason: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, sub: null });
  const [actionLoading, setActionLoading] = useState(false);

  const { success, error } = useToast();

  // Sync selectedStatus with URL params
  useEffect(() => {
    setSelectedStatus(statusParam);
    setPagination((p) => ({ ...p, page: 1 }));
  }, [statusParam]);

  // Handle action=create query param
  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setAssignModal({
        isOpen: true,
        tenantId: tenants[0]?._id || '',
        planId: plans[0]?._id || '',
        billingCycle: 'monthly',
        status: 'active',
      });
    }
  }, [searchParams, tenants, plans]);

  const fetchSubscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const [subRes, tenRes, planRes] = await Promise.all([
        subscriptionsApi.list({
          page: pagination.page,
          limit: pagination.limit,
          search,
          status: selectedStatus || undefined,
        }),
        tenantsApi.list({ limit: 100 }).catch(() => ({ data: { tenants: [] } })),
        plansApi.list({ limit: 100 }).catch(() => ({ data: { plans: [] } })),
      ]);

      const subItems = subRes.data?.subscriptions || subRes.data?.items || (Array.isArray(subRes.data) ? subRes.data : []);
      const formattedSubs = subItems.map((sub) => ({
        ...sub,
        tenantName: sub.tenantId?.name || sub.tenantName || 'Tenant',
        tenantSlug: sub.tenantId?.slug || '',
        planName: sub.planId?.name || sub.planName || 'Plan',
        price: sub.amount !== undefined ? sub.amount : (sub.price !== undefined ? sub.price : (sub.planId?.priceMonthly || 49)),
      }));
      setSubscriptions(formattedSubs);
      setTenants(Array.isArray(tenRes.data) ? tenRes.data : (tenRes.data?.tenants || tenRes.data?.items || []));
      setPlans(Array.isArray(planRes.data) ? planRes.data : (planRes.data?.plans || planRes.data?.items || []));
      setPagination((p) => ({ ...p, total: subRes.data?.pagination?.total || subItems.length }));
    } catch (err) {
      error(err.message || 'Failed to fetch subscriptions');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, selectedStatus, error]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleAssignSubscription = async (e) => {
    e.preventDefault();
    if (!assignModal.tenantId || !assignModal.planId) {
      error('Please select both a tenant and a plan');
      return;
    }
    setActionLoading(true);
    try {
      await subscriptionsApi.create({
        tenantId: assignModal.tenantId,
        planId: assignModal.planId,
        billingCycle: assignModal.billingCycle,
        status: assignModal.status,
      });
      success('Subscription plan successfully assigned to tenant');
      setAssignModal({ isOpen: false, tenantId: '', planId: '', billingCycle: 'monthly', status: 'active' });
      fetchSubscriptions();
    } catch (err) {
      error(err.message || 'Failed to create subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRenew = async () => {
    if (!renewModal.sub) return;
    setActionLoading(true);
    try {
      await subscriptionsApi.renew(renewModal.sub._id || renewModal.sub.id, {
        billingCycle: renewModal.billingCycle,
      });
      success('Subscription renewed for next term successfully');
      setRenewModal({ isOpen: false, sub: null, billingCycle: 'MONTHLY' });
      fetchSubscriptions();
    } catch (err) {
      error(err.message || 'Failed to renew subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExtend = async () => {
    if (!extendModal.sub) return;
    setActionLoading(true);
    try {
      await subscriptionsApi.extend(extendModal.sub._id || extendModal.sub.id, Number(extendModal.days));
      success(`Subscription extended by ${extendModal.days} days`);
      setExtendModal({ isOpen: false, sub: null, days: 14 });
      fetchSubscriptions();
    } catch (err) {
      error(err.message || 'Failed to extend subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelModal.sub) return;
    setActionLoading(true);
    try {
      await subscriptionsApi.cancel(cancelModal.sub._id || cancelModal.sub.id, cancelModal.reason);
      success('Subscription cancelled');
      setCancelModal({ isOpen: false, sub: null, reason: '' });
      fetchSubscriptions();
    } catch (err) {
      error(err.message || 'Failed to cancel subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.sub) return;
    setActionLoading(true);
    try {
      // Set status to cancelled / archived
      await subscriptionsApi.cancel(deleteModal.sub._id || deleteModal.sub.id, 'SuperAdmin terminated subscription');
      success('Subscription removed successfully');
      setDeleteModal({ isOpen: false, sub: null });
      fetchSubscriptions();
    } catch (err) {
      error(err.message || 'Failed to remove subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Tenant Name',
      accessor: 'tenantName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.tenantName || 'Tenant'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {row.tenantSlug ? `${row.tenantSlug}.beautysaas.local` : `ID: ${row.tenantId?._id || (typeof row.tenantId === 'string' ? row.tenantId : row._id)}`}
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Plan',
      accessor: 'planName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.planName || 'Growth Tier'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ${row.price || 49} / {row.billingCycle?.toLowerCase() || 'month'}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status || 'ACTIVE'} />,
    },
    {
      header: 'Term Dates',
      accessor: 'startDate',
      render: (row) => (
        <div style={{ fontSize: '0.8rem' }}>
          <div>{new Date(row.startDate).toLocaleDateString()}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            until {new Date(row.endDate).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
            <button
              onClick={() => setViewModal({ isOpen: true, sub: row })}
              className="btn btn-secondary btn-sm"
              title="View Subscription Details"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setRenewModal({ isOpen: true, sub: row, billingCycle: row.billingCycle || 'MONTHLY' })}
              className="btn btn-secondary btn-sm"
              title="Renew Subscription"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setExtendModal({ isOpen: true, sub: row, days: 14 })}
              className="btn btn-secondary btn-sm"
              title="Extend Trial / Grace Period"
            >
              <Calendar className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCancelModal({ isOpen: true, sub: row, reason: '' })}
              className="btn btn-outline-danger btn-sm"
              title="Suspend / Cancel Subscription"
            >
              <Slash className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeleteModal({ isOpen: true, sub: row })}
              className="btn btn-outline-danger btn-sm"
              title="Delete Subscription"
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
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Subscriptions</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Manage multi-tenant billing cycles, renewals, extensions, and lifecycle status.
          </p>
        </div>
        <button
          onClick={() =>
            setAssignModal({
              isOpen: true,
              tenantId: tenants[0]?._id || '',
              planId: plans[0]?._id || '',
              billingCycle: 'monthly',
              status: 'active',
            })
          }
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Assign Subscription</span>
        </button>
      </div>


      <DataTable
        columns={columns}
        data={subscriptions}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPagination((p) => ({ ...p, page: 1 }));
        }}
        searchPlaceholder="Search by tenant name..."
        pagination={{
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          onPageChange: (newPage) => setPagination((p) => ({ ...p, page: newPage })),
        }}
        emptyMessage="No subscriptions found."
      />

      {/* Assign / Create Subscription Modal */}
      <Modal
        isOpen={assignModal.isOpen}
        onClose={() => setAssignModal((p) => ({ ...p, isOpen: false }))}
        title="Assign Subscription Plan to Tenant"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setAssignModal((p) => ({ ...p, isOpen: false }))}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleAssignSubscription}
              disabled={actionLoading}
            >
              {actionLoading ? 'Assigning...' : 'Assign Subscription'}
            </button>
          </>
        }
      >
        <form onSubmit={handleAssignSubscription} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Select Tenant Business</label>
            <select
              className="form-select"
              value={assignModal.tenantId}
              onChange={(e) => setAssignModal((p) => ({ ...p, tenantId: e.target.value }))}
              required
            >
              <option value="">-- Choose Tenant --</option>
              {tenants.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.slug})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Select Subscription Plan</label>
            <select
              className="form-select"
              value={assignModal.planId}
              onChange={(e) => setAssignModal((p) => ({ ...p, planId: e.target.value }))}
              required
            >
              <option value="">-- Choose Plan --</option>
              {plans.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} - ${p.priceMonthly || p.price}/mo
                </option>
              ))}
            </select>
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Billing Cycle</label>
              <select
                className="form-select"
                value={assignModal.billingCycle}
                onChange={(e) => setAssignModal((p) => ({ ...p, billingCycle: e.target.value }))}
              >
                <option value="monthly">Monthly Cycle</option>
                <option value="yearly">Annual Cycle (Yearly)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Initial Status</label>
              <select
                className="form-select"
                value={assignModal.status}
                onChange={(e) => setAssignModal((p) => ({ ...p, status: e.target.value }))}
              >
                <option value="active">Active (Paid)</option>
                <option value="trial">14-Day Free Trial</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Renew Modal */}
      <Modal
        isOpen={renewModal.isOpen}
        onClose={() => setRenewModal({ isOpen: false, sub: null, billingCycle: 'MONTHLY' })}
        title={`Renew Subscription: ${renewModal.sub?.tenantName || ''}`}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setRenewModal({ isOpen: false, sub: null, billingCycle: 'MONTHLY' })}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleRenew} disabled={actionLoading}>
              {actionLoading ? 'Renewing...' : 'Confirm Renewal'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Select Renewal Billing Cycle</label>
          <select
            className="form-select"
            value={renewModal.billingCycle}
            onChange={(e) => setRenewModal((p) => ({ ...p, billingCycle: e.target.value }))}
          >
            <option value="MONTHLY">Monthly (+1 Month)</option>
            <option value="YEARLY">Yearly (+1 Year)</option>
          </select>
        </div>
      </Modal>

      {/* Extend Modal */}
      <Modal
        isOpen={extendModal.isOpen}
        onClose={() => setExtendModal({ isOpen: false, sub: null, days: 14 })}
        title={`Extend Subscription: ${extendModal.sub?.tenantName || ''}`}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setExtendModal({ isOpen: false, sub: null, days: 14 })}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleExtend} disabled={actionLoading}>
              {actionLoading ? 'Extending...' : 'Extend Days'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Days to Add to Expiration</label>
          <input
            type="number"
            className="form-input"
            min="1"
            max="180"
            value={extendModal.days}
            onChange={(e) => setExtendModal((p) => ({ ...p, days: e.target.value }))}
          />
        </div>
      </Modal>

      {/* Cancel Confirmation */}
      <Modal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, sub: null, reason: '' })}
        title={`Cancel Subscription: ${cancelModal.sub?.tenantName || ''}`}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setCancelModal({ isOpen: false, sub: null, reason: '' })}
              disabled={actionLoading}
            >
              Back
            </button>
            <button className="btn btn-danger" onClick={handleCancel} disabled={actionLoading}>
              {actionLoading ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Cancellation Reason</label>
          <textarea
            className="form-textarea"
            rows="3"
            placeholder="Reason for cancellation..."
            value={cancelModal.reason}
            onChange={(e) => setCancelModal((p) => ({ ...p, reason: e.target.value }))}
          />
        </div>
      </Modal>

      {/* View Subscription Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, sub: null })}
        title={`Subscription Details: ${viewModal.sub?.tenantName || ''}`}
        footer={
          <button className="btn btn-secondary btn-sm" onClick={() => setViewModal({ isOpen: false, sub: null })}>
            Close
          </button>
        }
      >
        {viewModal.sub && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.06)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.2rem' }}>{viewModal.sub.tenantName}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Plan: <strong>{viewModal.sub.planName}</strong>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                  {viewModal.sub.currency === 'INR' ? '₹' : '$'}{(viewModal.sub.price || 49).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  Billing: {viewModal.sub.billingCycle || 'Monthly'}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</div>
                <div style={{ marginTop: '0.3rem' }}><Badge status={viewModal.sub.status || 'ACTIVE'} /></div>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto Renewal</div>
                <div style={{ fontWeight: 600, marginTop: '0.3rem', color: viewModal.sub.autoRenew !== false ? '#10B981' : '#F59E0B' }}>
                  {viewModal.sub.autoRenew !== false ? 'Enabled (Automatic)' : 'Disabled (Manual)'}
                </div>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Term Start Date</div>
                <div style={{ fontWeight: 600, marginTop: '0.2rem' }}>{new Date(viewModal.sub.startDate).toLocaleDateString()}</div>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Term Expiration Date</div>
                <div style={{ fontWeight: 600, marginTop: '0.2rem', color: '#F59E0B' }}>{new Date(viewModal.sub.endDate).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete / Terminate Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, sub: null })}
        onConfirm={handleDelete}
        title="Terminate Subscription"
        message={`Are you sure you want to terminate the subscription for ${deleteModal.sub?.tenantName || 'this tenant'}?`}
        confirmText="Terminate Subscription"
        isDanger={true}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default SubscriptionsList;
