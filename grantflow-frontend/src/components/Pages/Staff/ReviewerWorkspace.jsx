import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../Core/shared/GlobalHeader';
import GlobalFooter from '../../Core/shared/GlobalFooter';
import { reviewsAPI, applicationsAPI } from '../../../services/api';

const ReviewerWorkspace = ({ onNavigate, isLoggedIn, onLogout, user }) => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [reviewPackage, setReviewPackage] = useState(null);
  const [scores, setScores] = useState({});
  const [comments, setComments] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await reviewsAPI.list();
        const mapped = await Promise.all(res.data.map(async (review) => {
          let appData = {};
          try {
            const appRes = await applicationsAPI.getById(review.application_id);
            appData = appRes.data;
          } catch { /* empty */ }
          return {
            id: appData.reference_id || `APP-${review.application_id}`,
            dbId: review.application_id,
            reviewId: review.id,
            org: appData.org_name || 'Unknown',
            grantType: appData.grant_type || '',
            dueDate: '',
            status: review.status === 'submitted' ? 'Reviewed' : 'Pending Review',
            amount: appData.total_requested || 0,
            score: review.total_score,
          };
        }));
        setAssignments(mapped);
      } catch { /* empty */ }
    };
    fetchReviews();
  }, []);

  const handleOpenReview = async (app) => {
    setSelectedApp(app);
    setScores({});
    setComments('');
    try {
      const res = await reviewsAPI.getReviewPackage(app.dbId);
      setReviewPackage(res.data);
      // Pre-fill with AI suggested scores
      const suggested = res.data?.ai_review_package?.suggested_scores || {};
      setScores({
        alignment: suggested.alignment?.score || '',
        feasibility: suggested.feasibility?.score || '',
        impact: suggested.impact?.score || '',
        budget: suggested.budget?.score || '',
        track_record: suggested.track_record?.score || '',
      });
    } catch {
      setReviewPackage(null);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedApp) return;
    setSubmitLoading(true);
    try {
      await reviewsAPI.submit({
        application_id: selectedApp.dbId,
        score_alignment: parseInt(scores.alignment) || 0,
        score_feasibility: parseInt(scores.feasibility) || 0,
        score_impact: parseInt(scores.impact) || 0,
        score_budget: parseInt(scores.budget) || 0,
        score_track_record: parseInt(scores.track_record) || 0,
        comments,
      });
      setAssignments(prev => prev.map(a => a.dbId === selectedApp.dbId ? { ...a, status: 'Reviewed', score: Object.values(scores).reduce((s, v) => s + (parseInt(v) || 0), 0) } : a));
      setSelectedApp(null);
    } catch (err) {
      alert(err.response?.data?.detail || 'Submit failed');
    } finally {
      setSubmitLoading(false);
    }
  };

  const MOCK_ASSIGNMENTS = assignments;

  const filteredApps = MOCK_ASSIGNMENTS.filter(app => {
    let match = true;
    if (filterStatus !== 'All' && app.status !== filterStatus) match = false;
    return match;
  });

  const getStatusColor = (status) => {
    return status === 'Reviewed' 
      ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900'
      : 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900';
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background-dark font-display flex flex-col selection:bg-primary/30">
      <GlobalHeader currentView="reviewer-workspace" onNavigate={onNavigate} isLoggedIn={isLoggedIn} onLogout={onLogout} user={user} />
      
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-block px-3 py-1 bg-primary/10 rounded-full border border-primary/20 mb-4">
              <span className="text-primary font-bold text-[10px] uppercase tracking-widest">Workspace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] mb-2">
              Reviewer <span className="text-primary">Workspace</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Evaluate assigned applications based on grant rubrics.</p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
             <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
               <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 flex">how_to_reg</span>
             </div>
             <div className="pr-4">
               <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Expert Panel</p>
               <p className="text-sm font-black text-slate-900 dark:text-white">Dr. A. Sharma</p>
             </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
           {[
             { label: "Total Assigned", value: MOCK_ASSIGNMENTS.length, icon: "inventory", color: "text-blue-500", bg: "bg-blue-500/10" },
             { label: "Pending Review", value: MOCK_ASSIGNMENTS.filter(a => a.status === 'Pending Review').length, icon: "pending_actions", color: "text-amber-500", bg: "bg-amber-500/10" },
             { label: "Completed", value: MOCK_ASSIGNMENTS.filter(a => a.status === 'Reviewed').length, icon: "task_alt", color: "text-green-500", bg: "bg-green-500/10" },
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
               <span className="material-symbols-outlined text-primary">grading</span>
               <h3 className="font-black text-lg text-slate-900 dark:text-white">Assigned to You</h3>
            </div>
            <select 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer w-full md:w-auto"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Assignments</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Reviewed">Reviewed</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="px-6 py-4">Application ID</th>
                  <th className="px-6 py-4">Organisation</th>
                  <th className="px-6 py-4">Grant / Amount</th>
                  <th className="px-6 py-4">Review Deadline</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Your Score</th>
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
                    <td className="px-6 py-4 text-amber-600 dark:text-amber-500 font-bold">{app.dueDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`font-black ${app.score ? 'text-primary' : 'text-slate-400'}`}>
                         {app.score !== null ? `${app.score}/100` : '-'}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenReview(app)}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors group-hover:opacity-100 opacity-0 md:opacity-100 focus:opacity-100"
                        title={app.status === 'Reviewed' ? 'View Evaluation' : 'Evaluate'}
                      >
                        <span className="material-symbols-outlined">{app.status === 'Reviewed' ? 'visibility' : 'edit_document'}</span>
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined !text-4xl text-slate-300 dark:text-slate-700">task</span>
                        <p>No assignments found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Review Action Modal stub */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedApp(null)} />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="sticky top-0 z-10 p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
               <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{selectedApp.id}</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Evaluate: {selectedApp.org}</h3>
               </div>
               <button onClick={() => setSelectedApp(null)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex">
                 <span className="material-symbols-outlined">close</span>
               </button>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Left: App Data + AI Review Package */}
               <div className="space-y-6">
                 <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">AI Review Package</h4>

                 {reviewPackage?.ai_review_package?.summary && (
                   <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-4 rounded-xl">
                     <p className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-1">
                       <span className="material-symbols-outlined !text-sm">smart_toy</span> AI Summary
                     </p>
                     <div className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                       <p><strong>Applicant:</strong> {reviewPackage.ai_review_package.summary.applicant}</p>
                       <p><strong>Project:</strong> {reviewPackage.ai_review_package.summary.project}</p>
                       <p><strong>Location:</strong> {reviewPackage.ai_review_package.summary.location}</p>
                       <p><strong>Beneficiaries:</strong> {reviewPackage.ai_review_package.summary.beneficiaries}</p>
                       <p><strong>Amount:</strong> {reviewPackage.ai_review_package.summary.amount}</p>
                     </div>
                   </div>
                 )}

                 {reviewPackage?.ai_review_package?.risk_flags?.length > 0 && (
                   <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-4 rounded-xl">
                     <p className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1">
                       <span className="material-symbols-outlined !text-sm">warning</span> Risk Flags
                     </p>
                     <div className="space-y-2">
                       {reviewPackage.ai_review_package.risk_flags.map((flag, i) => (
                         <div key={i} className="flex items-start gap-2">
                           <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${flag.severity === 'high' ? 'bg-red-100 text-red-700' : flag.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{flag.severity}</span>
                           <p className="text-xs text-slate-700 dark:text-slate-300">{flag.description}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}

                 <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                     <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">AI Composite Score</p>
                     <p className="text-2xl font-black text-primary">{reviewPackage?.ai_scores?.composite || 0}%</p>
                   </div>
                   <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                     <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Budget</p>
                     <p className="text-sm font-bold text-slate-900 dark:text-white">₹{(selectedApp.amount/100000).toFixed(1)} Lakhs</p>
                   </div>
                 </div>
               </div>

               {/* Right: Scoring */}
               <div className="space-y-6">
                 <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">Scoring Rubric ({selectedApp.grantType})</h4>

                 <div className="space-y-4">
                   {[
                     { key: 'alignment', label: 'Alignment / Problem Addressed', max: 5 },
                     { key: 'feasibility', label: 'Feasibility & Plan', max: 5 },
                     { key: 'impact', label: 'Impact & Outcomes', max: 5 },
                     { key: 'budget', label: 'Budget Justification', max: 5 },
                     { key: 'track_record', label: 'Track Record', max: 5 },
                   ].map((rubric) => {
                     const aiSuggested = reviewPackage?.ai_review_package?.suggested_scores?.[rubric.key];
                     return (
                       <div key={rubric.key} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-xl">
                         <div className="flex justify-between items-center mb-1">
                           <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{rubric.label}</span>
                           <span className="text-xs font-black text-slate-400">1–{rubric.max}</span>
                         </div>
                         {aiSuggested && (
                           <p className="text-[10px] text-blue-500 font-bold mb-1 flex items-center gap-1">
                             <span className="material-symbols-outlined !text-[10px]">smart_toy</span>
                             AI Suggested: {aiSuggested.score}/5 — {aiSuggested.justification}
                           </p>
                         )}
                         <input
                           type="number" min="1" max={rubric.max}
                           className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm font-black text-primary focus:ring-1 focus:ring-primary"
                           placeholder={`Score 1-${rubric.max}`}
                           disabled={selectedApp.status === 'Reviewed'}
                           value={scores[rubric.key] || ''}
                           onChange={(e) => setScores(prev => ({ ...prev, [rubric.key]: e.target.value }))}
                         />
                       </div>
                     );
                   })}
                 </div>

                 <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Reviewer Feedback Comments</label>
                    <textarea
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary h-24"
                      placeholder="Required qualitative feedback..."
                      disabled={selectedApp.status === 'Reviewed'}
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    ></textarea>
                 </div>
               </div>
            </div>
            
            <div className="sticky bottom-0 z-10 p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50 dark:bg-slate-900/90 backdrop-blur">
               <button 
                 onClick={() => setSelectedApp(null)}
                 className="px-6 py-3 rounded-xl text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
               >
                 Close
               </button>
               {selectedApp.status !== 'Reviewed' && (
                 <button
                   onClick={handleSubmitReview}
                   disabled={submitLoading || !comments}
                   className="px-8 py-3 rounded-xl bg-primary text-slate-900 font-black text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl active:scale-95 flex gap-2 items-center disabled:opacity-50"
                 >
                   <span className="material-symbols-outlined !text-lg">done_all</span>
                   {submitLoading ? 'Submitting...' : 'Submit Evaluation'}
                 </button>
               )}
            </div>
          </div>
        </div>
      )}

      <GlobalFooter />
    </div>
  );
};

export default ReviewerWorkspace;
