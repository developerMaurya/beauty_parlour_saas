/**
 * @file FormModal.jsx
 * @description Dynamic Form Modal with automated input generation, validation, submit handling, and loading state.
 * @module frontend/src/components/FormEngine/FormModal
 */

import React, { useState, useEffect } from 'react';
import Modal from '../Modal.jsx';
import FormField from './FormField.jsx';

export const FormModal = ({
  isOpen,
  onClose,
  title,
  fields = [], // [{ name, label, type, required, options, placeholder, step, min, max, helpText, span: 1 | 2 }]
  initialData = {},
  onSubmit,
  submitText = 'Save',
  size = 'default',
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const initial = {};
      fields.forEach((f) => {
        initial[f.name] = initialData[f.name] ?? f.defaultValue ?? '';
      });
      setFormData(initial);
      setErrors({});
    }
  }, [isOpen, initialData, fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    fields.forEach((f) => {
      if (f.required && (formData[f.name] === undefined || formData[f.name] === null || formData[f.name] === '')) {
        newErrors[f.name] = `${f.label || f.name} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error('FormModal submission error:', err);
      setErrors((prev) => ({
        ...prev,
        _form: err.response?.data?.message || err.message || 'Operation failed',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const footer = (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onClose}
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : submitText}
      </button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer} size={size}>
      <form onSubmit={handleSubmit}>
        {errors._form && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              color: '#f43f5e',
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            {errors._form}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: size === 'large' ? 'repeat(2, 1fr)' : '1fr',
            gap: '1rem',
          }}
        >
          {fields.map((f) => (
            <div
              key={f.name}
              style={{
                gridColumn: f.span === 2 ? 'span 2' : 'auto',
              }}
            >
              <FormField
                label={f.label}
                name={f.name}
                type={f.type}
                value={formData[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                required={f.required}
                options={f.options}
                error={errors[f.name]}
                helpText={f.helpText}
                rows={f.rows}
                prefix={f.prefix}
                step={f.step}
                min={f.min}
                max={f.max}
                disabled={f.disabled || isSubmitting}
              />
            </div>
          ))}
        </div>
      </form>
    </Modal>
  );
};

export default FormModal;
