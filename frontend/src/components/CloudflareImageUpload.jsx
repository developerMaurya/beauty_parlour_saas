/**
 * @file CloudflareImageUpload.jsx
 * @description Reusable React Image Uploader directly streaming to Cloudflare Images API.
 * Displays preview, upload progress, live Cloudflare URL, and copy-link button.
 * @module frontend/src/components/CloudflareImageUpload
 */

import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const CloudflareImageUpload = ({
  value = '',
  onChange,
  folder = 'general',
  entityType,
  entityId,
  label = 'Upload Image (Direct to Cloudflare)',
  tenantSlug,
  aspectRatio = 'square',
  maxSizeMb = 10,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [previewUrl, setPreviewUrl] = useState(value);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMb * 1024 * 1024) {
      setErrorMsg(`File size exceeds ${maxSizeMb}MB limit.`);
      return;
    }

    setErrorMsg('');
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (folder) formData.append('folder', folder);
      if (entityType) formData.append('entityType', entityType);
      if (entityId) formData.append('entityId', entityId);
      if (tenantSlug) formData.append('tenantSlug', tenantSlug);

      const headers = {};
      const activeTenant = localStorage.getItem('active_tenant_slug') || localStorage.getItem('active_tenant_id');
      if (activeTenant) {
        headers['x-tenant-id'] = activeTenant;
      }

      const response = await fetch('/api/v1/upload/image', {
        method: 'POST',
        headers,
        body: formData,
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Cloudflare upload failed');
      }

      const liveUrl = resData.data?.url;
      setPreviewUrl(liveUrl);
      if (onChange) {
        onChange(liveUrl, resData.data);
      }
      toast.success('Image successfully uploaded to Cloudflare Images!');
    } catch (err) {
      console.error('Upload Error:', err);
      setErrorMsg(err.message || 'Failed to upload image to Cloudflare');
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    setPreviewUrl('');
    if (onChange) onChange('', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary, #f1f5f9)' }}>
            {label}
          </label>
          <span style={{ fontSize: '11px', color: '#ec4899', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
            ⚡ Cloudflare Images
          </span>
        </div>
      )}

      {/* Upload Box / Preview Area */}
      <div
        style={{
          border: '2px dashed var(--border-subtle, rgba(255, 255, 255, 0.15))',
          borderRadius: '12px',
          padding: '16px',
          background: 'rgba(15, 23, 42, 0.4)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '140px',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={isUploading}
        />

        {previewUrl ? (
          <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src={previewUrl}
              alt="Uploaded preview"
              style={{
                maxHeight: '160px',
                maxWidth: '100%',
                borderRadius: '8px',
                objectFit: 'contain',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
              }}
            />
            <div style={{ marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Live on Cloudflare
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                style={{
                  fontSize: '11px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#cbd5e1',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  cursor: 'pointer',
                }}
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleClear}
                style={{
                  fontSize: '11px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </div>
            <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--text-muted, #94a3b8)', wordBreak: 'break-all', maxWidth: '100%', textAlign: 'center' }}>
              <code>{previewUrl}</code>
            </div>
          </div>
        ) : (
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            style={{
              cursor: isUploading ? 'not-allowed' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              textAlign: 'center',
            }}
          >
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
            ) : (
              <UploadCloud className="w-8 h-8 text-pink-400" />
            )}
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
              {isUploading ? 'Uploading directly to Cloudflare...' : 'Click or Drag & Drop image here'}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted, #94a3b8)' }}>
              PNG, JPG, WebP, GIF, SVG up to {maxSizeMb}MB (Saved directly in Cloud)
            </div>
          </div>
        )}

        {errorMsg && (
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle className="w-3.5 h-3.5" />
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudflareImageUpload;
