/**
 * @file StructureManagementPage.jsx
 * @description Dynamic Organizational Structure: Departments, Designations, and Skills.
 * Conforms strictly to Phase 04 Section 3 requirements (NO hardcoded roles).
 * @module frontend/src/modules/admin/pages/StructureManagementPage
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Layers, Award, Sparkles } from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';
import { departmentFetcher, designationFetcher, skillFetcher } from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';

export const StructureManagementPage = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('departments'); // 'departments' | 'designations' | 'skills'

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'departments') {
        const res = await departmentFetcher.list();
        setDepartments(res.data || []);
      } else if (activeTab === 'designations') {
        const [desigRes, deptRes] = await Promise.all([
          designationFetcher.list(),
          departmentFetcher.list(),
        ]);
        setDesignations(desigRes.data || []);
        setDepartments(deptRes.data || []);
      } else {
        const [skillRes, deptRes] = await Promise.all([
          skillFetcher.list(),
          departmentFetcher.list(),
        ]);
        setSkills(skillRes.data || []);
        setDepartments(deptRes.data || []);
      }
    } catch (err) {
      toast.error('Failed to load organizational structure data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleSave = async (data) => {
    try {
      if (activeTab === 'departments') {
        if (editingItem) {
          await departmentFetcher.update(editingItem._id, data);
          toast.success('Department updated');
        } else {
          await departmentFetcher.create(data);
          toast.success('Department created');
        }
      } else if (activeTab === 'designations') {
        if (editingItem) {
          await designationFetcher.update(editingItem._id, data);
          toast.success('Designation updated');
        } else {
          await designationFetcher.create(data);
          toast.success('Designation created');
        }
      } else {
        if (editingItem) {
          await skillFetcher.update(editingItem._id, data);
          toast.success('Skill updated');
        } else {
          await skillFetcher.create(data);
          toast.success('Skill created');
        }
      }
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      if (activeTab === 'departments') {
        await departmentFetcher.delete(id);
      } else if (activeTab === 'designations') {
        await designationFetcher.delete(id);
      } else {
        await skillFetcher.delete(id);
      }
      toast.success('Record deleted');
      loadData();
    } catch (err) {
      toast.error('Could not delete record');
    }
  };

  const departmentFields = [
    { name: 'name', label: 'Department Name', required: true, placeholder: 'e.g. Makeup, Salon, Hair, Spa' },
    { name: 'code', label: 'Department Code', placeholder: 'e.g. MKP, SALON, HAIR' },
    { name: 'description', label: 'Description', type: 'textarea' },
  ];

  const designationFields = [
    { name: 'name', label: 'Designation Title', required: true, placeholder: 'e.g. Senior Makeup Artist, Master Stylist' },
    {
      name: 'department',
      label: 'Department',
      type: 'select',
      required: true,
      options: departments.map((d) => ({ label: d.name, value: d._id })),
    },
    { name: 'description', label: 'Job Scope / Description', type: 'textarea' },
  ];

  const skillFields = [
    { name: 'name', label: 'Skill Name', required: true, placeholder: 'e.g. Airbrush Bridal Makeup, Layer Haircut, Swedish Massage' },
    {
      name: 'department',
      label: 'Department',
      type: 'select',
      options: departments.map((d) => ({ label: d.name, value: d._id })),
    },
    { name: 'description', label: 'Skill Details', type: 'textarea' },
  ];

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.name}</div>
          {row.code && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Code: {row.code}</div>}
        </div>
      ),
    },
    ...(activeTab !== 'departments'
      ? [
          {
            header: 'Department',
            render: (row) => row.department?.name || departments.find((d) => d._id === row.department)?.name || 'General',
          },
        ]
      : []),
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => (
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {row.description || '—'}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => {
              setEditingItem(row);
              setModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="btn btn-secondary btn-sm"
            style={{ color: '#ef4444' }}
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
            Organizational Structure
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Configure dynamic departments, designations, and professional skills without code changes
          </p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setModalOpen(true);
          }}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus className="w-4 h-4" /> Add {activeTab.slice(0, -1)}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('departments')}
          className={`btn ${activeTab === 'departments' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Layers className="w-4 h-4" /> Departments
        </button>
        <button
          onClick={() => setActiveTab('designations')}
          className={`btn ${activeTab === 'designations' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Award className="w-4 h-4" /> Designations
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`btn ${activeTab === 'skills' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Sparkles className="w-4 h-4" /> Skills
        </button>
      </div>

      <DataTable
        columns={columns}
        data={activeTab === 'departments' ? departments : activeTab === 'designations' ? designations : skills}
        isLoading={isLoading}
        searchPlaceholder={`Search ${activeTab}...`}
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editingItem
            ? `Edit ${activeTab.slice(0, -1)}`
            : `Add New ${activeTab.slice(0, -1)}`
        }
        fields={
          activeTab === 'departments'
            ? departmentFields
            : activeTab === 'designations'
            ? designationFields
            : skillFields
        }
        initialData={editingItem || {}}
        onSubmit={handleSave}
      />
    </div>
  );
};

export default StructureManagementPage;
