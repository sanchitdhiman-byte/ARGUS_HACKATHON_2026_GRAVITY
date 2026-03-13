import React from 'react';

const DocumentStep = () => {
  const documents = [
    { id: 'reg', label: 'Registration Certificate', notes: 'Certificate of Registration / Trust Deed / MOA-AOA' },
    { id: 'tax', label: '80G / 12A Tax Certificate', notes: 'Tax exemption proof' },
    { id: 'audit', label: 'Last 2 Years Audited Financial Statements', notes: 'Signed by registered CA' },
    { id: 'budget', label: 'Project Budget Breakdown', notes: 'Detailed line-item budget matching form totals' },
    { id: 'res', label: 'Board Resolution', notes: 'Signed by Chairperson authorising application' },
    { id: 'fcra', label: 'FCRA Certificate', notes: 'Required ONLY if foreign funds received previously', optional: true },
    { id: 'photo', label: 'Photographs of target community / site', notes: 'Evidence of problem statement' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <span className="material-symbols-outlined">upload_file</span>
          </div>
          <div>
            <h3 className="text-xl font-bold">Step 5: Required Documents</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Upload the necessary documentation to support your application.</p>
          </div>
        </div>
      </div>
      
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="group p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 hover:border-primary/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">{doc.label}</h4>
                  {doc.optional && <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 py-0.5 border border-slate-200 dark:border-slate-700 rounded-full">Optional</span>}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{doc.notes}</p>
              </div>
              
              <div className="w-full md:w-auto flex items-center gap-2">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-700 dark:text-white hover:border-primary transition-all">
                  <span className="material-symbols-outlined !text-lg text-primary">cloud_upload</span>
                  Upload PDF
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl flex gap-3">
          <span className="material-symbols-outlined text-blue-500">info</span>
          <p className="text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
            All files must be in PDF format and less than 5MB each. Please ensure scans are clear and readable.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentStep;
