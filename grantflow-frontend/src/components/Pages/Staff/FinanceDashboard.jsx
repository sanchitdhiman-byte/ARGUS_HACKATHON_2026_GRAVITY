import React, { useState } from 'react';
import GlobalHeader from '../../Core/shared/GlobalHeader';
import GlobalFooter from '../../Core/shared/GlobalFooter';

const MOCK_FINANCE = [
  { id: 'APP-EIG-2024-0012', org: 'Tech for All Ed', grantType: 'EIG', awardDate: 'Aug 10, 2024', totalAward: 1500000, disbursed: 500000, status: 'Active (Tranche 1)', nextTranche: 'Dec 15, 2024' },
  { id: 'APP-CDG-2024-0056', org: 'Rural Connect NGO', grantType: 'CDG', awardDate: 'Sep 05, 2024', totalAward: 800000, disbursed: 800000, status: 'Fully Disbursed', nextTranche: null },
  { id: 'APP-ECAG-2024-0089', org: 'Green Horizons', grantType: 'ECAG', awardDate: 'Oct 20, 2024', totalAward: 450000, disbursed: 0, status: 'Pending Initial Tranche', nextTranche: 'Nov 05, 2024' },
];

const FinanceDashboard = ({ onNavigate, isLoggedIn, onLogout, user }) => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);

  const filteredApps = MOCK_FINANCE.filter(app => {
    let match = true;
    if (filterStatus !== 'All') {
      if (filterStatus === 'Pending' && !app.status.includes('Pending')) match = false;
      if (filterStatus === 'Active' && !app.status.includes('Active')) match = false;
      if (filterStatus === 'Completed' && !app.status.includes('Fully')) match = false;
    }
    return match;
  });

  const getStatusColor = (status) => {
    if (status.includes('Active')) return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900';
    if (status.includes('Pending')) return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900';
    if (status.includes('Fully')) return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900';
    return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background-dark font-display flex flex-col selection:bg-primary/30">
      <GlobalHeader currentView="finance-dashboard" onNavigate={onNavigate} isLoggedIn={isLoggedIn} onLogout={onLogout} />
      
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-block px-3 py-1 bg-primary/10 rounded-full border border-primary/20 mb-4">
              <span className="text-primary font-bold text-[10px] uppercase tracking-widest">Finance Module</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] mb-2">
              Disbursement & <span className="text-primary">Finance</span> Track
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Manage grant tranches, payout schedules, and financial reporting.</p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
             <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
               <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 flex">account_balance</span>
             </div>
             <div className="pr-4">
               <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Fund Pool Balance</p>
               <p className="text-sm font-black text-slate-900 dark:text-white">₹45.2 Crores</p>
             </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           {[
             { label: "Total Awarded", value: "₹2.7 Cr", icon: "monetization_on", color: "text-blue-500", bg: "bg-blue-500/10" },
             { label: "Total Disbursed", value: "₹1.3 Cr", icon: "payments", color: "text-green-500", bg: "bg-green-500/10" },
             { label: "Pending Payouts", value: 4, icon: "schedule", color: "text-amber-500", bg: "bg-amber-500/10" },
             { label: "Active Grants", value: 18, icon: "assessment", color: "text-purple-500", bg: "bg-purple-500/10" },
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

        {/* List */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
               <span className="material-symbols-outlined text-primary">price_check</span>
               <h3 className="font-black text-lg text-slate-900 dark:text-white">Grant Ledger</h3>
            </div>
            <select 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer w-full md:w-auto"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Grants</option>
              <option value="Active">Active Tranches</option>
              <option value="Pending">Pending Init. Tranche</option>
              <option value="Completed">Fully Disbursed</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="px-6 py-4">Application ID</th>
                  <th className="px-6 py-4">Organisation</th>
                  <th className="px-6 py-4">Total Awarded</th>
                  <th className="px-6 py-4">Disbursed (Progress)</th>
                  <th className="px-6 py-4">Status & Next Tranche</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                {filteredApps.length > 0 ? filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      <div className="flex flex-col gap-0.5">
                         {app.id}
                         <span className="text-[10px] font-bold text-slate-400">{app.grantType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white max-w-[200px] truncate">{app.org}</td>
                    <td className="px-6 py-4 font-black text-slate-900 dark:text-white text-base">₹{(app.totalAward / 100000).toFixed(1)}L</td>
                    <td className="px-6 py-4">
                      <div className="w-48">
                         <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1 dark:text-slate-400">
                           <span>₹{(app.disbursed / 100000).toFixed(1)}L</span>
                           <span>{Math.round((app.disbursed/app.totalAward)*100)}%</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
                           <div className="h-full bg-primary rounded-full" style={{ width: `${(app.disbursed/app.totalAward)*100}%` }}></div>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full border ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                        {app.nextTranche && <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500">Next: {app.nextTranche}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedApp(app)}
                        className={`px-4 py-2 text-sm font-bold text-white rounded-lg transition-all shadow-sm ${app.status.includes('Fully') ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed hidden' : 'bg-primary text-slate-900 hover:bg-primary/90 hover:shadow-primary/20 hover:-translate-y-0.5'}`}
                      >
                        Process Payout
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined !text-4xl text-slate-300 dark:text-slate-700">inventory_2</span>
                        <p>No grants found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Finance Action Modal stub */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedApp(null)} />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
               <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{selectedApp.id}</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Disburse to {selectedApp.org}</h3>
               </div>
               <button onClick={() => setSelectedApp(null)} className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors flex">
                 <span className="material-symbols-outlined">close</span>
               </button>
            </div>
            <div className="p-8 space-y-6">
               <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Awarded</p>
                   <p className="font-black text-slate-900 dark:text-white text-lg">₹{(selectedApp.totalAward).toLocaleString()}</p>
                 </div>
                 <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                   <p className="text-[10px] font-bold text-amber-800 dark:text-amber-500 uppercase tracking-widest mb-1">Pending Balance</p>
                   <p className="font-black text-amber-900 dark:text-amber-400 text-lg">₹{(selectedApp.totalAward - selectedApp.disbursed).toLocaleString()}</p>
                 </div>
               </div>

               <div>
                 <p className="text-sm font-black text-slate-900 dark:text-white mb-2">Process Next Tranche</p>
                 <div className="relative mb-3">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                   <input 
                     type="number" 
                     className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-4 py-3 text-lg font-black focus:border-primary focus:ring-1 focus:ring-primary dark:text-white"
                     defaultValue={selectedApp.totalAward === 450000 ? 250000 : 500000}
                   />
                 </div>
                 
                 <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                   <span className="material-symbols-outlined text-green-500">verified</span>
                   <div>
                     <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">Compliance & Utilisation Check</p>
                     <p className="text-[10px] text-slate-500 leading-relaxed">System verified: All preceding compliance reports and utilisation certificates have been submitted and verified by the Program Officer. Ready for disbursement.</p>
                   </div>
                 </div>
               </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 flex items-center justify-between gap-3">
               <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors">
                 <span className="material-symbols-outlined !text-base">account_balance</span>
                 View Bank Details
               </button>
               <div className="flex items-center gap-3">
                 <button 
                   onClick={() => setSelectedApp(null)}
                   className="px-6 py-3 rounded-xl text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={() => { alert('Transfer Initiated Securely.'); setSelectedApp(null); }}
                   className="px-6 py-3 rounded-xl bg-primary text-slate-900 font-black text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl active:scale-95 flex items-center gap-2"
                 >
                   <span className="material-symbols-outlined !text-lg">send</span>
                   Initiate Transfer
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      <GlobalFooter />
    </div>
  );
};

export default FinanceDashboard;
