/**
 * @file PackagesOffersPage.jsx
 * @description Dynamic Packages with Custom Text Inclusions, Offers, and Customer Coupons.
 * Conforms to Sections 27, 28, 51.
 * @module frontend/src/modules/admin/pages/PackagesOffersPage
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Copy, Sparkles, Tag, Ticket, CheckCircle, Ban } from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';
import {
  packageFetcher,
  offerFetcher,
  couponFetcher,
  serviceFetcher,
  branchFetcher,
} from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';

export const PackagesOffersPage = () => {
  const { selectedBranchId } = useTenantAdmin();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('packages'); // 'packages' | 'offers' | 'coupons'

  const [packages, setPackages] = useState([]);
  const [offers, setOffers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [pkgModalOpen, setPkgModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);

  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [sRes, bRes] = await Promise.all([
        serviceFetcher.list({ limit: 100 }),
        branchFetcher.list(),
      ]);
      setServices(sRes.data || []);
      setBranches(bRes.data || []);

      if (activeTab === 'packages') {
        const pRes = await packageFetcher.list({ branchId: selectedBranchId || undefined });
        setPackages(pRes.data || []);
      } else if (activeTab === 'offers') {
        const oRes = await offerFetcher.list({ branchId: selectedBranchId || undefined });
        setOffers(oRes.data || []);
      } else {
        const cRes = await couponFetcher.list();
        setCoupons(cRes.data || []);
      }
    } catch (err) {
      toast.error('Failed to load packages and offers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, selectedBranchId]);

  const handleSavePackage = async (data) => {
    try {
      if (editingPkg) {
        await packageFetcher.update(editingPkg._id, data);
        toast.success('Package updated');
      } else {
        await packageFetcher.create(data);
        toast.success('New package created');
      }
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDuplicatePackage = async (pkgId) => {
    try {
      await packageFetcher.duplicate(pkgId);
      toast.success('Package duplicated');
      loadData();
    } catch (err) {
      toast.error('Failed to duplicate package');
    }
  };

  const handleSaveOffer = async (data) => {
    try {
      if (editingOffer) {
        await offerFetcher.update(editingOffer._id, data);
        toast.success('Offer updated');
      } else {
        await offerFetcher.create(data);
        toast.success('Offer created');
      }
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleSaveCoupon = async (data) => {
    try {
      if (editingCoupon) {
        await couponFetcher.update(editingCoupon._id, data);
        toast.success('Coupon updated');
      } else {
        await couponFetcher.create(data);
        toast.success('Coupon generated');
      }
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Delete this package?')) return;
    try {
      await packageFetcher.delete(id);
      toast.success('Package deleted');
      loadData();
    } catch (err) {
      toast.error('Could not delete package');
    }
  };

  const packageFields = [
    { name: 'name', label: 'Package Name', required: true, placeholder: 'e.g. Bridal Deluxe Full Service Package' },
    { name: 'price', label: 'Package Price (₹)', type: 'currency', required: true },
    { name: 'discount', label: 'Discount Amount (₹)', type: 'currency' },
    { name: 'duration', label: 'Total Duration (Minutes)', type: 'number', placeholder: '180' },
    { name: 'customText', label: 'Custom Inclusions (Free Text)', type: 'textarea', placeholder: 'e.g. Free Hair Decoration, Bridal Consultation, Premium Dressing Assistance', span: 2 },
    { name: 'homeServiceAllowed', label: 'Allow Home Service Dispatch', type: 'switch', defaultValue: true },
    { name: 'description', label: 'Description & Terms', type: 'textarea', span: 2 },
  ];

  const offerFields = [
    { name: 'name', label: 'Seasonal Offer Title', required: true, placeholder: 'e.g. Festive Bridal Bonanza (Nov 1 - Nov 15)' },
    {
      name: 'discountType',
      label: 'Discount Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Percentage (%)', value: 'percentage' },
        { label: 'Flat Amount (₹)', value: 'flat' },
      ],
    },
    { name: 'discountValue', label: 'Discount Value', type: 'number', required: true, placeholder: '25' },
    { name: 'festivalTag', label: 'Festival / Seasonal Badge', placeholder: 'e.g. Diwali Dhamaka, Karwa Chauth, Eid Glow, Christmas' },
    { name: 'validFrom', label: 'Date-Range: Valid From Date', type: 'date', required: true },
    { name: 'validUntil', label: 'Date-Range: Valid Until Date', type: 'date', required: true },
    { name: 'minimumAmount', label: 'Minimum Spend (₹)', type: 'currency' },
    { name: 'maximumDiscount', label: 'Max Discount Cap (₹)', type: 'currency' },
  ];

  const couponFields = [
    { name: 'code', label: 'Coupon Code', required: true, placeholder: 'e.g. GLOW500, BRIDE2026' },
    {
      name: 'discountType',
      label: 'Discount Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Flat Amount (₹)', value: 'flat' },
        { label: 'Percentage (%)', value: 'percentage' },
      ],
    },
    { name: 'discountValue', label: 'Discount Value', type: 'number', required: true, placeholder: '500' },
    { name: 'usageLimit', label: 'Max Usages', type: 'number', placeholder: '100' },
    { name: 'validUntil', label: 'Expiry Date', type: 'date' },
  ];

  const packageColumns = [
    {
      header: 'Package',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.name}</div>
          {row.customText && (
            <div style={{ fontSize: '0.75rem', color: '#ec4899', fontWeight: 600 }}>
              ★ {row.customText}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Price',
      render: (row) => (
        <span style={{ fontWeight: 700, color: '#10b981' }}>
          ₹{(row.price || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Duration',
      render: (row) => (
        <span style={{ fontSize: '0.85rem' }}>{row.duration || 120} mins</span>
      ),
    },
    {
      header: 'Home Service',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: row.homeServiceAllowed ? '#10b981' : 'var(--text-muted)' }}>
          {row.homeServiceAllowed ? 'Allowed' : 'Salon Only'}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => handleDuplicatePackage(row._id)}
            className="btn btn-secondary btn-sm"
            title="Duplicate Package"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setEditingPkg(row);
              setPkgModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDeletePackage(row._id)}
            className="btn btn-secondary btn-sm"
            style={{ color: '#ef4444' }}
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const offerColumns = [
    {
      header: 'Seasonal Offer',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{row.name}</div>
          {row.festivalTag && (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'rgba(236, 72, 153, 0.2)',
                color: '#ec4899',
                display: 'inline-block',
                marginTop: '4px',
              }}
            >
              🎉 {row.festivalTag}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Discount Deal',
      render: (row) => (
        <span style={{ fontWeight: 800, color: '#10b981', fontSize: '0.95rem' }}>
          {row.discountType === 'percentage' ? `${row.discountValue}% Off` : `₹${row.discountValue} Flat Off`}
        </span>
      ),
    },
    {
      header: 'Campaign Date Range',
      render: (row) => (
        <div style={{ fontSize: '0.8rem' }}>
          <div style={{ color: 'var(--text-secondary)' }}>
            From: <strong>{row.validFrom ? new Date(row.validFrom).toLocaleDateString() : 'Active Now'}</strong>
          </div>
          <div style={{ color: '#f59e0b', marginTop: '2px' }}>
            Until: <strong>{row.validUntil ? new Date(row.validUntil).toLocaleDateString() : 'End of Month'}</strong>
          </div>
        </div>
      ),
    },
    {
      header: 'Validity Status',
      render: (row) => {
        const isExpiringSoon = row.validUntil && new Date(row.validUntil) - new Date() < 5 * 86400000;
        return (
          <span
            style={{
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 800,
              background: isExpiringSoon ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: isExpiringSoon ? '#f59e0b' : '#10b981',
            }}
          >
            {isExpiringSoon ? '⏳ Expiring Soon' : '● Live Campaign'}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => {
              setEditingOffer(row);
              setOfferModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>
      ),
    },
  ];

  const couponColumns = [
    {
      header: 'Code',
      accessor: 'code',
      render: (row) => (
        <span style={{ fontWeight: 800, color: '#ec4899', letterSpacing: '1px' }}>
          {row.code}
        </span>
      ),
    },
    {
      header: 'Discount',
      render: (row) => (
        <span style={{ fontWeight: 700, color: '#10b981' }}>
          {row.discountType === 'percentage' ? `${row.discountValue}%` : `₹${row.discountValue}`}
        </span>
      ),
    },
    {
      header: 'Usage',
      render: (row) => (
        <span style={{ fontSize: '0.85rem' }}>
          {row.usedCount || 0} / {row.usageLimit || '∞'}
        </span>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Packages, Offers & Coupons
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Create dynamic combo packages with custom text inclusions, promotional offers, and discount vouchers
          </p>
        </div>
        <div>
          {activeTab === 'packages' && (
            <button
              onClick={() => {
                setEditingPkg(null);
                setPkgModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus className="w-4 h-4" /> Create Package
            </button>
          )}
          {activeTab === 'offers' && (
            <button
              onClick={() => {
                setEditingOffer(null);
                setOfferModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus className="w-4 h-4" /> Add Offer
            </button>
          )}
          {activeTab === 'coupons' && (
            <button
              onClick={() => {
                setEditingCoupon(null);
                setCouponModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus className="w-4 h-4" /> Generate Coupon
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('packages')}
          className={`btn ${activeTab === 'packages' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Sparkles className="w-4 h-4" /> Combo Packages
        </button>
        <button
          onClick={() => setActiveTab('offers')}
          className={`btn ${activeTab === 'offers' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Tag className="w-4 h-4" /> Promotional Offers
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`btn ${activeTab === 'coupons' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Ticket className="w-4 h-4" /> Discount Coupons
        </button>
      </div>

      {activeTab === 'packages' && (
        <DataTable
          columns={packageColumns}
          data={packages}
          isLoading={isLoading}
          searchPlaceholder="Search packages..."
        />
      )}

      {activeTab === 'offers' && (
        <DataTable
          columns={offerColumns}
          data={offers}
          isLoading={isLoading}
          searchPlaceholder="Search offers..."
        />
      )}

      {activeTab === 'coupons' && (
        <DataTable
          columns={couponColumns}
          data={coupons}
          isLoading={isLoading}
          searchPlaceholder="Search coupons..."
        />
      )}

      <FormModal
        isOpen={pkgModalOpen}
        onClose={() => setPkgModalOpen(false)}
        title={editingPkg ? 'Edit Package' : 'Create New Combo Package'}
        fields={packageFields}
        initialData={editingPkg || {}}
        onSubmit={handleSavePackage}
        size="large"
      />

      <FormModal
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        title={editingOffer ? 'Edit Offer' : 'Create Promotional Offer'}
        fields={offerFields}
        initialData={editingOffer || {}}
        onSubmit={handleSaveOffer}
      />

      <FormModal
        isOpen={couponModalOpen}
        onClose={() => setCouponModalOpen(false)}
        title={editingCoupon ? 'Edit Coupon' : 'Generate Discount Coupon'}
        fields={couponFields}
        initialData={editingCoupon || {}}
        onSubmit={handleSaveCoupon}
      />
    </div>
  );
};

export default PackagesOffersPage;
