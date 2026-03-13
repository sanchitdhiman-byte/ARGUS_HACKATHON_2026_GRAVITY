import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProgrammesPage from './pages/ProgrammesPage';
import ProgrammeDetailPage from './pages/ProgrammeDetailPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import ApplicationFormPage from './pages/ApplicationFormPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import AllApplicationsPage from './pages/AllApplicationsPage';
import ReviewsPage from './pages/ReviewsPage';
import ReviewWorkspacePage from './pages/ReviewWorkspacePage';
import GrantManagementPage from './pages/GrantManagementPage';
import CompliancePage from './pages/CompliancePage';
import UsersPage from './pages/UsersPage';
import AuditLogPage from './pages/AuditLogPage';
import OrganisationPage from './pages/OrganisationPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import './styles/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '8px',
                background: '#333',
                color: '#fff',
              },
            }}
          />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/programmes" element={<ProgrammesPage />} />
              <Route path="/programmes/:id" element={<ProgrammeDetailPage />} />
              <Route path="/applications/my" element={<MyApplicationsPage />} />
              <Route path="/applications/new/:programmeId" element={<ApplicationFormPage />} />
              <Route path="/applications/:id" element={<ApplicationDetailPage />} />
              <Route path="/applications/:id/edit" element={<ApplicationFormPage />} />
              <Route path="/applications" element={<AllApplicationsPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/reviews/:assignmentId" element={<ReviewWorkspacePage />} />
              <Route path="/grants" element={<GrantManagementPage />} />
              <Route path="/compliance" element={<CompliancePage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/audit" element={<AuditLogPage />} />
              <Route path="/organisation" element={<OrganisationPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
