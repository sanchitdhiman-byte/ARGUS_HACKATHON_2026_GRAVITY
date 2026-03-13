import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationAPI } from '../../api/endpoints';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/programmes': 'Programmes',
  '/applications/my': 'My Applications',
  '/applications': 'All Applications',
  '/reviews': 'My Reviews',
  '/grants': 'Grant Management',
  '/compliance': 'Compliance',
  '/users': 'User Management',
  '/audit': 'Audit Log',
  '/organisation': 'Organisation',
  '/notifications': 'Notifications',
  '/profile': 'Profile',
};

function Topbar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const { data: unreadData } = useQuery({
    queryKey: ['unreadCount'],
    queryFn: () => notificationAPI.unreadCount(),
    refetchInterval: 30000,
  });

  const unreadCount = unreadData?.data?.count || 0;

  const getTitle = () => {
    for (const [path, title] of Object.entries(PAGE_TITLES)) {
      if (location.pathname === path) return title;
    }
    if (location.pathname.startsWith('/programmes/')) return 'Programme Details';
    if (location.pathname.startsWith('/applications/new/')) return 'New Application';
    if (location.pathname.endsWith('/edit')) return 'Edit Application';
    if (location.pathname.startsWith('/applications/')) return 'Application Details';
    if (location.pathname.startsWith('/reviews/')) return 'Review Workspace';
    return 'GrantFlow';
  };

  return (
    <header className="topbar">
      <h1 className="topbar-title">{getTitle()}</h1>
      <div className="topbar-actions">
        <button className="topbar-notification" onClick={() => navigate('/notifications')}>
          <Bell size={20} />
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>
        <div className="topbar-user" onClick={() => navigate('/profile')}>
          <div className="topbar-avatar">
            <User size={18} />
          </div>
          <div className="topbar-user-info">
            <span className="topbar-user-name">{user?.fullName || 'User'}</span>
            <span className="topbar-user-role">{user?.role?.replace(/_/g, ' ')}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
