/**
 * @file RolePermissionPage.jsx
 * @description Dynamic Role Creation and Fine-Grained Permission Assignment Matrix.
 * Conforms to Phase 04 Section 5.
 * @module frontend/src/modules/admin/pages/RolePermissionPage
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ShieldCheck, Check, Save } from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';
import { roleFetcher, permissionFetcher } from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';

export const RolePermissionPage = () => {
  const toast = useToast();

  const [roles, setRoles] = useState([]);
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const [selectedRoleForPerms, setSelectedRoleForPerms] = useState(null);
  const [activePerms, setActivePerms] = useState([]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [roleRes, permRes] = await Promise.all([
        roleFetcher.list(),
        permissionFetcher.getGrouped(),
      ]);
      setRoles(roleRes.data || []);
      setGroupedPermissions(permRes.data || {});
      if (roleRes.data?.length > 0 && !selectedRoleForPerms) {
        setSelectedRoleForPerms(roleRes.data[0]);
        setActivePerms(roleRes.data[0].permissions || []);
      }
    } catch (err) {
      toast.error('Failed to load roles and permissions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectRole = (role) => {
    setSelectedRoleForPerms(role);
    setActivePerms(role.permissions || []);
  };

  const togglePermission = (permCode) => {
    setActivePerms((prev) =>
      prev.includes(permCode) ? prev.filter((p) => p !== permCode) : [...prev, permCode]
    );
  };

  const handleSavePermissions = async () => {
    if (!selectedRoleForPerms) return;
    try {
      await roleFetcher.updatePermissions(selectedRoleForPerms._id, activePerms);
      toast.success(`Permissions saved for role: ${selectedRoleForPerms.name}`);
      loadData();
    } catch (err) {
      toast.error('Could not save permissions');
    }
  };

  const handleSaveRole = async (data) => {
    try {
      if (editingRole) {
        await roleFetcher.update(editingRole._id, data);
        toast.success('Role updated');
      } else {
        await roleFetcher.create(data);
        toast.success('Role created');
      }
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (!window.confirm('Delete this role?')) return;
    try {
      await roleFetcher.delete(roleId);
      toast.success('Role deleted');
      loadData();
    } catch (err) {
      toast.error('Could not delete role');
    }
  };

  const roleFields = [
    { name: 'name', label: 'Role Name', required: true, placeholder: 'e.g. Salon Floor Manager' },
    { name: 'code', label: 'Role Code', required: true, placeholder: 'e.g. FLOOR_MANAGER' },
    { name: 'description', label: 'Role Purpose', type: 'textarea' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Roles & Permission Matrix
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Define custom salon roles and dynamically configure fine-grained permissions
          </p>
        </div>
        <button
          onClick={() => {
            setEditingRole(null);
            setModalOpen(true);
          }}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus className="w-4 h-4" /> Create Custom Role
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', gap: '1.5rem' }}>
        {/* Roles List */}
        <div
          className="card"
          style={{
            padding: '1.25rem',
            borderRadius: '12px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            System Roles
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {roles.map((r) => {
              const isSelected = selectedRoleForPerms?._id === r._id;
              return (
                <div
                  key={r._id}
                  onClick={() => handleSelectRole(r)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: `1px solid ${isSelected ? 'var(--primary-color, #ec4899)' : 'var(--border-color)'}`,
                    backgroundColor: isSelected ? 'rgba(236, 72, 153, 0.1)' : 'var(--bg-app)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {r.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.code}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingRole(r);
                        setModalOpen(true);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px' }}
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    {!r.isSystem && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRole(r._id);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px', color: '#ef4444' }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Permission Matrix */}
        <div
          className="card"
          style={{
            padding: '1.25rem',
            borderRadius: '12px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Permissions for:{' '}
                <span style={{ color: 'var(--primary-color, #ec4899)' }}>
                  {selectedRoleForPerms?.name || 'Select a role'}
                </span>
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Toggle individual access rights for this role
              </p>
            </div>
            <button
              onClick={handleSavePermissions}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Save className="w-4 h-4" /> Save Permissions
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '550px', overflowY: 'auto' }}>
            {Object.entries(groupedPermissions).map(([group, perms]) => (
              <div
                key={group}
                style={{
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '1rem',
                }}
              >
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--text-primary)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {group} Operations
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '0.5rem',
                  }}
                >
                  {perms.map((p) => {
                    const isChecked = activePerms.includes(p.code) || activePerms.includes('*');
                    return (
                      <label
                        key={p.code}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: 'pointer',
                          padding: '0.4rem 0.6rem',
                          borderRadius: '6px',
                          backgroundColor: isChecked ? 'rgba(236, 72, 153, 0.1)' : 'transparent',
                          border: `1px solid ${isChecked ? 'rgba(236, 72, 153, 0.3)' : 'transparent'}`,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermission(p.code)}
                          style={{ accentColor: 'var(--primary-color, #ec4899)' }}
                        />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                          {p.name || p.code}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingRole ? 'Edit Role' : 'Create Custom Role'}
        fields={roleFields}
        initialData={editingRole || {}}
        onSubmit={handleSaveRole}
      />
    </div>
  );
};

export default RolePermissionPage;
