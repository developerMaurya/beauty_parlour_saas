/**
 * @file Header.jsx
 * @description Super Admin Top Navigation Bar with Cluster Health, Light/Dark Theme Switcher, and Breadcrumb
 */

import React, { useState, useEffect } from 'react';
import { Menu, Database, Shield, Bell, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation, Link } from 'react-router-dom';

export const Header = ({ onMenuClick }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Theme state: dark | light (default to dark, persisted in localStorage)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Generate clean breadcrumb title
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentTitle = pathParts[1]
    ? pathParts[1].charAt(0).toUpperCase() + pathParts[1].slice(1).replace(/-/g, ' ')
    : 'Dashboard';

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onMenuClick}
          className="btn-icon"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'none',
          }}
          id="mobile-menu-btn"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Super Admin</span>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{currentTitle}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Cluster / DB Status Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            background: 'var(--color-success-bg)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            fontSize: '0.75rem',
            color: 'var(--color-success)',
            fontWeight: 700,
          }}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Atlas Cluster0: Online</span>
        </div>

        {/* Theme Toggle Button (Light & Dark) */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          className="btn-icon"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          style={{
            width: '2.2rem',
            height: '2.2rem',
            borderRadius: '50%',
            background: 'var(--bg-card-hover)',
            border: '1px solid var(--border-card)',
            color: theme === 'dark' ? '#FBBF24' : '#6366F1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* User Profile Pill */}
        <Link
          to="/superadmin/profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.35rem 0.85rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-card)',
            borderRadius: '9999px',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              width: '1.85rem',
              height: '1.85rem',
              borderRadius: '50%',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 700,
              overflow: 'hidden',
            }}
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user?.name || 'Super Admin'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : user?.name ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              'A'
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {user?.name || 'Super Admin'}
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 700 }}>
              SUPER_ADMIN
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
