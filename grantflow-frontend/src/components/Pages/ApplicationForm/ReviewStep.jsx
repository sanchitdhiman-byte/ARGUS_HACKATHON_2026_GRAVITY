import React from 'react';
import { GRANTS_DATA } from '../../../data/grants';

const ReviewStep = ({ data, onEditSection, grantType }) => {
  const grantInfo = GRANTS_DATA.find(g => g.id === grantType) || GRANTS_DATA[0];
  const requiredDocsCount = grantInfo.requiredDocuments?.length || 0;
  const uploadedDocsCount = Object.keys(data.uploadedDocs || {}).length;

  const sections = [
    { 
      title: 'Organisation Details', 
      step: 1, 
      fields: [
        data.orgName || '(Missing Org Name)', 
        data.regNumber || '(Missing Reg #)', 
        data.email || '(Missing Email)'
      ],
      isComplete: !!(data.orgName && data.regNumber && data.email && data.establishedYear && data.budget)
    },
    { 
      title: 'Project Details', 
      step: 2, 
      fields: [
        data.projectTitle || '(Missing Title)', 
        data.projectLocation || '(Missing Location)', 
        data.targetBeneficiaries ? `${data.targetBeneficiaries} Beneficiaries` : '(Missing Beneficiaries)'
      ],
      isComplete: !!(data.projectTitle && data.projectLocation && data.problemStatement && data.proposedSolution)
    },
    { 
      title: 'Budget Breakdown', 
      step: 3, 
      fields: [
        data.totalRequested ? `₹${data.totalRequested} Total` : '(Missing Total)', 
        data.personnel ? `₹${data.personnel} Personnel` : 'No Personnel Costs', 
        data.justification ? 'Justification Provided' : '(Missing Justification)'
      ],
      isComplete: !!(data.totalRequested && data.justification)
    },
    { 
      title: 'Track Record & Experience', 
      step: 4, 
      fields: [
        data.hasPreviousGrants ? 'Prior Grants: Yes' : 'Prior Grants: No', 
        data.signatoryName || '(Missing Signatory)',
        data.declared ? 'Declaration Signed' : '(Declaration Missing)'
      ],
      isComplete: !!(data.signatoryName && data.designation && data.declared)
    },
    { 
      title: 'Uploaded Documents', 
      step: 5, 
      fields: [
        `${uploadedDocsCount} of ${requiredDocsCount} Required Uploaded`,
        ...Object.keys(data.uploadedDocs || {}).slice(0, 2).map(k => `✓ ${k}`)
      ],
      isComplete: uploadedDocsCount >= requiredDocsCount - 1 // Allowing optional
    },
  ];

  const allComplete = sections.every(s => s.isComplete);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <span className="material-symbols-outlined">send</span>
          </div>
          <div>
            <h3 className="text-xl font-bold">Step 6: Review & Submit</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Please review all sections before final submission.</p>
          </div>
        </div>
      </div>
      
      <div className="p-8 space-y-6">
        {!allComplete && (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 p-4 rounded-xl flex items-start gap-3 mb-6">
            <span className="material-symbols-outlined text-red-500 mt-0.5">error</span>
            <div>
              <p className="text-sm font-bold text-red-800 dark:text-red-400">Incomplete Application</p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">Please ensure all required fields in the sections below are filled before submission.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {sections.map((section) => (
            <div key={section.title} className={`p-6 rounded-2xl border ${section.isComplete ? 'border-green-200 dark:border-green-900/50 bg-green-50/20 dark:bg-green-900/10' : 'border-red-200 dark:border-red-900/50 bg-red-50/20 dark:bg-red-900/10'} flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`material-symbols-outlined !text-lg ${section.isComplete ? 'text-green-500' : 'text-red-500'}`}>
                    {section.isComplete ? 'check_circle' : 'warning'}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white">{section.title}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {section.fields.map((f, i) => (
                    <span key={i} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{f}</span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => onEditSection(section.step)}
                className="flex items-center gap-2 text-primary font-black text-sm hover:translate-x-1 transition-transform bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:border-primary"
              >
                Edit Section
                <span className="material-symbols-outlined !text-lg">edit</span>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-slate-900 dark:bg-primary/10 rounded-2xl text-white dark:text-primary">
          <div className="flex items-center gap-4 mb-4">
            <span className="material-symbols-outlined !text-3xl">verified</span>
            <h4 className="text-xl font-black">Ready for Submission</h4>
          </div>
          <p className="text-slate-400 dark:text-primary/70 text-sm mb-6 leading-relaxed">
            By clicking submit below, your application will be securely encrypted and sent to our grant committee for review. You will receive a tracking ID via your registered email address automatically.
          </p>
          <div className="p-4 bg-white/5 dark:bg-primary/5 rounded-xl border border-white/10 dark:border-primary/10 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <span className="material-symbols-outlined !text-sm text-green-400">lock</span>
               <span className="text-[10px] font-bold text-green-400 uppercase tracking-[0.2em]">End-to-End Encrypted Submission</span>
             </div>
             <span className="text-xs font-bold font-mono text-slate-400">v2.1.0-secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
