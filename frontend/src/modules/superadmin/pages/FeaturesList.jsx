/**
 * @file FeaturesList.jsx
 * @description Super Admin Feature Catalog, Category Management, and Plan Entitlements
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { featuresApi } from '../../../services/api/superadmin.api';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';
import Modal from '../../../components/Modal';
import ConfirmModal from '../../../components/ConfirmModal';
import { useToast } from '../../../context/ToastContext';
import { Sliders, Plus, Edit2, Trash2 } from 'lucide-react';

export const FeaturesList = () => {
  const [searchParams] = useSearchParams();
  const [features, setFeatures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modals
  const [featureModal, setFeatureModal] = useState({
    isOpen: false,
    isEdit: false,
    id: null,
    name: '',
    key: '',
    category: '',
    description: '',
    isDefault: false,
  });

  const [categoryModal, setCategoryModal] = useState({
    isOpen: false,
    name: '',
    description: '',
  });

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null, isCategory: false });
  const [actionLoading, setActionLoading] = useState(false);

  const { success, error } = useToast();

  const fetchFeatures = useCallback(async () => {
    setIsLoading(true);
    try {
      const [featRes, catRes] = await Promise.all([
        featuresApi.list({ search, category: selectedCategory || undefined }).catch(() => ({ data: { features: [] } })),
        featuresApi.listCategories().catch(() => ({ data: { categories: [] } })),
      ]);

      setFeatures(featRes.data?.features || []);
      setCategories(catRes.data?.categories || []);
    } catch (err) {
      error(err.message || 'Failed to fetch features');
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedCategory, error]);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  const handleSaveFeature = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        name: featureModal.name,
        key: featureModal.key || featureModal.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        category: featureModal.category || categories[0]?.name || 'Core Operations',
        description: featureModal.description,
        isDefault: featureModal.isDefault,
      };

      if (featureModal.isEdit && featureModal.id) {
        await featuresApi.update(featureModal.id, payload);
        success('Feature updated successfully');
      } else {
        await featuresApi.create(payload);
        success('New feature registered');
      }

      setFeatureModal({ isOpen: false, isEdit: false, id: null });
      fetchFeatures();
    } catch (err) {
      error(err.message || 'Failed to save feature');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await featuresApi.createCategory({
        name: categoryModal.name,
        description: categoryModal.description,
      });
      success(`Category ${categoryModal.name} created`);
      setCategoryModal({ isOpen: false, name: '', description: '' });
      fetchFeatures();
    } catch (err) {
      error(err.message || 'Failed to create category');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return;
    setActionLoading(true);
    try {
      if (deleteModal.isCategory) {
        await featuresApi.deleteCategory(deleteModal.item._id || deleteModal.item.id);
        success('Feature category deleted');
      } else {
        await featuresApi.delete(deleteModal.item._id || deleteModal.item.id);
        success('Feature removed');
      }
      setDeleteModal({ isOpen: false, item: null, isCategory: false });
      fetchFeatures();
    } catch (err) {
      error(err.message || 'Failed to delete');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Feature Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            {row.key}
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => (
        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {row.category || 'General'}
        </span>
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {row.description || 'Feature module capability'}
        </span>
      ),
    },
    {
      header: 'Default Entitlement',
      accessor: 'isDefault',
      render: (row) => (
        <Badge status={row.isDefault ? 'ACTIVE' : 'TRIAL'} text={row.isDefault ? 'Enabled' : 'Optional'} />
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
              setFeatureModal({
                isOpen: true,
                isEdit: true,
                id: row._id || row.id,
                name: row.name,
                key: row.key,
                category: row.category || '',
                description: row.description || '',
                isDefault: !!row.isDefault,
              })
            }
            className="btn btn-secondary btn-sm"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteModal({ isOpen: true, item: row, isCategory: false })}
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
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Feature Catalog</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Configure operational features, functional modules, and plan assignment rights.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setCategoryModal({ isOpen: true, name: '', description: '' })}
            className="btn btn-secondary"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
          <button
            onClick={() =>
              setFeatureModal({
                isOpen: true,
                isEdit: false,
                id: null,
                name: '',
                key: '',
                category: categories[0]?.name || 'Core Operations',
                description: '',
                isDefault: false,
              })
            }
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4" /> Add Feature
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={features}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search features by name or key..."
        filters={
          categories.length > 0 && (
            <select
              className="form-select"
              style={{ width: '180px' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id || c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          )
        }
        emptyMessage="No features registered in catalog."
      />

      {/* Feature Modal */}
      <Modal
        isOpen={featureModal.isOpen}
        onClose={() => setFeatureModal((p) => ({ ...p, isOpen: false }))}
        title={featureModal.isEdit ? 'Edit Feature' : 'Register New Feature'}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setFeatureModal((p) => ({ ...p, isOpen: false }))}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveFeature} disabled={actionLoading}>
              {actionLoading ? 'Saving...' : 'Save Feature'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveFeature}>
          <div className="form-group">
            <label className="form-label">Feature Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Online Appointment Scheduling"
              value={featureModal.name}
              onChange={(e) => setFeatureModal((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Feature Key (Unique Identifier)</label>
            <input
              type="text"
              className="form-input"
              placeholder="online_appointments"
              value={featureModal.key}
              onChange={(e) => setFeatureModal((p) => ({ ...p, key: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-input"
              placeholder="Core Operations, Marketing, CRM"
              value={featureModal.category}
              onChange={(e) => setFeatureModal((p) => ({ ...p, category: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="Describe feature capability..."
              value={featureModal.description}
              onChange={(e) => setFeatureModal((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
        </form>
      </Modal>

      {/* Category Modal */}
      <Modal
        isOpen={categoryModal.isOpen}
        onClose={() => setCategoryModal((p) => ({ ...p, isOpen: false }))}
        title="Add Feature Category"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setCategoryModal((p) => ({ ...p, isOpen: false }))}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveCategory} disabled={actionLoading}>
              Save Category
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveCategory}>
          <div className="form-group">
            <label className="form-label">Category Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Inventory Management"
              value={categoryModal.name}
              onChange={(e) => setCategoryModal((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows="2"
              placeholder="Category overview..."
              value={categoryModal.description}
              onChange={(e) => setCategoryModal((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null, isCategory: false })}
        onConfirm={handleDeleteConfirm}
        title="Delete Feature Confirmation"
        message="Are you sure you want to remove this item? This may impact plan configurations."
        isLoading={actionLoading}
      />
    </div>
  );
};

export default FeaturesList;
