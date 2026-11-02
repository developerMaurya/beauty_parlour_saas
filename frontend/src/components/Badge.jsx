/**
 * @file Badge.jsx
 * @description Status & Attribute Pill Badge
 */

import React from 'react';

export const Badge = ({ status, text, variant }) => {
  const normalized = (variant || status || 'default').toLowerCase().replace(/[\s_]+/g, '-');
  const label = text || status;

  return (
    <span className={`badge badge-${normalized}`}>
      <span className="badge-dot" />
      <span>{label}</span>
    </span>
  );
};

export default Badge;
