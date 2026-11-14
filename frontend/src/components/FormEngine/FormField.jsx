/**
 * @file FormField.jsx
 * @description Dynamic Form Field Component supporting text, textarea, number, email, phone, date, time, select, switch, checkbox, currency.
 * Conforms to Section 63 requirements.
 * @module frontend/src/components/FormEngine/FormField
 */

import React, { useState } from 'react';
import { uploadImageToCloudflare } from '../../services/uploadService.js';

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleChange = (e) => {
    if (type === 'checkbox' || type === 'switch') {
      onChange({ target: { name, value: e.target.checked } });
    } else if (type === 'number' || type === 'currency') {
      onChange({ target: { name, value: e.target.value === '' ? '' : Number(e.target.value) } });
    } else {
      onChange(e);
    }
  };

  // Safe formatting for date inputs to ensure HTML5 <input type="date"> works properly (YYYY-MM-DD for native, DD/MM/YYYY for Indian/UK display)
  let displayValue = value ?? '';
  let formattedDDMMYYYY = '';
  if (type === 'date' && displayValue) {
    try {
      if (typeof displayValue === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(displayValue.trim())) {
        const [day, month, year] = displayValue.trim().split('/');
        displayValue = `${year}-${month}-${day}`;
        formattedDDMMYYYY = `${day}/${month}/${year}`;
      } else if (typeof displayValue === 'string' && displayValue.includes('T')) {
        displayValue = displayValue.split('T')[0];
        const [y, m, d] = displayValue.split('-');
        formattedDDMMYYYY = `${d}/${m}/${y}`;
      } else if (typeof displayValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(displayValue.trim())) {
        const [y, m, d] = displayValue.trim().split('-');
        formattedDDMMYYYY = `${d}/${m}/${y}`;
      } else if (displayValue instanceof Date) {
        displayValue = displayValue.toISOString().split('T')[0];
        const [y, m, d] = displayValue.split('-');
        formattedDDMMYYYY = `${d}/${m}/${y}`;
      }
    } catch (e) {}
  }

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
          className="form-input form-select"
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ec4899' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            paddingRight: '36px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
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
      ) : type === 'image' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {value ? (
              <div
                style={{
                  position: 'relative',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #ec4899',
                  boxShadow: '0 2px 8px rgba(236, 72, 153, 0.3)',
                  flexShrink: 0,
                  background: '#f8fafc',
                }}
              >
                <img
                  src={value}
                  alt="Avatar Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(236, 72, 153, 0.1)',
                  border: '2px dashed rgba(236, 72, 153, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ec4899',
                  fontSize: '22px',
                  flexShrink: 0,
                }}
              >
                {isUploading ? '⏳' : '📷'}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
              <input
                type="file"
                accept="image/*"
                id={`file-input-${name}`}
                style={{ display: 'none' }}
                disabled={disabled || isUploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setIsUploading(true);
                    setUploadError('');
                    try {
                      const publicUrl = await uploadImageToCloudflare(file, {
                        folder: 'avatars',
                        entityType: name,
                      });
                      onChange({ target: { name, value: publicUrl } });
                    } catch (err) {
                      console.error('Image upload failed:', err);
                      setUploadError(err.message || 'Image upload failed. Please check network or paste link.');
                    } finally {
                      setIsUploading(false);
                      e.target.value = '';
                    }
                  }
                }}
              />
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button
                  type="button"
                  disabled={disabled || isUploading}
                  onClick={() => document.getElementById(`file-input-${name}`)?.click()}
                  className="btn btn-secondary btn-sm"
                  style={{
                    fontSize: '11.5px',
                    padding: '5px 12px',
                    background: isUploading ? 'rgba(236, 72, 153, 0.25)' : 'rgba(236, 72, 153, 0.12)',
                    borderColor: 'rgba(236, 72, 153, 0.35)',
                    color: '#ec4899',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: isUploading ? 'wait' : 'pointer',
                  }}
                >
                  {isUploading ? '⏳ Uploading to Cloudflare...' : '📁 Choose Image File'}
                </button>
                {value && (
                  <button
                    type="button"
                    disabled={disabled || isUploading}
                    onClick={() => {
                      onChange({ target: { name, value: '' } });
                      setUploadError('');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '11px', padding: '5px 9px', color: '#ef4444' }}
                  >
                    Remove
                  </button>
                )}
              </div>
              <span style={{ fontSize: '11px', color: isUploading ? '#ec4899' : 'var(--text-muted)' }}>
                {isUploading
                  ? '⚡ Uploading directly to Cloudflare Images API... please wait'
                  : 'Uploads directly to Cloudflare live URL (No Base64). Or paste link below:'}
              </span>
              {uploadError && (
                <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600 }}>
                  ⚠️ {uploadError}
                </span>
              )}
            </div>
          </div>

          <input
            type="text"
            id={name}
            name={name}
            value={value ?? ''}
            onChange={handleChange}
            placeholder={placeholder || 'Or paste image URL (https://...)'}
            disabled={disabled || isUploading}
            className="form-input"
            style={{ fontSize: '12px', height: '34px' }}
          />
        </div>
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
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder || (type === 'date' ? 'DD/MM/YYYY' : '')}
          disabled={disabled}
          step={step}
          min={min}
          max={max}
          className="form-input"
        />
      )}

      {type === 'date' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', marginTop: '2px', padding: '0 2px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Format: <strong>DD/MM/YYYY</strong></span>
          {formattedDDMMYYYY && (
            <span style={{ color: '#ec4899', fontWeight: 700, background: 'rgba(236, 72, 153, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
              📅 Selected: {formattedDDMMYYYY}
            </span>
          )}
        </div>
      )}

      {error && <span style={{ fontSize: '0.775rem', color: 'var(--rose-400, #f43f5e)' }}>{error}</span>}
      {helpText && !error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{helpText}</span>
      )}
    </div>
  );
};

export default FormField;
