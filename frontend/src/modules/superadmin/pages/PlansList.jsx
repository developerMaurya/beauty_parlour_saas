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
import { Layers, Plus, Edit2, Trash2, CheckCircle, Sliders, Shield, Eye } from 'lucide-react';

export const PlansList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'all';

  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  // Modals
  const [viewModal, setViewModal] = useState({ isOpen: false, plan: null });
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

  // Handle action=create query param
  useEffect(() => {
    if (searchParams.get('action') === 'create') {
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
      });
    }
  }, [searchParams]);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await plansApi.list({
        page: pagination.page,
        limit: pagination.limit,
        search,
      });
      const planItems = Array.isArray(res.data) ? res.data : (res.data?.plans || res.data?.items || []);
      setPlans(planItems);
      setPagination((p) => ({ ...p, total: res.data?.pagination?.total || planItems.length }));
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
      const generatedSlug = (planModal.code || planModal.name).toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const monthlyPrice = Number(planModal.price) || 0;
      const payload = {
        name: planModal.name,
        slug: generatedSlug,
        code: generatedSlug,
        description: planModal.description || '',
        priceMonthly: monthlyPrice,
        priceYearly: monthlyPrice * 10, // 2 months discount on annual
        price: monthlyPrice,
        currency: 'INR',
        billingCycle: planModal.billingCycle || 'MONTHLY',
        isPopular: Boolean(planModal.isPopular),
        trialDays: 14,
        limits: {
          maxBranches: Number(planModal.maxBranches) || 1,
          maxStaff: Number(planModal.maxStaff) || 5,
          maxClients: Number(planModal.maxClients) || 500,
          maxStorageMb: Number(planModal.maxStorageMb) || 2048,
        },
      };

      if (planModal.isEdit && planModal.id) {
        await plansApi.update(planModal.id, payload);
        success('Subscription plan updated successfully in database');
      } else {
        await plansApi.create(payload);
        success('New subscription plan registered in database');
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
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{row.slug || row.code}</div>
        </div>
      ),
    },
    {
      header: 'Pricing',
      accessor: 'price',
      render: (row) => {
        const price = row.priceMonthly !== undefined ? row.priceMonthly : (row.price || 49);
        const curr = row.currency === 'INR' ? '₹' : '$';
        return (
          <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>
            {curr}{price.toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>/{row.billingCycle?.toLowerCase() || 'mo'}</span>
          </span>
        );
      },
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
            <button
              onClick={() => setViewModal({ isOpen: true, plan: row })}
              className="btn btn-secondary btn-sm"
              title="View Plan Details"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() =>
                setPlanModal({
                  isOpen: true,
                  isEdit: true,
                  id,
                  name: row.name,
                  code: row.slug || row.code,
                  description: row.description || '',
                  price: row.priceMonthly !== undefined ? row.priceMonthly : (row.price || 49),
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


      {/* VIEW 1: ALL PLANS TABLE */}
      {activeTab === 'all' && (
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
      )}

      {/* VIEW 2: PLAN FEATURES MATRIX */}
      {activeTab === 'features' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Plan Feature Access Matrix</h3>
              <p className="card-subtitle">Entitlements enabled for each subscription tier</p>
            </div>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Feature Capability</th>
                  <th>Starter Studio</th>
                  <th>Growth Salon Pro</th>
                  <th>Enterprise Multi-Chain</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Cloudflare Direct Media Delivery', starter: '500 Images', pro: '5,000 Images', ent: 'Unlimited Direct' },
                  { feature: 'Isolated MongoDB Deployment Option', starter: 'Shared Pool', pro: 'Shared Pool', ent: 'Dedicated Mongo DB' },
                  { feature: 'Custom Domain & SSL Enforcement', starter: 'Subdomain only', pro: '1 Custom Domain', ent: 'Unlimited Domains' },
                  { feature: 'Staff Attendance & Biometrics', starter: 'Basic Roster', pro: 'Full Attendance', ent: 'Geo-fence + Biometric' },
                  { feature: 'Student Cosmetology Academy', starter: '❌', pro: 'Up to 25 Students', ent: 'Unlimited Batches' },
                  { feature: 'Automated WhatsApp & SMS Alerts', starter: 'Add-on only', pro: '1,000 credits/mo', ent: '5,000 credits/mo' },
                  { feature: 'Multi-Branch Switcher & POS Sync', starter: '1 Branch', pro: 'Up to 3 Branches', ent: 'Unlimited Branches' },
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{row.feature}</td>
                    <td><span className="badge badge-secondary">{row.starter}</span></td>
                    <td><span className="badge badge-primary">{row.pro}</span></td>
                    <td><span className="badge badge-success">{row.ent}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: PLAN LIMITS & QUOTAS */}
      {activeTab === 'limits' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Tenant Resource Quotas</h3>
              <p className="card-subtitle">Maximum allowable entities provisioned per plan</p>
            </div>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Plan Tier</th>
                  <th>Max Branches</th>
                  <th>Max Staff Members</th>
                  <th>Max Client Records</th>
                  <th>Cloud Storage Quota</th>
                </tr>
              </thead>
              <tbody>
                {plans.length > 0 ? (
                  plans.map((p) => (
                    <tr key={p._id || p.id}>
                      <td style={{ fontWeight: 600 }}>{p.name} ({p.code})</td>
                      <td>{p.limits?.maxBranches || 1} Branches</td>
                      <td>{p.limits?.maxStaff || 5} Staff</td>
                      <td>{(p.limits?.maxClients || 500).toLocaleString()} Clients</td>
                      <td>{(p.limits?.maxStorageMb || 2048) >= 1024 ? `${(p.limits?.maxStorageMb || 2048) / 1024} GB` : `${p.limits?.maxStorageMb || 2048} MB`}</td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Starter Studio</td>
                      <td>1 Branch</td>
                      <td>5 Staff</td>
                      <td>500 Clients</td>
                      <td>2 GB</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Growth Salon Pro</td>
                      <td>3 Branches</td>
                      <td>15 Staff</td>
                      <td>2,500 Clients</td>
                      <td>10 GB</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Enterprise Multi-Chain</td>
                      <td>Unlimited</td>
                      <td>Unlimited</td>
                      <td>Unlimited</td>
                      <td>100 GB</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: PLAN COMPARISON CARDS */}
      {activeTab === 'comparison' && (
        <div className="grid-cols-3">
          {[
            {
              name: 'Starter Studio',
              price: '$49',
              period: '/month',
              desc: 'Essential salon operations for single-location studios and boutique parlours.',
              features: ['1 Branch Location', 'Up to 5 Staff Members', '500 Client Records', 'Cloudflare Direct Media', 'Centralized Database Pool'],
              popular: false,
            },
            {
              name: 'Growth Salon Pro',
              price: '$99',
              period: '/month',
              desc: 'High-volume salons and day spas requiring multi-chair scheduling and academy portals.',
              features: ['Up to 3 Branches', 'Up to 15 Staff Members', '2,500 Client Records', 'Student Academy Management', '1 Custom Domain + SSL', 'Inventory & Commission Tracking'],
              popular: true,
            },
            {
              name: 'Enterprise Multi-Chain',
              price: '$199',
              period: '/month',
              desc: 'Nationwide salon franchises requiring multi-database isolation and custom SLAs.',
              features: ['Unlimited Branches & Staff', 'Unlimited Clients & Records', 'Dedicated Separate MongoDB Option', 'White-label Custom Domains', 'Priority 24/7 SLA Support', 'Full API Access'],
              popular: false,
            },
          ].map((card) => (
            <div
              key={card.name}
              className="card"
              style={{
                position: 'relative',
                border: card.popular ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                background: card.popular ? 'rgba(99, 102, 241, 0.04)' : undefined,
              }}
            >
              {card.popular && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '16px',
                    background: 'var(--primary)',
                    color: 'white',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 10px',
                    borderRadius: '999px',
                  }}
                >
                  MOST POPULAR
                </span>
              )}
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{card.name}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minHeight: '38px' }}>{card.desc}</p>
              <div style={{ margin: '1.25rem 0', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800 }}>{card.price}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{card.period}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {card.features.map((f, i) => (
                  <li key={i} style={{ fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`btn ${card.popular ? 'btn-primary' : 'btn-secondary'}`}
                style={{ width: '100%' }}
                onClick={() =>
                  setPlanModal({
                    isOpen: true,
                    isEdit: false,
                    id: null,
                    name: card.name,
                    code: card.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    description: card.desc,
                    price: parseInt(card.price.replace('$', '')),
                    billingCycle: 'MONTHLY',
                    isPopular: card.popular,
                    maxBranches: card.name.includes('Enterprise') ? 999 : card.name.includes('Growth') ? 3 : 1,
                    maxStaff: card.name.includes('Enterprise') ? 999 : card.name.includes('Growth') ? 15 : 5,
                    maxClients: card.name.includes('Enterprise') ? 99999 : card.name.includes('Growth') ? 2500 : 500,
                    maxStorageMb: card.name.includes('Enterprise') ? 102400 : card.name.includes('Growth') ? 10240 : 2048,
                  })
                }
              >
                Customize Tier
              </button>
            </div>
          ))}
        </div>
      )}

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

      {/* View Plan Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, plan: null })}
        title={`Subscription Tier: ${viewModal.plan?.name || ''}`}
        footer={
          <button className="btn btn-secondary btn-sm" onClick={() => setViewModal({ isOpen: false, plan: null })}>
            Close
          </button>
        }
      >
        {viewModal.plan && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.06)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{viewModal.plan.name}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Code: {viewModal.plan.slug || viewModal.plan.code}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                  {viewModal.plan.currency === 'INR' ? '₹' : '$'}{(viewModal.plan.priceMonthly || viewModal.plan.price || 49).toLocaleString()}
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}> / month</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
                  Annual: {viewModal.plan.currency === 'INR' ? '₹' : '$'}{((viewModal.plan.priceYearly || (viewModal.plan.priceMonthly || 49) * 10)).toLocaleString()} (Save 20%)
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {viewModal.plan.description || 'Enterprise beauty parlour & salon chain operating tier with full appointment management, inventory control, and multi-staff billing.'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Staff Quota</div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: '0.2rem' }}>{viewModal.plan.limits?.maxStaff || 5} Team Members</div>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Branches / Locations</div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: '0.2rem' }}>{viewModal.plan.limits?.maxBranches || 1} Parlour Location</div>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Client Accounts</div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: '0.2rem' }}>{viewModal.plan.limits?.maxClients || 500} Clients</div>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cloud Media Storage</div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: '0.2rem' }}>{viewModal.plan.limits?.maxStorageMb || 2048} MB SSD</div>
              </div>
            </div>
          </div>
        )}
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
