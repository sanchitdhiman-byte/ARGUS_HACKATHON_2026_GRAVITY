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
              Expanded View
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
              {/* Application Form Preview */}
              <div>
                <h4 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
                  <span className="material-symbols-outlined text-primary">assignment</span>
                  Application Form Preview
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">
                      Organisation Name
                    </label>
                    <input
                      disabled
                      placeholder="Enter your org name"
                      type="text"
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 text-slate-400 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">
                      Project Category
                    </label>
                    <select
                      disabled
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 text-slate-400 text-sm"
                    >
                      <option>{grant.category}</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">
                      Project Proposal Summary
                    </label>
                    <textarea
                      disabled
                      placeholder="Briefly describe your project goals..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 h-24 text-slate-400 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div>
                <h4 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
                  <span className="material-symbols-outlined text-primary">fact_check</span>
                  Eligibility Criteria (E1-E9)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { code: "E1: Legal Status", desc: "Registered entity" },
                    { code: "E2: Location", desc: "Operating region verified" },
                    { code: "E3: Experience", desc: "Proven track record" },
                  ].map((e) => (
                    <div
                      key={e.code}
                      className="p-3 sm:p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3"
                    >
                      <span className="material-symbols-outlined text-green-500 text-sm">
                        check_circle
                      </span>
                      <div>
                        <p className="text-[10px] sm:text-xs font-bold dark:text-white">{e.code}</p>
                        <p className="text-[9px] sm:text-[10px] text-slate-500">{e.desc}</p>
                      </div>
                    </div>
                  ))}
                  <div className="p-3 sm:p-4 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-start gap-3 opacity-60">
                    <span className="material-symbols-outlined text-slate-400 text-sm">info</span>
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold dark:text-white">E4 - E9</p>
                      <p className="text-[9px] sm:text-[10px] text-slate-500">
                        Financial metrics & audit
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workflow Stages */}
              <div className="overflow-x-auto pb-4 sm:pb-0">
                <h4 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
                  <span className="material-symbols-outlined text-primary">account_tree</span>
                  Workflow Stages
                </h4>
                <div className="flex items-center gap-2 sm:gap-4 min-w-[500px] sm:min-w-0">
                  {[
                    { icon: "edit_note", label: "Submission", active: true },
                    { icon: "rule", label: "Review", active: false },
                    { icon: "rate_review", label: "Evaluation", active: false },
                    { icon: "payments", label: "Disbursement", active: false },
                  ].map((stage, i) => (
                    <React.Fragment key={stage.label}>
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                            stage.active
                              ? "bg-primary shadow-lg shadow-primary/30 text-slate-900"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm sm:text-base">{stage.icon}</span>
                        </div>
                        <span
                          className={`text-[9px] sm:text-[10px] font-bold text-center ${
                            stage.active ? "text-slate-900 dark:text-white" : "text-slate-400"
                          }`}
                        >
                          {stage.label}
                        </span>
                      </div>
                      {i < 3 && (
                        <div className="flex-1 h-[2px] bg-slate-200 dark:bg-slate-800 mb-5" />
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
                  {[
                    "Entity Certification",
                    "Financial Statements",
                    "Implementation Plan",
                    "Detailed Budget",
                  ].map((doc) => (
                    <li key={doc} className="flex items-center gap-2 text-xs sm:text-sm dark:text-slate-300">
                      <span className="material-symbols-outlined text-primary text-base sm:text-lg">description</span>
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Scoring Rubric */}
              <div className="p-5 sm:p-6 bg-primary/10 rounded-2xl border border-primary/20">
                <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary mb-4">
                  Scoring Rubric
                </h4>
                <div className="space-y-4">
                  {[
                    { label: "Community Impact", pct: 40 },
                    { label: "Sustainability", pct: 30 },
                    { label: "Innovation", pct: 20 },
                    { label: "Feasibility", pct: 10 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-[10px] sm:text-xs font-bold mb-1 dark:text-slate-300">
                        <span>{item.label}</span>
                        <span>{item.pct}%</span>
                      </div>
                      <div className="h-1.5 sm:h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => {
                  onClose();
                  onApplyNow(grant);
                }}
                className="w-full bg-primary py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:bg-primary/90 transition-all text-slate-900 active:scale-[0.98]"
              >
                Start Application
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrantModal;
