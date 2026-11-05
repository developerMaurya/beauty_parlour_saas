/**
 * @file StaffSettingsPage.jsx
 * @description Staff Preferences, Privacy & Account Configurations.
 * Conforms to Phase 05 Section 48.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext.jsx';
import * as setApi from '../../../services/api/staff/settingsFetcher.js';

export default function StaffSettingsPage() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [settings, setSettings] = useState({
    language: 'en',
    theme: 'dark',
    shareBirthdayWithTeam: true,
    showScheduleToColleagues: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await setApi.getSettings();
        if (res?.data) {
          setSettings((prev) => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        console.warn('Settings load err:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await setApi.updateSettings(settings);
      success('Account settings saved!');
    } catch (err) {
      toastError(err?.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>⚙️</span>
            <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
              Specialist Account Settings
            </h1>
          </div>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13.5px' }}>
            Personalize language, appearance, and colleague collaboration privacy
          </p>
        </div>

        <button
          onClick={() => navigate('/staff/security')}
          style={{
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            color: '#fff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          🔐 Security & Devices →
        </button>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Localization & Theme */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
            🎨 Display & Regional Preferences
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Interface Language</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings((p) => ({ ...p, language: e.target.value }))}
                style={inputStyle}
              >
                <option value="en">English (United States)</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="es">Spanish (Español)</option>
                <option value="fr">French (Français)</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Visual Color Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => setSettings((p) => ({ ...p, theme: e.target.value }))}
                style={inputStyle}
              >
                <option value="dark">Dark Luxe Obsidian (Default)</option>
                <option value="light">Light Mode</option>
                <option value="system">Follow Operating System</option>
              </select>
            </div>
          </div>
        </div>

        {/* Team Privacy */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
            👥 Colleague Collaboration Privacy
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={toggleRowStyle}>
              <div>
                <div style={{ fontWeight: '600', color: '#fff', fontSize: '13.5px' }}>
                  Share Birthday with Salon Team
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Allows teammates to see your upcoming birthday on the team noticeboard.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.shareBirthdayWithTeam}
                onChange={(e) => setSettings((p) => ({ ...p, shareBirthdayWithTeam: e.target.checked }))}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ ...toggleRowStyle, borderBottom: 'none' }}>
              <div>
                <div style={{ fontWeight: '600', color: '#fff', fontSize: '13.5px' }}>
                  Show Shift Availability to Reception
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Enables front-desk managers to assign walk-in appointments during your active shifts.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showScheduleToColleagues}
                onChange={(e) => setSettings((p) => ({ ...p, showScheduleToColleagues: e.target.checked }))}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '13.5px',
            }}
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
}

const cardStyle = {
  background: 'rgba(30, 41, 59, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  padding: '24px',
};

const labelStyle = {
  display: 'block',
  fontSize: '12.5px',
  fontWeight: '600',
  color: '#cbd5e1',
  marginBottom: '6px',
};

const inputStyle = {
  width: '100%',
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  padding: '10px',
  color: '#fff',
  fontSize: '13px',
  boxSizing: 'border-box',
};

const toggleRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '12px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
};
