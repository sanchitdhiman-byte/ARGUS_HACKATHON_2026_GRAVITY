import React, { useState, useEffect, useCallback } from 'react';
import GlobalHeader from '../../Core/shared/GlobalHeader';
import GlobalFooter from '../../Core/shared/GlobalFooter';

const API = 'http://localhost:8000/api/v1';

const ROLE_OPTIONS = [
  { value: 'officer',  label: 'Program Officer' },
  { value: 'reviewer', label: 'Reviewer' },
  { value: 'finance',  label: 'Finance Officer' },
  { value: 'admin',    label: 'Admin' },
  { value: 'applicant',label: 'Applicant' },
];

const ROLE_BADGE = {
  admin:    'bg-purple-100 text-purple-800 border-purple-200',
  officer:  'bg-blue-100 text-blue-800 border-blue-200',
  reviewer: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  finance:  'bg-green-100 text-green-800 border-green-200',
  applicant:'bg-slate-100 text-slate-700 border-slate-200',
};

const ACTION_BADGE = {
  APPLICATION_APPROVED:  'bg-green-100 text-green-800',
  APPLICATION_REJECTED:  'bg-red-100 text-red-800',
  APPLICATION_ASSIGNED:  'bg-blue-100 text-blue-800',
  APPLICATION_SUBMITTED: 'bg-amber-100 text-amber-800',
  STAFF_CREATED:         'bg-purple-100 text-purple-800',
  ROLE_CHANGED:          'bg-indigo-100 text-indigo-800',
  USER_DEACTIVATED:      'bg-red-100 text-red-700',
  USER_ACTIVATED:        'bg-green-100 text-green-700',
};

function authHeaders() {
  const token = localStorage.getItem('access_token');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

function StatCard({ icon, label, value, sub, color, bg }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-transparent to-slate-100 dark:to-slate-800 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
      <div className={`w-11 h-11 ${bg} rounded-2xl flex items-center justify-center mb-4`}>
        <span className={`material-symbols-outlined ${color} text-2xl`}>{icon}</span>
      </div>
      <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">{value}</p>
      <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard({ onNavigate, isLoggedIn, onLogout, user }) {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Create staff form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({ org_name: '', email: '', password: '', role: 'officer' });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  // Role assignment
  const [roleEditing, setRoleEditing] = useState(null); // user id being edited
  const [roleValue, setRoleValue] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      const r = await fetch(`${API}/admin/stats`, { headers: authHeaders() });
      if (!r.ok) throw new Error('Failed to load stats');
      setStats(await r.json());
    } catch (e) { setError(e.message); }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const r = await fetch(`${API}/admin/users`, { headers: authHeaders() });
      if (!r.ok) throw new Error('Failed to load users');
      setUsers(await r.json());
    } catch (e) { setError(e.message); }
  }, []);

  const fetchAuditLog = useCallback(async () => {
    try {
      const r = await fetch(`${API}/admin/audit-log`, { headers: authHeaders() });
      if (!r.ok) throw new Error('Failed to load audit log');
      setAuditLog(await r.json());
    } catch (e) { setError(e.message); }
  }, []);

  useEffect(() => {
    setError('');
    setLoading(true);
    const p = tab === 'overview' ? fetchStats()
            : tab === 'users'    ? fetchUsers()
            : fetchAuditLog();
    p.finally(() => setLoading(false));
  }, [tab, fetchStats, fetchUsers, fetchAuditLog]);

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');
    try {
      const r = await fetch(`${API}/admin/users`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(createForm),
      });
      if (!r.ok) {
        const d = await r.json();
        throw new Error(d.detail || 'Failed to create account');
      }
      setShowCreateForm(false);
      setCreateForm({ org_name: '', email: '', password: '', role: 'officer' });
      fetchUsers();
    } catch (e) { setCreateError(e.message); }
    finally { setCreateLoading(false); }
  };

  const handleRoleSave = async (userId) => {
    try {
      const r = await fetch(`${API}/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ role: roleValue }),
      });
      if (!r.ok) throw new Error('Failed to update role');
      setRoleEditing(null);
      fetchUsers();
    } catch (e) { setError(e.message); }
  };

  const handleToggleActive = async (u) => {
    const endpoint = u.is_active ? 'deactivate' : 'activate';
    try {
      const r = await fetch(`${API}/admin/users/${u.id}/${endpoint}`, {
        method: 'PATCH',
        headers: authHeaders(),
      });
      if (!r.ok) throw new Error('Failed to update user status');
      fetchUsers();
    } catch (e) { setError(e.message); }
  };

  const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
  const fmtDate = (s) => s ? new Date(s).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  const TABS = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'users',    label: 'User Management', icon: 'manage_accounts' },
    { id: 'audit',    label: 'Audit Log', icon: 'history' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background-dark font-display flex flex-col selection:bg-primary/30">
      <GlobalHeader currentView="admin-dashboard" onNavigate={onNavigate} isLoggedIn={isLoggedIn} onLogout={onLogout} user={user} />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-block px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/20 mb-4">
              <span className="text-purple-600 font-bold text-[10px] uppercase tracking-widest">Platform Admin</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] mb-2">
              Admin <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Manage users, roles, audit platform activity, and view grant analytics.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <span className="material-symbols-outlined text-purple-600">shield_person</span>
            </div>
            <div className="pr-4">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Logged in as</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">{user?.email || 'Admin'}</p>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8 w-fit">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === t.id
                  ? 'bg-primary text-slate-900 shadow-md shadow-primary/20'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-base">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-400 text-sm font-medium flex items-center gap-3">
            <span className="material-symbols-outlined text-xl">error</span>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <p className="text-slate-500 font-medium">Loading…</p>
            </div>
          </div>
        ) : (
          <>
            {/* ─── OVERVIEW TAB ─── */}
            {tab === 'overview' && stats && (
              <div className="space-y-8">
                {/* KPI cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon="description" label="Total Applications" value={stats.applications.total}
                    color="text-primary" bg="bg-primary/10" />
                  <StatCard icon="check_circle" label="Approved Grants" value={stats.applications.approved}
                    sub={`Approved: ${fmt(stats.financials.total_approved)}`}
                    color="text-green-600" bg="bg-green-500/10" />
                  <StatCard icon="pending" label="Pending Review" value={stats.applications.pending}
                    color="text-amber-600" bg="bg-amber-500/10" />
                  <StatCard icon="cancel" label="Rejected" value={stats.applications.rejected}
                    color="text-red-500" bg="bg-red-500/10" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon="flag" label="Risk Flagged" value={stats.applications.risk_flagged}
                    color="text-orange-500" bg="bg-orange-500/10" />
                  <StatCard icon="currency_rupee" label="Total Requested" value={fmt(stats.financials.total_requested)}
                    color="text-blue-600" bg="bg-blue-500/10" />
                  <StatCard icon="group" label="Total Users" value={stats.users.total}
                    sub={`${stats.users.active} active`}
                    color="text-purple-600" bg="bg-purple-500/10" />
                  <StatCard icon="savings" label="Total Disbursed" value={fmt(stats.financials.total_approved)}
                    sub="Approved applications total"
                    color="text-teal-600" bg="bg-teal-500/10" />
                </div>

                {/* By Grant Type */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-5">Applications by Grant Type</h3>
                    <div className="space-y-4">
                      {Object.entries(stats.by_grant_type).map(([gt, count]) => {
                        const pct = stats.applications.total > 0 ? Math.round((count / stats.applications.total) * 100) : 0;
                        const colors = { CDG: 'bg-primary', EIG: 'bg-blue-500', ECAG: 'bg-purple-500' };
                        return (
                          <div key={gt}>
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{gt}</span>
                              <span className="text-sm font-black text-slate-900 dark:text-white">{count} <span className="text-slate-400 font-medium">({pct}%)</span></span>
                            </div>
                            <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className={`h-full ${colors[gt] || 'bg-slate-400'} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-5">Applications by Status</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(stats.by_status).filter(([, v]) => v > 0).map(([status, count]) => (
                        <div key={status} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-2xl px-4 py-3">
                          <span className="text-xs font-bold text-slate-500 capitalize">{status.replace(/_/g, ' ')}</span>
                          <span className="text-lg font-black text-slate-900 dark:text-white">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── USERS TAB ─── */}
            {tab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-slate-500 font-medium">{users.length} users registered on the platform</p>
                  <button
                    onClick={() => setShowCreateForm(v => !v)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 px-5 py-2.5 rounded-xl text-sm font-black text-slate-900 transition-all shadow-lg shadow-primary/10 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-base">person_add</span>
                    Create Staff Account
                  </button>
                </div>

                {/* Create Staff Form */}
                {showCreateForm && (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">badge</span>
                      New Staff Account
                    </h3>
                    {createError && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{createError}</div>
                    )}
                    <form onSubmit={handleCreateStaff} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Organisation Name</label>
                        <input
                          required
                          value={createForm.org_name}
                          onChange={e => setCreateForm(f => ({ ...f, org_name: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="GrantFlow Admin Office"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                        <input
                          required type="email"
                          value={createForm.email}
                          onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="officer@grantflow.in"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
                        <input
                          required type="password" minLength={8}
                          value={createForm.password}
                          onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="Min. 8 characters"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Role</label>
                        <select
                          value={createForm.role}
                          onChange={e => setCreateForm(f => ({ ...f, role: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          {ROLE_OPTIONS.filter(r => r.value !== 'applicant').map(r => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setShowCreateForm(false)}
                          className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                          Cancel
                        </button>
                        <button type="submit" disabled={createLoading}
                          className="flex items-center gap-2 bg-primary hover:bg-primary/90 px-6 py-2.5 rounded-xl text-sm font-black text-slate-900 transition-all disabled:opacity-60">
                          {createLoading ? <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : <span className="material-symbols-outlined text-base">add</span>}
                          Create Account
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Users Table */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800">
                          <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                          <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                          <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                          <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                          <th className="text-right px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {users.map(u => (
                          <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-sm">
                                  {(u.org_name || u.email)[0].toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 dark:text-white">{u.org_name || '—'}</p>
                                  <p className="text-xs text-slate-400">ID #{u.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">{u.email}</td>
                            <td className="px-6 py-4">
                              {roleEditing === u.id ? (
                                <div className="flex items-center gap-2">
                                  <select
                                    value={roleValue}
                                    onChange={e => setRoleValue(e.target.value)}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
                                  >
                                    {ROLE_OPTIONS.map(r => (
                                      <option key={r.value} value={r.value}>{r.label}</option>
                                    ))}
                                  </select>
                                  <button onClick={() => handleRoleSave(u.id)}
                                    className="p-1.5 bg-primary rounded-lg hover:bg-primary/80 transition-all">
                                    <span className="material-symbols-outlined text-sm text-slate-900">check</span>
                                  </button>
                                  <button onClick={() => setRoleEditing(null)}
                                    className="p-1.5 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all">
                                    <span className="material-symbols-outlined text-sm text-slate-600">close</span>
                                  </button>
                                </div>
                              ) : (
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${ROLE_BADGE[u.role] || ROLE_BADGE.applicant}`}>
                                  {u.role}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-green-500' : 'bg-red-400'}`} />
                                {u.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => { setRoleEditing(u.id); setRoleValue(u.role); }}
                                  title="Change role"
                                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-primary transition-all"
                                >
                                  <span className="material-symbols-outlined text-base">manage_accounts</span>
                                </button>
                                <button
                                  onClick={() => handleToggleActive(u)}
                                  title={u.is_active ? 'Deactivate' : 'Activate'}
                                  className={`p-2 rounded-xl transition-all ${u.is_active ? 'hover:bg-red-50 text-slate-500 hover:text-red-600' : 'hover:bg-green-50 text-slate-500 hover:text-green-600'}`}
                                >
                                  <span className="material-symbols-outlined text-base">
                                    {u.is_active ? 'person_off' : 'person_check'}
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-6 py-16 text-center text-slate-400 font-medium">
                              No users found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ─── AUDIT LOG TAB ─── */}
            {tab === 'audit' && (
              <div className="space-y-4">
                <p className="text-slate-500 font-medium">{auditLog.length} entries (most recent first)</p>

                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800">
                          <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Timestamp</th>
                          <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actor</th>
                          <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
                          <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Object</th>
                          <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {auditLog.map(entry => (
                          <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-3 text-slate-500 font-medium whitespace-nowrap text-xs">
                              {fmtDate(entry.timestamp)}
                            </td>
                            <td className="px-6 py-3 text-slate-700 dark:text-slate-300 font-medium text-xs">
                              {entry.actor_email || `User #${entry.actor_id}` || 'System'}
                            </td>
                            <td className="px-6 py-3">
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${ACTION_BADGE[entry.action] || 'bg-slate-100 text-slate-700'}`}>
                                {entry.action.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-xs font-medium text-slate-500">
                              {entry.object_type} {entry.object_id ? `#${entry.object_id}` : ''}
                            </td>
                            <td className="px-6 py-3 text-xs text-slate-500 max-w-xs truncate" title={entry.details}>
                              {entry.details || '—'}
                            </td>
                          </tr>
                        ))}
                        {auditLog.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-6 py-16 text-center text-slate-400 font-medium">
                              No audit log entries yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <GlobalFooter />
    </div>
  );
}
