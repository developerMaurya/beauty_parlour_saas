/**
 * @file RolePermissionPage.jsx
 * @description Dynamic Role Creation and Fine-Grained Permission Assignment Matrix.
 * Conforms to Phase 04 Section 5.
 * @module frontend/src/modules/admin/pages/RolePermissionPage
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ShieldCheck, Check, Save, UserCheck, Shield } from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';
import { roleFetcher, permissionFetcher, staffFetcher, userFetcher } from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';

export const RolePermissionPage = () => {
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('matrix'); // 'matrix' | 'assign'
  const [roles, setRoles] = useState([]);
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [staffList, setStaffList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const [selectedRoleForPerms, setSelectedRoleForPerms] = useState(null);
  const [activePerms, setActivePerms] = useState([]);

  // Assignment states
  const [selectedStaffToAssign, setSelectedStaffToAssign] = useState('');
  const [selectedRoleToAssign, setSelectedRoleToAssign] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [roleRes, permRes, staffRes, userRes] = await Promise.allSettled([
        roleFetcher.list(),
        permissionFetcher.getGrouped(),
        staffFetcher.list(),
        userFetcher.list(),
      ]);

      const rData = roleRes.status === 'fulfilled' ? roleRes.value.data || [] : [];
      setRoles(rData);
      if (permRes.status === 'fulfilled') {
        setGroupedPermissions(permRes.value.data || {});
      }
      if (staffRes.status === 'fulfilled') {
        setStaffList(staffRes.value.data || []);
      }
      if (userRes.status === 'fulfilled') {
        setUserList(userRes.value.data || []);
      }

      if (rData.length > 0 && !selectedRoleForPerms) {
        setSelectedRoleForPerms(rData[0]);
        setActivePerms(rData[0].permissions || []);
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

  const handleAssignRoleToStaff = async () => {
    if (!selectedStaffToAssign || !selectedRoleToAssign) {
      toast.error('Please select both a staff member and a role to assign');
      return;
    }
    try {
      // Find staff and role
      const staffMember = staffList.find((s) => s._id === selectedStaffToAssign);
      const roleObj = roles.find((r) => r.code === selectedRoleToAssign || r._id === selectedRoleToAssign);

      if (staffMember?.userId) {
        await userFetcher.update(staffMember.userId, {
          role: roleObj?.isSystem ? roleObj.code : 'STAFF',
          customRoleId: roleObj?._id,
        });
      }
      toast.success(`Role ${roleObj?.name || selectedRoleToAssign} assigned to ${staffMember?.name || 'Staff'}`);
      setSelectedStaffToAssign('');
      setSelectedRoleToAssign('');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign role');
    }
  };

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
            Define custom salon roles, assign permissions, and allocate roles to staff & operators
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`btn btn-sm ${activeTab === 'matrix' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Shield className="w-4 h-4" /> Roles & Permissions Matrix
          </button>
          <button
            onClick={() => setActiveTab('assign')}
            className={`btn btn-sm ${activeTab === 'assign' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <UserCheck className="w-4 h-4" /> Assign Roles to Staff
          </button>
          <button
            onClick={() => {
              setEditingRole(null);
              setModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus className="w-4 h-4" /> Create Custom Role
          </button>
        </div>
      </div>

      {activeTab === 'assign' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Assignment Card */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              borderRadius: '12px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck className="w-5 h-5 text-pink-500" /> Allocate Role to Staff Member
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Select an employee or staff specialist, choose their security authorization role, and grant instantaneous access.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', alignItems: 'flex-end', marginTop: '0.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  1. Select Staff Member / Specialist:
                </label>
                <select
                  value={selectedStaffToAssign}
                  onChange={(e) => setSelectedStaffToAssign(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-primary)', fontWeight: 600 }}
                >
                  <option value="">-- Choose Staff Specialist --</option>
                  {staffList.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.designation || 'Specialist'}) · {s.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  2. Select Role & Access Matrix:
                </label>
                <select
                  value={selectedRoleToAssign}
                  onChange={(e) => setSelectedRoleToAssign(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-primary)', fontWeight: 600 }}
                >
                  <option value="">-- Choose Security Role --</option>
                  {roles.map((r) => (
                    <option key={r._id} value={r.code}>
                      {r.name} ({r.code}) {r.isSystem ? '[System Role]' : '[Custom Role]'}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAssignRoleToStaff}
                className="btn btn-primary"
                style={{ height: '42px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Save className="w-4 h-4" /> Save & Grant Role Access
              </button>
            </div>
          </div>

          {/* Staff Roster Roles Table */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              borderRadius: '12px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
            }}
          >
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
              Current Staff Members & Assigned Authorization
            </h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Staff Specialist</th>
                    <th>Designation</th>
                    <th>Phone / Contact</th>
                    <th>Current Assigned Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map((st) => (
                    <tr key={st._id}>
                      <td>
                        <strong style={{ color: 'var(--text-primary)' }}>{st.name}</strong>
                      </td>
                      <td>{st.designation || 'Stylist'}</td>
                      <td>{st.phone}</td>
                      <td>
                        <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', fontWeight: 700, fontSize: '0.75rem' }}>
                          {st.role || 'STAFF'}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.75rem' }}>● Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'matrix' && (
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
            System Roles ({roles.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {roles.length === 0 && !isLoading && (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No roles found. Loading defaults...
              </div>
            )}
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
      )}

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
