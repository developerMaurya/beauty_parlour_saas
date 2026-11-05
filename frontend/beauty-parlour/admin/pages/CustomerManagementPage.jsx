/**
 * @file CustomerManagementPage.jsx
 * @description Customer CRM: Client Profiles, Visit History, Notes, and Preferences.
 * Conforms to Section 19.
 * @module frontend/src/modules/admin/pages/CustomerManagementPage
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, HeartHandshake, FileText, Ban, CheckCircle, Phone, Calendar } from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';
import { customerFetcher, branchFetcher } from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';

export const CustomerManagementPage = () => {
  const { selectedBranchId } = useTenantAdmin();
  const toast = useToast();

  const [customers, setCustomers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Note Modal
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [selectedCustomerForNote, setSelectedCustomerForNote] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cRes, bRes] = await Promise.all([
        customerFetcher.list({ branchId: selectedBranchId || undefined }),
        branchFetcher.list(),
      ]);
      setCustomers(cRes.data || []);
      setBranches(bRes.data || []);
    } catch (err) {
      toast.error('Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedBranchId]);

  const handleSaveCustomer = async (data) => {
    try {
      if (editingCustomer) {
        await customerFetcher.update(editingCustomer._id, data);
        toast.success('Customer profile updated');
      } else {
        await customerFetcher.create(data);
        toast.success('New customer profile added');
      }
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleToggleBlock = async (item) => {
    try {
      if (item.status === 'blocked') {
        await customerFetcher.unblock(item._id);
        toast.success('Customer unblocked');
      } else {
        const reason = window.prompt('Enter reason for blocking:');
        if (!reason) return;
        await customerFetcher.block(item._id, { reason });
        toast.success('Customer blocked');
      }
      loadData();
    } catch (err) {
      toast.error('Failed to change block status');
    }
  };

  const handleAddNote = async (data) => {
    try {
      await customerFetcher.addNote(selectedCustomerForNote._id, data);
      toast.success('Customer preference note saved');
      loadData();
    } catch (err) {
      toast.error('Failed to add note');
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('Delete this customer profile?')) return;
    try {
      await customerFetcher.delete(customerId);
      toast.success('Customer profile deleted');
      loadData();
    } catch (err) {
      toast.error('Could not delete customer');
    }
  };

  const customerFields = [
    { name: 'name', label: 'Client Name', required: true, placeholder: 'e.g. Shalini Roy' },
    { name: 'phone', label: 'Phone Number', required: true, placeholder: '+91 9876543210' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'shalini@example.com' },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      options: [
        { label: 'Female', value: 'female' },
        { label: 'Male', value: 'male' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'dob', label: 'Date of Birth (For Birthday Offers)', type: 'date' },
    { name: 'anniversary', label: 'Anniversary Date', type: 'date' },
    {
      name: 'branch',
      label: 'Preferred Branch',
      type: 'select',
      options: branches.map((b) => ({ label: b.name, value: b._id })),
    },
    { name: 'address', label: 'Home Address (For Home Services)', type: 'textarea', span: 2 },
  ];

  const noteFields = [
    { name: 'note', label: 'Client Preference / Allergy / Styling Note', type: 'textarea', required: true, placeholder: 'e.g. Sensitive scalp, allergic to ammonia hair dye, prefers warm water' },
  ];

  const columns = [
    {
      header: 'Customer',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.phone}</div>
        </div>
      ),
    },
    {
      header: 'Visits & Spend',
      render: (row) => (
        <div style={{ fontSize: '0.85rem' }}>
          <div>{row.totalVisits || 0} Salon Visit(s)</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
            ₹{(row.totalSpent || 0).toLocaleString()} spent
          </div>
        </div>
      ),
    },
    {
      header: 'Loyalty Points',
      render: (row) => (
        <span style={{ fontWeight: 700, color: '#ec4899' }}>
          {row.loyaltyPoints || 0} pts
        </span>
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
            background:
              row.status === 'active'
                ? 'rgba(16, 185, 129, 0.15)'
                : 'rgba(239, 68, 68, 0.15)',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => {
              setSelectedCustomerForNote(row);
              setNoteModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            title="Add Styling / Preference Note"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleToggleBlock(row)}
            className="btn btn-secondary btn-sm"
            style={{ color: row.status === 'blocked' ? '#10b981' : '#f59e0b' }}
            title={row.status === 'blocked' ? 'Unblock' : 'Block'}
          >
            {row.status === 'blocked' ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              setEditingCustomer(row);
              setModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDeleteCustomer(row._id)}
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
            Customer Relationship Management (CRM)
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Track client profiles, styling preferences, lifetime spend, visits, and loyalty rewards
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCustomer(null);
            setModalOpen(true);
          }}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus className="w-4 h-4" /> Add New Customer
        </button>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        isLoading={isLoading}
        searchPlaceholder="Search customers by name, phone, email..."
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCustomer ? 'Edit Customer' : 'Add New Customer Profile'}
        fields={customerFields}
        initialData={editingCustomer || {}}
        onSubmit={handleSaveCustomer}
        size="large"
      />

      <FormModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        title={`Add Preference Note: ${selectedCustomerForNote?.name || ''}`}
        fields={noteFields}
        onSubmit={handleAddNote}
        submitText="Save Note"
      />
    </div>
  );
};

export default CustomerManagementPage;
