import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../Core/shared/GlobalHeader';
import GlobalFooter from '../../Core/shared/GlobalFooter';
import { complianceAPI, applicationsAPI } from '../../../services/api';

const ComplianceReporting = ({ onNavigate, isLoggedIn, onLogout, user }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [ACTIVE_GRANTS, setActiveGrants] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [reportComments, setReportComments] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appsRes = await applicationsAPI.list();
        const activeApps = appsRes.data.filter(a =>
          ['approved', 'active_reporting', 'agreement_acknowledged'].includes(a.status)
        );
        const grants = activeApps.map(app => ({
          id: app.reference_id,
          dbId: app.id,
          grantType: app.grant_type,
          title: app.project_title || app.org_name,
          awardedDate: app.submitted_at ? new Date(app.submitted_at).toLocaleDateString('en-IN') : '',
          status: 'Active',
          reports: [
            { type: 'Progress Report', due: 'Next due', status: 'Pending', requiredDocs: ['Impact Report PDF', 'Photographs'], appId: app.id },
            { type: 'Utilisation Certificate', due: 'Next due', status: 'Pending', requiredDocs: ['Signed UC', 'Audited Statements'], appId: app.id },
          ],
        }));
        setActiveGrants(grants.length > 0 ? grants : [{
          id: 'APP-EIG-2024-0012', grantType: 'EIG', title: 'Tech for All Ed', status: 'Active (Tranche 1)',
          reports: [
            { type: 'Quarterly Narrative Report', due: 'Nov 10, 2024', status: 'Pending', requiredDocs: ['Impact Report PDF', 'Photographs'], appId: null },
            { type: 'Utilisation Certificate (UC)', due: 'Nov 10, 2024', status: 'Pending', requiredDocs: ['Signed UC', 'Audited Statements'], appId: null },
          ],
        }]);
      } catch {
        setActiveGrants([{
          id: 'APP-EIG-2024-0012', grantType: 'EIG', title: 'Tech for All Ed', status: 'Active (Tranche 1)',
          reports: [
            { type: 'Quarterly Narrative Report', due: 'Nov 10, 2024', status: 'Pending', requiredDocs: ['Impact Report PDF', 'Photographs'], appId: null },
          ],
        }]);
      }
    };
    fetchData();
  }, []);

  const handleComplianceSubmit = async () => {
    if (!selectedReport) return;
    setSubmitLoading(true);
    try {
      const appId = selectedReport.appId || 1;
      const res = await complianceAPI.submitReport(appId, selectedReport.type, {
        comments: reportComments,
        submitted_via: 'portal',
      });
      const analysis = res.data.ai_analysis;
      let message = 'Report submitted successfully!';
      if (analysis) {
        message += `\n\nAI Analysis: ${analysis.content_quality || 'N/A'}\nRecommendation: ${analysis.recommended_action || 'N/A'}`;
        if (analysis.content_flags?.length > 0) {
          message += `\n\nFlags:\n${analysis.content_flags.map(f => `- ${f.issue}`).join('\n')}`;
        }
      }
      alert(message);
      setSelectedReport(null);
      setReportComments('');
    } catch (err) {
      alert(err.response?.data?.detail || 'Submission failed');
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Pending') return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900';
    if (status === 'Submitted') return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900';
    if (status === 'Verified') return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900';
    return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background-dark font-display flex flex-col selection:bg-primary/30">
      <GlobalHeader currentView="compliance" onNavigate={onNavigate} isLoggedIn={isLoggedIn} onLogout={onLogout} user={user} />
      
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-block px-3 py-1 bg-primary/10 rounded-full border border-primary/20 mb-4">
              <span className="text-primary font-bold text-[10px] uppercase tracking-widest">Compliance Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] mb-2">
              Compliance & <span className="text-primary">Reporting</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Submit mandatory impact reports and utilisation certificates.</p>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Left column: Grants list */}
           <div className="lg:col-span-2 space-y-6">
             {ACTIVE_GRANTS.length > 0 ? ACTIVE_GRANTS.map(grant => (
               <div key={grant.id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                 <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{grant.id}</span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                         {grant.title}
                         <span className="bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">{grant.grantType}</span>
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900 text-xs font-bold uppercase tracking-wider rounded-full">
                       {grant.status}
                    </span>
                 </div>
                 <div className="p-6">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">event_upcoming</span>
                      Required Deliverables
                    </h4>
                    <div className="space-y-4">
                      {grant.reports.map((report, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-colors group">
                           <div>
                              <div className="flex items-center gap-3 mb-1">
                                 <h5 className="font-bold text-slate-900 dark:text-white">{report.type}</h5>
                                 <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full border ${getStatusColor(report.status)}`}>
                                   {report.status}
                                 </span>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                 {report.requiredDocs.map(doc => (
                                   <span key={doc} className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                                     <span className="material-symbols-outlined !text-[12px]">description</span>
                                     {doc}
                                   </span>
                                 ))}
                              </div>
                           </div>
                           <div className="flex flex-col items-end gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                              <span className="text-xs font-bold text-red-600 dark:text-red-400">Due: {report.due}</span>
                              <button 
                                onClick={() => setSelectedReport(report)}
                                className="w-full sm:w-auto px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs rounded-lg hover:shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2"
                              >
                                Submit Report
                                <span className="material-symbols-outlined !text-sm">arrow_forward</span>
                              </button>
                           </div>
                        </div>
                      ))}
                    </div>
                 </div>
               </div>
             )) : (
               <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500">
                 <span className="material-symbols-outlined !text-5xl text-slate-300 dark:text-slate-700 mb-4 block">assignment_turned_in</span>
                 <p className="font-bold text-slate-900 dark:text-white text-lg">No Pending Reports</p>
                 <p>You have no active grants that require compliance reporting at this time.</p>
               </div>
             )}
           </div>

           {/* Right column: Info */}
           <div className="space-y-6">
              <div className="bg-primary/5 rounded-3xl border border-primary/20 p-6">
                 <h4 className="font-black text-primary text-lg mb-4 flex items-center gap-2">
                   <span className="material-symbols-outlined">gavel</span>
                   Compliance Guidelines
                 </h4>
                 <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                   <li className="flex gap-3">
                     <span className="material-symbols-outlined !text-base text-primary shrink-0">check_circle</span>
                     <p>Utilisation Certificates must be signed by a registered Charted Accountant.</p>
                   </li>
                   <li className="flex gap-3">
                     <span className="material-symbols-outlined !text-base text-primary shrink-0">check_circle</span>
                     <p>Impact reports should include at least 5 geocoded photographs of the intervention.</p>
                   </li>
                   <li className="flex gap-3">
                     <span className="material-symbols-outlined !text-base text-primary shrink-0">warning</span>
                     <p className="font-bold">Failure to submit reports within 15 days of the deadline will freeze subsequent tranches automatically via smart contract.</p>
                   </li>
                 </ul>
              </div>
           </div>
        </div>
      </main>

      {/* Submission Modal stub */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedReport(null)} />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
               <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Submit {selectedReport.type}</h3>
                  <p className="text-xs font-bold text-red-600 dark:text-red-400 mt-1">Due: {selectedReport.due}</p>
               </div>
               <button onClick={() => setSelectedReport(null)} className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors flex">
                 <span className="material-symbols-outlined">close</span>
               </button>
            </div>
            <div className="p-8 space-y-6">
               <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-4 rounded-xl flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-500 mt-0.5">upload_file</span>
                  <div>
                    <p className="text-sm font-bold text-amber-800 dark:text-amber-500">Required Documents</p>
                    <ul className="text-xs text-amber-700 dark:text-amber-400 mt-1 list-disc list-inside">
                      {selectedReport.requiredDocs.map(doc => <li key={doc}>{doc}</li>)}
                    </ul>
                  </div>
               </div>

               <div>
                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Upload Report Package (PDF/ZIP)</label>
                 <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary transition-colors rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-50 dark:bg-slate-800/50">
                   <span className="material-symbols-outlined !text-4xl text-slate-400 mb-2">cloud_upload</span>
                   <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Click to browse or drag & drop</p>
                   <p className="text-xs text-slate-500 mt-1">Max 10MB</p>
                 </div>
               </div>
               
               <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Additional Comments (Optional)</label>
                  <textarea
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary h-24"
                    placeholder="Any notes for the Program Officer..."
                    value={reportComments}
                    onChange={(e) => setReportComments(e.target.value)}
                  ></textarea>
               </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 flex items-center justify-end gap-3">
               <button 
                 onClick={() => setSelectedReport(null)}
                 className="px-6 py-3 rounded-xl text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleComplianceSubmit}
                 disabled={submitLoading}
                 className="px-6 py-3 rounded-xl bg-primary text-slate-900 font-black text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl active:scale-95 flex items-center gap-2"
               >
                 <span className="material-symbols-outlined !text-lg">{submitLoading ? 'hourglass_top' : 'cloud_done'}</span>
                 {submitLoading ? 'Submitting...' : 'Secure Submit'}
               </button>
            </div>
          </div>
        </div>
      )}

      <GlobalFooter />
    </div>
  );
};

export default ComplianceReporting;
