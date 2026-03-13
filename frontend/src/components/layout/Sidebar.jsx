import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Building2,
  Users,
  ClipboardCheck,
  Award,
  Shield,
  ScrollText,
  Bell,
  User,
  LogOut,
  Banknote,
} from 'lucide-react';

function Sidebar() {
  const { user, logout, isRole } = useAuth();
  const navigate = useNavigate();

  const navItems = [];

  navItems.push({ to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' });

  if (isRole(ROLES.APPLICANT)) {
    navItems.push({ to: '/programmes', icon: FolderOpen, label: 'Programmes' });
    navItems.push({ to: '/applications/my', icon: FileText, label: 'My Applications' });
    navItems.push({ to: '/organisation', icon: Building2, label: 'Organisation' });
  }

  if (isRole([ROLES.PLATFORM_ADMIN, ROLES.PROGRAM_OFFICER])) {
    navItems.push({ to: '/applications', icon: FileText, label: 'All Applications' });
    navItems.push({ to: '/grants', icon: Award, label: 'Grant Management' });
    navItems.push({ to: '/compliance', icon: Shield, label: 'Compliance' });
  }

  if (isRole(ROLES.REVIEWER)) {
    navItems.push({ to: '/reviews', icon: ClipboardCheck, label: 'My Reviews' });
  }

  if (isRole(ROLES.FINANCE_OFFICER)) {
    navItems.push({ to: '/grants', icon: Banknote, label: 'Disbursements' });
  }

  if (isRole(ROLES.PLATFORM_ADMIN)) {
    navItems.push({ to: '/programmes', icon: FolderOpen, label: 'Programmes' });
    navItems.push({ to: '/users', icon: Users, label: 'User Management' });
    navItems.push({ to: '/audit', icon: ScrollText, label: 'Audit Log' });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Award size={28} />
          <span>GrantFlow</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink
          to="/notifications"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Bell size={20} />
          <span>Notifications</span>
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <User size={20} />
          <span>Profile</span>
        </NavLink>
        <button className="sidebar-link sidebar-logout" onClick={logout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
