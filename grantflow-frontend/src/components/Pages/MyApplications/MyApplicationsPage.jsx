import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../Core/shared/GlobalHeader';
import GlobalFooter from '../../Core/shared/GlobalFooter';
import MobileBottomNav from '../../Core/shared/MobileBottomNav';
import { applicationsAPI } from '../../../services/api';

const StatusModal = ({ application, onClose }) => {
  if (!application) return null;

  const stages = [
    { name: 'Submitted', icon: 'check', done: true },
    { name: 'Screening', icon: 'search', done: true },
    { name: 'In Review', icon: 'rate_review', current: application.status === 'In Review' },
    { name: 'Decision', icon: 'gavel', current: application.status === 'Decision' },
    { name: 'Agreement', icon: 'handshake' },
    { name: 'Active', icon: 'rocket_launch' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-primary uppercase tracking-widest">ID: {application.id}</span>
            <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
              application.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {application.status}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="p-8">
          <h3 className="text-2xl font-black mb-8 text-slate-900 dark:text-white">Application Tracking</h3>
          
          <div className="relative">
            <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800"></div>
            <div className="flex justify-between items-start relative z-10">
              {stages.map((stage, idx) => (
                <div key={stage.name} className="flex flex-col items-center gap-3 group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    stage.done 
                      ? "bg-primary text-slate-900 shadow-lg shadow-primary/20" 
                      : stage.current 
                        ? "bg-primary/20 text-primary ring-2 ring-primary animate-pulse" 
                        : "bg-slate-100 dark:bg-slate-800 text-slate-300"
                  }`}>
                    <span className="material-symbols-outlined !text-xl">{stage.done ? 'check' : stage.icon}</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider text-center max-w-[60px] ${
                    stage.done || stage.current ? "text-slate-900 dark:text-white" : "text-slate-400"
                  }`}>
                    {stage.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">info</span>
              Current Update
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Your application is currently being evaluated by the technical sub-committee. We expect to move to the 'Decision' phase by October 28, 2024. No further action is required from your side at this moment.
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-800/10 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-primary text-slate-900 font-bold rounded-xl active:scale-95 transition-all">
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

const ApplicationDetailsModal = ({ application, onClose }) => {
  if (!application) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">{application.title}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Submitted on {application.date}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          <section>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">Project Overview</h4>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grant Type</p>
                <p className="text-sm font-bold">{application.type} - {application.category}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Funding Amount</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">{application.requested}</p>
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">Core Submission Details</h4>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Problem Statement</p>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Currently, the local community lacks accessible green spaces for urban farming and youth engagement. Our initiative aims to convert abandoned lots into productive gardens.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Impact Goal</p>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Benefit over 500 residents directly through local organic produce and provide 20 youth leadership positions in agriculture.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">Submitted Documents</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Reg_Certificate.pdf', 'Audit_Report_2023.pdf', 'Budget_Proposal.pdf', 'Board_Resolution.pdf'].map(doc => (
                <div key={doc} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 group cursor-pointer hover:border-primary transition-all">
                  <span className="material-symbols-outlined text-primary">picture_as_pdf</span>
                  <span className="text-xs font-bold truncate flex-1">{doc}</span>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">download</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors">
            Withdraw Application
          </button>
          <button onClick={onClose} className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-all">
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};

const MyApplicationsPage = ({ onNavigate, isLoggedIn, onLogout, user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await applicationsAPI.list();
        const mapped = res.data.map(app => ({
          id: app.reference_id,
          dbId: app.id,
          type: app.grant_type,
          title: app.project_title || app.org_name || 'Untitled',
          category: app.grant_type === 'CDG' ? 'Community' : app.grant_type === 'EIG' ? 'Education' : 'Environment',
          requested: `₹${(app.total_requested || 0).toLocaleString('en-IN')}`,
          date: app.submitted_at ? new Date(app.submitted_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
          stage: app.status?.replace(/_/g, ' '),
          status: app.status === 'approved' ? 'Approved' : app.status === 'rejected' ? 'Rejected' : app.status === 'reviewed' ? 'Reviewed' : 'In Review',
          aiScore: app.ai_score,
        }));
        setApplications(mapped);
      } catch {
        // Fallback to empty
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const filteredApps = applications.filter(app => 
    app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewStatus = (app) => {
    setSelectedApp(app);
    setIsStatusModalOpen(true);
  };

  const handleViewDetails = (app) => {
    setSelectedApp(app);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 flex flex-col">
      <GlobalHeader
        currentView="my-applications"
        onNavigate={onNavigate}
        isLoggedIn={isLoggedIn}
        onLogout={onLogout}
        user={user}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">My Applications</h2>
            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium">
              <span className="material-symbols-outlined !text-lg text-primary">info</span>
              You have <span className="font-black text-slate-900 dark:text-slate-100">{applications.length} active</span> grant applications in your dashboard.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('form')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-slate-900 font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-wider"
          >
            <span className="material-symbols-outlined font-black">add</span>
            New Application
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-8 bg-slate-50 dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 items-center shadow-sm">
          <div className="relative flex-1 min-w-[280px]">
            <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
              <span className="material-symbols-outlined">search</span>
            </span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white placeholder:text-slate-500 shadow-sm"
              placeholder="Search by ID or Project Title..." 
              type="text"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-4 py-3 text-sm font-bold border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
              <span className="material-symbols-outlined !text-lg">filter_list</span>
              Status: All
            </button>
            <button className="flex items-center justify-center w-12 h-12 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 transition-colors shadow-sm text-slate-500">
              <span className="material-symbols-outlined">calendar_today</span>
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Application ID</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Grant</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Project Title</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Requested</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApps.map((app) => (
                <tr key={app.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-6 text-sm font-black text-primary">{app.id}</td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 text-[10px] font-black bg-slate-100 dark:bg-slate-800 rounded-full tracking-wider border border-slate-200 dark:border-slate-700">{app.type}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{app.title}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{app.category}</div>
                  </td>
                  <td className="px-6 py-6 text-sm font-black text-slate-900 dark:text-white">{app.requested}</td>
                  <td className="px-6 py-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      app.status === 'Approved' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleViewStatus(app)}
                        className="px-4 py-2 text-[10px] font-black uppercase tracking-wider text-primary border-2 border-primary rounded-xl hover:bg-primary hover:text-slate-900 transition-all shadow-sm active:scale-95"
                      >
                        Status
                      </button>
                      <button 
                        onClick={() => handleViewDetails(app)}
                        className="px-4 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 border-2 border-slate-100 dark:border-slate-800 rounded-xl hover:border-slate-200 transition-all active:scale-95"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredApps.map((app) => (
            <div key={app.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ID: {app.id}</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    app.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <h3 className="text-slate-900 dark:text-white font-black text-lg leading-snug mb-1">{app.title}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{app.category}</p>
              </div>
              <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grant</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{app.type}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount</p>
                  <p className="text-sm font-black text-primary">{app.requested}</p>
                </div>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleViewStatus(app)}
                  className="py-3 rounded-2xl bg-primary text-slate-900 text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  Status
                </button>
                <button 
                  onClick={() => handleViewDetails(app)}
                  className="py-3 rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-black uppercase tracking-wider active:scale-95 transition-all"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <GlobalFooter />
      <MobileBottomNav onNavigate={onNavigate} currentView="my-applications" />
      
      {isStatusModalOpen && (
        <StatusModal 
          application={selectedApp} 
          onClose={() => setIsStatusModalOpen(false)} 
        />
      )}

      {isDetailsModalOpen && (
        <ApplicationDetailsModal 
          application={selectedApp} 
          onClose={() => setIsDetailsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default MyApplicationsPage;
