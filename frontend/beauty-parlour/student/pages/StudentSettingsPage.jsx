import React, { useState, useEffect } from 'react';
import { settingsFetcher } from '../../../api/student';

export default function StudentSettingsPage() {
  const [settings, setSettings] = useState({
    language: 'en',
    timezone: 'Asia/Kolkata',
    emailNotifications: true,
    smsNotifications: true,
    whatsappNotifications: true,
    pushNotifications: true,
    profileVisibility: 'CAMPUS'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await settingsFetcher.get();
        if (res.success && res.data) {
          setSettings(prev => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        console.error('Error fetching settings', err);
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
      setError(null);
      setSaved(false);
      const res = await settingsFetcher.update(settings);
      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(res.message || 'Failed to update preferences');
      }
    } catch (err) {
      setError(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
        <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
        <div>Loading preferences...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#f8fafc' }}>
          Portal Preferences & Notification Channels
        </h1>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
          Configure WhatsApp schedule reminders, SMS fee notices, timezones, and portal privacy.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {saved && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '14px', color: '#6ee7b7', marginBottom: '20px' }}>
          ✓ Preferences saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Localization Card */}
        <div style={{ background: '#1e293b', borderRadius: '14px', border: '1px solid #334155', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px', color: '#f8fafc', fontSize: '16px' }}>Language & Timezone</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Portal Language</label>
              <select
                value={settings.language}
                onChange={e => setSettings({ ...settings, language: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
              >
                <option value="en">English (Official)</option>
                <option value="hi">Hindi (हिंदी)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Timezone</label>
              <select
                value={settings.timezone}
                onChange={e => setSettings({ ...settings, timezone: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
              >
                <option value="Asia/Kolkata">IST (GMT +5:30) New Delhi / Mumbai</option>
                <option value="Asia/Dubai">GST (GMT +4:00) Dubai</option>
                <option value="UTC">UTC Universal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div style={{ background: '#1e293b', borderRadius: '14px', border: '1px solid #334155', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px', color: '#f8fafc', fontSize: '16px' }}>Notification Channels</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { key: 'whatsappNotifications', title: 'WhatsApp Instant Class Reminders', desc: 'Receive morning schedule reminders and hall changes directly on your registered WhatsApp.' },
              { key: 'smsNotifications', title: 'SMS Transactional & Fee Alerts', desc: 'Critical alerts for fee receipts, installment dates, and biometric check-ins.' },
              { key: 'emailNotifications', title: 'Email Newsletters & Academic Transcripts', desc: 'Detailed grade sheets, exam result announcements, and diploma copies.' },
              { key: 'pushNotifications', title: 'In-Portal Realtime Popups', desc: 'Instant desktop / mobile browser notifications when instructors message.' }
            ].map(ch => (
              <label
                key={ch.key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px',
                  background: '#0f172a',
                  borderRadius: '10px',
                  border: '1px solid #334155',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>{ch.title}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{ch.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings[ch.key]}
                  onChange={e => setSettings({ ...settings, [ch.key]: e.target.checked })}
                  style={{ transform: 'scale(1.3)', accentColor: '#f59e0b', cursor: 'pointer' }}
                />
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000',
              fontWeight: 700,
              padding: '12px 32px',
              borderRadius: '8px',
              border: 'none',
              cursor: saving ? 'not-allowed' : 'pointer'
            }}
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
}
