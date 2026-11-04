/**
 * @file App.jsx
 * @description Main Frontend Application Shell with Context Providers, Super Admin and Tenant Admin Routes
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TenantAdminProvider } from './context/TenantAdminContext';
import { StaffProvider } from './context/StaffContext';
import { StudentProvider } from './context/StudentContext';
import { CustomerProvider } from './context/CustomerContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import SuperAdminRoutes from './routes/superadmin.routes';
import AdminRoutes from './routes/admin.routes';
import StaffRoutes from './routes/staff.routes';
import StudentRoutes from './routes/student.routes';
import CustomerRoutes from './routes/customer.routes';
import PublicRoutes from './routes/public.routes';
import DomainSuspendedPage from './pages/DomainSuspendedPage';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/index.css';

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <TenantAdminProvider>
              <StaffProvider>
                <StudentProvider>
                  <CustomerProvider>
                    <ToastProvider>
                      <Routes>
                        {SuperAdminRoutes}
                        {AdminRoutes}
                        {StaffRoutes}
                        {StudentRoutes}
                        {CustomerRoutes}
                        {PublicRoutes}
                        <Route path="/portal-suspended" element={<DomainSuspendedPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </ToastProvider>
                  </CustomerProvider>
                </StudentProvider>
              </StaffProvider>
            </TenantAdminProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
