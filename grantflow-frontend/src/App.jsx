import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './components/Pages/LandingPage/LandingPage';
import ApplicationForm from './components/Pages/ApplicationForm/ApplicationForm';
import LoginPage from './components/Pages/Auth/LoginPage';
import SignUpPage from './components/Pages/Auth/SignUpPage';
import PasswordResetPage from './components/Pages/Auth/PasswordResetPage';
import EmailVerificationPage from './components/Pages/Auth/EmailVerificationPage';
import MyApplicationsPage from './components/Pages/MyApplications/MyApplicationsPage';
import ProgramOfficerDashboard from './components/Pages/Staff/ProgramOfficerDashboard';
import ReviewerWorkspace from './components/Pages/Staff/ReviewerWorkspace';
import FinanceDashboard from './components/Pages/Staff/FinanceDashboard';
import AdminDashboard from './components/Pages/Staff/AdminDashboard';
import EligibilityChecker from './components/Pages/EligibilityChecker/EligibilityChecker';
import NotificationsPage from './components/Pages/Notifications/NotificationsPage';
import ComplianceReporting from './components/Pages/Compliance/ComplianceReporting';
import ProtectedRoute from './components/Core/shared/ProtectedRoute';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('access_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }

    // Listen for forced logout from axios interceptor (token refresh failure)
    const handleForceLogout = () => {
      setIsLoggedIn(false);
      setUser(null);
      navigate('/login');
    };
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, [navigate]);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    if (userData) setUser(userData);
    else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    }
    
    // Redirect back to the page they were trying to access, or home
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const commonProps = { 
    onNavigate: (path, data) => {
      if (data?.grantType) setSelectedGrantType(data.grantType);
      navigate(path.startsWith('/') ? path : `/${path}`);
    }, 
    isLoggedIn, 
    onLogout: handleLogout, 
    user 
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage {...commonProps} onLogin={() => navigate('/login')} />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} onNavigate={commonProps.onNavigate} />} />
      <Route path="/signup" element={<SignUpPage onNavigate={commonProps.onNavigate} />} />
      <Route path="/reset-password" element={<PasswordResetPage onNavigate={commonProps.onNavigate} />} />
      <Route path="/verify-email" element={<EmailVerificationPage onNavigate={commonProps.onNavigate} />} />
      
      {/* Protected Routes */}
      <Route path="/my-applications" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} user={user}>
          <MyApplicationsPage {...commonProps} />
        </ProtectedRoute>
      } />
      
      <Route path="/form" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} user={user}>
          <ApplicationForm {...commonProps} selectedGrantType={selectedGrantType} />
        </ProtectedRoute>
      } />

      <Route path="/eligibility-check" element={<EligibilityChecker {...commonProps} />} />
      
      <Route path="/officer-dashboard" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} user={user} requiredRole="officer">
          <ProgramOfficerDashboard {...commonProps} />
        </ProtectedRoute>
      } />
      
      <Route path="/reviewer-workspace" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} user={user} requiredRole="reviewer">
          <ReviewerWorkspace {...commonProps} />
        </ProtectedRoute>
      } />
      
      <Route path="/finance-dashboard" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} user={user} requiredRole="finance">
          <FinanceDashboard {...commonProps} />
        </ProtectedRoute>
      } />
      
      <Route path="/admin-dashboard" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} user={user} requiredRole="admin">
          <AdminDashboard {...commonProps} />
        </ProtectedRoute>
      } />
      
      <Route path="/notifications" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} user={user}>
          <NotificationsPage {...commonProps} />
        </ProtectedRoute>
      } />
      
      <Route path="/compliance" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} user={user}>
          <ComplianceReporting {...commonProps} />
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute isLoggedIn={isLoggedIn} user={user}>
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-2xl font-bold">User Profile (Coming Soon)</h1>
          </div>
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
