import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../Core/shared/GlobalHeader';
import GlobalFooter from '../../Core/shared/GlobalFooter';
import { adminAPI, applicationsAPI } from '../../../services/api';

const ROLES = ['applicant', 'reviewer', 'officer', 'finance', 'admin'];

const AdminDashboard = ({ onNavigate, isLoggedIn, onLogout, user }) => {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');

  // Assignment modal state
  const [assignApp, setAssignApp] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [staffRoleFilter, setStaffRoleFilter] = useState('reviewer');
  const [assigning, setAssigning] = useState(false);
  const [conflictWarning, setConflictWarning] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, appsRes] = await Promise.all([
        adminAPI.listUsers(),
        applicationsAPI.list(),
      ]);
      setUsers(usersRes.data);
      setApplications(appsRes.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update role');
    }
  };

  const openAssignModal = async (app) => {
    setAssignApp(app);
    setConflictWarning(null);
    try {
      const res = await adminAPI.listStaff(staffRoleFilter);
      setStaffList(res.data);
    } catch {
      setStaffList([]);
    }
  };

  const handleStaffRoleFilterChange = async (role) => {
    setStaffRoleFilter(role);
    try {
      const res = await adminAPI.listStaff(role);
      setStaffList(res.data);
    } catch {
      setStaffList([]);
    }
  };

  const handleAssign = async (staffId, force = false) => {
    if (!assignApp) return;
    setAssigning(true);
    setConflictWarning(null);
    try {
      const res = await adminAPI.assignToStaff(assignApp.id, staffId, force);
      if (res.data.warning && !force) {
        setConflictWarning({ staffId, message: res.data.conflict });
        setAssigning(false);
        return;
      }
      alert(res.data.message || 'Assigned successfully');
      setAssignApp(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Assignment failed');
    } finally {
      setAssigning(false);
    }
  };

  // Detect COI client-side for display
  const getConflictInfo = (staff, app) => {
    if (staff.role !== 'reviewer') return null;
    const staffDomain = staff.email?.split('@')[1]?.toLowerCase();
    const appEmail = app.contact_email || '';
    const appDomain = appEmail.split('@')[1]?.toLowerCase();
    if (staffDomain && appDomain && staffDomain === appDomain) {
      return `Conflict: shares @${staffDomain} with applicant`;
    }
    return null;
  };

  const filteredUsers = roleFilter
    ? users.filter(u => u.role === roleFilter)
    : users;

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400';
      case 'officer': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400';
      case 'reviewer': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400';
      case 'finance': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getStatusColor = (status) => {
    if (['approved', 'active_reporting'].includes(status)) return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400';
    if (['rejected', 'ineligible'].includes(status)) return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400';
    if (['pending_review', 'screening', 'assigned'].includes(status)) return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400';
    if (['risk_flagged'].includes(status)) return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400';
    return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-background-dark font-display flex flex-col">
        <GlobalHeader currentView="admin-dashboard" onNavigate={onNavigate} isLoggedIn={isLoggedIn} onLogout={onLogout} user={user} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined !text-6xl text-red-400 mb-4 block">shield</span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Access Denied</h2>
            <p className="text-slate-500">You need Admin privileges to access this page.</p>
          </div>
        </main>
        <GlobalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background-dark font-display flex flex-col selection:bg-primary/30">
      <GlobalHeader currentView="admin-dashboard" onNavigate={onNavigate} isLoggedIn={isLoggedIn} onLogout={onLogout} user={user} />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-block px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20 mb-4">
              <span className="text-red-500 font-bold text-[10px] uppercase tracking-widest">Admin Console</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] mb-2">
              System <span className="text-primary">Administration</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Manage users, roles, and application workflow assignments.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'users', label: 'User Management', icon: 'group' },
            { id: 'workflow', label: 'Workflow Management', icon: 'account_tree' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                tab === t.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined !text-lg">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="animate-spin material-symbols-outlined !text-4xl text-primary">progress_activity</span>
          </div>
        ) : tab === 'users' ? (
          /* ── USER MANAGEMENT TAB ──────────────────────────────────── */
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">manage_accounts</span>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">All Users ({filteredUsers.length})</h3>
              </div>
              <select
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold"
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Organisation / Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Current Role</th>
                    <th className="px-6 py-4">Change Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-400">#{u.id}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{u.org_name}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full border ${getRoleBadgeColor(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={u.role}
                          onChange={e => handleRoleChange(u.id, e.target.value)}
                          disabled={u.id === user?.id}
                          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                        </select>
                        {u.id === user?.id && (
                          <span className="ml-2 text-[10px] text-slate-400 font-bold">(You)</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ── WORKFLOW MANAGEMENT TAB ──────────────────────────────── */
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/50">
              <span className="material-symbols-outlined text-primary">assignment</span>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">Application Workflow ({applications.length})</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="px-6 py-4">Reference ID</th>
                    <th className="px-6 py-4">Applicant / Org</th>
                    <th className="px-6 py-4">Grant</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">AI Score</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                  {applications.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-700 dark:text-slate-300">{app.reference_id}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white max-w-[200px] truncate">
                        {app.org_name || app.project_title || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                          {app.grant_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full border ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900 dark:text-white">{app.ai_score || '—'}</td>
                      <td className="px-6 py-4 text-right">
                        {['pending_review', 'risk_flagged', 'waitlisted'].includes(app.status) && (
                          <button
                            onClick={() => openAssignModal(app)}
                            className="px-4 py-2 text-sm font-bold bg-primary text-slate-900 rounded-lg hover:bg-primary/90 transition-all shadow-sm flex items-center gap-2 ml-auto"
                          >
                            <span className="material-symbols-outlined !text-base">person_add</span>
                            Reassign
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ── Assignment Modal ──────────────────────────────────────── */}
      {assignApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => { setAssignApp(null); setConflictWarning(null); }} />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{assignApp.reference_id}</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Assign Staff</h3>
              </div>
              <button onClick={() => { setAssignApp(null); setConflictWarning(null); }} className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors flex">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Role filter */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Filter staff by role</label>
                <div className="flex gap-2">
                  {['reviewer', 'officer', 'finance'].map(r => (
                    <button
                      key={r}
                      onClick={() => handleStaffRoleFilterChange(r)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        staffRoleFilter === r
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conflict warning banner */}
              {conflictWarning && (
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-4 rounded-xl flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-500 mt-0.5">warning</span>
                  <div>
                    <p className="text-sm font-bold text-amber-800 dark:text-amber-400">Conflict of Interest Detected</p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">{conflictWarning.message}</p>
                    <button
                      onClick={() => handleAssign(conflictWarning.staffId, true)}
                      disabled={assigning}
                      className="mt-3 px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                    >
                      {assigning ? 'Assigning...' : 'Assign Anyway (Override)'}
                    </button>
                  </div>
                </div>
              )}

              {/* Staff list */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {staffList.length > 0 ? staffList.map(staff => {
                  const conflict = getConflictInfo(staff, assignApp);
                  return (
                    <div
                      key={staff.id}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                        conflict
                          ? 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10'
                          : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <span className="material-symbols-outlined text-slate-500">person</span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">{staff.org_name}</p>
                          <p className="text-xs text-slate-500">{staff.email}</p>
                          {conflict && (
                            <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-0.5">
                              <span className="material-symbols-outlined !text-xs">warning</span>
                              {conflict}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAssign(staff.id)}
                        disabled={assigning}
                        className="px-4 py-2 text-xs font-bold bg-primary text-slate-900 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
                      >
                        Assign
                      </button>
                    </div>
                  );
                }) : (
                  <div className="text-center py-8 text-slate-500">
                    <span className="material-symbols-outlined !text-3xl text-slate-300 mb-2 block">person_off</span>
                    <p className="text-sm font-bold">No staff found with role "{staffRoleFilter}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <GlobalFooter />
    </div>
  );
};

export default AdminDashboard;
