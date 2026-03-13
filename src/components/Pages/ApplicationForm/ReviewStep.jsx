import React from 'react';

const ReviewStep = () => {
  const sections = [
    { title: 'Organisation Details', step: 1, fields: ['Legal Name', 'Reg Number', 'Contact Email'] },
    { title: 'Project Details', step: 2, fields: ['Title', 'Location', 'Beneficiaries'] },
    { title: 'Budget Breakdown', step: 3, fields: ['Total Requested', 'Personnel', 'Equipment'] },
    { title: 'Track Record', step: 4, fields: ['Prior Projects', 'Signatory Name'] },
    { title: 'Documents', step: 5, fields: ['6 of 7 Uploaded'] },
  ];

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
        <div className="grid grid-cols-1 gap-4">
          {sections.map((section) => (
            <div key={section.title} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">{section.title}</h4>
                <div className="flex flex-wrap gap-2">
                  {section.fields.map(f => (
                    <span key={f} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{f}</span>
                  ))}
                </div>
              </div>
              <button className="flex items-center gap-2 text-primary font-black text-sm hover:translate-x-1 transition-transform">
                Edit Section
                <span className="material-symbols-outlined !text-lg">chevron_right</span>
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
            By clicking submit, your application will be reviewed by our grant committee. You will receive a tracking ID via your registered email address.
          </p>
          <div className="p-4 bg-white/5 dark:bg-primary/5 rounded-xl border border-white/10 dark:border-primary/10 flex items-center gap-3">
             <span className="material-symbols-outlined !text-sm">lock</span>
             <span className="text-[10px] font-bold uppercase tracking-[0.2em]">End-to-End Encrypted Submission</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
