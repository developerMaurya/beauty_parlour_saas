/**
 * @file BranchManagementPage.jsx
 * @description Dynamic Branch Management with CRUD, Default Switch, and Operating Hours Configuration.
 * Conforms to Sections 6 & 7.
 * @module frontend/src/modules/admin/pages/BranchManagementPage
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, Clock, MapPin, Phone } from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';
import { branchFetcher } from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';

export const BranchManagementPage = () => {
  const { loadBranches } = useTenantAdmin();
  const toast = useToast();

  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  const [hoursModalOpen, setHoursModalOpen] = useState(false);
  const [activeBranchForHours, setActiveBranchForHours] = useState(null);

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const res = await branchFetcher.list();
      setBranches(res.data || []);
    } catch (err) {
      toast.error('Failed to load branches');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleSave = async (data) => {
    try {
      if (editingBranch) {
        await branchFetcher.update(editingBranch._id, data);
        toast.success('Branch updated successfully');
      } else {
        await branchFetcher.create(data);
        toast.success('New branch established');
      }
      setModalOpen(false);
      setEditingBranch(null);
      fetchBranches();
      loadBranches();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save branch');
    }
  };

  const handleSetDefault = async (branchId) => {
    try {
      await branchFetcher.setDefault(branchId);
      toast.success('Default branch set');
      fetchBranches();
      loadBranches();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Could not set default branch');
    }
  };

  const handleDelete = async (branchId) => {
    if (!window.confirm('Are you sure you want to delete this branch?')) return;
    try {
      await branchFetcher.delete(branchId);
      toast.success('Branch deleted');
      fetchBranches();
      loadBranches();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Could not delete branch');
    }
  };

  const handleSaveHours = async (hoursData) => {
    try {
      await branchFetcher.updateHours(activeBranchForHours._id, {
        openingTime: hoursData.openingTime,
        closingTime: hoursData.closingTime,
        days: hoursData.days ? hoursData.days.split(',').map((d) => d.trim()) : [],
      });
      toast.success('Branch hours saved');
      fetchBranches();
    } catch (err) {
      toast.error('Could not save branch operating hours');
    }
  };

  const branchFields = [
    { name: 'name', label: 'Branch Name', required: true, placeholder: 'e.g. Downtown Flagship' },
    { name: 'code', label: 'Branch Code', required: true, placeholder: 'e.g. DT-01' },
    { name: 'phone', label: 'Contact Phone', placeholder: '+91 9876543210' },
    { name: 'email', label: 'Contact Email', type: 'email', placeholder: 'downtown@salon.com' },
    { name: 'address', label: 'Full Street Address', type: 'textarea', span: 2 },
  ];

  const hoursFields = [
    { name: 'openingTime', label: 'Opening Time', placeholder: '09:00 AM', required: true },
    { name: 'closingTime', label: 'Closing Time', placeholder: '08:00 PM', required: true },
    { name: 'days', label: 'Operating Days (Comma-separated)', placeholder: 'Mon, Tue, Wed, Thu, Fri, Sat' },
  ];

  const columns = [
    {
      header: 'Branch Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {row.name}
            {row.isDefault && (
              <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 700 }}>
                Default
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Code: {row.code}</div>
        </div>
      ),
    },
    {
      header: 'Contact Info',
      render: (row) => (
        <div style={{ fontSize: '0.85rem' }}>
          <div>{row.phone || 'No phone'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.email || 'No email'}</div>
        </div>
      ),
    },
    {
      header: 'Hours',
      render: (row) => (
        <button
          onClick={() => {
            setActiveBranchForHours(row);
            setHoursModalOpen(true);
          }}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Clock className="w-3.5 h-3.5" />
          {row.operatingHours?.openingTime || '09:00'} - {row.operatingHours?.closingTime || '20:00'}
        </button>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            background: row.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: row.status === 'active' ? '#10b981' : '#ef4444',
          }}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {!row.isDefault && (
            <button
              onClick={() => handleSetDefault(row._id)}
              className="btn btn-secondary btn-sm"
              title="Set as Default Branch"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Make Default
            </button>
          )}
          <button
            onClick={() => {
              setEditingBranch(row);
              setModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Branch Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Configure and scale physical salons, studios, and institute branches
          </p>
        </div>
        <button
          onClick={() => {
            setEditingBranch(null);
            setModalOpen(true);
          }}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus className="w-4 h-4" /> Add New Branch
        </button>
      </div>

      <DataTable
        columns={columns}
        data={branches}
        isLoading={isLoading}
        searchPlaceholder="Search branches..."
      />

      {/* Branch Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBranch ? 'Edit Branch' : 'Add New Branch'}
        fields={branchFields}
        initialData={editingBranch || {}}
        onSubmit={handleSave}
        size="large"
      />

      {/* Operating Hours Modal */}
      <FormModal
        isOpen={hoursModalOpen}
        onClose={() => setHoursModalOpen(false)}
        title={`Operating Hours: ${activeBranchForHours?.name || ''}`}
        fields={hoursFields}
        initialData={{
          openingTime: activeBranchForHours?.operatingHours?.openingTime || '09:00 AM',
          closingTime: activeBranchForHours?.operatingHours?.closingTime || '08:00 PM',
          days: activeBranchForHours?.operatingHours?.days?.join(', ') || 'Mon, Tue, Wed, Thu, Fri, Sat',
        }}
        onSubmit={handleSaveHours}
      />
    </div>
  );
};

export default BranchManagementPage;
