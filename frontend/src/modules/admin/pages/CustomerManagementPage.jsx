/**
 * @file CustomerManagementPage.jsx
 * @description Customer CRM: Client Profiles, Visit History, Notes, and Preferences.
 * Conforms to Section 19.
 * @module frontend/src/modules/admin/pages/CustomerManagementPage
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, HeartHandshake, FileText, Ban, CheckCircle, Phone, Calendar, Eye, X, MapPin, Mail, Award } from 'lucide-react';
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

  // View & Delete Modal States
  const [viewCustomerModal, setViewCustomerModal] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(null);

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
      const payload = {
        ...data,
        profilePhoto: data.photo || data.profilePhoto || '',
        branchId: data.branch || data.branchId,
        dateOfBirth: data.dob || data.dateOfBirth,
        anniversaryDate: data.anniversary || data.anniversaryDate,
      };
      if (editingCustomer) {
        await customerFetcher.update(editingCustomer._id, payload);
        toast.success('Customer profile updated');
      } else {
        await customerFetcher.create(payload);
        toast.success('New customer profile added');
      }
      setModalOpen(false);
      setEditingCustomer(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleOpenEditCustomer = (row) => {
    setEditingCustomer({
      ...row,
      photo: row.profilePhoto || row.photo || '',
      branch: row.branchId?._id || row.branchId || row.branch || '',
      dob: row.dateOfBirth || row.dob || '',
      anniversary: row.anniversaryDate || row.anniversary || '',
      address: typeof row.address === 'object' ? (row.address?.street || '') : (row.address || ''),
    });
    setModalOpen(true);
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

  const handleDeleteCustomer = (customer) => {
    setConfirmDeleteModal({
      title: 'Delete Customer Profile',
      message: `Are you sure you want to delete profile for "${customer.name}" (${customer.phone})? This will remove all salon visit logs, package credits, and loyalty balance for this client.`,
      confirmText: 'Delete Client Record',
      onConfirm: async () => {
        try {
          await customerFetcher.delete(customer._id);
          toast.success(`Customer "${customer.name}" deleted successfully`);
          setConfirmDeleteModal(null);
          loadData();
        } catch (err) {
          toast.error(err.response?.data?.message || err.message || 'Could not delete customer');
        }
      },
    });
  };

  const customerFields = [
    { name: 'name', label: 'Client Name', required: true, placeholder: 'e.g. Shalini Roy' },
    { name: 'phone', label: 'Phone Number', required: true, placeholder: '+91 9876543210' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'shalini@example.com' },
    { name: 'photo', label: 'Customer Photo / Avatar URL (Optional)', placeholder: 'https://images.unsplash.com/... or paste image URL' },
    { name: 'password', label: 'Customer Portal Login Password (For /customer/login)', type: 'password', placeholder: 'e.g. Customer@123' },
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
      render: (row) => {
        const photoUrl = row.profilePhoto || row.photo;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={row.name}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(236, 72, 153, 0.4)',
                  flexShrink: 0,
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '13px',
                  flexShrink: 0,
                }}
              >
                {(row.name || 'C').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.phone}</div>
            </div>
          </div>
        );
      },
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
            onClick={() => setViewCustomerModal(row)}
            className="btn btn-secondary btn-sm"
            title="View Full Profile"
            style={{ color: '#38bdf8' }}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
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
            onClick={() => handleOpenEditCustomer(row)}
            className="btn btn-secondary btn-sm"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDeleteCustomer(row)}
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
        onClose={() => {
          setModalOpen(false);
          setEditingCustomer(null);
        }}
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

      {/* View Customer Details Modal */}
      {viewCustomerModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              background: '#1e293b',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {viewCustomerModal.profilePhoto || viewCustomerModal.photo ? (
                  <img
                    src={viewCustomerModal.profilePhoto || viewCustomerModal.photo}
                    alt={viewCustomerModal.name}
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #8b5cf6',
                      boxShadow: '0 4px 12px rgba(139,92,246,0.3)',
                      flexShrink: 0,
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.25rem',
                      boxShadow: '0 4px 12px rgba(168,85,247,0.3)',
                      flexShrink: 0,
                    }}
                  >
                    {(viewCustomerModal.name || 'C').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#8b5cf6', fontWeight: 800, textTransform: 'uppercase' }}>
                    Customer Profile & CRM
                  </span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '2px 0 0 0', color: '#f8fafc' }}>
                    {viewCustomerModal.name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewCustomerModal(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(15,23,42,0.6)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>PHONE NUMBER</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                  {viewCustomerModal.phone || 'N/A'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>MEMBERSHIP STATUS</div>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '2px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    background: viewCustomerModal.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: viewCustomerModal.status === 'active' ? '#10b981' : '#ef4444',
                  }}
                >
                  {viewCustomerModal.status || 'Active'}
                </span>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>EMAIL ADDRESS</div>
                <div style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '2px' }}>
                  {viewCustomerModal.email || 'N/A'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>LOYALTY POINTS</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ec4899', marginTop: '2px' }}>
                  ★ {viewCustomerModal.loyaltyPoints || 0} pts
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL SALON VISITS</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                  {viewCustomerModal.totalVisits || 0} Completed Visits
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>LIFETIME SPEND</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                  ₹{(viewCustomerModal.totalSpent || 0).toLocaleString()}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>DATE OF BIRTH</div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '2px' }}>
                  {viewCustomerModal.dob || 'Not set'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>ANNIVERSARY</div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '2px' }}>
                  {viewCustomerModal.anniversary || 'Not set'}
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>HOME DELIVERY ADDRESS</div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '2px' }}>
                  {viewCustomerModal.address || 'Flagship Salon Walk-in Customer'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setViewCustomerModal(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const c = viewCustomerModal;
                  setViewCustomerModal(null);
                  setEditingCustomer(c);
                  setModalOpen(true);
                }}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Customer Confirmation Modal */}
      {confirmDeleteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              background: '#1e293b',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                  {confirmDeleteModal.title}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  Action requires admin authorization
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
              {confirmDeleteModal.message}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setConfirmDeleteModal(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmDeleteModal.onConfirm) confirmDeleteModal.onConfirm();
                }}
                className="btn btn-primary"
                style={{ background: '#ef4444', borderColor: '#ef4444' }}
              >
                {confirmDeleteModal.confirmText || 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagementPage;
