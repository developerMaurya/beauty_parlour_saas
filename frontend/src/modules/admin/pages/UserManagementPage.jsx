/**
 * @file UserManagementPage.jsx
 * @description Primary User Management conforming to Section 2 & 4: ADMIN, STAFF, STUDENT, CUSTOMER.
 * Supports status toggles, block/unblock, password reset, and session revocation.
 * @module frontend/src/modules/admin/pages/UserManagementPage
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, Key, ShieldAlert, ShieldCheck, Ban, CheckCircle, Eye, X, Phone, Mail, Shield, Calendar, Check } from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';
import { userFetcher, roleFetcher, branchFetcher } from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';

export const UserManagementPage = () => {
  const { selectedBranchId } = useTenantAdmin();
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [selectedUserForPw, setSelectedUserForPw] = useState(null);

  // View User & Confirmation Modals
  const [viewUserModal, setViewUserModal] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [uRes, rRes, bRes] = await Promise.all([
        userFetcher.list({
          userType: userTypeFilter || undefined,
          branchId: selectedBranchId || undefined,
        }),
        roleFetcher.list(),
        branchFetcher.list(),
      ]);
      setUsers(uRes.data || []);
      setRoles(rRes.data || []);
      setBranches(bRes.data || []);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userTypeFilter, selectedBranchId]);

  const handleSaveUser = async (data) => {
    try {
      const payload = {
        ...data,
        role: data.userType || data.role,
        customRoleId: roles.find((r) => r.code === data.role)?._id || undefined,
        branchId: data.branch || data.branchId || undefined,
      };
      if (editingUser) {
        await userFetcher.update(editingUser._id, payload);
        toast.success('User profile updated');
      } else {
        await userFetcher.create(payload);
        toast.success('User account registered');
      }
      setModalOpen(false);
      setEditingUser(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Operation failed');
    }
  };

  const handleOpenEditUser = (row) => {
    setEditingUser({
      ...row,
      userType: row.role || row.userType || 'STAFF',
      role: row.customRoleId?.code || row.role || 'STAFF',
      branch: row.branchId?._id || row.branchId || '',
    });
    setModalOpen(true);
  };

  const handleToggleBlock = async (user) => {
    try {
      if (user.status === 'blocked') {
        await userFetcher.unblock(user._id);
        toast.success('User unblocked');
      } else {
        const reason = window.prompt('Enter reason for blocking:');
        if (!reason) return;
        await userFetcher.block(user._id, { reason });
        toast.success('User blocked');
      }
      loadData();
    } catch (err) {
      toast.error('Failed to change block status');
    }
  };

  const handleResetPassword = async (data) => {
    try {
      await userFetcher.resetPassword(selectedUserForPw._id, {
        newPassword: data.newPassword,
      });
      toast.success('Password successfully reset');
    } catch (err) {
      toast.error('Password reset failed');
    }
  };

  const handleRevokeSessions = async (userId) => {
    if (!window.confirm('Revoke all active sessions for this user?')) return;
    try {
      await userFetcher.revokeSessions(userId);
      toast.success('All user sessions invalidated');
    } catch (err) {
      toast.error('Failed to revoke sessions');
    }
  };

  const handleDeleteUser = (user) => {
    setConfirmDeleteModal({
      title: 'Delete User Account',
      message: `Are you sure you want to permanently delete user account for "${user.name}" (${user.email})? They will lose access to all portal services immediately.`,
      confirmText: 'Delete Account',
      onConfirm: async () => {
        try {
          await userFetcher.delete(user._id);
          toast.success(`User "${user.name}" deleted successfully`);
          setConfirmDeleteModal(null);
          loadData();
        } catch (err) {
          toast.error(err.response?.data?.message || err.message || 'Could not delete user');
        }
      },
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const name = (u.name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const phone = (u.phone || '').toLowerCase();
      const role = (u.role || u.userType || '').toLowerCase();
      const matchesSearch =
        name.includes(searchQuery.toLowerCase()) ||
        email.includes(searchQuery.toLowerCase()) ||
        phone.includes(searchQuery.toLowerCase()) ||
        role.includes(searchQuery.toLowerCase());
      const matchesType = !userTypeFilter || (u.role || u.userType || '').toUpperCase() === userTypeFilter.toUpperCase();
      const matchesStatus = !statusFilter || u.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [users, searchQuery, userTypeFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const userFields = [
    { name: 'name', label: 'Full Name', required: true, placeholder: 'e.g. Priya Sharma' },
    { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'priya@example.com' },
    ...(!editingUser ? [{ name: 'password', label: 'Initial Password', type: 'password', required: true }] : []),
    { name: 'phone', label: 'Phone Number', placeholder: '+91 9876543210' },
    {
      name: 'userType',
      label: 'Primary User Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Admin', value: 'ADMIN' },
        { label: 'Staff Member', value: 'STAFF' },
        { label: 'Student / Trainee', value: 'STUDENT' },
        { label: 'Customer / Client', value: 'CUSTOMER' },
      ],
    },
    {
      name: 'role',
      label: 'Security Role',
      type: 'select',
      options: roles.map((r) => ({ label: r.name, value: r.code })),
    },
    {
      name: 'branch',
      label: 'Assigned Branch',
      type: 'select',
      options: branches.map((b) => ({ label: b.name, value: b._id })),
    },
  ];

  const pwFields = [
    { name: 'newPassword', label: 'New Password', type: 'password', required: true, placeholder: '••••••••' },
  ];

  const columns = [
    {
      header: 'User',
      accessor: 'name',
      render: (row) => {
        const displayName = row.name || row.username || (row.email ? row.email.split('@')[0] : 'User');
        const displaySub = row.email || row.phone || `@${row.username}`;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background:
                  (row.role || row.userType) === 'ADMIN'
                    ? 'rgba(236, 72, 153, 0.15)'
                    : (row.role || row.userType) === 'STAFF'
                    ? 'rgba(59, 130, 246, 0.15)'
                    : (row.role || row.userType) === 'STUDENT'
                    ? 'rgba(99, 102, 241, 0.15)'
                    : 'rgba(16, 185, 129, 0.15)',
                color:
                  (row.role || row.userType) === 'ADMIN'
                    ? '#ec4899'
                    : (row.role || row.userType) === 'STAFF'
                    ? '#3b82f6'
                    : (row.role || row.userType) === 'STUDENT'
                    ? '#6366f1'
                    : '#10b981',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.82rem',
                flexShrink: 0,
              }}
            >
              {displayName[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {displayName}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {displaySub}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Primary Type',
      accessor: 'role',
      render: (row) => {
        const rawType = (row.role || row.userType || 'CUSTOMER').toUpperCase();
        const bgMap = {
          ADMIN: 'rgba(236, 72, 153, 0.12)',
          STAFF: 'rgba(59, 130, 246, 0.12)',
          STUDENT: 'rgba(99, 102, 241, 0.12)',
          CUSTOMER: 'rgba(16, 185, 129, 0.12)',
        };
        const colorMap = {
          ADMIN: '#ec4899',
          STAFF: '#3b82f6',
          STUDENT: '#6366f1',
          CUSTOMER: '#10b981',
        };
        const borderMap = {
          ADMIN: 'rgba(236, 72, 153, 0.3)',
          STAFF: 'rgba(59, 130, 246, 0.3)',
          STUDENT: 'rgba(99, 102, 241, 0.3)',
          CUSTOMER: 'rgba(16, 185, 129, 0.3)',
        };

        return (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.7rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              backgroundColor: bgMap[rawType] || 'rgba(148, 163, 184, 0.12)',
              color: colorMap[rawType] || '#94a3b8',
              border: `1px solid ${borderMap[rawType] || 'rgba(148, 163, 184, 0.25)'}`,
              display: 'inline-block',
            }}
          >
            {rawType}
          </span>
        );
      },
    },
    {
      header: 'Security Role',
      render: (row) => {
        const roleName = row.customRoleId?.name || (row.role ? (row.role.charAt(0).toUpperCase() + row.role.slice(1).toLowerCase()) : 'Standard');
        return (
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {roleName}
          </span>
        );
      },
    },
    {
      header: 'Status',
      render: (row) => (
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.7rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            background:
              row.status === 'active'
                ? 'rgba(16, 185, 129, 0.12)'
                : row.status === 'blocked'
                ? 'rgba(239, 68, 68, 0.12)'
                : 'rgba(245, 158, 11, 0.12)',
            color:
              row.status === 'active'
                ? '#10b981'
                : row.status === 'blocked'
                ? '#ef4444'
                : '#f59e0b',
            border: `1px solid ${
              row.status === 'active'
                ? 'rgba(16, 185, 129, 0.25)'
                : row.status === 'blocked'
                ? 'rgba(239, 68, 68, 0.25)'
                : 'rgba(245, 158, 11, 0.25)'
            }`,
          }}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => {
        const btnStyle = {
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-app)',
          cursor: 'pointer',
          padding: 0,
          transition: 'all 0.15s ease',
        };

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {/* View Full Profile Details */}
            <button
              onClick={() => setViewUserModal(row)}
              style={{ ...btnStyle, color: '#0284c7' }}
              title="View User Details"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setSelectedUserForPw(row);
                setPwModalOpen(true);
              }}
              style={{ ...btnStyle, color: '#8b5cf6' }}
              title="Reset Password"
            >
              <Key className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleToggleBlock(row)}
              style={{ ...btnStyle, color: row.status === 'blocked' ? '#10b981' : '#f59e0b' }}
              title={row.status === 'blocked' ? 'Unblock User' : 'Block User'}
            >
              {row.status === 'blocked' ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => handleRevokeSessions(row._id)}
              style={{ ...btnStyle, color: '#64748b' }}
              title="Revoke Active Sessions"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleOpenEditUser(row)}
              style={{ ...btnStyle, color: '#4f46e5' }}
              title="Edit Profile"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDeleteUser(row)}
              style={{ ...btnStyle, color: '#ef4444' }}
              title="Delete Account"
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            User Accounts & Authentication
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage the 4 primary system roles: Admin, Staff, Student, Customer
          </p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setModalOpen(true);
          }}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus className="w-4 h-4" /> Create User
        </button>
      </div>

      <DataTable
        columns={columns}
        data={paginatedUsers}
        isLoading={isLoading}
        searchPlaceholder="Search users by name, email, phone..."
        searchValue={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        filters={
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={userTypeFilter}
              onChange={(e) => {
                setUserTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="form-input"
              style={{ width: 'auto', minWidth: '150px', height: '38px', fontSize: '0.82rem' }}
            >
              <option value="">All User Types</option>
              <option value="ADMIN">Admins</option>
              <option value="STAFF">Staff Members</option>
              <option value="STUDENT">Students</option>
              <option value="CUSTOMER">Customers</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="form-input"
              style={{ width: 'auto', minWidth: '130px', height: '38px', fontSize: '0.82rem' }}
            >
              <option value="">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="blocked">Blocked Only</option>
              <option value="pending">Pending Only</option>
            </select>
          </div>
        }
        pagination={{
          page: currentPage,
          limit: itemsPerPage,
          total: filteredUsers.length,
          onPageChange: setCurrentPage,
        }}
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        title={editingUser ? 'Edit User' : 'Create New User Account'}
        fields={userFields}
        initialData={editingUser || {}}
        onSubmit={handleSaveUser}
      />

      <FormModal
        isOpen={pwModalOpen}
        onClose={() => setPwModalOpen(false)}
        title={`Reset Password: ${selectedUserForPw?.name || ''}`}
        fields={pwFields}
        onSubmit={handleResetPassword}
        submitText="Update Password"
      />

      {/* View User Full Profile Modal */}
      {viewUserModal && (
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                  }}
                >
                  {(viewUserModal.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                    User Account Record
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0 0 0', color: '#f8fafc' }}>
                    {viewUserModal.name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewUserModal(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(15,23,42,0.6)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>PRIMARY TYPE</div>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    background:
                      (viewUserModal.role || viewUserModal.userType) === 'ADMIN'
                        ? 'rgba(236, 72, 153, 0.15)'
                        : (viewUserModal.role || viewUserModal.userType) === 'STAFF'
                        ? 'rgba(59, 130, 246, 0.15)'
                        : 'rgba(16, 185, 129, 0.15)',
                    color:
                      (viewUserModal.role || viewUserModal.userType) === 'ADMIN'
                        ? '#ec4899'
                        : (viewUserModal.role || viewUserModal.userType) === 'STAFF'
                        ? '#3b82f6'
                        : '#10b981',
                  }}
                >
                  {(viewUserModal.role || viewUserModal.userType || 'CUSTOMER').toUpperCase()}
                </span>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>SECURITY ROLE</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {viewUserModal.customRoleId?.name || viewUserModal.role || 'Salon Member'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>EMAIL ADDRESS</div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '2px' }}>
                  {viewUserModal.email || 'N/A'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>PHONE NUMBER</div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '2px' }}>
                  {viewUserModal.phone || 'N/A'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>ACCOUNT STATUS</div>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    background: viewUserModal.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: viewUserModal.status === 'active' ? '#10b981' : '#ef4444',
                  }}
                >
                  {viewUserModal.status || 'Active'}
                </span>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>ASSIGNED BRANCH</div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '2px' }}>
                  {viewUserModal.branchId?.name || 'All Branches'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setViewUserModal(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const u = viewUserModal;
                  setViewUserModal(null);
                  setSelectedUserForPw(u);
                  setPwModalOpen(true);
                }}
                className="btn btn-secondary"
                style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Key className="w-3.5 h-3.5" /> Reset Password
              </button>
              <button
                type="button"
                onClick={() => {
                  const u = viewUserModal;
                  setViewUserModal(null);
                  setEditingUser(u);
                  setModalOpen(true);
                }}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
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
                  Requires administrative confirmation
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

export default UserManagementPage;
