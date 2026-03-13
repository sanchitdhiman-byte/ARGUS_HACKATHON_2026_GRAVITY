import React, { useState, useEffect } from 'react';
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
import EligibilityChecker from './components/Pages/EligibilityChecker/EligibilityChecker';
import NotificationsPage from './components/Pages/Notifications/NotificationsPage';
import ComplianceReporting from './components/Pages/Compliance/ComplianceReporting';
import AdminDashboard from './components/Pages/Admin/AdminDashboard';

function App() {
  const [view, setView] = useState('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedGrantType, setSelectedGrantType] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('access_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const navigate = (path, data) => {
    if (data?.grantType) setSelectedGrantType(data.grantType);
    setView(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    const userObj = userData || JSON.parse(localStorage.getItem('user') || 'null');
    setUser(userObj);
    // Redirect to the right dashboard based on role
    const role = userObj?.role;
    if (role === 'admin')    setView('admin-dashboard');
    else if (role === 'officer')   setView('officer-dashboard');
    else if (role === 'reviewer')  setView('reviewer-workspace');
    else if (role === 'finance')   setView('finance-dashboard');
    else setView('landing');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setView('landing');
  };

  const renderView = () => {
    const commonProps = { onNavigate: navigate, isLoggedIn, onLogout: handleLogout, user, currentView: view };

    switch(view) {
      case 'form':
        return <ApplicationForm {...commonProps} selectedGrantType={selectedGrantType} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={navigate} />;
      case 'signup':
        return <SignUpPage onNavigate={navigate} onLogin={handleLogin} />;
      case 'reset-password':
        return <PasswordResetPage onNavigate={navigate} />;
      case 'verify-email':
        return <EmailVerificationPage onNavigate={navigate} />;
      case 'my-applications':
        return <MyApplicationsPage {...commonProps} />;
      case 'eligibility-check':
        return <EligibilityChecker {...commonProps} />;
      case 'officer-dashboard':
        return <ProgramOfficerDashboard {...commonProps} />;
      case 'reviewer-workspace':
        return <ReviewerWorkspace {...commonProps} />;
      case 'finance-dashboard':
        return <FinanceDashboard {...commonProps} />;
      case 'notifications':
        return <NotificationsPage {...commonProps} />;
      case 'compliance':
        return <ComplianceReporting {...commonProps} />;
      case 'admin-dashboard':
        return <AdminDashboard {...commonProps} />;
      case 'landing':
      default:
        return (
          <LandingPage 
            {...commonProps}
            onLogin={() => navigate('login')}
          />
        );
    }
  };

  return (
    <>
      {renderView()}
    </>
  );
}

export default App;
