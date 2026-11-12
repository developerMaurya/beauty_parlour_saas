/**
 * @file RoleManagementPage.jsx
 * @description Dynamic RBAC Role Management Page across all 5 Business Verticals:
 *   - Golden Beauty Parlour
 *   - Jaygurudev Event & Management
 *   - Plotting & Real Estate
 *   - Office & Commercial Rent
 *   - RB Software & Cloud SaaS
 *   - Central Administration / Master Global
 * Provides complete CRUD: Create Role, Edit Role, Delete Role, View Details, and Filter by Target Business.
 * Created roles automatically populate the Role dropdown when registering/editing users!
 * @module frontend/src/modules/admin/pages/RoleManagementPage
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  Info,
  X,
  Lock,
} from 'lucide-react';
import {
  fetchDynamicRoles,
  addDynamicRole,
  updateDynamicRole,
  deleteDynamicRole,
  fetchDynamicBusinessTargets,
  BUSINESS_TARGETS,
} from '../../../services/dynamicMasterStore.js';
import { useToast } from '../../../context/ToastContext.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';

export const RoleManagementPage = () => {
  const toast = useToast();
  const [roles, setRoles] = useState([]);
  const [businessTargets, setBusinessTargets] = useState(BUSINESS_TARGETS);
  const [targetFilter, setTargetFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [viewRoleModal, setViewRoleModal] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(null);

  const loadRoles = async () => {
    setIsLoading(true);
    try {
      const [fetchedRoles, fetchedTargets] = await Promise.all([
        fetchDynamicRoles(),
        fetchDynamicBusinessTargets(),
      ]);
      setRoles(fetchedRoles || []);
      if (fetchedTargets && fetchedTargets.length > 0) {
        setBusinessTargets(fetchedTargets);
      }
    } catch (err) {
      toast.error('Failed to load roles from MongoDB');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
    const handleSync = (e) => {
      if (e.detail && Array.isArray(e.detail)) setRoles(e.detail);
      else loadRoles();
    };
    window.addEventListener('dynamic_roles_changed', handleSync);
    return () => window.removeEventListener('dynamic_roles_changed', handleSync);
  }, []);

  const handleSaveRole = async (formData) => {
    try {
      if (editingRole) {
        await updateDynamicRole(editingRole._id, formData);
        toast.success(`Role "${formData.name}" updated in Database!`);
      } else {
        const created = await addDynamicRole(formData);
        toast.success(`New Role "${created?.name || formData.name}" created in Database!`);
      }
      setModalOpen(false);
      setEditingRole(null);
      await loadRoles();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save role in DB');
    }
  };

  const handleDeleteRole = (role) => {
    if (role.isSystem) {
      toast.error(`"${role.name}" is a protected core system role and cannot be deleted.`);
      return;
    }
    setConfirmDeleteModal({
      title: 'Delete System Role',
      message: `Are you sure you want to permanently delete role "${role.name}" (${role.code}) from Database?`,
      onConfirm: async () => {
        try {
          await deleteDynamicRole(role._id);
          toast.success(`Role "${role.name}" deleted from Database`);
          setConfirmDeleteModal(null);
          await loadRoles();
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to delete role from DB');
        }
      },
    });
  };

  const filteredRoles = useMemo(() => {
    return roles.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (r.name || '').toLowerCase().includes(q) ||
        (r.code || '').toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q);
      const matchesTarget =
        targetFilter === 'ALL' || r.targetBusiness === targetFilter || r.targetBusiness === 'ALL';
      const matchesStatus = !statusFilter || r.status === statusFilter;
      return matchesSearch && matchesTarget && matchesStatus;
    });
  }, [roles, searchQuery, targetFilter, statusFilter]);

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage) || 1;
  const paginatedRoles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRoles.slice(start, start + itemsPerPage);
  }, [filteredRoles, currentPage, itemsPerPage]);

  const roleFormFields = [
    {
      name: 'name',
      label: 'Role Name',
      required: true,
      placeholder: 'e.g. Aadiyogi Stage Decor Lead or Cloud Architect',
    },
    {
      name: 'code',
      label: 'Role Code',
      required: true,
      placeholder: 'e.g. EVENT_STAGE_LEAD (Auto-formatted)',
    },
    {
      name: 'targetBusiness',
      label: 'Target Business Vertical / Dashboard',
      type: 'select',
      required: true,
      options: BUSINESS_TARGETS.map((t) => ({
        label: `${t.emoji} ${t.label}`,
        value: t.id,
      })),
    },
    {
      name: 'description',
      label: 'Role Responsibilities & Purpose',
      type: 'textarea',
      placeholder: 'Describe the authority and tasks assigned to this role...',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
              flexShrink: 0,
            }}
          >
            <Shield size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                Role Management Master
              </h1>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#d97706',
                  textTransform: 'uppercase',
                }}
              >
                Dynamic RBAC
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
              Create and manage custom roles across all 5 business verticals. Created roles auto-sync with the User Registration Form!
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingRole(null);
            setModalOpen(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
            transition: 'all 0.15s ease',
          }}
        >
          <Plus size={16} />
          <span>+ Create New Role</span>
        </button>
      </div>

      {/* ── Filters & Search Bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'var(--bg-surface, #ffffff)',
          padding: '1rem 1.25rem',
          borderRadius: '14px',
          border: '1px solid var(--border-color, #e2e8f0)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              type="text"
              placeholder="Search by role name or code..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, #cbd5e1)',
                background: 'var(--bg-canvas, #f8fafc)',
                fontSize: '0.84rem',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="#64748b" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Target Business:</span>
            <select
              value={targetFilter}
              onChange={(e) => {
                setTargetFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, #cbd5e1)',
                background: 'var(--bg-canvas, #f8fafc)',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">🌐 All Portals ({roles.length})</option>
              {BUSINESS_TARGETS.filter((b) => b.id !== 'ALL').map((b) => (
                <option key={b.id} value={b.id}>
                  {b.emoji} {b.label}
                </option>
              ))}
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid var(--border-color, #cbd5e1)',
              background: 'var(--bg-canvas, #f8fafc)',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* ── Role List Table ── */}
      <div
        style={{
          background: 'var(--bg-surface, #ffffff)',
          borderRadius: '16px',
          border: '1px solid var(--border-color, #e2e8f0)',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-canvas, #f8fafc)', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-muted)' }}>Role Name</th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-muted)' }}>Role Code</th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-muted)' }}>Target Business</th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-muted)' }}>Scope & Description</th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRoles.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No roles found matching the selected filters.
                  </td>
                </tr>
              ) : (
                paginatedRoles.map((role) => {
                  return (
                    <tr
                      key={role._id}
                      style={{
                        borderBottom: '1px solid var(--border-color, #f1f5f9)',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-canvas, #f8fafc)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '7px',
                              background: 'rgba(245, 158, 11, 0.12)',
                              color: '#d97706',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Shield size={14} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{role.name}</div>
                            {role.isSystem && (
                              <span style={{ fontSize: '9px', fontWeight: 800, color: '#6366f1' }}>Core Protected</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <code
                          style={{
                            background: 'rgba(0, 0, 0, 0.06)',
                            padding: '3px 7px',
                            borderRadius: '5px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            color: '#334155',
                          }}
                        >
                          {role.code}
                        </code>
                      </td>

                      <td style={{ padding: '12px 16px' }}>{getBusinessBadge(role.targetBusiness)}</td>

                      <td style={{ padding: '12px 16px', maxWidth: '280px' }}>
                        <div
                          style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.78rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {role.description || 'No description provided'}
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            background: role.status === 'active' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                            color: role.status === 'active' ? '#16a34a' : '#dc2626',
                          }}
                        >
                          {role.status === 'active' ? '● Active' : '○ Inactive'}
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            onClick={() => setViewRoleModal(role)}
                            title="View Role Details"
                            style={{
                              background: 'transparent',
                              border: '1px solid var(--border-color, #e2e8f0)',
                              borderRadius: '7px',
                              padding: '5px',
                              cursor: 'pointer',
                              color: 'var(--text-muted)',
                            }}
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            onClick={() => {
                              setEditingRole(role);
                              setModalOpen(true);
                            }}
                            title="Edit Role"
                            style={{
                              background: 'transparent',
                              border: '1px solid var(--border-color, #e2e8f0)',
                              borderRadius: '7px',
                              padding: '5px',
                              cursor: 'pointer',
                              color: '#3b82f6',
                            }}
                          >
                            <Edit2 size={14} />
                          </button>

                          <button
                            onClick={() => handleDeleteRole(role)}
                            title={role.isSystem ? 'Core system role cannot be deleted' : 'Delete Role'}
                            disabled={role.isSystem}
                            style={{
                              background: 'transparent',
                              border: '1px solid var(--border-color, #e2e8f0)',
                              borderRadius: '7px',
                              padding: '5px',
                              cursor: role.isSystem ? 'not-allowed' : 'pointer',
                              color: role.isSystem ? '#cbd5e1' : '#ef4444',
                            }}
                          >
                            {role.isSystem ? <Lock size={14} /> : <Trash2 size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Table Footer & Pagination ── */}
        <div
          style={{
            padding: '10px 16px',
            borderTop: '1px solid var(--border-color, #e2e8f0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div>
            Showing <strong>{paginatedRoles.length}</strong> of <strong>{filteredRoles.length}</strong> roles
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-color, #e2e8f0)',
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage <= 1 ? 0.5 : 1,
              }}
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontWeight: 700 }}>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-color, #e2e8f0)',
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage >= totalPages ? 0.5 : 1,
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Create / Edit Role Modal ── */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingRole(null);
        }}
        onSubmit={handleSaveRole}
        initialData={
          editingRole || {
            name: '',
            code: '',
            targetBusiness: 'ALL',
            description: '',
            status: 'active',
          }
        }
        title={editingRole ? `Edit Role: ${editingRole.name}` : 'Create New Multi-Business Role'}
        fields={roleFormFields}
        submitLabel={editingRole ? 'Update Role' : 'Create Role & Sync'}
      />

      {/* ── View Role Details Modal ── */}
      {viewRoleModal && (
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
          onClick={() => setViewRoleModal(null)}
        >
          <div
            style={{
              background: 'var(--bg-surface, #ffffff)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '520px',
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
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Shield size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {viewRoleModal.name}
                  </h3>
                  <code style={{ fontSize: '0.75rem', color: '#64748b' }}>{viewRoleModal.code}</code>
                </div>
              </div>
              <button
                onClick={() => setViewRoleModal(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Target Business Vertical:</span>
                <div style={{ marginTop: '4px' }}>{getBusinessBadge(viewRoleModal.targetBusiness)}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Description & Scope:</span>
                <p
                  style={{
                    margin: '4px 0 0',
                    background: 'var(--bg-canvas, #f8fafc)',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color, #e2e8f0)',
                    lineHeight: 1.5,
                  }}
                >
                  {viewRoleModal.description || 'No description provided.'}
                </p>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Status:</span>
                <div style={{ marginTop: '4px' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      background: viewRoleModal.status === 'active' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: viewRoleModal.status === 'active' ? '#16a34a' : '#dc2626',
                    }}
                  >
                    {viewRoleModal.status === 'active' ? 'Active Role' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                onClick={() => setViewRoleModal(null)}
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
                Delete Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagementPage;

