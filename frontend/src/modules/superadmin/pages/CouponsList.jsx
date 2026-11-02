/**
 * @file CouponsList.jsx
 * @description Super Admin Promotional Discount Coupons & Voucher Code Management
 */

import React, { useState, useEffect, useCallback } from 'react';
import { couponsApi } from '../../../services/api/superadmin.api';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';
import Modal from '../../../components/Modal';
import ConfirmModal from '../../../components/ConfirmModal';
import { useToast } from '../../../context/ToastContext';
import { Tag, Plus, Edit2, Trash2 } from 'lucide-react';

export const CouponsList = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [couponModal, setCouponModal] = useState({
    isOpen: false,
    isEdit: false,
    id: null,
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    maxUses: 100,
    validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  });

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, coupon: null });
  const [actionLoading, setActionLoading] = useState(false);

  const { success, error } = useToast();

  const fetchCoupons = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await couponsApi.list({ search });
      setCoupons(res.data?.coupons || []);
    } catch (err) {
      error(err.message || 'Failed to fetch coupons');
    } finally {
      setIsLoading(false);
    }
  }, [search, error]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        code: couponModal.code.toUpperCase().trim(),
        discountType: couponModal.discountType,
        discountValue: Number(couponModal.discountValue),
        maxUses: Number(couponModal.maxUses),
        validUntil: couponModal.validUntil,
      };

      if (couponModal.isEdit && couponModal.id) {
        await couponsApi.update(couponModal.id, payload);
        success('Coupon updated successfully');
      } else {
        await couponsApi.create(payload);
        success('New coupon code created');
      }

      setCouponModal({ isOpen: false, isEdit: false, id: null });
      fetchCoupons();
    } catch (err) {
      error(err.message || 'Failed to save coupon');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.coupon) return;
    setActionLoading(true);
    try {
      await couponsApi.delete(deleteModal.coupon._id || deleteModal.coupon.id);
      success('Coupon archived');
      setDeleteModal({ isOpen: false, coupon: null });
      fetchCoupons();
    } catch (err) {
      error(err.message || 'Failed to delete coupon');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Promo Code',
      accessor: 'code',
      render: (row) => (
        <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary)', letterSpacing: '0.05em' }}>
          {row.code}
        </span>
      ),
    },
    {
      header: 'Discount',
      accessor: 'discountValue',
      render: (row) => (
        <span style={{ fontWeight: 600 }}>
          {row.discountType === 'PERCENTAGE' ? `${row.discountValue}% OFF` : `$${row.discountValue} OFF`}
        </span>
      ),
    },
    {
      header: 'Redemptions',
      accessor: 'usedCount',
      render: (row) => (
        <span style={{ fontSize: '0.85rem' }}>
          {row.usedCount || 0} / {row.maxUses || 'Unlimited'}
        </span>
      ),
    },
    {
      header: 'Expiration Date',
      accessor: 'validUntil',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {row.validUntil ? new Date(row.validUntil).toLocaleDateString() : 'Never'}
        </span>
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
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button
            onClick={() =>
              setCouponModal({
                isOpen: true,
                isEdit: true,
                id: row._id || row.id,
                code: row.code,
                discountType: row.discountType || 'PERCENTAGE',
                discountValue: row.discountValue,
                maxUses: row.maxUses || 100,
                validUntil: row.validUntil ? row.validUntil.split('T')[0] : '',
              })
            }
            className="btn btn-secondary btn-sm"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteModal({ isOpen: true, coupon: row })}
            className="btn btn-outline-danger btn-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Coupons & Promotions</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Create promotional discount codes for marketing campaigns and onboarding discounts.
          </p>
        </div>
        <button
          onClick={() =>
            setCouponModal({
              isOpen: true,
              isEdit: false,
              id: null,
              code: 'BEAUTY20',
              discountType: 'PERCENTAGE',
              discountValue: 20,
              maxUses: 100,
              validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
            })
          }
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={coupons}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search coupon code..."
        emptyMessage="No promotional coupons created."
      />

      {/* Coupon Modal */}
      <Modal
        isOpen={couponModal.isOpen}
        onClose={() => setCouponModal((p) => ({ ...p, isOpen: false }))}
        title={couponModal.isEdit ? 'Edit Coupon' : 'Create Promo Coupon'}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setCouponModal((p) => ({ ...p, isOpen: false }))}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveCoupon} disabled={actionLoading}>
              {actionLoading ? 'Saving...' : 'Save Coupon'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveCoupon}>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Coupon Code *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. SUMMER50"
                value={couponModal.code}
                onChange={(e) => setCouponModal((p) => ({ ...p, code: e.target.value }))}
                style={{ textTransform: 'uppercase' }}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Discount Type</label>
              <select
                className="form-select"
                value={couponModal.discountType}
                onChange={(e) => setCouponModal((p) => ({ ...p, discountType: e.target.value }))}
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount ($)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Discount Value</label>
              <input
                type="number"
                className="form-input"
                min="1"
                value={couponModal.discountValue}
                onChange={(e) => setCouponModal((p) => ({ ...p, discountValue: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Allowed Redemptions</label>
              <input
                type="number"
                className="form-input"
                min="1"
                value={couponModal.maxUses}
                onChange={(e) => setCouponModal((p) => ({ ...p, maxUses: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Valid Until</label>
            <input
              type="date"
              className="form-input"
              value={couponModal.validUntil}
              onChange={(e) => setCouponModal((p) => ({ ...p, validUntil: e.target.value }))}
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, coupon: null })}
        onConfirm={handleDeleteConfirm}
        title={`Archive Coupon: ${deleteModal.coupon?.code || ''}`}
        message="Are you sure you want to deactivate and archive this coupon?"
        confirmText="Archive Coupon"
        isLoading={actionLoading}
      />
    </div>
  );
};

export default CouponsList;
