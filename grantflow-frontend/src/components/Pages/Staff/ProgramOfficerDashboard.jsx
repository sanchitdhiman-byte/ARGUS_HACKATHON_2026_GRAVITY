import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../Core/shared/GlobalHeader';
import GlobalFooter from '../../Core/shared/GlobalFooter';

const ProgramOfficerDashboard = ({ onNavigate, isLoggedIn, onLogout, user }) => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterGrant, setFilterGrant] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const res = await fetch('http://127.0.0.1:8000/api/v1/applications', { headers });
        if (res.ok) {
          const data = await res.json();
          // Map backend schema to what the UI expects
          const mapped = data.map(d => ({
            id: d.reference_id,
            org: d.org_name || 'Unknown Org',
            grantType: d.grant_type || 'CDG',
            date: new Date(d.submitted_at).toLocaleDateString(),
            status: d.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Quick format
            aiScore: d.ai_score || 0,
            amount: d.requested_amount || 0,
            raw: d
          }));
          setApps(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch apps", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const filteredApps = apps.filter(app => {
    let match = true;
    if (filterStatus !== 'All' && app.status !== filterStatus) match = false;
    if (filterGrant !== 'All' && app.grantType !== filterGrant) match = false;
    if (searchQuery && !app.org.toLowerCase().includes(searchQuery.toLowerCase()) && !app.id.toLowerCase().includes(searchQuery.toLowerCase())) match = false;
    return match;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Review': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900';
      case 'Assigned': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900';
      case 'Under Review': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900';
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900';
      default: return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const getAiScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400 font-black';
    if (score >= 70) return 'text-amber-600 dark:text-amber-400 font-bold';
    return 'text-red-600 dark:text-red-400 font-bold';
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background-dark font-display flex flex-col selection:bg-primary/30">
      <GlobalHeader currentView="staff-dash" onNavigate={onNavigate} isLoggedIn={isLoggedIn} onLogout={onLogout} />
      
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-block px-3 py-1 bg-primary/10 rounded-full border border-primary/20 mb-4">
              <span className="text-primary font-bold text-[10px] uppercase tracking-widest">Workspace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] mb-2">
              Program Officer <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Manage intake, screen applications, and coordinate reviews.</p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
             <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
               <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 flex">event</span>
             </div>
             <div className="pr-4">
               <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Current Cycle</p>
               <p className="text-sm font-black text-slate-900 dark:text-white">Q4 2024</p>
             </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           {[
             { label: "Pending Screening", value: 32, icon: "inbox", color: "text-amber-500", bg: "bg-amber-500/10" },
             { label: "Assigned to Review", value: 45, icon: "assignment_ind", color: "text-blue-500", bg: "bg-blue-500/10" },
             { label: "Active Reviewers", value: 12, icon: "groups", color: "text-purple-500", bg: "bg-purple-500/10" },
             { label: "Avg. Screening Time", value: "2.4d", icon: "timer", color: "text-green-500", bg: "bg-green-500/10" },
           ].map((kpi, idx) => (
             <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-transparent to-slate-100 dark:to-slate-800 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
               <div className={`w-12 h-12 rounded-2xl ${kpi.bg} flex items-center justify-center mb-4`}>
                 <span className={`material-symbols-outlined !text-2xl ${kpi.color}`}>{kpi.icon}</span>
               </div>
               <h4 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{kpi.value}</h4>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
             </div>
           ))}
        </div>

        {/* Actions & Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
               <span className="material-symbols-outlined text-primary">view_list</span>
               <h3 className="font-black text-lg text-slate-900 dark:text-white">Application Queue</h3>
               <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">{filteredApps.length}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-lg">search</span>
                <input 
                  type="text" 
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all font-medium placeholder:font-normal"
                  placeholder="App ID or Org Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                value={filterGrant}
                onChange={(e) => setFilterGrant(e.target.value)}
              >
                <option value="All">All Grants</option>
                <option value="CDG">CDG</option>
                <option value="EIG">EIG</option>
                <option value="ECAG">ECAG</option>
              </select>
              <select 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Assigned">Assigned</option>
                <option value="Under Review">Under Review</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="px-6 py-4">Application ID</th>
                  <th className="px-6 py-4">Organisation</th>
                  <th className="px-6 py-4">Grant / Amount</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4">AI Init. Score</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                {filteredApps.length > 0 ? filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4 font-mono font-bold text-slate-700 dark:text-slate-300">{app.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white max-w-[200px] truncate">{app.org}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-black text-slate-900 dark:text-white">{app.grantType}</span>
                        <span className="text-xs text-slate-500">₹{(app.amount / 100000).toFixed(1)}L</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{app.date}</td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                         <span className={`material-symbols-outlined !text-lg ${getAiScoreColor(app.aiScore)}`}>
                           {app.aiScore >= 90 ? 'task_alt' : (app.aiScore >= 70 ? 'info' : 'warning')}
                         </span>
                         <span className={getAiScoreColor(app.aiScore)}>{app.aiScore}%</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedApp(app)}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors group-hover:opacity-100 opacity-0 md:opacity-100 focus:opacity-100"
                        title="Review Application"
                      >
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined !text-4xl text-slate-300 dark:text-slate-700">mystery</span>
                        <p>No applications match your filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* PO Action Modal stub */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedApp(null)} />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
               <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{selectedApp.id}</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedApp.org}</h3>
               </div>
               <button onClick={() => setSelectedApp(null)} className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors flex">
                 <span className="material-symbols-outlined">close</span>
               </button>
            </div>
            <div className="p-8 space-y-6">
               <div className="flex gap-4">
                 <div className="flex-1 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-4 rounded-xl">
                   <p className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-500 mb-1">AI Screening Report</p>
                   <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Application passes basic algorithmic eligibility checks. Budget arithmetic verified.</p>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Grant Phase</p>
                   <p className="font-medium text-slate-900 dark:text-white">{selectedApp.grantType} 2024</p>
                 </div>
                 <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Requested</p>
                   <p className="font-black text-slate-900 dark:text-white text-lg">₹{(selectedApp.amount).toLocaleString()}</p>
                 </div>
               </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 flex items-center justify-end gap-3">
               <button 
                 onClick={() => setSelectedApp(null)}
                 className="px-6 py-3 rounded-xl text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
               >
                 Close
               </button>
               <button 
                 className="px-6 py-3 rounded-xl bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-bold text-sm hover:bg-red-200 transition-colors"
               >
                 Reject (Ineligible)
               </button>
               <button 
                 className="px-6 py-3 rounded-xl bg-primary text-slate-900 font-black text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl active:scale-95"
               >
                 Assign Reviewers
               </button>
            </div>
          </div>
        </div>
      )}

      <GlobalFooter />
    </div>
  );
};

export default ProgramOfficerDashboard;
