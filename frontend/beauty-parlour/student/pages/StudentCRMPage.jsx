/**
 * @file StudentCRMPage.jsx
 * @description Student Academy CRM & Trainee Operations Hub.
 * Features:
 * - Training plan & curriculum progression tracker with module status
 * - Biometric / Geo daily class punch clock (Green Check-in / Red Check-out)
 * - Trainee leave application & status log
 * - Verified Certificate issuance & credential download
 * - Trainer Faculty desk inquiry channel
 * - Batch cohort & peer trainee directory
 * @module frontend/src/modules/student/pages/StudentCRMPage
 */

import React, { useState } from 'react';
import { useStudent } from '../../../context/StudentContext.jsx';

export default function StudentCRMPage() {
  const { studentUser, studentProfile, branch } = useStudent();

  const [activeTab, setActiveTab] = useState('curriculum');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [punchHistory, setPunchHistory] = useState([
    {
      id: 1,
      date: 'Today',
      type: 'IN',
      time: '09:05 AM',
      branch: branch?.name || 'Main Flagship Sanctuary',
      status: 'VERIFIED',
      trainer: 'Elena Rostova',
      notes: 'Morning Bridal Hair Styling Practical Masterclass',
    },
    {
      id: 2,
      date: 'Yesterday',
      type: 'OUT',
      time: '05:15 PM',
      branch: branch?.name || 'Main Flagship Sanctuary',
      status: 'VERIFIED',
      trainer: 'Elena Rostova',
      notes: 'Skin Anatomy & Chemical Peeling Lab',
    },
    {
      id: 3,
      date: 'Yesterday',
      type: 'IN',
      time: '09:12 AM',
      branch: branch?.name || 'Main Flagship Sanctuary',
      status: 'VERIFIED',
      trainer: 'Elena Rostova',
      notes: 'On-time biometric gate punch',
    },
  ]);

  const [leaves, setLeaves] = useState([
    {
      id: 1,
      type: 'Exam Preparation',
      from: '2026-11-12',
      to: '2026-11-13',
      days: 2,
      reason: 'Preparing for CIDESCO Advanced Esthetics Theory Examination',
      status: 'APPROVED',
      approvedBy: 'Academy Dean',
    },
    {
      id: 2,
      type: 'Medical Leave',
      from: '2026-10-24',
      to: '2026-10-24',
      days: 1,
      reason: 'Fever and viral checkup with medical prescription',
      status: 'APPROVED',
      approvedBy: 'Academy Dean',
    },
  ]);

  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [newLeave, setNewLeave] = useState({
    type: 'Personal / Study',
    from: '',
    to: '',
    days: 1,
    reason: '',
  });

  const [inquiries, setInquiries] = useState([
    {
      id: 1,
      subject: 'Airbrush Gun PSI Setting for HD Bridal Makeup',
      trainer: 'Elena Rostova (Lead Cosmetology Trainer)',
      date: '2026-11-02',
      status: 'ANSWERED',
      reply: 'Maintain 12-15 PSI for liquid silicone foundation to prevent skin stippling. See Module 4 video.',
    },
  ]);
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryText, setInquiryText] = useState('');

  // Handle Punch In / Out
  const handlePunch = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (!isCheckedIn) {
      setIsCheckedIn(true);
      setCheckInTime(timeStr);
      setPunchHistory([
        {
          id: Date.now(),
          date: 'Today',
          type: 'IN',
          time: timeStr,
          branch: branch?.name || 'Main Flagship Sanctuary',
          status: 'VERIFIED',
          trainer: 'Elena Rostova',
          notes: 'Trainee GPS check-in verified at Academy Lab A',
        },
        ...punchHistory,
      ]);
    } else {
      setIsCheckedIn(false);
      setPunchHistory([
        {
          id: Date.now(),
          date: 'Today',
          type: 'OUT',
          time: timeStr,
          branch: branch?.name || 'Main Flagship Sanctuary',
          status: 'VERIFIED',
          trainer: 'Elena Rostova',
          notes: 'Class session completed. Punch out logged.',
        },
        ...punchHistory,
      ]);
    }
  };

  const submitLeave = (e) => {
    e.preventDefault();
    if (!newLeave.from || !newLeave.reason) return;
    setLeaves([
      {
        id: Date.now(),
        ...newLeave,
        status: 'PENDING',
        approvedBy: 'Academy Coordinator',
      },
      ...leaves,
    ]);
    setLeaveModalOpen(false);
    setNewLeave({ type: 'Personal / Study', from: '', to: '', days: 1, reason: '' });
  };

  const submitInquiry = (e) => {
    e.preventDefault();
    if (!inquirySubject || !inquiryText) return;
    setInquiries([
      {
        id: Date.now(),
        subject: inquirySubject,
        trainer: 'Elena Rostova (Lead Cosmetology Trainer)',
        date: 'Just now',
        status: 'PENDING',
        reply: 'Assigned to trainer desk. Awaiting review.',
      },
      ...inquiries,
    ]);
    setInquirySubject('');
    setInquiryText('');
  };

  // Enrolled Plan Data
  const enrolledPlan = {
    title: 'Diploma in Advanced Cosmetology, Hair & Laser Aesthetics',
    level: 'Master Professional Tier III',
    batchCode: 'ACM-2026-B4',
    progress: 74,
    enrolledDate: '15 Aug 2026',
    completionDate: '28 Feb 2027',
    totalHours: 420,
    completedHours: 310,
    modules: [
      { id: 1, title: 'Module 1: Trichology & Scalp Biochemistry', hours: 40, status: 'COMPLETED', grade: '96%' },
      { id: 2, title: 'Module 2: Advanced Precision Hair Sculpting & Balayage', hours: 80, status: 'COMPLETED', grade: '94%' },
      { id: 3, title: 'Module 3: Derma Esthetics, Chemical Peels & Hydra-Infusion', hours: 90, status: 'COMPLETED', grade: '98%' },
      { id: 4, title: 'Module 4: Cinematic HD & Airbrush Bridal Artistry', hours: 100, status: 'IN_PROGRESS', grade: 'In Review' },
      { id: 5, title: 'Module 5: Salon Clinic Management, POS & Ethics', hours: 60, status: 'UPCOMING', grade: 'Pending' },
      { id: 6, title: 'Module 6: Final Portfolio Defense & Live Model Exam', hours: 50, status: 'UPCOMING', grade: 'Pending' },
    ],
  };

  // Peer Batch Mates
  const peers = [
    { name: 'Pooja Verma', avatar: '👩‍🦰', phone: '+91 98765 11001', specialization: 'Airbrush Bridal Makeup', progress: 80 },
    { name: 'Kavita Sen', avatar: '👩', phone: '+91 98765 11002', specialization: 'Laser & Derma Peeling', progress: 75 },
    { name: 'Zoya Khan', avatar: '🧕', phone: '+91 98765 11003', specialization: 'Hair Couture & Balayage', progress: 72 },
    { name: 'Aarav Malhotra', avatar: '👨', phone: '+91 98765 11004', specialization: 'Barbering & Hair Prosthetics', progress: 68 },
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px', color: '#f8fafc' }}>
      {/* Top Banner Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          borderRadius: '20px',
          padding: '28px 32px',
          marginBottom: '28px',
          boxShadow: '0 20px 40px -15px rgba(67, 56, 202, 0.4)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px' }}>🎓</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '1.2px',
                padding: '4px 10px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#e0e7ff',
              }}
            >
              Academy CRM & Trainee Operations Hub
            </span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, margin: '0 0 6px 0', color: '#ffffff' }}>
            {studentProfile?.name || studentUser?.name || 'Trainee Student'}
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#c7d2fe' }}>
            Batch: <strong>{enrolledPlan.batchCode}</strong> · Enrolled: {enrolledPlan.title} · Campus: {branch?.name || 'Main Sanctuary'}
          </p>
        </div>

        {/* Punch Clock Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#c7d2fe', marginBottom: '2px' }}>Class Shift Punch Clock</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: isCheckedIn ? '#4ade80' : '#f87171' }}>
              ● {isCheckedIn ? `Punched IN at ${checkInTime}` : 'Currently Punched OUT'}
            </div>
          </div>
          <button
            onClick={handlePunch}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 26px',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              border: 'none',
              background: isCheckedIn
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              boxShadow: isCheckedIn
                ? '0 10px 25px -5px rgba(239, 68, 68, 0.5)'
                : '0 10px 25px -5px rgba(16, 185, 129, 0.5)',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '18px' }}>{isCheckedIn ? '🔴' : '🟢'}</span>
            {isCheckedIn ? 'Check-Out (End Class)' : 'Check-In (Punch In)'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}
      >
        {[
          { key: 'curriculum', label: 'Curriculum & Modules', icon: '📚' },
          { key: 'attendance', label: 'Class Punch Clock & Log', icon: '⏱️' },
          { key: 'leaves', label: 'Leave Applications', icon: '🏖️' },
          { key: 'certificates', label: 'Certificates & Vault', icon: '📜' },
          { key: 'trainers', label: 'Trainer Desk & Q&A', icon: '👩‍🏫' },
          { key: 'batchmates', label: 'Batch Mates & Cohort', icon: '👥' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === tab.key ? '#6366f1' : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === tab.key ? '#ffffff' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Curriculum & Modules */}
      {activeTab === 'curriculum' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
          <div>
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(12px)',
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '24px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 800 }}>Enrolled Training Plan</h3>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>{enrolledPlan.title}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '24px', fontWeight: 900, color: '#818cf8' }}>{enrolledPlan.progress}%</span>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Overall Completion</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '10px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
                <div
                  style={{
                    width: `${enrolledPlan.progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
                    borderRadius: '10px',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total Curriculum</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, marginTop: '2px' }}>{enrolledPlan.totalHours} Hours</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Completed Hours</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>{enrolledPlan.completedHours} Hours</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Target Completion</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, marginTop: '2px' }}>{enrolledPlan.completionDate}</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Certification Tier</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#ec4899', marginTop: '2px' }}>Tier III Gold</div>
                </div>
              </div>
            </div>

            {/* Modules List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {enrolledPlan.modules.map((mod) => (
                <div
                  key={mod.id}
                  style={{
                    background: 'rgba(30, 41, 59, 0.7)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '18px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background:
                            mod.status === 'COMPLETED'
                              ? 'rgba(16, 185, 129, 0.2)'
                              : mod.status === 'IN_PROGRESS'
                              ? 'rgba(99, 102, 241, 0.2)'
                              : 'rgba(148, 163, 184, 0.2)',
                          color:
                            mod.status === 'COMPLETED'
                              ? '#34d399'
                              : mod.status === 'IN_PROGRESS'
                              ? '#818cf8'
                              : '#94a3b8',
                        }}
                      >
                        {mod.status}
                      </span>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>{mod.title}</h4>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                      Duration: {mod.hours} Practicum Hours · Academic Score: <strong>{mod.grade}</strong>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: 'none',
                        color: '#f8fafc',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      📖 Syllabus & Notes
                    </button>
                    {mod.status === 'COMPLETED' && (
                      <button
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          background: 'rgba(16, 185, 129, 0.2)',
                          border: 'none',
                          color: '#34d399',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        ✓ Passed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions & Trainee Specs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '22px',
              }}
            >
              <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', fontWeight: 800 }}>⚡ Trainee Fast Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => setLeaveModalOpen(true)}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span>🏖️</span> Apply for Leave
                </button>
                <button
                  onClick={() => setActiveTab('trainers')}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span>👩‍🏫</span> Ask Trainer a Question
                </button>
                <button
                  onClick={() => setActiveTab('certificates')}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span>📜</span> View Issued Certificates
                </button>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '22px',
              }}
            >
              <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', fontWeight: 800 }}>📌 Academy Guidelines</h3>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#94a3b8', lineHeight: '1.8' }}>
                <li>Minimum 80% biometric attendance required for certificate eligibility.</li>
                <li>Live model practicum requires prior sterilization sign-off by master trainer.</li>
                <li>Uniform and lab smock compulsory during all clinic practical sessions.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Class Punch Clock & Log */}
      {activeTab === 'attendance' && (
        <div style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '18px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 800 }}>Biometric Attendance & Class Shift Log</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                Green badges indicate confirmed check-ins; red badges represent verified class completion check-outs.
              </p>
            </div>
            <button
              onClick={handlePunch}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                border: 'none',
                background: isCheckedIn ? '#ef4444' : '#10b981',
                color: '#ffffff',
              }}
            >
              {isCheckedIn ? '🔴 Punch Out' : '🟢 Punch In'}
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', fontSize: '12px' }}>
                  <th style={{ padding: '12px 16px' }}>DATE & TIME</th>
                  <th style={{ padding: '12px 16px' }}>PUNCH TYPE</th>
                  <th style={{ padding: '12px 16px' }}>BRANCH / LAB</th>
                  <th style={{ padding: '12px 16px' }}>SUPERVISING TRAINER</th>
                  <th style={{ padding: '12px 16px' }}>CURRICULUM PRACTICUM</th>
                  <th style={{ padding: '12px 16px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {punchHistory.map((punch) => (
                  <tr key={punch.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '13px' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700 }}>{punch.time}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{punch.date}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 800,
                          background: punch.type === 'IN' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: punch.type === 'IN' ? '#10b981' : '#ef4444',
                        }}
                      >
                        {punch.type === 'IN' ? '🟢 CHECK-IN' : '🔴 CHECK-OUT'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{punch.branch}</td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{punch.trainer}</td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '12px' }}>{punch.notes}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8' }}>✓ {punch.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Leaves */}
      {activeTab === 'leaves' && (
        <div style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '18px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 800 }}>Student Leave & Absence Applications</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                Apply for study leaves, medical leave, or scheduled examination leaves.
              </p>
            </div>
            <button
              onClick={() => setLeaveModalOpen(true)}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                border: 'none',
                background: '#6366f1',
                color: '#ffffff',
              }}
            >
              + Apply New Leave
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {leaves.map((leave) => (
              <div
                key={leave.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 800, fontSize: '14px' }}>{leave.type}</span>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 800,
                        background: leave.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: leave.status === 'APPROVED' ? '#34d399' : '#f59e0b',
                      }}
                    >
                      {leave.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    Dates: {leave.from} {leave.to ? `to ${leave.to}` : ''} ({leave.days} Day{leave.days > 1 ? 's' : ''})
                  </div>
                  <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>Reason: {leave.reason}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#94a3b8' }}>
                  Reviewed by: <strong>{leave.approvedBy}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Certificates */}
      {activeTab === 'certificates' && (
        <div style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '18px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: '18px', fontWeight: 800 }}>📜 Verified Academy Credentials & Digital Vault</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(49, 46, 129, 0.8) 100%)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏆</div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800 }}>Certified Trichology & Scalp Specialist</h4>
              <p style={{ fontSize: '12px', color: '#c7d2fe', margin: '0 0 14px 0' }}>
                Issued by Glamour Cosmetology Academy · Credential ID: GCA-TRIC-88910
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => alert('Downloading official digital certificate PDF with cryptographic verification QR.')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: '#6366f1',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  ⬇️ Download Certificate
                </button>
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, rgba(20, 40, 60, 0.8) 0%, rgba(15, 30, 50, 0.8) 100%)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎖️</div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800 }}>Derma Chemical Peeling & Skin Rejuvenation</h4>
              <p style={{ fontSize: '12px', color: '#bae6fd', margin: '0 0 14px 0' }}>
                Issued by Glamour Cosmetology Academy · Credential ID: GCA-DERM-44102
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => alert('Downloading official digital certificate PDF with cryptographic verification QR.')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  ⬇️ Download Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Trainer Desk */}
      {activeTab === 'trainers' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '18px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 800 }}>👩‍🏫 Trainer Inquiry & Q&A Thread</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 800, fontSize: '14px' }}>{inq.subject}</div>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 800,
                        background: inq.status === 'ANSWERED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: inq.status === 'ANSWERED' ? '#34d399' : '#f59e0b',
                      }}
                    >
                      {inq.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                    Trainer: <strong>{inq.trainer}</strong> · {inq.date}
                  </div>
                  <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '12px', borderRadius: '8px', fontSize: '13px', color: '#e0e7ff', borderLeft: '3px solid #6366f1' }}>
                    💬 {inq.reply}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={submitInquiry} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>Submit New Doubt to Faculty Desk</h4>
              <input
                type="text"
                placeholder="Subject / Topic (e.g. Skin undertone neutralization with orange corrector)"
                value={inquirySubject}
                onChange={(e) => setInquirySubject(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '13px',
                }}
              />
              <textarea
                placeholder="Describe your question or difficulty encountered during practical lab work..."
                rows={3}
                value={inquiryText}
                onChange={(e) => setInquiryText(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '13px',
                  resize: 'vertical',
                }}
              />
              <button
                type="submit"
                style={{
                  alignSelf: 'flex-start',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: '#6366f1',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Send Question to Trainer
              </button>
            </form>
          </div>

          {/* Assigned Faculty Profile */}
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '18px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 800 }}>Master Faculty Lead</h3>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>👩‍🏫</div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 800 }}>Elena Rostova</h4>
              <div style={{ fontSize: '12px', color: '#818cf8', fontWeight: 700 }}>CIDESCO Zurich Certified Cosmetologist</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Lead Trainer · Bridal Hair & Derma Specialist</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
              Office Hours: Monday - Friday, 02:00 PM - 04:00 PM at Lab Studio 2.
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Batch Mates */}
      {activeTab === 'batchmates' && (
        <div style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '18px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 800 }}>👥 Batch Cohort & Peer Trainee Directory</h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#94a3b8' }}>
            Batch: <strong>{enrolledPlan.batchCode}</strong> · Connect with fellow academy classmates for joint portfolio practicals.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {peers.map((peer, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '18px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div style={{ fontSize: '32px' }}>{peer.avatar}</div>
                <div>
                  <h4 style={{ margin: '0 0 2px 0', fontSize: '15px', fontWeight: 700 }}>{peer.name}</h4>
                  <div style={{ fontSize: '12px', color: '#818cf8', marginBottom: '2px' }}>{peer.specialization}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Progress: {peer.progress}% Completed</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leave Application Modal */}
      {leaveModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#1e293b',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '28px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
            }}
          >
            <h3 style={{ margin: '0 0 18px 0', fontSize: '18px', fontWeight: 800 }}>Apply for Student Leave</h3>
            <form onSubmit={submitLeave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Leave Category</label>
                <select
                  value={newLeave.type}
                  onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '13px',
                  }}
                >
                  <option value="Personal / Study">Personal / Study Leave</option>
                  <option value="Medical Leave">Medical Leave (Doctor Certificate)</option>
                  <option value="Exam Preparation">Board Examination Leave</option>
                  <option value="Family Function">Family Event</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>From Date</label>
                  <input
                    type="date"
                    required
                    value={newLeave.from}
                    onChange={(e) => setNewLeave({ ...newLeave, from: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: '#0f172a',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '13px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>To Date</label>
                  <input
                    type="date"
                    value={newLeave.to}
                    onChange={(e) => setNewLeave({ ...newLeave, to: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: '#0f172a',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Reason for Leave</label>
                <textarea
                  required
                  rows={3}
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  placeholder="State the academic or personal reason..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '13px',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setLeaveModalOpen(false)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    background: '#6366f1',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

