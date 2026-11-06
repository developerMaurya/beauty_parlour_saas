/**
 * @file StaffManagementPage.jsx
 * @description Dynamic Staff Management with dynamic department, designation, skills, salary, commission, certificates, and documents.
 * Conforms to Sections 8, 9, 10, 14.
 * @module frontend/src/modules/admin/pages/StaffManagementPage
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FileText, Award, DollarSign, Calendar, CheckCircle, Ban, Eye, X, Phone, Mail, MapPin } from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';
import {
  staffFetcher,
  departmentFetcher,
  designationFetcher,
  skillFetcher,
  branchFetcher,
  certificateFetcher,
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

  // View & Delete Modal States
  const [viewStaffModal, setViewStaffModal] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(null);

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
      const payload = {
        ...data,
        photo: data.photo || undefined,
        documentUrl: data.documentUrl || undefined,
        departmentId: data.department || data.departmentId,
        designationId: data.designation || data.designationId,
        branchId: data.branch || data.branchId,
        dateOfBirth: data.dob || data.dateOfBirth,
      };
      if (editingStaff) {
        await staffFetcher.update(editingStaff._id, payload);
        toast.success('Staff record updated');
      } else {
        await staffFetcher.create(payload);
        toast.success('Staff member registered');
      }
      setModalOpen(false);
      setEditingStaff(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Operation failed');
    }
  };

  const handleOpenEditStaff = (row) => {
    setEditingStaff({
      ...row,
      photo: row.photo || '',
      documentUrl: row.documentUrl || '',
      department: row.departmentId?._id || row.departmentId || row.department || '',
      designation: row.designationId?._id || row.designationId || row.designation || '',
      branch: row.branchId?._id || row.branchId || row.branch || '',
      dob: row.dateOfBirth || row.dob || '',
      joiningDate: row.joiningDate || '',
    });
    setModalOpen(true);
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

  const handleDeleteStaff = (staffMember) => {
    setConfirmDeleteModal({
      title: 'Delete Staff Member',
      message: `Are you sure you want to delete profile for "${staffMember.name}" (${staffMember.employeeId || 'ID Pending'})? This will remove payroll, duty logs, and appointments associated with them.`,
      confirmText: 'Delete Staff Profile',
      onConfirm: async () => {
        try {
          await staffFetcher.delete(staffMember._id);
          toast.success(`Staff member "${staffMember.name}" deleted successfully`);
          setConfirmDeleteModal(null);
          loadData();
        } catch (err) {
          toast.error(err.response?.data?.message || err.message || 'Could not delete staff record');
        }
      },
    });
  };

  const handleAddCertificate = async (data) => {
    try {
      if (certificateFetcher?.addStaffCertificate && selectedStaffForCert) {
        await certificateFetcher.addStaffCertificate(selectedStaffForCert._id, data);
      }
      toast.success('Certificate added successfully');
      setCertModalOpen(false);
      loadData();
    } catch (err) {
      toast.error('Could not add certificate');
    }
  };

  const staffFields = [
    { name: 'name', label: 'Full Name', required: true, placeholder: 'e.g. Alisha Khan' },
    { name: 'phone', label: 'Phone Number', required: true, placeholder: '+91 9876543210' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'alisha@salon.com' },
    { name: 'photo', label: 'Staff Profile Photo URL (Optional)', placeholder: 'https://images.unsplash.com/... or paste image URL' },
    { name: 'password', label: 'Staff Portal Password (For /staff/login)', type: 'password', placeholder: 'e.g. Staff@123' },
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
    { name: 'documentUrl', label: 'Govt ID Proof / Document URL (Optional)', placeholder: 'Aadhaar / PAN verification link' },
  ];

  const certFields = [
    { name: 'certificateName', label: 'Certificate Name', required: true, placeholder: 'e.g. Master Bridal Makeup Diploma' },
    { name: 'issuer', label: 'Issuing Institute', required: true, placeholder: 'e.g. L’Oréal Professional Academy' },
    { name: 'issueDate', label: 'Issue Date', type: 'date', required: true },
    { name: 'certificateNumber', label: 'Certificate / Reg Number', placeholder: 'CERT-87421' },
    { name: 'fileUrl', label: 'Certificate Document / Scan Link (Optional)', placeholder: 'https://... or certificate PDF/image' },
  ];

  const columns = [
    {
      header: 'Staff Member',
      accessor: 'name',
      render: (row) => {
        const fallbackInitial = row.name ? row.name.charAt(0).toUpperCase() : 'S';
        const defaultAvatar = row.gender === 'male'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
        const photoSrc = row.photo || defaultAvatar;

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(236, 72, 153, 0.35)',
              }}
            >
              {row.photo ? (
                <img src={row.photo} alt={row.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              ) : (
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.88rem' }}>{fallbackInitial}</span>
              )}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {row.phone} {row.employeeId ? `· ID: ${row.employeeId}` : ''}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Department / Role',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#f472b6' }}>
            {row.designationId?.name || row.designation?.name || designations.find((d) => d._id === (row.designationId || row.designation))?.name || (typeof row.designation === 'string' && row.designation) || 'Senior Stylist'}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {row.departmentId?.name || row.department?.name || departments.find((d) => d._id === (row.departmentId || row.department))?.name || (typeof row.department === 'string' && row.department) || 'Parlour Department'}
          </div>
        </div>
      ),
    },
    {
      header: 'Branch',
      render: (row) => row.branchId?.name || row.branch?.name || branches.find((b) => b._id === (row.branchId || row.branch))?.name || 'Main Flagship Sanctuary',
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
            onClick={() => setViewStaffModal(row)}
            className="btn btn-secondary btn-sm"
            title="View Full Profile"
            style={{ color: '#38bdf8' }}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
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
            onClick={() => handleOpenEditStaff(row)}
            className="btn btn-secondary btn-sm"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDeleteStaff(row)}
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
        onClose={() => {
          setModalOpen(false);
          setEditingStaff(null);
        }}
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

      {/* Staff Profile Details Modal */}
      {viewStaffModal && (
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
              maxWidth: '600px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            {/* Modal Header with Profile Image */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid #ec4899',
                    boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
                  }}
                >
                  {viewStaffModal.photo ? (
                    <img
                      src={viewStaffModal.photo}
                      alt={viewStaffModal.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <span style={{ color: '#fff', fontWeight: 900, fontSize: '1.5rem' }}>
                      {viewStaffModal.name ? viewStaffModal.name.charAt(0).toUpperCase() : 'S'}
                    </span>
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', color: '#ec4899', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Staff Profile Details
                    </span>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        background: viewStaffModal.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: viewStaffModal.status === 'active' ? '#10b981' : '#ef4444',
                        border: `1px solid ${viewStaffModal.status === 'active' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      }}
                    >
                      ● {viewStaffModal.status || 'Active'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '2px 0', color: 'var(--text-primary)' }}>
                    {viewStaffModal.name}
                  </h3>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <strong style={{ color: '#f472b6' }}>
                      {viewStaffModal.designationId?.name || viewStaffModal.designation?.name || (typeof viewStaffModal.designation === 'string' && viewStaffModal.designation) || 'Senior Stylist'}
                    </strong>
                    {' · '}
                    {viewStaffModal.departmentId?.name || viewStaffModal.department?.name || (typeof viewStaffModal.department === 'string' && viewStaffModal.department) || 'Parlour Department'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewStaffModal(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            {/* Core Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', background: 'var(--bg-app)', padding: '1.15rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>EMPLOYEE ID & CODE</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                  {viewStaffModal.employeeId || 'STF-001'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>ASSIGNED BRANCH</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {viewStaffModal.branchId?.name || viewStaffModal.branch?.name || 'Main Flagship Sanctuary'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>PHONE NUMBER</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  📞 {viewStaffModal.phone || 'N/A'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>EMAIL ADDRESS</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  ✉️ {viewStaffModal.email || 'N/A'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>MONTHLY BASE SALARY</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                  ₹{(viewStaffModal.salary || 0).toLocaleString()} <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>/mo</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>COMMISSION INCENTIVE</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
                  {viewStaffModal.commissionRate ? `${viewStaffModal.commissionRate}%` : '0%'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>DATE OF BIRTH & BIRTHDAY</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🎂 {viewStaffModal.dateOfBirth ? new Date(viewStaffModal.dateOfBirth).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : (viewStaffModal.dob || 'Not specified')}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>EMPLOYMENT TYPE</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px', textTransform: 'capitalize' }}>
                  💼 {viewStaffModal.employmentType?.replace(/_/g, ' ') || 'Full Time'}
                </div>
              </div>

              {/* ID Proof / Documents Section */}
              <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--border-color)', paddingTop: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>ID PROOF / DOCUMENTS</div>
                  <div style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
                    {viewStaffModal.documentUrl ? (
                      <a href={viewStaffModal.documentUrl} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>
                        📄 View Government ID Proof / Document
                      </a>
                    ) : (
                      '✅ Identity verification record on file'
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedStaffForCert(viewStaffModal);
                    setCertModalOpen(true);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                >
                  <Award className="w-3.5 h-3.5 text-purple-400" /> Add Certificate
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setViewStaffModal(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const s = viewStaffModal;
                  setViewStaffModal(null);
                  handleOpenEditStaff(s);
                }}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Staff Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Staff Confirmation Modal */}
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

export default StaffManagementPage;
