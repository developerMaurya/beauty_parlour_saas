/**
 * @file TenantGrowthBarChart.jsx
 * @description Dynamic, interactive SVG multi-column bar chart for Super Admin tenant acquisition & retention
 */

import React, { useState } from 'react';

export const TenantGrowthBarChart = ({
  data = null,
  title = 'Tenant Growth & Onboarding Velocity',
  subtitle = 'Monthly new signups and total active salon tenants',
  height = 280,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [timeframe, setTimeframe] = useState('6M');

  // Default dynamic data sets based on timeframe
  const defaultData6M = [
    { month: 'Jun', newTenants: 2, activeTenants: 4, churn: 0 },
    { month: 'Jul', newTenants: 3, activeTenants: 7, churn: 0 },
    { month: 'Aug', newTenants: 5, activeTenants: 12, churn: 1 },
    { month: 'Sep', newTenants: 6, activeTenants: 17, churn: 0 },
    { month: 'Oct', newTenants: 8, activeTenants: 24, churn: 1 },
    { month: 'Nov', newTenants: 11, activeTenants: 34, churn: 0 },
  ];

  const defaultData1Y = [
    { month: 'Jan', newTenants: 1, activeTenants: 1 },
    { month: 'Feb', newTenants: 2, activeTenants: 3 },
    { month: 'Mar', newTenants: 2, activeTenants: 5 },
    { month: 'Apr', newTenants: 3, activeTenants: 8 },
    { month: 'May', newTenants: 4, activeTenants: 12 },
    { month: 'Jun', newTenants: 3, activeTenants: 15 },
    { month: 'Jul', newTenants: 5, activeTenants: 20 },
    { month: 'Aug', newTenants: 6, activeTenants: 25 },
    { month: 'Sep', newTenants: 7, activeTenants: 31 },
    { month: 'Oct', newTenants: 8, activeTenants: 38 },
    { month: 'Nov', newTenants: 10, activeTenants: 47 },
    { month: 'Dec', newTenants: 12, activeTenants: 58 },
  ];

  const chartData = data || (timeframe === '1Y' ? defaultData1Y : defaultData6M);

  // SVG dimensions & scales
  const svgWidth = 600;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxVal = Math.max(...chartData.map((d) => Math.max(d.newTenants, d.activeTenants || 0)), 10) * 1.15;

  const barGroupWidth = chartWidth / chartData.length;
  const barWidth = Math.max(8, Math.min(22, barGroupWidth * 0.28));
  const barGap = 4;

  const getY = (val) => paddingTop + chartHeight - (val / maxVal) * chartHeight;

  return (
    <div className="card" style={{ padding: '1.25rem', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <h3 className="card-title" style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#6366F1' }} />
            {title}
          </h3>
          <p className="card-subtitle" style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>{subtitle}</p>
        </div>

        {/* Legend & Timeframe Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#6366F1' }} />
              Active Tenants
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#38BDF8' }} />
              New Signups
            </span>
          </div>

          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', padding: '2px', border: '1px solid var(--border-subtle)' }}>
            {['6M', '1Y'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                style={{
                  padding: '3px 10px',
                  borderRadius: '4px',
                  border: 'none',
                  background: timeframe === t ? 'var(--primary)' : 'transparent',
                  color: timeframe === t ? '#FFFFFF' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${height}`}
          style={{ width: '100%', height: 'auto', minWidth: '420px', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="activeBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
            <linearGradient id="newBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <filter id="barGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6366F1" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const yPos = paddingTop + chartHeight * ratio;
            const val = Math.round(maxVal * (1 - ratio));
            return (
              <g key={ratio}>
                <line
                  x1={paddingLeft}
                  y1={yPos}
                  x2={svgWidth - paddingRight}
                  y2={yPos}
                  stroke="currentColor"
                  strokeOpacity="0.08"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={yPos + 4}
                  textAnchor="end"
                  fill="var(--text-muted)"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {chartData.map((d, i) => {
            const groupX = paddingLeft + i * barGroupWidth;
            const centerX = groupX + barGroupWidth / 2;
            const isHovered = hoveredIndex === i;

            const activeY = getY(d.activeTenants || 0);
            const activeH = Math.max(0, paddingTop + chartHeight - activeY);

            const newY = getY(d.newTenants || 0);
            const newH = Math.max(0, paddingTop + chartHeight - newY);

            const activeBarX = centerX - barWidth - barGap / 2;
            const newBarX = centerX + barGap / 2;

            return (
              <g
                key={d.month}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Hover Column Highlight */}
                {isHovered && (
                  <rect
                    x={groupX + 4}
                    y={paddingTop}
                    width={barGroupWidth - 8}
                    height={chartHeight}
                    fill="rgba(99, 102, 241, 0.08)"
                    rx="6"
                  />
                )}

                {/* Active Tenants Bar */}
                <rect
                  x={activeBarX}
                  y={activeY}
                  width={barWidth}
                  height={activeH}
                  rx="4"
                  fill="url(#activeBarGrad)"
                  filter={isHovered ? 'url(#barGlow)' : undefined}
                  style={{ transition: 'all 0.3s ease' }}
                />

                {/* New Signups Bar */}
                <rect
                  x={newBarX}
                  y={newY}
                  width={barWidth}
                  height={newH}
                  rx="4"
                  fill="url(#newBarGrad)"
                  style={{ transition: 'all 0.3s ease' }}
                />

                {/* Month Label */}
                <text
                  x={centerX}
                  y={height - 12}
                  textAnchor="middle"
                  fill={isHovered ? 'var(--text-primary)' : 'var(--text-muted)'}
                  fontSize="11"
                  fontWeight={isHovered ? '700' : '500'}
                  fontFamily="var(--font-sans)"
                >
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredIndex !== null && chartData[hoveredIndex] && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: `${Math.min(
                75,
                Math.max(
                  15,
                  ((paddingLeft + hoveredIndex * barGroupWidth + barGroupWidth / 2) / svgWidth) * 100
                )
              )}%`,
              transform: 'translateX(-50%)',
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--border-card)',
              borderRadius: '8px',
              padding: '0.6rem 0.9rem',
              boxShadow: 'var(--shadow-lg)',
              pointerEvents: 'none',
              zIndex: 10,
              minWidth: '150px',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#F8FAFC', marginBottom: '0.35rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.25rem' }}>
              {chartData[hoveredIndex].month} Telemetry
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', gap: '1rem', color: '#818CF8', marginBottom: '0.2rem' }}>
              <span>Active Tenants:</span>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{chartData[hoveredIndex].activeTenants}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', gap: '1rem', color: '#38BDF8' }}>
              <span>New Signups:</span>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>+{chartData[hoveredIndex].newTenants}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantGrowthBarChart;
