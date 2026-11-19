/**
 * @file App.jsx
 * @description Main Frontend Application Shell with Master Admin Routes, Role Workspaces, and Public Storefront
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TenantAdminProvider } from './context/TenantAdminContext.jsx';
import { StaffProvider } from './context/StaffContext.jsx';
import { StudentProvider } from './context/StudentContext.jsx';
import { CustomerProvider } from './context/CustomerContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import AdminRoutes from './routes/admin.routes.jsx';
import StaffRoutes from './routes/staff.routes.jsx';
import StudentRoutes from './routes/student.routes.jsx';
import CustomerRoutes from './routes/customer.routes.jsx';
import PublicRoutes from './routes/public.routes.jsx';
import DomainSuspendedPage from './pages/DomainSuspendedPage.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './styles/index.css';

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <TenantAdminProvider>
            <StaffProvider>
              <StudentProvider>
                <CustomerProvider>
                  <ToastProvider>
                    <Routes>
                      {AdminRoutes}
                      {StaffRoutes}
                      {StudentRoutes}
                      {CustomerRoutes}
                      {PublicRoutes}
                      {/* Redirect old superadmin links to admin dashboard */}
                      <Route path="/superadmin/*" element={<Navigate to="/admin/dashboard" replace />} />
                      <Route path="/portal-suspended" element={<DomainSuspendedPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </ToastProvider>
                </CustomerProvider>
              </StudentProvider>
            </StaffProvider>
          </TenantAdminProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
