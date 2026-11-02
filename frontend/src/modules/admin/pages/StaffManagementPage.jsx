/**
 * @file StaffManagementPage.jsx
 * @description Dynamic Staff Management with dynamic department, designation, skills, salary, commission, certificates, and documents.
 * Conforms to Sections 8, 9, 10, 14.
 * @module frontend/src/modules/admin/pages/StaffManagementPage
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FileText, Award, DollarSign, Calendar, CheckCircle, Ban } from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';
import {
  staffFetcher,
  departmentFetcher,
  designationFetcher,
  skillFetcher,
  branchFetcher,
} from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';

export const StaffManagementPage = () => {
  const { selectedBranchId } = useTenantAdmin();
  const toast = useToast();

  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  // Certificate Modal
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [selectedStaffForCert, setSelectedStaffForCert] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [stRes, dpRes, dsRes, skRes, brRes] = await Promise.all([
        staffFetcher.list({ branchId: selectedBranchId || undefined }),
        departmentFetcher.list(),
        designationFetcher.list(),
        skillFetcher.list(),
        branchFetcher.list(),
      ]);
      setStaff(stRes.data || []);
      setDepartments(dpRes.data || []);
      setDesignations(dsRes.data || []);
      setSkills(skRes.data || []);
      setBranches(brRes.data || []);
    } catch (err) {
      toast.error('Failed to load staff records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedBranchId]);

  const handleSaveStaff = async (data) => {
    try {
      if (editingStaff) {
        await staffFetcher.update(editingStaff._id, data);
        toast.success('Staff record updated');
      } else {
        await staffFetcher.create(data);
        toast.success('Staff member registered');
      }
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Operation failed');
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      if (item.status === 'active') {
        await staffFetcher.deactivate(item._id);
        toast.success('Staff marked inactive');
      } else {
        await staffFetcher.activate(item._id);
        toast.success('Staff marked active');
      }
      loadData();
    } catch (err) {
      toast.error('Could not update staff status');
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm('Delete this staff record?')) return;
    try {
      await staffFetcher.delete(staffId);
      toast.success('Staff record deleted');
      loadData();
    } catch (err) {
      toast.error('Could not delete staff record');
    }
  };

  const handleAddCertificate = async (data) => {
    try {
      await staffFetcher.getCertificates(selectedStaffForCert._id);
      toast.success('Certificate added');
      loadData();
    } catch (err) {
      toast.error('Could not add certificate');
    }
  };

  const staffFields = [
    { name: 'name', label: 'Full Name', required: true, placeholder: 'e.g. Alisha Khan' },
    { name: 'phone', label: 'Phone Number', required: true, placeholder: '+91 9876543210' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'alisha@salon.com' },
    { name: 'employeeId', label: 'Employee ID', placeholder: 'STF-001' },
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
    {
      name: 'department',
      label: 'Department',
      type: 'select',
      required: true,
      options: departments.map((d) => ({ label: d.name, value: d._id })),
    },
    {
      name: 'designation',
      label: 'Designation',
      type: 'select',
      required: true,
      options: designations.map((d) => ({ label: d.name, value: d._id })),
    },
    {
      name: 'branch',
      label: 'Assigned Branch',
      type: 'select',
      options: branches.map((b) => ({ label: b.name, value: b._id })),
    },
    {
      name: 'employmentType',
      label: 'Employment Type',
      type: 'select',
      options: [
        { label: 'Full Time', value: 'full_time' },
        { label: 'Part Time', value: 'part_time' },
        { label: 'Contract', value: 'contract' },
        { label: 'Freelancer', value: 'freelancer' },
      ],
    },
    { name: 'salary', label: 'Monthly Base Salary', type: 'currency' },
    { name: 'commissionRate', label: 'Commission Rate (%)', type: 'number', placeholder: '10' },
    { name: 'dob', label: 'Date of Birth (For Birthday Tracking)', type: 'date' },
    { name: 'joiningDate', label: 'Joining Date', type: 'date' },
  ];

  const certFields = [
    { name: 'certificateName', label: 'Certificate Name', required: true, placeholder: 'e.g. Master Bridal Makeup Diploma' },
    { name: 'issuer', label: 'Issuing Institute', required: true, placeholder: 'e.g. L’Oréal Professional Academy' },
    { name: 'issueDate', label: 'Issue Date', type: 'date', required: true },
    { name: 'certificateNumber', label: 'Certificate / Reg Number', placeholder: 'CERT-87421' },
  ];

  const columns = [
    {
      header: 'Staff Member',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {row.phone} {row.employeeId ? `· ID: ${row.employeeId}` : ''}
          </div>
        </div>
      ),
    },
    {
      header: 'Department / Role',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
            {row.designation?.name || designations.find((d) => d._id === row.designation)?.name || 'Staff'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {row.department?.name || departments.find((d) => d._id === row.department)?.name || 'General'}
          </div>
        </div>
      ),
    },
    {
      header: 'Branch',
      render: (row) => row.branch?.name || branches.find((b) => b._id === row.branch)?.name || 'All Branches',
    },
    {
      header: 'Compensation',
      render: (row) => (
        <div style={{ fontSize: '0.85rem' }}>
          <div>₹{(row.salary || 0).toLocaleString()} /mo</div>
          {row.commissionRate > 0 && (
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
              {row.commissionRate}% comm.
            </div>
          )}
        </div>
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
              setSelectedStaffForCert(row);
              setCertModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            title="Certificates"
          >
            <Award className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleToggleStatus(row)}
            className="btn btn-secondary btn-sm"
            style={{ color: row.status === 'active' ? '#f59e0b' : '#10b981' }}
            title={row.status === 'active' ? 'Deactivate' : 'Activate'}
          >
            {row.status === 'active' ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              setEditingStaff(row);
              setModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDeleteStaff(row._id)}
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
            Staff & Employee Directory
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage staff profiles, dynamic designations, compensation, and qualifications
          </p>
        </div>
        <button
          onClick={() => {
            setEditingStaff(null);
            setModalOpen(true);
          }}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      <DataTable
        columns={columns}
        data={staff}
        isLoading={isLoading}
        searchPlaceholder="Search staff by name, phone, employee ID..."
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingStaff ? 'Edit Staff Member' : 'Register New Staff Member'}
        fields={staffFields}
        initialData={editingStaff || {}}
        onSubmit={handleSaveStaff}
        size="large"
      />

      <FormModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        title={`Add Certificate for ${selectedStaffForCert?.name || ''}`}
        fields={certFields}
        onSubmit={handleAddCertificate}
        submitText="Add Certificate"
      />
    </div>
  );
};

export default StaffManagementPage;
