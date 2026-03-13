import React from 'react';

const BudgetStep = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <span className="material-symbols-outlined">payments</span>
          </div>
          <div>
            <h3 className="text-xl font-bold">Step 3: Budget Details</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Provide a detailed breakdown of the requested funds.</p>
          </div>
        </div>
      </div>
      
      <form className="p-8 space-y-8" onSubmit={(e) => e.preventDefault()}>
        {/* Section: Total */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Total Amount Requested (INR) <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
            <input 
              className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-8 pr-4 py-4 text-xl font-black text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all" 
              placeholder="0.00" 
              type="number"
            />
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

        {/* Section: Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Personnel Costs (INR) <span className="text-primary">*</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₹</span>
              <input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" placeholder="0" type="number" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Equipment & Materials (INR) <span className="text-primary">*</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₹</span>
              <input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" placeholder="0" type="number" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Travel & Logistics (INR) <span className="text-primary">*</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₹</span>
              <input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" placeholder="0" type="number" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Overheads (INR) <span className="text-primary">*</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₹</span>
              <input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" placeholder="0" type="number" />
            </div>
          </div>
          <div className="col-span-full">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Other / Miscellaneous (INR)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₹</span>
              <input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" placeholder="0" type="number" />
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

        {/* Section: Justification */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Budget Justification <span className="text-primary">*</span></label>
          <textarea 
            className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" 
            placeholder="Explain why these costs are necessary for the project..." 
            rows="6"
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default BudgetStep;
