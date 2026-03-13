import React, { useState } from 'react';
import LandingPage from './components/Pages/LandingPage/LandingPage';
import ApplicationForm from './components/Pages/ApplicationForm/ApplicationForm';
import LoginPage from './components/Pages/Auth/LoginPage';
import SignUpPage from './components/Pages/Auth/SignUpPage';
import PasswordResetPage from './components/Pages/Auth/PasswordResetPage';
import EmailVerificationPage from './components/Pages/Auth/EmailVerificationPage';
import MyApplicationsPage from './components/Pages/MyApplications/MyApplicationsPage';

function App() {
  const [view, setView] = useState('landing'); // 'landing', 'form', 'login', 'signup', 'reset-password', 'verify-email', 'my-applications'
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = (path) => {
    setView(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setView('landing');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView('landing');
  };

  const renderView = () => {
    switch(view) {
      case 'form':
        return <ApplicationForm onNavigate={navigate} isLoggedIn={isLoggedIn} onLogout={handleLogout} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={navigate} />;
      case 'signup':
        return <SignUpPage onNavigate={navigate} />;
      case 'reset-password':
        return <PasswordResetPage onNavigate={navigate} />;
      case 'verify-email':
        return <EmailVerificationPage onNavigate={navigate} />;
      case 'my-applications':
        return <MyApplicationsPage onNavigate={navigate} isLoggedIn={isLoggedIn} onLogout={handleLogout} />;
      case 'landing':
      default:
        return (
          <LandingPage 
            onNavigate={navigate} 
            isLoggedIn={isLoggedIn} 
            onLogin={() => navigate('login')}
            onLogout={handleLogout}
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
