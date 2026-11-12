/**
 * @file StaffSoftwareDashboardPage.jsx
 * @description Dedicated Staff Dashboard for RB Software & Tech Hub Developers & Engineers.
 * Features sprint board tasks, pull requests, API cluster status, and developer timesheets.
 * @module frontend/src/modules/staff/pages/StaffSoftwareDashboardPage
 */

import React, { useState } from 'react';
import {
  Code2,
  GitPullRequest,
  CheckCircle2,
  Clock,
  Terminal,
  Server,
  Activity,
  Layers,
  Bug,
  Cpu,
  Zap,
  ExternalLink,
  GitBranch,
} from 'lucide-react';
import { useStaff } from '../../../context/StaffContext.jsx';

export default function StaffSoftwareDashboardPage() {
  const { staffUser } = useStaff();

  // Active Sprint Tasks
  const sprintTasks = [
    {
      id: 'RB-412',
      title: 'Implement Razorpay & PhonePe Webhook Idempotency Queue',
      project: 'Core Billing Gateway',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      branch: 'feature/payment-webhook-idempotency',
      points: 5,
      assignee: 'Self',
    },
    {
      id: 'RB-408',
      title: 'Optimize MongoDB Aggregate Pipeline for Real Estate Reports',
      project: 'Plotting CRM Backend',
      priority: 'MEDIUM',
      status: 'CODE_REVIEW',
      branch: 'perf/mongodb-aggregate-index',
      points: 3,
      assignee: 'Self',
    },
    {
      id: 'RB-421',
      title: 'Resolve Event Multi-Tier Stage Pricing Form Validation Bug',
      project: 'Event Management Engine',
      priority: 'URGENT',
      status: 'QA_TESTING',
      branch: 'bugfix/event-stage-pricing-calc',
      points: 2,
      assignee: 'Self',
    },
  ];

  // Microservices & API Cluster Status
  const clusterServices = [
    { name: 'Core SaaS Express API', uptime: '99.98%', latency: '42ms', status: 'HEALTHY' },
    { name: 'Tenant Database Shard (Atlas)', uptime: '100%', latency: '12ms', status: 'HEALTHY' },
    { name: 'Socket.IO Realtime Server', uptime: '99.95%', latency: '18ms', status: 'HEALTHY' },
    { name: 'S3/Cloudinary CDN Storage', uptime: '99.99%', latency: '35ms', status: 'HEALTHY' },
  ];

  // Developer Metrics
  const devMetrics = [
    { label: 'Sprint Story Points', value: '28 / 32', color: '#38bdf8' },
    { label: 'Open PRs for Review', value: '3', color: '#facc15' },
    { label: 'Commits Pushed (Wk)', value: '47', color: '#4ade80' },
    { label: 'Code Coverage', value: '88.4%', color: '#c084fc' },
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* ── Top Software Dev Hero Header ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(14, 165, 233, 0.05) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '18px',
          padding: '24px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              boxShadow: '0 8px 24px rgba(56, 189, 248, 0.35)',
            }}
          >
            💻
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
                RB Software & Tech Hub Workspace
              </h1>
              <span
                style={{
                  background: 'rgba(56, 189, 248, 0.25)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.5px',
                }}
              >
                ENGINEER ACTIVE
              </span>
            </div>
            <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: '14px' }}>
              Logged in as <strong style={{ color: '#fff' }}>{staffUser?.name || 'Software Engineer'}</strong> • Sprint: <strong>Sprint 24 (Q4 Production Release)</strong>
            </p>
          </div>
        </div>

        {/* Git Branch Pill */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <GitBranch className="w-5 h-5 text-sky-400" />
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>
              Current Git Environment
            </div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#38bdf8', fontFamily: 'monospace' }}>
              main • prod-cluster-blr
            </div>
          </div>
        </div>
      </div>

      {/* ── Key Metrics Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {devMetrics.map((st, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {st.label}
            </span>
            <span style={{ fontSize: '28px', fontWeight: '900', color: st.color }}>
              {st.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Main Two Column Layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
        {/* Left Column: Assigned Sprint Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Code2 className="w-5 h-5 text-sky-400" />
              Active Sprint Tasks ({sprintTasks.length})
            </h2>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Target Sprint End: Friday 06:00 PM
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sprintTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  background: 'rgba(30, 41, 59, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: '#38bdf8', fontFamily: 'monospace' }}>
                        {task.id}
                      </span>
                      <span style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>
                        {task.title}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '13px', color: '#94a3b8' }}>
                      <span style={{ color: '#cbd5e1' }}>Project: <strong>{task.project}</strong></span>
                      <span>•</span>
                      <span>Story Points: <strong style={{ color: '#38bdf8' }}>{task.points} pts</strong></span>
                    </div>
                  </div>

                  <span
                    style={{
                      background:
                        task.status === 'IN_PROGRESS'
                          ? 'rgba(56, 189, 248, 0.2)'
                          : task.status === 'CODE_REVIEW'
                          ? 'rgba(250, 204, 21, 0.2)'
                          : 'rgba(192, 132, 252, 0.2)',
                      color:
                        task.status === 'IN_PROGRESS'
                          ? '#38bdf8'
                          : task.status === 'CODE_REVIEW'
                          ? '#facc15'
                          : '#c084fc',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '700',
                    }}
                  >
                    {task.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Git branch line */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#94a3b8',
                  }}
                >
                  <Terminal className="w-3.5 h-3.5 text-sky-400" />
                  <span>git checkout -b {task.branch}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#e2e8f0',
                      border: 'none',
                      padding: '7px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <GitPullRequest className="w-3.5 h-3.5" /> Create PR
                  </button>
                  <button
                    type="button"
                    style={{
                      background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                      color: '#fff',
                      border: 'none',
                      padding: '7px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Move to Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Microservice Health & Quick Worklog */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Worklog Logger */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock className="w-4 h-4 text-sky-400" />
              Daily Standup & Work Log
            </h3>
            <textarea
              placeholder="What did you work on today? Any blockers or PR reviews needed..."
              rows={3}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '10px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
                resize: 'none',
              }}
            />
            <button
              type="button"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                color: '#fff',
                border: 'none',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              Post Daily Standup Log
            </button>
          </div>

          {/* Microservices Cluster Health */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server className="w-4 h-4 text-sky-400" />
              Service Cluster Latency
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {clusterServices.map((srv, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    borderRadius: '10px',
                    padding: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9' }}>{srv.name}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Uptime: {srv.uptime}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '11px', color: '#4ade80', background: 'rgba(74, 222, 128, 0.15)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                      {srv.latency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

