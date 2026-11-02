/**
 * @file SubscriptionsList.jsx
 * @description Super Admin Tenant Subscriptions, Lifecycle Renewals, Extensions, and Cancellations
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { subscriptionsApi } from '../../../services/api/superadmin.api';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';
import Modal from '../../../components/Modal';
import ConfirmModal from '../../../components/ConfirmModal';
import { useToast } from '../../../context/ToastContext';
import { CreditCard, RefreshCw, Calendar, Slash } from 'lucide-react';

export const SubscriptionsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get('status') || '';

  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(statusParam);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  // Action Modals
  const [renewModal, setRenewModal] = useState({ isOpen: false, sub: null, billingCycle: 'MONTHLY' });
  const [extendModal, setExtendModal] = useState({ isOpen: false, sub: null, days: 14 });
  const [cancelModal, setCancelModal] = useState({ isOpen: false, sub: null, reason: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const { success, error } = useToast();

  const fetchSubscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await subscriptionsApi.list({
        page: pagination.page,
        limit: pagination.limit,
        search,
        status: selectedStatus || undefined,
      });
      setSubscriptions(res.data?.subscriptions || []);
      setPagination((p) => ({ ...p, total: res.data?.pagination?.total || 0 }));
    } catch (err) {
      error(err.message || 'Failed to fetch subscriptions');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, selectedStatus, error]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

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

  const columns = [
    {
      header: 'Tenant Name',
      accessor: 'tenantName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.tenantName || 'Tenant'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ID: {row.tenantId || row._id}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
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
              title="Cancel Subscription"
            >
              <Slash className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Subscription Management</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Manage multi-tenant billing cycles, renewals, extensions, and lifecycle status.
        </p>
      </div>

      <div className="tabs-nav">
        {[
          { label: 'All Subscriptions', value: '' },
          { label: 'Active', value: 'active' },
          { label: 'Trial', value: 'trialing' },
          { label: 'Past Due', value: 'past_due' },
          { label: 'Canceled', value: 'canceled' },
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
    </div>
  );
};

export default SubscriptionsList;
