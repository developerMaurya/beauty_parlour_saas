/**
 * @file CircularGaugeMeter.jsx
 * @description Ultra-premium Circular Radial Gauge Meter with gradient stroke, dynamic percentage, and status indicators
 */

import React from 'react';

export const CircularGaugeMeter = ({
  value = 75,
  max = 100,
  min = 0,
  label = 'Capacity',
  unit = '%',
  sublabel = 'Normal Range',
  color = '#6366F1',
  secondaryColor = '#A855F7',
  size = 140,
  strokeWidth = 12,
  status = 'healthy',
}) => {
  // Normalize percentage
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  // Circumference calculation for 240-degree arc
  const radius = (size - strokeWidth) / 2;
  const startAngle = 150;
  const endAngle = 390;
  const totalAngle = endAngle - startAngle; // 240 deg

  const arcLength = (totalAngle / 360) * (2 * Math.PI * radius);
  const strokeDashoffset = arcLength - (percentage / 100) * arcLength;

  // Center coordinates
  const center = size / 2;

  // Gradient ID unique per component
  const gradientId = `gauge-grad-${label.replace(/[^a-zA-Z0-9]/g, '')}-${value}`;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.75rem',
        position: 'relative',
      }}
    >
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(0deg)', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
            <filter id={`glow-${gradientId}`} x1="-20%" y1="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--border-card)"
            strokeOpacity="0.7"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${2 * Math.PI * radius}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            style={{ transform: `rotate(${startAngle}deg)`, transformOrigin: `${center}px ${center}px` }}
          />

          {/* Active Value Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${2 * Math.PI * radius}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter={`url(#glow-${gradientId})`}
            style={{
              transform: `rotate(${startAngle}deg)`,
              transformOrigin: `${center}px ${center}px`,
              transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>

        {/* Center Display */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontSize: size > 150 ? '1.85rem' : '1.45rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-primary)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
          >
            {value}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '2px' }}>
              {unit}
            </span>
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginTop: '0.25rem',
            }}
          >
            {label}
          </div>
        </div>
      </div>

      {sublabel && (
        <div
          style={{
            marginTop: '0.35rem',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: status === 'healthy' ? '#10B981' : status === 'warning' ? '#F59E0B' : '#EF4444',
              display: 'inline-block',
            }}
          />
          <span>{sublabel}</span>
        </div>
      )}
    </div>
  );
};

export default CircularGaugeMeter;
