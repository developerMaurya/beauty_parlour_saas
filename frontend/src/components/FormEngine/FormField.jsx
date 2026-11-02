/**
 * @file FormField.jsx
 * @description Dynamic Form Field Component supporting text, textarea, number, email, phone, date, time, select, switch, checkbox, currency.
 * Conforms to Section 63 requirements.
 * @module frontend/src/components/FormEngine/FormField
 */

import React from 'react';

export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  options = [], // [{ label: 'Option', value: 'val' }]
  disabled = false,
  helpText = '',
  rows = 3,
  prefix = '',
  step = 'any',
  min,
  max,
}) => {
  const handleChange = (e) => {
    if (type === 'checkbox' || type === 'switch') {
      onChange({ target: { name, value: e.target.checked } });
    } else if (type === 'number' || type === 'currency') {
      onChange({ target: { name, value: e.target.value === '' ? '' : Number(e.target.value) } });
    } else {
      onChange(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--rose-400, #f43f5e)' }}>*</span>}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value ?? ''}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className="form-input"
          style={{ resize: 'vertical', minHeight: '80px' }}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value ?? ''}
          onChange={handleChange}
          disabled={disabled}
          className="form-input"
        >
          <option value="">{placeholder || 'Select option...'}</option>
          {options.map((opt, i) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={i} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
      ) : type === 'switch' || type === 'checkbox' ? (
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: disabled ? 'not-allowed' : 'pointer',
            padding: '0.25rem 0',
          }}
        >
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={!!value}
            onChange={handleChange}
            disabled={disabled}
            style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color, #ec4899)' }}
          />
          <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{placeholder || label}</span>
        </label>
      ) : type === 'currency' ? (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              position: 'absolute',
              left: '0.75rem',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            {prefix || '₹'}
          </span>
          <input
            type="number"
            id={name}
            name={name}
            value={value ?? ''}
            onChange={handleChange}
            placeholder={placeholder || '0.00'}
            disabled={disabled}
            step={step}
            min={min}
            max={max}
            className="form-input"
            style={{ paddingLeft: '2rem' }}
          />
        </div>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value ?? ''}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          step={step}
          min={min}
          max={max}
          className="form-input"
        />
      )}

      {error && <span style={{ fontSize: '0.775rem', color: 'var(--rose-400, #f43f5e)' }}>{error}</span>}
      {helpText && !error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{helpText}</span>
      )}
    </div>
  );
};

export default FormField;
