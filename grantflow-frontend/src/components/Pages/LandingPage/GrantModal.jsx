import React from 'react';

const GrantModal = ({ grant, isOpen, onClose, onApplyNow }) => {
  if (!isOpen || !grant) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 sm:px-10 sm:py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <span className="text-primary font-bold text-[10px] sm:text-xs tracking-widest uppercase">
              {grant.category}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 dark:text-white">
              {grant.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined dark:text-white">close</span>
          </button>
        </div>

        <div className="p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Left Column: Form & Details */}
            <div className="lg:col-span-2 space-y-8 md:space-y-10">

              <div className="space-y-4">
                 <h4 className="text-base sm:text-lg font-bold flex items-center gap-2 dark:text-white">
                  <span className="material-symbols-outlined text-primary">info</span>
                  Grant Overview
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                  {grant.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                   <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Funding</p>
                      <p className="font-bold text-slate-900 dark:text-white">{grant.fundingRange}</p>
                   </div>
                   <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Duration</p>
                      <p className="font-bold text-slate-900 dark:text-white">{grant.duration}</p>
                   </div>
                   <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Deadline</p>
                      <p className="font-bold text-red-600 dark:text-red-400">{grant.deadline}</p>
                   </div>
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div>
                <h4 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
                  <span className="material-symbols-outlined text-primary">fact_check</span>
                  Eligibility Criteria
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {grant.eligibilityCriteria.map((e) => (
                    <div
                      key={e.code}
                      className={`p-3 sm:p-4 rounded-xl flex items-start gap-3 border ${
                        e.ai 
                          ? 'bg-blue-500/5 border-blue-500/20' 
                          : 'bg-green-500/5 border-green-500/20'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-sm ${e.ai ? 'text-blue-500' : 'text-green-500'}`}>
                        {e.ai ? 'smart_toy' : 'check_circle'}
                      </span>
                      <div>
                        <p className="text-[10px] sm:text-xs font-bold dark:text-white">
                          {e.code}: {e.label} {e.ai && <span className="ml-1 text-[8px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full uppercase tracking-wider">AI Checked</span>}
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{e.rule}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workflow Stages */}
              <div className="overflow-x-auto pb-4 sm:pb-0">
                <h4 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
                  <span className="material-symbols-outlined text-primary">account_tree</span>
                  End-to-End Workflow
                </h4>
                <div className="flex items-center gap-2 sm:gap-4 min-w-[600px] sm:min-w-0">
                  {grant.workflowStages.map((stage, i) => (
                    <React.Fragment key={stage.stage}>
                      <div className="flex flex-col items-center gap-2 flex-1 group">
                        <div
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-primary group-hover:text-slate-900 group-hover:shadow-lg group-hover:shadow-primary/30"
                        >
                          <span className="material-symbols-outlined text-sm sm:text-base">{stage.icon}</span>
                        </div>
                        <div className="text-center">
                           <span
                             className="text-[9px] sm:text-[10px] font-bold text-slate-900 dark:text-white block whitespace-nowrap"
                           >
                             {stage.stage}
                           </span>
                           <span className="text-[8px] text-slate-500 uppercase tracking-wider whitespace-nowrap">
                             {stage.sla}
                           </span>
                        </div>
                      </div>
                      {i < grant.workflowStages.length - 1 && (
                        <div className="flex-1 h-[2px] bg-slate-200 dark:bg-slate-800 mb-6" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Sidebar Info */}
            <div className="space-y-6 md:space-y-8">
              {/* Required Documents */}
              <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
                  Required Documents
                </h4>
                <ul className="space-y-3">
                  {grant.requiredDocuments.map((doc) => (
                    <li key={doc.label} className="flex items-start gap-3 text-xs sm:text-sm dark:text-slate-300">
                      <span className="material-symbols-outlined text-primary text-base sm:text-lg mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>description</span>
                      <div>
                        <span className="font-bold relative">
                          {doc.label}
                          {doc.optional && <span className="ml-2 text-[8px] uppercase tracking-widest bg-slate-200 text-slate-600 px-1 rounded-sm">Optional</span>}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{doc.notes}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Scoring Rubric */}
              <div className="p-5 sm:p-6 bg-primary/10 rounded-2xl border border-primary/20">
                <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary mb-4">
                  Scoring Rubric Dimensions
                </h4>
                <div className="space-y-4">
                  {grant.scoringRubric.map((item) => (
                    <div key={item.dimension}>
                      <div className="flex justify-between text-[10px] sm:text-xs font-bold mb-1.5 dark:text-slate-200">
                        <span>{item.dimension}</span>
                        <span>{item.weight}%</span>
                      </div>
                      <div className="h-1.5 sm:h-2 bg-slate-200 dark:bg-slate-800/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${item.weight}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-4 rounded-xl flex items-start gap-3">
                 <span className="material-symbols-outlined text-amber-500 mt-0.5">warning</span>
                 <div>
                    <p className="text-[10px] font-bold text-amber-800 dark:text-amber-500 uppercase tracking-widest mb-1">Important</p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed max-w-[200px]">Applications mapping over {grant.maxAwards} awards per cycle are waitlisted.</p>
                 </div>
              </div>

              <button 
                onClick={() => {
                  onClose();
                  onApplyNow(grant);
                }}
                className="w-full bg-primary py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:bg-primary/90 transition-all text-slate-900 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Start Application <span className="material-symbols-outlined !text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrantModal;
