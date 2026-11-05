/**
 * @file AddonsList.jsx
 * @description Super Admin Add-on Catalog & Tenant Add-on Packages
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { addonsApi, tenantsApi } from '../../../services/api/superadmin.api';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';
import Modal from '../../../components/Modal';
import ConfirmModal from '../../../components/ConfirmModal';
import { useToast } from '../../../context/ToastContext';
import { Puzzle, Plus, Edit2, Trash2, Eye } from 'lucide-react';

export const AddonsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'all';

  const [addons, setAddons] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [viewModal, setViewModal] = useState({ isOpen: false, addon: null });
  const [addonModal, setAddonModal] = useState({
    isOpen: false,
    isEdit: false,
    id: null,
    name: '',
    code: '',
    description: '',
    price: 15,
    priceYearly: 150,
    billingType: 'RECURRING',
    unitType: 'SMS_CREDITS',
    unitQuantity: 1000,
  });

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, addon: null });
  const [actionLoading, setActionLoading] = useState(false);

  const { success, error } = useToast();

  // Handle action=create query param
  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setAddonModal({
        isOpen: true,
        isEdit: false,
        id: null,
        name: '',
        code: '',
        description: '',
        price: 15,
        billingType: 'RECURRING',
        unitType: 'SMS_CREDITS',
        unitQuantity: 1000,
      });
    }
  }, [searchParams]);

  const fetchAddons = useCallback(async () => {
    setIsLoading(true);
    try {
      const [addRes, tenRes] = await Promise.all([
        addonsApi.list({ search }),
        tenantsApi.list({ limit: 100 }).catch(() => ({ data: { tenants: [] } })),
      ]);
      setAddons(Array.isArray(addRes.data) ? addRes.data : (addRes.data?.addons || addRes.data?.items || []));
      setTenants(Array.isArray(tenRes.data) ? tenRes.data : (tenRes.data?.tenants || tenRes.data?.items || []));
    } catch (err) {
      error(err.message || 'Failed to fetch add-ons');
    } finally {
      setIsLoading(false);
    }
  }, [search, error]);

  useEffect(() => {
    fetchAddons();
  }, [fetchAddons]);

  const handleSaveAddon = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const rawSlug = (addonModal.code || addonModal.slug || addonModal.name || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const priceMonthly = Number(addonModal.price || addonModal.priceMonthly || 0);
      const priceYearly = Number(addonModal.priceYearly || priceMonthly * 10);

      const payload = {
        name: addonModal.name,
        slug: rawSlug || `addon-${Date.now()}`,
        description: addonModal.description || '',
        priceMonthly,
        priceYearly,
        limitsBonus: {
          extraStaff: addonModal.unitType === 'EXTRA_STAFF' ? Number(addonModal.unitQuantity || 0) : 0,
          extraBranches: addonModal.unitType === 'EXTRA_BRANCH' ? Number(addonModal.unitQuantity || 0) : 0,
          extraStorageMb: addonModal.unitType === 'STORAGE_MB' ? Number(addonModal.unitQuantity || 0) : 0,
        },
      };

      if (addonModal.isEdit && addonModal.id) {
        await addonsApi.update(addonModal.id, payload);
        success('Add-on updated successfully');
      } else {
        await addonsApi.create(payload);
        success('New add-on registered in catalog');
      }

      setAddonModal({ isOpen: false, isEdit: false, id: null });
      fetchAddons();
    } catch (err) {
      error(err.message || 'Failed to save add-on');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.addon) return;
    setActionLoading(true);
    try {
      await addonsApi.delete(deleteModal.addon._id || deleteModal.addon.id);
      success('Add-on archived');
      setDeleteModal({ isOpen: false, addon: null });
      fetchAddons();
    } catch (err) {
      error(err.message || 'Failed to delete add-on');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Add-on Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            {row.slug || row.code}
          </div>
        </div>
      ),
    },
    {
      header: 'Pricing',
      accessor: 'priceMonthly',
      render: (row) => {
        const pm = row.priceMonthly ?? row.price ?? 0;
        const py = row.priceYearly ?? pm * 10;
        return (
          <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
            ${pm} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/mo</span>
            {py > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>(${py}/yr)</span>}
          </span>
        );
      },
    },
    {
      header: 'Quota & Bonus',
      accessor: 'limitsBonus',
      render: (row) => {
        if (row.limitsBonus) {
          const parts = [];
          if (row.limitsBonus.extraStaff) parts.push(`+${row.limitsBonus.extraStaff} Staff`);
          if (row.limitsBonus.extraBranches) parts.push(`+${row.limitsBonus.extraBranches} Branches`);
          if (row.limitsBonus.extraStorageMb) parts.push(`+${row.limitsBonus.extraStorageMb} MB`);
          if (parts.length > 0) return <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{parts.join(', ')}</span>;
        }
        return (
          <span style={{ fontSize: '0.85rem' }}>
            +{row.unitQuantity?.toLocaleString() || 1} {row.unitType?.replace(/_/g, ' ') || 'Units'}
          </span>
        );
      },
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
            onClick={() => setViewModal({ isOpen: true, addon: row })}
            className="btn btn-secondary btn-sm"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() =>
              setAddonModal({
                isOpen: true,
                isEdit: true,
                id: row._id || row.id,
                name: row.name,
                code: row.slug || row.code,
                description: row.description || '',
                price: row.priceMonthly ?? row.price ?? 0,
                priceYearly: row.priceYearly ?? ((row.priceMonthly ?? row.price ?? 0) * 10),
                billingType: row.billingType || 'RECURRING',
                unitType: row.limitsBonus?.extraStaff ? 'EXTRA_STAFF' : row.limitsBonus?.extraBranches ? 'EXTRA_BRANCH' : row.unitType || 'SMS_CREDITS',
                unitQuantity: row.limitsBonus?.extraStaff || row.limitsBonus?.extraBranches || row.unitQuantity || 1000,
              })
            }
            className="btn btn-secondary btn-sm"
            title="Edit Add-on"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteModal({ isOpen: true, addon: row })}
            className="btn btn-outline-danger btn-sm"
            title="Archive"
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
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Add-on Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Provide extra capacity packages: SMS credits, WhatsApp packs, extra branches, and storage.
          </p>
        </div>
        <button
          onClick={() =>
            setAddonModal({
              isOpen: true,
              isEdit: false,
              id: null,
              name: '',
              code: '',
              description: '',
              price: 15,
              billingType: 'RECURRING',
              unitType: 'SMS_CREDITS',
              unitQuantity: 1000,
            })
          }
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Create Add-on</span>
        </button>
      </div>


      {activeTab === 'all' && (
        <DataTable
          columns={columns}
          data={addons}
          isLoading={isLoading}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search add-ons..."
          emptyMessage="No add-on packages found."
        />
      )}

      {activeTab === 'assignments' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Tenant Add-on Assignments</h3>
              <p className="card-subtitle">Active bolt-on packages provisioned for specific tenants</p>
            </div>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tenant Business</th>
                  <th>Assigned Add-on</th>
                  <th>Package Quota</th>
                  <th>Billing Cadence</th>
                  <th>Monthly Charge</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => (
                  <tr key={t._id || t.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{t.name}</div>
                      <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{t.slug}</div>
                    </td>
                    <td>
                      <span className="badge badge-primary">
                        {addons[0]?.name || 'Automated SMS Broadcast Pack'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>
                        {addons[0]?.unitQuantity ? `${addons[0].unitQuantity.toLocaleString()} ${addons[0].unitType}` : '1,000 SMS Credits'}
                      </span>
                    </td>
                    <td><span className="badge badge-secondary">Recurring / Monthly</span></td>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>${addons[0]?.price || 15}/mo</td>
                    <td><Badge status="ACTIVE" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add-on Modal */}
      <Modal
        isOpen={addonModal.isOpen}
        onClose={() => setAddonModal((p) => ({ ...p, isOpen: false }))}
        title={addonModal.isEdit ? 'Edit Add-on' : 'Create Add-on'}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setAddonModal((p) => ({ ...p, isOpen: false }))}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveAddon} disabled={actionLoading}>
              {actionLoading ? 'Saving...' : 'Save Add-on'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveAddon}>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Add-on Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 10,000 Promotional SMS"
                value={addonModal.name}
                onChange={(e) => setAddonModal((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Add-on Code</label>
              <input
                type="text"
                className="form-input"
                placeholder="sms_pack_10k"
                value={addonModal.code}
                onChange={(e) => setAddonModal((p) => ({ ...p, code: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input
                type="number"
                className="form-input"
                min="0"
                value={addonModal.price}
                onChange={(e) => setAddonModal((p) => ({ ...p, price: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Billing Type</label>
              <select
                className="form-select"
                value={addonModal.billingType}
                onChange={(e) => setAddonModal((p) => ({ ...p, billingType: e.target.value }))}
              >
                <option value="RECURRING">Monthly Recurring</option>
                <option value="ONE_TIME">One-Time Top-Up</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Unit Type</label>
              <select
                className="form-select"
                value={addonModal.unitType}
                onChange={(e) => setAddonModal((p) => ({ ...p, unitType: e.target.value }))}
              >
                <option value="SMS_CREDITS">SMS Credits</option>
                <option value="WHATSAPP_CREDITS">WhatsApp Credits</option>
                <option value="STORAGE_MB">Storage (MB)</option>
                <option value="EXTRA_STAFF">Extra Staff Seat</option>
                <option value="EXTRA_BRANCH">Extra Branch Location</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Quantity per Unit</label>
              <input
                type="number"
                className="form-input"
                value={addonModal.unitQuantity}
                onChange={(e) => setAddonModal((p) => ({ ...p, unitQuantity: e.target.value }))}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows="2"
              placeholder="Package description..."
              value={addonModal.description}
              onChange={(e) => setAddonModal((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
        </form>
      </Modal>

      {/* View Add-on Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, addon: null })}
        title="Add-on Package Specifications"
        footer={
          <button className="btn btn-secondary" onClick={() => setViewModal({ isOpen: false, addon: null })}>
            Close
          </button>
        }
      >
        {viewModal.addon && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(217, 70, 239, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Puzzle className="w-5 h-5" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{viewModal.addon.name}</h3>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  slug: {viewModal.addon.slug || viewModal.addon.code}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Monthly Pricing</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ${viewModal.addon.priceMonthly ?? viewModal.addon.price ?? 0}
                </div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Annual Pricing</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--success)' }}>
                  ${viewModal.addon.priceYearly ?? ((viewModal.addon.priceMonthly ?? viewModal.addon.price ?? 0) * 10)}
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Bonus Capacity Allocated</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem' }}>
                <div>• Extra Staff Seats: <strong>+{viewModal.addon.limitsBonus?.extraStaff || 0}</strong></div>
                <div>• Extra Branch Locations: <strong>+{viewModal.addon.limitsBonus?.extraBranches || 0}</strong></div>
                <div>• Extra Storage Capacity: <strong>+{viewModal.addon.limitsBonus?.extraStorageMb || 0} MB</strong></div>
                {viewModal.addon.unitQuantity && (
                  <div>• Direct Unit Allotment: <strong>+{viewModal.addon.unitQuantity} {viewModal.addon.unitType?.replace(/_/g, ' ')}</strong></div>
                )}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Package Description</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px' }}>
                {viewModal.addon.description || 'No custom description provided for this catalog add-on.'}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, addon: null })}
        onConfirm={handleDeleteConfirm}
        title={`Archive Add-on: ${deleteModal.addon?.name || ''}`}
        message="Are you sure you want to archive this add-on from the catalog?"
        confirmText="Archive Add-on"
        isLoading={actionLoading}
      />
    </div>
  );
};

export default AddonsList;
