/**
 * @file UserTypeManagementPage.jsx
 * @description Dynamic User Type Master CRUD across all 5 Business Verticals:
 *   - Golden Beauty Parlour
 *   - Jaygurudev Event & Management
 *   - Plotting & Real Estate
 *   - Office & Commercial Rent
 *   - RB Software & Cloud SaaS
 *   - Central Administration / Master Global
 * Provides complete CRUD: Create User Type, Edit User Type, Delete User Type, View Details, and Filter by Target Business.
 * Created user types dynamically populate the User Type dropdown when registering/editing users!
 * @module frontend/src/modules/admin/pages/UserTypeManagementPage
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Lock,
} from 'lucide-react';
import {
  fetchDynamicUserTypes,
  addDynamicUserType,
  updateDynamicUserType,
  deleteDynamicUserType,
  fetchDynamicBusinessTargets,
  BUSINESS_TARGETS,
} from '../../../services/dynamicMasterStore.js';
import { useToast } from '../../../context/ToastContext.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';

export const UserTypeManagementPage = () => {
  const toast = useToast();
  const [userTypes, setUserTypes] = useState([]);
  const [businessTargets, setBusinessTargets] = useState(BUSINESS_TARGETS);
  const [targetFilter, setTargetFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [viewTypeModal, setViewTypeModal] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(null);

  const loadUserTypes = async () => {
    setIsLoading(true);
    try {
      const [fetchedTypes, fetchedTargets] = await Promise.all([
        fetchDynamicUserTypes(),
        fetchDynamicBusinessTargets(),
      ]);
      setUserTypes(fetchedTypes || []);
      if (fetchedTargets && fetchedTargets.length > 0) {
        setBusinessTargets(fetchedTargets);
      }
    } catch (err) {
      toast.error('Failed to load user types from Database');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserTypes();
    const handleSync = (e) => {
      if (e.detail && Array.isArray(e.detail)) setUserTypes(e.detail);
      else loadUserTypes();
    };
    window.addEventListener('dynamic_user_types_changed', handleSync);
    return () => window.removeEventListener('dynamic_user_types_changed', handleSync);
  }, []);

  const handleSaveType = async (formData) => {
    try {
      if (editingType) {
        await updateDynamicUserType(editingType._id, formData);
        toast.success(`User Type "${formData.name}" updated in Database!`);
      } else {
        const created = await addDynamicUserType(formData);
        toast.success(`New User Type "${created?.name || formData.name}" created in Database!`);
      }
      setModalOpen(false);
      setEditingType(null);
      await loadUserTypes();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save user type in DB');
    }
  };

  const handleDeleteType = (typeItem) => {
    if (typeItem.isSystem) {
      toast.error(`"${typeItem.name}" is a protected core system user type and cannot be deleted.`);
      return;
    }
    setConfirmDeleteModal({
      title: 'Delete User Type',
      message: `Are you sure you want to permanently delete user type "${typeItem.name}" (${typeItem.code}) from Database?`,
      onConfirm: async () => {
        try {
          await deleteDynamicUserType(typeItem._id);
          toast.success(`User type "${typeItem.name}" deleted from Database`);
          setConfirmDeleteModal(null);
          await loadUserTypes();
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to delete user type from DB');
        }
      },
    });
  };

  const filteredTypes = useMemo(() => {
    return userTypes.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (t.name || '').toLowerCase().includes(q) ||
        (t.code || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q);
      const matchesTarget =
        targetFilter === 'ALL' || t.targetBusiness === targetFilter || t.targetBusiness === 'ALL';
      const matchesStatus = !statusFilter || t.status === statusFilter;
      return matchesSearch && matchesTarget && matchesStatus;
    });
  }, [userTypes, searchQuery, targetFilter, statusFilter]);

  const totalPages = Math.ceil(filteredTypes.length / itemsPerPage) || 1;
  const paginatedTypes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTypes.slice(start, start + itemsPerPage);
  }, [filteredTypes, currentPage, itemsPerPage]);

  const typeFormFields = [
    {
      name: 'name',
      label: 'User Type Name',
      required: true,
      placeholder: 'e.g. Real Estate Sales Partner or Cosmetology Trainee',
    },
    {
      name: 'code',
      label: 'Type Identifier Code',
      required: true,
      placeholder: 'e.g. AGENT, STUDENT, VENDOR (Auto-uppercase)',
    },
    {
      name: 'targetBusiness',
      label: 'Associated Business Vertical',
      type: 'select',
      required: true,
      options: BUSINESS_TARGETS.map((t) => ({
        label: `${t.emoji} ${t.label}`,
        value: t.id,
      })),
    },
    {
      name: 'description',
      label: 'Access Scope & Category Purpose',
      type: 'textarea',
      placeholder: 'Describe which users fall under this classification...',
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
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(139, 92, 246, 0.35)',
              flexShrink: 0,
            }}
          >
            <Tag size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                User Type Master
              </h1>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: '#7c3aed',
                  textTransform: 'uppercase',
                }}
              >
                Dynamic Types
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
              Define customized user classifications across all business portals. Synchronizes dynamically with the User Registration Form!
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingType(null);
            setModalOpen(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.35)',
            transition: 'all 0.15s ease',
          }}
        >
          <Plus size={16} />
          <span>+ Create User Type</span>
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
              placeholder="Search by type name or code..."
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
              <option value="ALL">🌐 All Portals ({userTypes.length})</option>
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

      {/* ── User Type Table ── */}
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
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-muted)' }}>Type Classification</th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-muted)' }}>Code Identifier</th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-muted)' }}>Target Business</th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-muted)' }}>Description / Access Scope</th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTypes.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No user types found matching the selected filters.
                  </td>
                </tr>
              ) : (
                paginatedTypes.map((typeItem) => {
                  return (
                    <tr
                      key={typeItem._id}
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
                              background: 'rgba(139, 92, 246, 0.12)',
                              color: '#7c3aed',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Tag size={14} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{typeItem.name}</div>
                            {typeItem.isSystem && (
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
                            color: '#475569',
                          }}
                        >
                          {typeItem.code}
                        </code>
                      </td>

                      <td style={{ padding: '12px 16px' }}>{getBusinessBadge(typeItem.targetBusiness)}</td>

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
                          {typeItem.description || 'No description provided'}
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
                            background: typeItem.status === 'active' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                            color: typeItem.status === 'active' ? '#16a34a' : '#dc2626',
                          }}
                        >
                          {typeItem.status === 'active' ? '● Active' : '○ Inactive'}
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            onClick={() => setViewTypeModal(typeItem)}
                            title="View Details"
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
                              setEditingType(typeItem);
                              setModalOpen(true);
                            }}
                            title="Edit Type"
                            style={{
                              background: 'transparent',
                              border: '1px solid var(--border-color, #e2e8f0)',
                              borderRadius: '7px',
                              padding: '5px',
                              cursor: 'pointer',
                              color: '#8b5cf6',
                            }}
                          >
                            <Edit2 size={14} />
                          </button>

                          <button
                            onClick={() => handleDeleteType(typeItem)}
                            title={typeItem.isSystem ? 'Core system user type cannot be deleted' : 'Delete Type'}
                            disabled={typeItem.isSystem}
                            style={{
                              background: 'transparent',
                              border: '1px solid var(--border-color, #e2e8f0)',
                              borderRadius: '7px',
                              padding: '5px',
                              cursor: typeItem.isSystem ? 'not-allowed' : 'pointer',
                              color: typeItem.isSystem ? '#cbd5e1' : '#ef4444',
                            }}
                          >
                            {typeItem.isSystem ? <Lock size={14} /> : <Trash2 size={14} />}
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
            Showing <strong>{paginatedTypes.length}</strong> of <strong>{filteredTypes.length}</strong> user types
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

      {/* ── Create / Edit User Type Modal ── */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingType(null);
        }}
        onSubmit={handleSaveType}
        initialData={
          editingType || {
            name: '',
            code: '',
            targetBusiness: 'ALL',
            description: '',
            status: 'active',
          }
        }
        title={editingType ? `Edit User Type: ${editingType.name}` : 'Create Dynamic User Type Master'}
        fields={typeFormFields}
        submitLabel={editingType ? 'Update User Type' : 'Create Type & Sync'}
      />

      {/* ── View User Type Modal ── */}
      {viewTypeModal && (
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
          onClick={() => setViewTypeModal(null)}
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
                    background: 'rgba(139, 92, 246, 0.15)',
                    color: '#7c3aed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Tag size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {viewTypeModal.name}
                  </h3>
                  <code style={{ fontSize: '0.75rem', color: '#64748b' }}>{viewTypeModal.code}</code>
                </div>
              </div>
              <button
                onClick={() => setViewTypeModal(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Target Business Vertical:</span>
                <div style={{ marginTop: '4px' }}>{getBusinessBadge(viewTypeModal.targetBusiness)}</div>
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
                  {viewTypeModal.description || 'No description provided.'}
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
                      background: viewTypeModal.status === 'active' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: viewTypeModal.status === 'active' ? '#16a34a' : '#dc2626',
                    }}
                  >
                    {viewTypeModal.status === 'active' ? 'Active Classification' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                onClick={() => setViewTypeModal(null)}
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
                Delete Type
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTypeManagementPage;

