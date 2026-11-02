/**
 * @file UserManagementPage.jsx
 * @description Primary User Management conforming to Section 2 & 4: ADMIN, STAFF, STUDENT, CUSTOMER.
 * Supports status toggles, block/unblock, password reset, and session revocation.
 * @module frontend/src/modules/admin/pages/UserManagementPage
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Key, ShieldAlert, ShieldCheck, Ban, CheckCircle } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [selectedUserForPw, setSelectedUserForPw] = useState(null);

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
      if (editingUser) {
        await userFetcher.update(editingUser._id, data);
        toast.success('User profile updated');
      } else {
        await userFetcher.create(data);
        toast.success('User account registered');
      }
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Operation failed');
    }
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

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await userFetcher.delete(userId);
      toast.success('User deleted');
      loadData();
    } catch (err) {
      toast.error('Could not delete user');
    }
  };

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
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Primary Type',
      accessor: 'userType',
      render: (row) => (
        <span
          style={{
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            backgroundColor:
              row.userType === 'ADMIN'
                ? 'rgba(236, 72, 153, 0.15)'
                : row.userType === 'STAFF'
                ? 'rgba(59, 130, 246, 0.15)'
                : row.userType === 'STUDENT'
                ? 'rgba(99, 102, 241, 0.15)'
                : 'rgba(16, 185, 129, 0.15)',
            color:
              row.userType === 'ADMIN'
                ? '#ec4899'
                : row.userType === 'STAFF'
                ? '#3b82f6'
                : row.userType === 'STUDENT'
                ? '#6366f1'
                : '#10b981',
          }}
        >
          {row.userType}
        </span>
      ),
    },
    {
      header: 'Role',
      render: (row) => row.role || 'Standard',
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
                : row.status === 'blocked'
                ? 'rgba(239, 68, 68, 0.15)'
                : 'rgba(245, 158, 11, 0.15)',
            color:
              row.status === 'active'
                ? '#10b981'
                : row.status === 'blocked'
                ? '#ef4444'
                : '#f59e0b',
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
              setSelectedUserForPw(row);
              setPwModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            title="Reset Password"
          >
            <Key className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleToggleBlock(row)}
            className="btn btn-secondary btn-sm"
            style={{ color: row.status === 'blocked' ? '#10b981' : '#f59e0b' }}
            title={row.status === 'blocked' ? 'Unblock User' : 'Block User'}
          >
            {row.status === 'blocked' ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => handleRevokeSessions(row._id)}
            className="btn btn-secondary btn-sm"
            title="Revoke Sessions"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setEditingUser(row);
              setModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDeleteUser(row._id)}
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
        data={users}
        isLoading={isLoading}
        searchPlaceholder="Search users by name, email..."
        filters={
          <select
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="">All User Types</option>
            <option value="ADMIN">Admins</option>
            <option value="STAFF">Staff Members</option>
            <option value="STUDENT">Students</option>
            <option value="CUSTOMER">Customers</option>
          </select>
        }
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
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
    </div>
  );
};

export default UserManagementPage;
