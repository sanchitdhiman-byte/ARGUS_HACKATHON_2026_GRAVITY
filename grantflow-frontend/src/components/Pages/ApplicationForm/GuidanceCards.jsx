import React from 'react';

const GuidanceCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {/* Help Card */}
      <div className="border border-primary/20 rounded-2xl p-6 bg-primary/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <span className="material-symbols-outlined !text-xl">help</span>
          </div>
          <h5 className="font-bold text-slate-900 dark:text-white text-lg">Need help?</h5>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed font-medium">
          Check out our <a className="text-primary font-bold underline hover:text-primary/80 transition-colors" href="#">Entity Information Guide</a> to see which registration documents are required for this step.
        </p>
        <div className="flex items-center gap-2 text-xs font-bold text-primary bg-white dark:bg-slate-800 p-3 rounded-xl justify-center border border-primary/10 shadow-sm transition-transform hover:scale-[1.02] cursor-pointer">
          <span className="material-symbols-outlined !text-sm">support_agent</span>
          Live Chat Available
        </div>
      </div>

      {/* Validation Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3 text-green-600">
          <span className="material-symbols-outlined !text-xl animate-pulse">verified</span>
          <h5 className="font-bold text-slate-900 dark:text-white text-lg">Auto-Validation</h5>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          Our system checks your Registration Number against national databases in real-time.
        </p>
        <div className="mt-4 flex -space-x-2">
          {['GOV', 'NGO', 'ORG'].map((text, i) => (
            <div key={i} className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-slate-400 shadow-sm transition-transform hover:z-10 hover:scale-110 cursor-pointer">
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Resource Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 overflow-hidden relative group shadow-sm">
        <div className="relative z-10">
          <h5 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Application Resource</h5>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 font-medium leading-relaxed">Download the CDG Handbook for detailed evaluation criteria.</p>
          <button className="flex items-center gap-2 text-primary font-black text-sm hover:translate-x-1 transition-transform group">
            <span className="material-symbols-outlined group-hover:animate-bounce">download</span>
            Get PDF (2.4MB)
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-[0.05] dark:opacity-[0.1] group-hover:scale-110 transition-transform group-hover:opacity-20">
          <span className="material-symbols-outlined !text-8xl">article</span>
        </div>
      </div>
    </div>
  );
};

export default GuidanceCards;
