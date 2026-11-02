/**
 * @file AddonsList.jsx
 * @description Super Admin Add-on Catalog & Tenant Add-on Packages
 */

import React, { useState, useEffect, useCallback } from 'react';
import { addonsApi } from '../../../services/api/superadmin.api';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';
import Modal from '../../../components/Modal';
import ConfirmModal from '../../../components/ConfirmModal';
import { useToast } from '../../../context/ToastContext';
import { Puzzle, Plus, Edit2, Trash2 } from 'lucide-react';

export const AddonsList = () => {
  const [addons, setAddons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [addonModal, setAddonModal] = useState({
    isOpen: false,
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

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, addon: null });
  const [actionLoading, setActionLoading] = useState(false);

  const { success, error } = useToast();

  const fetchAddons = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await addonsApi.list({ search });
      setAddons(res.data?.addons || []);
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
      const payload = {
        name: addonModal.name,
        code: addonModal.code || addonModal.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        description: addonModal.description,
        price: Number(addonModal.price),
        billingType: addonModal.billingType,
        unitType: addonModal.unitType,
        unitQuantity: Number(addonModal.unitQuantity),
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
            {row.code}
          </div>
        </div>
      ),
    },
    {
      header: 'Pricing',
      accessor: 'price',
      render: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
          ${row.price} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/{row.billingType?.toLowerCase() || 'month'}</span>
        </span>
      ),
    },
    {
      header: 'Quota Bundle',
      accessor: 'unitQuantity',
      render: (row) => (
        <span style={{ fontSize: '0.85rem' }}>
          +{row.unitQuantity?.toLocaleString() || 1} {row.unitType?.replace(/_/g, ' ') || 'Units'}
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
              setAddonModal({
                isOpen: true,
                isEdit: true,
                id: row._id || row.id,
                name: row.name,
                code: row.code,
                description: row.description || '',
                price: row.price,
                billingType: row.billingType || 'RECURRING',
                unitType: row.unitType || 'SMS_CREDITS',
                unitQuantity: row.unitQuantity || 1000,
              })
            }
            className="btn btn-secondary btn-sm"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteModal({ isOpen: true, addon: row })}
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

      <DataTable
        columns={columns}
        data={addons}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search add-ons..."
        emptyMessage="No add-on packages found."
      />

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
