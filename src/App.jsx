import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AppSettingsProvider } from './contexts/AppSettingsContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pharmacies from './pages/Pharmacies';
import PharmacyDetail from './pages/PharmacyDetail';
import CRM from './pages/CRM';
import Tasks from './pages/Tasks';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppSettingsProvider>
          <NotificationProvider>
            <DataProvider>
              <Router>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route
                      path="/*"
                      element={
                        <ProtectedRoute>
                          <Layout>
                            <Routes>
                              <Route path="/dashboard" element={<Dashboard />} />
                              <Route path="/pharmacies" element={<Pharmacies />} />
                              <Route path="/pharmacies/:id" element={<PharmacyDetail />} />
                              <Route path="/crm" element={<CRM />} />
                              <Route path="/tasks" element={<Tasks />} />
                              <Route path="/documents" element={<Documents />} />
                              <Route path="/settings" element={<Settings />} />
                            </Routes>
                          </Layout>
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                  <Toaster
                    position="bottom-right"
                    containerClassName="toast-container-bottom-right"
                    containerStyle={{
                      zIndex: 999999999,
                      position: 'fixed',
                      bottom: '1rem',
                      right: '1rem',
                      pointerEvents: 'none',
                    }}
                    toastOptions={{
                      duration: 4000,
                      className: 'toast-notification-bottom-right',
                      style: {
                        background: 'var(--toast-bg)',
                        color: 'var(--toast-text)',
                        border: '1px solid var(--toast-border)',
                        borderRadius: '0.75rem',
                        padding: '16px 20px',
                        fontSize: '14px',
                        fontWeight: '500',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                        maxWidth: '400px',
                        minWidth: '300px',
                        zIndex: 999999999,
                        position: 'relative',
                        pointerEvents: 'auto',
                        marginBottom: '8px',
                      },
                      success: {
                        className: 'toast-success-bottom-right',
                        style: {
                          background: 'var(--toast-success-bg)',
                          color: 'var(--toast-success-text)',
                          border: '1px solid var(--toast-success-border)',
                          zIndex: 999999999,
                          pointerEvents: 'auto',
                        },
                        iconTheme: {
                          primary: 'var(--toast-success-icon)',
                          secondary: 'var(--toast-success-bg)',
                        },
                      },
                      error: {
                        className: 'toast-error-bottom-right',
                        style: {
                          background: 'var(--toast-error-bg)',
                          color: 'var(--toast-error-text)',
                          border: '1px solid var(--toast-error-border)',
                          zIndex: 999999999,
                          pointerEvents: 'auto',
                        },
                        iconTheme: {
                          primary: 'var(--toast-error-icon)',
                          secondary: 'var(--toast-error-bg)',
                        },
                      },
                      loading: {
                        className: 'toast-loading-bottom-right',
                        style: {
                          background: 'var(--toast-loading-bg)',
                          color: 'var(--toast-loading-text)',
                          border: '1px solid var(--toast-loading-border)',
                          zIndex: 999999999,
                          pointerEvents: 'auto',
                        },
                        iconTheme: {
                          primary: 'var(--toast-loading-icon)',
                          secondary: 'var(--toast-loading-bg)',
                        },
                      },
                    }}
                  />
                </div>
              </Router>
            </DataProvider>
          </NotificationProvider>
        </AppSettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;