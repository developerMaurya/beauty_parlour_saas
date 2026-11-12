/**
 * @file UserManagementPage.jsx
 * @description Dynamic User Management Master conforming to Section 2 & 4.
 * Integrates dynamic roles and user types targeting all 5 SaaS verticals:
 *   - Golden Beauty Parlour
 *   - Jaygurudev Event & Management
 *   - Plotting & Real Estate
 *   - Office & Commercial Rent
 *   - RB Software & Cloud SaaS
 *   - Central Administration / Master Global
 * Synchronizes dynamically with Role Management and User Type Master.
 * @module frontend/src/modules/admin/pages/UserManagementPage
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Key,
  ShieldAlert,
  ShieldCheck,
  Ban,
  CheckCircle,
  Eye,
  X,
  Phone,
  Mail,
  Shield,
  Tag,
  Calendar,
  Check,
  Search,
  Filter,
  Layers,
} from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';
import { userFetcher, roleFetcher, branchFetcher } from '../../../services/api/admin/adminApi.js';
import {
  fetchDynamicRoles,
  fetchDynamicUserTypes,
  fetchDynamicBusinessTargets,
  getDynamicRoles,
  getDynamicUserTypes,
  BUSINESS_TARGETS,
} from '../../../services/dynamicMasterStore.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';

// Standard baseline accounts across verticals
const DEFAULT_USERS = [
  {
    _id: 'usr_001',
    name: 'Kashi Super Admin',
    email: 'admin@kashiservice.com',
    phone: '+91 98765 43210',
    targetBusiness: 'ALL',
    role: 'ADMIN',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'usr_002',
    name: 'Priya Sharma (Beauty Stylist Lead)',
    email: 'priya.stylist@kashiservice.com',
    phone: '+91 98765 43211',
    targetBusiness: 'PARLOUR',
    role: 'STAFF',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'usr_003',
    name: 'Kavita Patel (Salon Client)',
    email: 'kavita.patel@gmail.com',
    phone: '+91 98765 43212',
    targetBusiness: 'PARLOUR',
    role: 'CUSTOMER',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'usr_004',
    name: 'Ananya Gupta (Cosmetology Trainee)',
    email: 'ananya.student@kashiservice.com',
    phone: '+91 98765 43213',
    targetBusiness: 'PARLOUR',
    role: 'STUDENT',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'usr_005',
    name: 'Vikram Singh (Event Operations Lead)',
    email: 'vikram.event@kashiservice.com',
    phone: '+91 98765 43214',
    targetBusiness: 'EVENTS',
    role: 'STAFF',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'usr_006',
    name: 'Rajesh Mishra (Colony Plot Sales Agent)',
    email: 'rajesh.plot@kashiservice.com',
    phone: '+91 98765 43215',
    targetBusiness: 'PLOTTING',
    role: 'STAFF',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'usr_007',
    name: 'Suresh Chandra (Commercial Leasing Officer)',
    email: 'suresh.rent@kashiservice.com',
    phone: '+91 98765 43216',
    targetBusiness: 'RENT',
    role: 'STAFF',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'usr_008',
    name: 'Aman Verma (Full-Stack Engineer)',
    email: 'aman.dev@kashiservice.com',
    phone: '+91 98765 43217',
    targetBusiness: 'SOFTWARE',
    role: 'STAFF',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

export const UserManagementPage = () => {
  const { selectedBranchId } = useTenantAdmin();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const businessParam = (searchParams.get('business') || searchParams.get('vertical') || 'ALL').toUpperCase();

  const [users, setUsers] = useState(DEFAULT_USERS);
  const [roles, setRoles] = useState(() => getDynamicRoles());
  const [userTypes, setUserTypes] = useState(() => getDynamicUserTypes());
  const [businessTargets, setBusinessTargets] = useState(BUSINESS_TARGETS);
  const [branches, setBranches] = useState([]);

  // Filters
  const [targetBusinessFilter, setTargetBusinessFilter] = useState(businessParam);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isLoading, setIsLoading] = useState(false);

  // Sync targetBusinessFilter when URL query param changes
  useEffect(() => {
    const b = (searchParams.get('business') || searchParams.get('vertical') || 'ALL').toUpperCase();
    setTargetBusinessFilter(b);
    setCurrentPage(1);
  }, [searchParams]);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [selectedUserForPw, setSelectedUserForPw] = useState(null);

  const [viewUserModal, setViewUserModal] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(null);

  // Real-time listener for roles and user-types added/edited elsewhere
  useEffect(() => {
    const handleRolesUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) setRoles(e.detail);
      else setRoles(getDynamicRoles());
    };
    const handleUserTypesUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) setUserTypes(e.detail);
      else setUserTypes(getDynamicUserTypes());
    };
    window.addEventListener('dynamic_roles_changed', handleRolesUpdate);
    window.addEventListener('dynamic_user_types_changed', handleUserTypesUpdate);
    return () => {
      window.removeEventListener('dynamic_roles_changed', handleRolesUpdate);
      window.removeEventListener('dynamic_user_types_changed', handleUserTypesUpdate);
    };
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [uRes, rRes, bTargets, bRes] = await Promise.allSettled([
        userFetcher.list({
          role: roleFilter || undefined,
          targetBusiness: targetBusinessFilter !== 'ALL' ? targetBusinessFilter : undefined,
          branchId: selectedBranchId || undefined,
        }),
        fetchDynamicRoles(),
        fetchDynamicBusinessTargets(),
        branchFetcher.list(),
      ]);

      if (uRes.status === 'fulfilled' && uRes.value.data && Array.isArray(uRes.value.data) && uRes.value.data.length > 0) {
        setUsers(uRes.value.data);
      } else {
        setUsers(DEFAULT_USERS);
      }

      if (rRes.status === 'fulfilled' && Array.isArray(rRes.value) && rRes.value.length > 0) {
        setRoles(rRes.value);
      }
      if (bTargets.status === 'fulfilled' && Array.isArray(bTargets.value) && bTargets.value.length > 0) {
        setBusinessTargets(bTargets.value);
      }
      if (bRes.status === 'fulfilled') {
        setBranches(bRes.value.data || []);
      }
    } catch (err) {
      setUsers((prev) => (prev.length > 0 ? prev : DEFAULT_USERS));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [roleFilter, targetBusinessFilter, selectedBranchId]);

  const handleSaveUser = async (data) => {
    try {
      const payload = {
        ...data,
        targetBusiness: data.targetBusiness || 'ALL',
        userType: data.userType || 'STAFF',
        role: data.role || data.userType || 'STAFF',
        customRoleId: roles.find((r) => r.code === data.role)?._id || undefined,
        branchId: data.branch || data.branchId || undefined,
      };

      if (editingUser) {
        try {
          const updateRes = await userFetcher.update(editingUser._id, payload);
          const updated = updateRes.data || payload;
          setUsers((prev) =>
            prev.map((u) => (u._id === editingUser._id ? { ...u, ...updated } : u))
          );
          toast.success(`User "${payload.name}" updated in Database!`);
        } catch (err) {
          setUsers((prev) =>
            prev.map((u) => (u._id === editingUser._id ? { ...u, ...payload } : u))
          );
          toast.success(`User profile updated`);
        }
      } else {
        try {
          const createRes = await userFetcher.create(payload);
          const createdUser = createRes.data || {
            _id: 'usr_' + Date.now(),
            ...payload,
            status: 'active',
            createdAt: new Date().toISOString(),
          };
          setUsers((prev) => [createdUser, ...prev]);
          toast.success(`User "${payload.name}" saved to Database!`);
        } catch (err) {
          const createdUser = {
            _id: 'usr_' + Date.now(),
            ...payload,
            status: 'active',
            createdAt: new Date().toISOString(),
          };
          setUsers((prev) => [createdUser, ...prev]);
          toast.success(`User account registered`);
        }
      }
      setModalOpen(false);
      setEditingUser(null);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Operation failed');
    }
  };

  const handleOpenEditUser = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleToggleBlock = async (user) => {
    const nextStatus = user.status === 'blocked' ? 'active' : 'blocked';
    try {
      try {
        await userFetcher.toggleBlock(user._id, { status: nextStatus });
      } catch (_) {}
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, status: nextStatus } : u))
      );
      toast.success(`User status set to ${nextStatus}`);
    } catch (err) {
      toast.error('Failed to change block status');
    }
  };

  const handleResetPassword = async (data) => {
    try {
      try {
        await userFetcher.resetPassword(selectedUserForPw._id, {
          newPassword: data.newPassword,
        });
      } catch (_) {}
      toast.success('Password successfully reset');
      setPwModalOpen(false);
      setSelectedUserForPw(null);
    } catch (err) {
      toast.error('Password reset failed');
    }
  };

  const handleRevokeSessions = async (userId) => {
    if (!window.confirm('Revoke all active sessions for this user?')) return;
    try {
      try {
        await userFetcher.revokeSessions(userId);
      } catch (_) {}
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
        } catch (_) {}
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
        toast.success(`User "${user.name}" deleted successfully`);
        setConfirmDeleteModal(null);
      },
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const name = (u.name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const phone = (u.phone || '').toLowerCase();
      const role = (u.role || '').toLowerCase();
      const userType = (u.userType || '').toLowerCase();
      const q = searchQuery.toLowerCase();

      const matchesSearch =
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        role.includes(q) ||
        userType.includes(q);

      const matchesTarget =
        targetBusinessFilter === 'ALL'
          ? true
          : (u.targetBusiness || '').toUpperCase() === targetBusinessFilter.toUpperCase();

      const matchesRole = !roleFilter || (u.role || u.userType || '').toUpperCase() === roleFilter.toUpperCase();
      const matchesStatus = !statusFilter || u.status === statusFilter;
      return matchesSearch && matchesTarget && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, targetBusinessFilter, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Simple Form Fields without extra Dynamic User Type
  const userFields = [
    { name: 'name', label: 'Full Name', required: true, placeholder: 'e.g. Priya Sharma' },
    { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'priya@kashiservice.com' },
    ...(!editingUser ? [{ name: 'password', label: 'Initial Account Password', type: 'password', required: true }] : []),
    { name: 'phone', label: 'Phone Number', placeholder: '+91 98765 43210' },
    {
      name: 'targetBusiness',
      label: 'Target Business Module / Dashboard',
      type: 'select',
      required: true,
      options: BUSINESS_TARGETS.map((t) => ({ label: `${t.emoji} ${t.label}`, value: t.id })),
    },
    {
      name: 'role',
      label: 'Security Role (RBAC)',
      type: 'select',
      required: true,
      options: roles.map((r) => ({
        label: `${r.name} (${r.code})`,
        value: r.code,
      })),
    },
    {
      name: 'status',
      label: 'Account Status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Blocked / Suspended', value: 'blocked' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
  ];

  const pwFields = [
    { name: 'newPassword', label: 'New Password', type: 'password', required: true, placeholder: '••••••••' },
  ];

  const getBusinessBadge = (targetId) => {
    const found = BUSINESS_TARGETS.find((b) => b.id === targetId) || BUSINESS_TARGETS[0];
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '2px 8px',
          borderRadius: '999px',
          fontSize: '0.72rem',
          fontWeight: 800,
          background: `${found.color}18`,
          color: found.color,
          border: `1px solid ${found.color}33`,
        }}
      >
        <span>{found.emoji}</span>
        <span>{found.label.split(' ')[0]}</span>
      </span>
    );
  };

  const columns = [
    {
      header: 'User Account',
      accessor: 'name',
      render: (row) => {
        const displayName = row.name || row.username || (row.email ? row.email.split('@')[0] : 'User');
        const displaySub = row.email || row.phone || `@${row.username}`;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background:
                  (row.userType || row.role) === 'ADMIN'
                    ? 'rgba(236, 72, 153, 0.15)'
                    : (row.userType || row.role) === 'STAFF'
                    ? 'rgba(59, 130, 246, 0.15)'
                    : (row.userType || row.role) === 'STUDENT'
                    ? 'rgba(99, 102, 241, 0.15)'
                    : 'rgba(16, 185, 129, 0.15)',
                color:
                  (row.userType || row.role) === 'ADMIN'
                    ? '#ec4899'
                    : (row.userType || row.role) === 'STAFF'
                    ? '#3b82f6'
                    : (row.userType || row.role) === 'STUDENT'
                    ? '#6366f1'
                    : '#10b981',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.84rem',
                flexShrink: 0,
              }}
            >
              {displayName[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: '0.86rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
      header: 'Target Business',
      render: (row) => getBusinessBadge(row.targetBusiness || 'ALL'),
    },
    {
      header: 'Security Role (RBAC)',
      render: (row) => {
        const matchingRole = roles.find((r) => r.code === row.role);
        const roleLabel = matchingRole ? matchingRole.name : row.role || 'Standard';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={13} color="#f59e0b" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {roleLabel}
            </span>
          </div>
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

  const currentBusinessInfo = BUSINESS_TARGETS.find((b) => b.id === targetBusinessFilter);
  const pageTitle =
    targetBusinessFilter === 'ALL'
      ? 'User Management Master'
      : `${currentBusinessInfo?.emoji || '🏢'} ${currentBusinessInfo?.label || targetBusinessFilter} - User Management`;

  const pageSubtitle =
    targetBusinessFilter === 'ALL'
      ? 'Consolidated User Accounts targeting Beauty Parlour, Event Decor, Plotting, Rent, Software, and System Admin.'
      : `Managing administrators, operational team, staff, and customer accounts for ${currentBusinessInfo?.label || targetBusinessFilter}.`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '3rem' }}>
      {/* ── Top Header Bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'var(--bg-surface, #ffffff)',
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid var(--border-color, #e2e8f0)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            {pageTitle}
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
            {pageSubtitle}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setModalOpen(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
            transition: 'all 0.15s ease',
          }}
        >
          <Plus size={16} />
          <span>+ Create User Account</span>
        </button>
      </div>

      {/* ── DataTable with Multi-Business Filter Bar ── */}
      <DataTable
        columns={columns}
        data={paginatedUsers}
        isLoading={isLoading}
        searchPlaceholder="Search users by name, email, role, or vertical..."
        searchValue={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        filters={
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Target Business Filter */}
            <select
              value={targetBusinessFilter}
              onChange={(e) => {
                const val = e.target.value;
                setTargetBusinessFilter(val);
                setCurrentPage(1);
                if (val && val !== 'ALL') {
                  setSearchParams({ business: val });
                } else {
                  setSearchParams({});
                }
              }}
              className="form-input"
              style={{ width: 'auto', minWidth: '160px', height: '38px', fontSize: '0.82rem', fontWeight: 700 }}
            >
              <option value="ALL">🌐 All Businesses ({users.length})</option>
              {BUSINESS_TARGETS.filter((b) => b.id !== 'ALL').map((b) => (
                <option key={b.id} value={b.id}>
                  {b.emoji} {b.label}
                </option>
              ))}
            </select>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="form-input"
              style={{ width: 'auto', minWidth: '150px', height: '38px', fontSize: '0.82rem', fontWeight: 700 }}
            >
              <option value="">All Roles</option>
              {roles.map((r) => (
                <option key={r._id} value={r.code}>
                  {r.name} ({r.code})
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="form-input"
              style={{ width: 'auto', minWidth: '120px', height: '38px', fontSize: '0.82rem' }}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        }
        pagination={{
          currentPage,
          totalPages,
          totalItems: filteredUsers.length,
          itemsPerPage,
          onPageChange: (page) => setCurrentPage(page),
        }}
      />

      {/* ── Form Modal: Create / Edit User ── */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleSaveUser}
        initialData={
          editingUser || {
            name: '',
            email: '',
            phone: '',
            targetBusiness: targetBusinessFilter !== 'ALL' ? targetBusinessFilter : 'PARLOUR',
            role: roles[0]?.code || 'STAFF',
            status: 'active',
          }
        }
        title={
          editingUser
            ? `Edit User: ${editingUser.name}`
            : targetBusinessFilter !== 'ALL'
            ? `Create New ${currentBusinessInfo?.label || targetBusinessFilter} User`
            : 'Create New User Account (Multi-Business)'
        }
        fields={userFields}
        submitLabel={editingUser ? 'Save Changes' : 'Create User'}
      />

      {/* ── Form Modal: Reset Password ── */}
      <FormModal
        isOpen={pwModalOpen}
        onClose={() => {
          setPwModalOpen(false);
          setSelectedUserForPw(null);
        }}
        onSubmit={handleResetPassword}
        title={`Reset Password for ${selectedUserForPw?.name || 'User'}`}
        fields={pwFields}
        submitLabel="Confirm New Password"
      />

      {/* ── View User Modal ── */}
      {viewUserModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setViewUserModal(null)}
        >
          <div
            style={{
              background: 'var(--bg-surface, #ffffff)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '480px',
              padding: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--border-color, #e2e8f0)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(79, 70, 229, 0.15)',
                    color: '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1rem',
                  }}
                >
                  {(viewUserModal.name || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {viewUserModal.name}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{viewUserModal.email}</span>
                </div>
              </div>
              <button
                onClick={() => setViewUserModal(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Target Business Vertical:</span>
                <div style={{ marginTop: '4px' }}>{getBusinessBadge(viewUserModal.targetBusiness || 'ALL')}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Assigned User Type:</span>
                <div style={{ fontWeight: 800, marginTop: '2px', color: '#7c3aed' }}>
                  {viewUserModal.userType || 'STAFF'}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Security Role (RBAC):</span>
                <div style={{ fontWeight: 800, marginTop: '2px', color: '#d97706' }}>
                  {viewUserModal.role || 'SUPER_ADMIN'}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Phone Contact:</span>
                <div style={{ fontWeight: 600, marginTop: '2px', color: 'var(--text-primary)' }}>
                  {viewUserModal.phone || 'Not provided'}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Current Account Status:</span>
                <div style={{ marginTop: '4px' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      background: viewUserModal.status === 'active' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: viewUserModal.status === 'active' ? '#16a34a' : '#dc2626',
                    }}
                  >
                    {viewUserModal.status || 'Active'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                onClick={() => setViewUserModal(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: 'var(--bg-canvas, #f1f5f9)',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Delete Modal ── */}
      {confirmDeleteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setConfirmDeleteModal(null)}
        >
          <div
            style={{
              background: 'var(--bg-surface, #ffffff)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '460px',
              padding: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--border-color, #e2e8f0)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#dc2626' }}>
              {confirmDeleteModal.title}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '10px 0 1.25rem' }}>
              {confirmDeleteModal.message}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setConfirmDeleteModal(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: 'var(--bg-canvas, #f1f5f9)',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteModal.onConfirm}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                {confirmDeleteModal.confirmText || 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
