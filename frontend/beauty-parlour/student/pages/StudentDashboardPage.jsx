/**
 * @file StudentDashboardPage.jsx
 * @description Dynamic Academy Student Portal Dashboard.
 * Conforms to Phase 06 Section 3 & 60.
 * Displays real-time academic progression, class timetable, fee clearance, and certificate eligibility.
 * @module frontend/src/modules/student/pages/StudentDashboardPage
 */

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import * as dashApi from '../../../services/api/student/dashboardFetcher.js';

export default function StudentDashboardPage() {
  const [data, setData] = useState(null);
  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [ovRes, tdRes] = await Promise.allSettled([
          dashApi.getDashboardOverview(),
          dashApi.getDashboardToday(),
        ]);

        if (ovRes.status === 'fulfilled' && ovRes.value?.data) {
          setData(ovRes.value.data);
        }
        if (tdRes.status === 'fulfilled' && tdRes.value?.data) {
          setTodayData(tdRes.value.data);
        }
      } catch (err) {
        console.warn('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading student portal dashboard...</div>;
  }

  const d = data || {};
  const plan = d.plan || {};
  const course = d.course || {};
  const att = d.attendance || {};
  const prog = d.progress || {};
  const fin = d.financials || {};
  const cert = d.certificate || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>🎓</span>
            <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
              {course.name || 'Academy Trainee Portal'}
            </h1>
            <span style={badgeStyle('#6366f1')}>{course.status || 'ACTIVE'}</span>
          </div>
          <div style={{ fontSize: '13.5px', color: '#94a3b8', marginTop: '6px' }}>
            Plan: <strong style={{ color: '#fff' }}>{plan.name}</strong> • Duration: {plan.durationMonths || 6} Months ({plan.durationHours || 240} Hours)
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <NavLink
            to="/student/plans"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              padding: '10px 18px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            + Upgrade / New Plan
          </NavLink>
          <NavLink
            to="/student/reports/complete"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              padding: '10px 18px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '600',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            📊 Full Student Report
          </NavLink>
        </div>
      </div>

      {/* 4 CORE KPI METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {/* Attendance Card */}
        <div style={kpiCardStyle}>
          <div style={kpiHeaderStyle}>
            <span style={{ color: '#94a3b8', fontSize: '12.5px', fontWeight: '600' }}>Attendance Rate</span>
            <span style={{ fontSize: '20px' }}>⏱️</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: att.attendancePercentage >= 80 ? '#10b981' : '#f59e0b', margin: '4px 0' }}>
            {att.attendancePercentage}%
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            {att.attendedClasses} Attended / {att.totalClasses} Total Classes ({att.missedClasses} Missed)
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
            Min 80% required for certificate eligibility
          </div>
        </div>

        {/* Course Progress Card */}
        <div style={kpiCardStyle}>
          <div style={kpiHeaderStyle}>
            <span style={{ color: '#94a3b8', fontSize: '12.5px', fontWeight: '600' }}>Curriculum Progress</span>
            <span style={{ fontSize: '20px' }}>📈</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#818cf8', margin: '4px 0' }}>
            {prog.overallPercentage}%
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            {prog.completedModules} Completed / {prog.remainingModules} Remaining Modules
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
            Theory: {prog.theoryPercentage}% • Practical: {prog.practicalPercentage}%
          </div>
        </div>

        {/* Fees & Balance Card */}
        <div style={kpiCardStyle}>
          <div style={kpiHeaderStyle}>
            <span style={{ color: '#94a3b8', fontSize: '12.5px', fontWeight: '600' }}>Fee & Balance</span>
            <span style={{ fontSize: '20px' }}>💰</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: fin.remainingAmount === 0 ? '#10b981' : '#f43f5e', margin: '4px 0' }}>
            ₹{fin.remainingAmount?.toLocaleString('en-IN') || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            Paid ₹{fin.totalPaid?.toLocaleString('en-IN') || 0} of ₹{fin.totalCourseFee?.toLocaleString('en-IN') || 0}
          </div>
          <div style={{ fontSize: '11px', color: fin.remainingAmount === 0 ? '#10b981' : '#f59e0b', marginTop: '6px', fontWeight: '600' }}>
            Status: {fin.paymentStatus}
          </div>
        </div>

        {/* Certificate Eligibility Card */}
        <div style={kpiCardStyle}>
          <div style={kpiHeaderStyle}>
            <span style={{ color: '#94a3b8', fontSize: '12.5px', fontWeight: '600' }}>Graduation Certificate</span>
            <span style={{ fontSize: '20px' }}>📜</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: cert.isEligible ? '#10b981' : '#a855f7', margin: '4px 0' }}>
            {cert.isEligible ? 'Eligible' : 'In Progress'}
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            Status: <span style={{ textTransform: 'uppercase', color: '#fff', fontWeight: '600' }}>{cert.status}</span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <NavLink to="/student/certificates" style={{ fontSize: '11.5px', color: '#38bdf8', textDecoration: 'none', fontWeight: '600' }}>
              Check Requirements →
            </NavLink>
          </div>
        </div>
      </div>

      {/* TODAY CLASS & SCHEDULE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Today's Schedule Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#fff' }}>
              🗓️ Today's Classes & Sessions
            </h3>
            <NavLink to="/student/schedule" style={{ fontSize: '12px', color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>
              Full Timetable
            </NavLink>
          </div>

          {!todayData?.todayClasses || todayData.todayClasses.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>No classes scheduled for today.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {todayData.todayClasses.map((c, idx) => (
                <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#fff', fontSize: '13.5px' }}>{c.title}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {c.startTime} - {c.endTime} • Room: {c.room} • {c.classType}
                    </div>
                  </div>
                  <span style={badgeStyle('#10b981')}>{c.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Announcements & Faculty Messages */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#fff' }}>
              📢 Announcements & Faculty Alerts
            </h3>
            <NavLink to="/student/announcements" style={{ fontSize: '12px', color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>
              View All
            </NavLink>
          </div>

          {!todayData?.announcements || todayData.announcements.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>No new campus announcements.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {todayData.announcements.map((a, idx) => (
                <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px 14px', borderRadius: '10px' }}>
                  <div style={{ fontWeight: '600', color: '#fff', fontSize: '13px' }}>{a.title}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{a.content || a.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const kpiCardStyle = {
  background: 'rgba(30, 41, 59, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
};

const kpiHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const cardStyle = {
  background: 'rgba(30, 41, 59, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  padding: '22px',
};

const badgeStyle = (color) => ({
  background: `${color}22`,
  color: color,
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
});
