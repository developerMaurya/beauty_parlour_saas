/**
 * @file StaffReportsPage.jsx
 * @description Personal Authorized Operational & Financial Reports for Staff.
 * Conforms to Phase 05 Section 47.
 */

import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext.jsx';
import * as repApi from '../../../services/api/staff/reportFetcher.js';

export default function StaffReportsPage() {
  const { success, error: toastError } = useToast();

  const [activeReport, setActiveReport] = useState('attendance');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { id: 'attendance', label: 'Attendance & Hours Report', icon: '⏱️' },
    { id: 'appointments', label: 'Appointments Handled Report', icon: '✂️' },
    { id: 'services', label: 'Completed Services Breakdown', icon: '✨' },
    { id: 'earnings', label: 'Earnings & Salary Statement', icon: '💰' },
    { id: 'commission', label: 'Commission Statement', icon: '💵' },
    { id: 'home-services', label: 'Doorstep Home Visits Log', icon: '🚗' },
    { id: 'performance', label: 'Specialist Performance Summary', icon: '📈' },
  ];

  const handleGenerate = async (typeId) => {
    setActiveReport(typeId);
    try {
      setLoading(true);
      let res;
      if (typeId === 'attendance') res = await repApi.getAttendanceReport();
      else if (typeId === 'appointments') res = await repApi.getAppointmentsReport();
      else if (typeId === 'services') res = await repApi.getServicesReport();
      else if (typeId === 'earnings') res = await repApi.getEarningsReport();
      else if (typeId === 'commission') res = await repApi.getCommissionReport();
      else if (typeId === 'home-services') res = await repApi.getHomeServicesReport();
      else if (typeId === 'performance') res = await repApi.getPerformanceReport();

      setReportData(res?.data || {});
      success(`${reportTypes.find((r) => r.id === typeId)?.label} generated!`);
    } catch (err) {
      toastError(err?.response?.data?.message || 'Report generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>📊</span>
            <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
              Specialist Reports & Statements
            </h1>
          </div>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13.5px' }}>
            Generate personal authorized statements for appointments, commissions, and hours
          </p>
        </div>

        <button
          onClick={() => window.print()}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#fff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          🖨️ Print / Save PDF
        </button>
      </div>

      {/* Report Types Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {reportTypes.map((r) => (
          <button
            key={r.id}
            onClick={() => handleGenerate(r.id)}
            style={{
              background: activeReport === r.id ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'rgba(30, 41, 59, 0.6)',
              color: activeReport === r.id ? '#fff' : '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '10px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{r.icon}</span> {r.label}
          </button>
        ))}
      </div>

      {/* Report Content View */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: '#fff' }}>
            {reportTypes.find((r) => r.id === activeReport)?.label}
          </h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Generated: {new Date().toLocaleDateString()}
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Generating report data...</div>
        ) : !reportData ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
            <p>Click any report above to query and generate your authorized personal statement.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#38bdf8', marginBottom: '12px' }}>
                Summary Totals
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                {Object.entries(reportData).map(([key, val]) => {
                  if (typeof val === 'object' && val !== null) return null;
                  return (
                    <div key={key} style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '10px 14px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'capitalize' }}>
                        {key.replace(/([A-Z])/g, ' $1')}
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginTop: '2px' }}>
                        {typeof val === 'number' && key.toLowerCase().includes('amount') ? `₹${val.toLocaleString()}` : String(val)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
              * Data is strictly filtered to your authenticated specialist profile within the current branch context.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  background: 'rgba(30, 41, 59, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  padding: '24px',
};
