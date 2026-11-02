/**
 * @file CustomerRegisterPage.jsx
 * @description Customer Self-Registration Portal View.
 * Captures name, phone, email, password, gender, and preferred city.
 * @module frontend/src/modules/customer/pages/CustomerRegisterPage
 */

import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useCustomer } from '../../../context/CustomerContext.jsx';

export default function CustomerRegisterPage() {
  const { register } = useCustomer();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    gender: 'female',
    city: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(form);
      navigate('/customer/dashboard');
    } catch (err) {
      setError(err?.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0a0d14 70%)', padding: '32px 20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '480px', background: 'rgba(17, 24, 39, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px', boxShadow: '0 10px 25px rgba(236, 72, 153, 0.4)' }}>
            ✨
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Join Luxe Salon
          </h1>
          <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
            Create your personalized customer portal account
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Ananya Sharma"
              value={form.name}
              onChange={handleChange}
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '11px 16px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="10-digit mobile"
                value={form.phone}
                onChange={handleChange}
                style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '11px 16px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '11px 14px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. ananya@example.com"
              value={form.email}
              onChange={handleChange}
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '11px 16px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Create Password *
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '11px 16px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              City / Preferred Location
            </label>
            <input
              type="text"
              name="city"
              placeholder="e.g. Mumbai, Pune, Delhi"
              value={form.city}
              onChange={handleChange}
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '11px 16px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 8px 20px rgba(236, 72, 153, 0.4)', marginTop: '8px' }}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '18px' }}>
          <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
            Already have an account?{' '}
            <NavLink to="/customer/login" style={{ color: '#ec4899', fontWeight: 700, textDecoration: 'none' }}>
              Sign In
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}
