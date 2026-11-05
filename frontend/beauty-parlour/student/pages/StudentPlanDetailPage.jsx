/**
 * @file StudentPlanDetailPage.jsx
 * @description Comprehensive Plan Breakdown & Curriculum Details.
 * Conforms to Phase 06 Section 5.
 * @module frontend/src/modules/student/pages/StudentPlanDetailPage
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import * as planApi from '../../../services/api/student/planFetcher.js';

export default function StudentPlanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlan = async () => {
      try {
        setLoading(true);
        const res = await planApi.getPlanById(id);
        if (res.success && res.data) {
          setPlan(res.data);
        }
      } catch (err) {
        console.warn('Failed to load plan:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadPlan();
  }, [id]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading plan details...</div>;
  }

  if (!plan) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#fca5a5' }}>Plan not found.</div>;
  }

  const finalPrice = Math.max(0, plan.price - (plan.discount || 0));

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <button onClick={() => navigate('/student/plans')} style={btnBackStyle}>
        ← Back to All Plans
      </button>

      {/* Plan Header Card */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={codeBadgeStyle}>{plan.code || 'PLAN'}</span>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '8px 0 6px', color: '#fff' }}>{plan.name}</h1>
            <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>{plan.description}</p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#fff' }}>
              ₹{finalPrice.toLocaleString('en-IN')}
            </div>
            {plan.discount > 0 && (
              <div style={{ fontSize: '13px', color: '#64748b', textDecoration: 'line-through' }}>
                ₹{plan.price.toLocaleString('en-IN')}
              </div>
            )}
            <NavLink
              to={`/student/purchase?planId=${plan._id}`}
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
                padding: '10px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '13.5px',
                marginTop: '10px',
              }}
            >
              Enroll in this Plan
            </NavLink>
          </div>
        </div>
      </div>

      {/* Curriculum & Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Hours & Structure Card */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: '0 0 14px' }}>
            ⏱️ Training Structure
          </h2>
          <div style={rowStyle}>
            <span style={{ color: '#94a3b8' }}>Total Duration:</span>
            <span style={{ color: '#fff', fontWeight: '600' }}>{plan.durationMonths || 6} Months</span>
          </div>
          <div style={rowStyle}>
            <span style={{ color: '#94a3b8' }}>Total Training Hours:</span>
            <span style={{ color: '#fff', fontWeight: '600' }}>{plan.durationHours || 240} Hours</span>
          </div>
          <div style={rowStyle}>
            <span style={{ color: '#94a3b8' }}>Theory Classes:</span>
            <span style={{ color: '#fff', fontWeight: '600' }}>{plan.theoryHours || 40} Hours</span>
          </div>
          <div style={rowStyle}>
            <span style={{ color: '#94a3b8' }}>Practical Sessions:</span>
            <span style={{ color: '#fff', fontWeight: '600' }}>{plan.practicalHours || 80} Hours</span>
          </div>
          <div style={rowStyle}>
            <span style={{ color: '#94a3b8' }}>Attendance Requirement:</span>
            <span style={{ color: '#10b981', fontWeight: '600' }}>Min {plan.attendanceRequirementPercentage || 80}%</span>
          </div>
        </div>

        {/* Pricing & Installments Card */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: '0 0 14px' }}>
            💳 Fee & Installment Structure
          </h2>
          <div style={rowStyle}>
            <span style={{ color: '#94a3b8' }}>Base Plan Price:</span>
            <span style={{ color: '#fff', fontWeight: '600' }}>₹{plan.price?.toLocaleString('en-IN')}</span>
          </div>
          <div style={rowStyle}>
            <span style={{ color: '#94a3b8' }}>Special Discount:</span>
            <span style={{ color: '#10b981', fontWeight: '600' }}>-₹{plan.discount?.toLocaleString('en-IN') || 0}</span>
          </div>
          <div style={rowStyle}>
            <span style={{ color: '#94a3b8' }}>Admission Fee:</span>
            <span style={{ color: '#fff', fontWeight: '600' }}>₹{plan.admissionFee?.toLocaleString('en-IN') || 0}</span>
          </div>
          <div style={rowStyle}>
            <span style={{ color: '#94a3b8' }}>Installment Facility:</span>
            <span style={{ color: '#38bdf8', fontWeight: '600' }}>
              {plan.installmentOption ? `Available (Up to ${plan.numberOfInstallments || 3} installments)` : 'Full Payment'}
            </span>
          </div>
        </div>
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

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 0',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  fontSize: '13px',
};

const codeBadgeStyle = {
  background: 'rgba(99, 102, 241, 0.2)',
  color: '#818cf8',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: '700',
};

const btnBackStyle = {
  background: 'none',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer',
  padding: 0,
  fontSize: '13px',
  alignSelf: 'flex-start',
};
