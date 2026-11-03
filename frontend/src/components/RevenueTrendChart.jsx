/**
 * @file RevenueTrendChart.jsx
 * @description Interactive SVG Area & Line Chart for SaaS Monthly Recurring Revenue (MRR) with Hover Tooltip
 */

import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';

export const RevenueTrendChart = ({
  currentMrr = 490,
  currency = '$',
  growthPercent = '+18.4%',
}) => {
  const [timeRange, setTimeRange] = useState('6M');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Dynamic datasets based on time range
  const datasets = {
    '3M': [
      { label: 'Sep 2026', mrr: Math.round(currentMrr * 0.72), tx: 4, growth: '+12%' },
      { label: 'Oct 2026', mrr: Math.round(currentMrr * 0.85), tx: 6, growth: '+15%' },
      { label: 'Nov 2026', mrr: currentMrr, tx: 8, growth: '+18.4%' },
    ],
    '6M': [
      { label: 'Jun 2026', mrr: Math.round(currentMrr * 0.35), tx: 2, growth: '+8%' },
      { label: 'Jul 2026', mrr: Math.round(currentMrr * 0.48), tx: 3, growth: '+10%' },
      { label: 'Aug 2026', mrr: Math.round(currentMrr * 0.62), tx: 4, growth: '+14%' },
      { label: 'Sep 2026', mrr: Math.round(currentMrr * 0.72), tx: 5, growth: '+12%' },
      { label: 'Oct 2026', mrr: Math.round(currentMrr * 0.85), tx: 6, growth: '+15%' },
      { label: 'Nov 2026', mrr: currentMrr, tx: 8, growth: '+18.4%' },
    ],
    '1Y': [
      { label: 'Dec 25', mrr: Math.round(currentMrr * 0.15), tx: 1, growth: '-' },
      { label: 'Feb 26', mrr: Math.round(currentMrr * 0.25), tx: 2, growth: '+6%' },
      { label: 'Apr 26', mrr: Math.round(currentMrr * 0.40), tx: 3, growth: '+11%' },
      { label: 'Jun 26', mrr: Math.round(currentMrr * 0.55), tx: 4, growth: '+12%' },
      { label: 'Aug 26', mrr: Math.round(currentMrr * 0.70), tx: 6, growth: '+16%' },
      { label: 'Nov 26', mrr: currentMrr, tx: 8, growth: '+18.4%' },
    ],
  };

  const points = datasets[timeRange] || datasets['6M'];

  // Dimensions
  const svgWidth = 650;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = Math.max(...points.map((p) => p.mrr), 100) * 1.25;
  const minVal = 0;

  // Calculate coordinates
  const coords = points.map((p, idx) => {
    const x = paddingX + (idx / (points.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - ((p.mrr - minVal) / (maxVal - minVal)) * (svgHeight - paddingY * 2);
    return { ...p, x, y };
  });

  // Construct smooth bezier curve path
  const linePath = coords.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.x} ${pt.y}`;
  }, '');

  // Closed area path for gradient
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${svgHeight - paddingY} L ${coords[0].x} ${svgHeight - paddingY} Z`;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header with Title and Range Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <div
              style={{
                width: '1.85rem',
                height: '1.85rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(99, 102, 241, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="card-title" style={{ margin: 0 }}>
              Recurring Revenue Velocity (MRR)
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              {currency}{currentMrr.toLocaleString()}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <TrendingUp className="w-3.5 h-3.5" /> {growthPercent}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>trajectory</span>
          </div>
        </div>

        {/* Time Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(0,0,0,0.15)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          {['3M', '6M', '1Y'].map((range) => (
            <button
              key={range}
              onClick={() => {
                setTimeRange(range);
                setHoveredPoint(null);
              }}
              style={{
                border: 'none',
                background: timeRange === range ? 'var(--primary-gradient)' : 'transparent',
                color: timeRange === range ? '#FFFFFF' : 'var(--text-muted)',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart Area */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            <linearGradient id="mrrAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#A855F7" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="mrrStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>

            <filter id="mrrGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#6366F1" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Grid Lines */}
          {[0.25, 0.5, 0.75].map((fraction, idx) => {
            const lineY = paddingY + fraction * (svgHeight - paddingY * 2);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={lineY}
                  x2={svgWidth - paddingX}
                  y2={lineY}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Baseline */}
          <line
            x1={paddingX}
            y1={svgHeight - paddingY}
            x2={svgWidth - paddingX}
            y2={svgHeight - paddingY}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />

          {/* Area Fill */}
          <path d={areaPath} fill="url(#mrrAreaGradient)" />

          {/* Stroke Line */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#mrrStrokeGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#mrrGlow)"
          />

          {/* Active Data Dots & Interaction Targets */}
          {coords.map((pt, i) => (
            <g
              key={i}
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Invisible large touch target */}
              <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" />

              {/* Halo circle on hover */}
              {hoveredPoint?.label === pt.label && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="9"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="2"
                  opacity="0.8"
                />
              )}

              {/* Data Dot */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill="#FFFFFF"
                stroke="#6366F1"
                strokeWidth="2.5"
                style={{
                  transition: 'transform 0.2s ease',
                  transform: hoveredPoint?.label === pt.label ? 'scale(1.4)' : 'scale(1)',
                  transformOrigin: `${pt.x}px ${pt.y}px`,
                }}
              />

              {/* X Axis Label */}
              <text
                x={pt.x}
                y={svgHeight - 10}
                textAnchor="middle"
                fontSize="10"
                fontWeight="500"
                fill="var(--text-muted)"
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Popup */}
        {hoveredPoint && (
          <div
            style={{
              position: 'absolute',
              left: `${(hoveredPoint.x / svgWidth) * 100}%`,
              top: `${(hoveredPoint.y / svgHeight) * 100}%`,
              transform: 'translate(-50%, -125%)',
              background: 'var(--bg-surface-elevated, #1A2642)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-md)',
              padding: '0.45rem 0.75rem',
              boxShadow: 'var(--shadow-lg)',
              pointerEvents: 'none',
              zIndex: 10,
              minWidth: '110px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {hoveredPoint.label}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38BDF8' }}>
              {currency}{hoveredPoint.mrr.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 600 }}>
              {hoveredPoint.growth} Growth
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueTrendChart;
