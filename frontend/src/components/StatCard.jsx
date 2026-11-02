/**
 * @file StatCard.jsx
 * @description KPI Metric Display Card with Trends
 */

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, change, trend = 'up', icon: Icon, prefix = '', suffix = '' }) => {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        {Icon && (
          <div className="stat-icon">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="stat-value">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </div>
      {change !== undefined && (
        <div className={`stat-trend ${trend === 'up' ? 'trend-up' : 'trend-down'}`}>
          {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{change}</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>vs last period</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
