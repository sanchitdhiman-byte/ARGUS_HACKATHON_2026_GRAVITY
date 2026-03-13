import React, { useEffect } from 'react';

const BudgetStep = ({ data, onChange }) => {
  // Auto-calculate total requested whenever line items change
  useEffect(() => {
    const p = parseFloat(data.personnel) || 0;
    const e = parseFloat(data.equipment) || 0;
    const t = parseFloat(data.travel) || 0;
    const o = parseFloat(data.overheads) || 0;
    const m = parseFloat(data.other) || 0;
    const total = p + e + t + o + m;
    
    // Only update if it actually changed to prevent infinite loops
    if (total.toString() !== data.totalRequested && (total > 0 || data.totalRequested)) {
      onChange('totalRequested', total.toString());
    }
  }, [data.personnel, data.equipment, data.travel, data.overheads, data.other]);

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
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Total Amount Requested (INR) <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
            <input 
              readOnly
              value={data.totalRequested}
              className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 pl-8 pr-4 py-4 text-xl font-black text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all cursor-not-allowed" 
              placeholder="0.00 (Auto-calculated)" 
              type="text"
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">This is auto-calculated from the line items below.</p>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Personnel Costs (INR)</label>
            <input type="number" value={data.personnel} onChange={e => onChange('personnel', e.target.value)} className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary transition-all" placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Equipment & Materials (INR)</label>
            <input type="number" value={data.equipment} onChange={e => onChange('equipment', e.target.value)} className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary transition-all" placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Travel & Logistics (INR)</label>
            <input type="number" value={data.travel} onChange={e => onChange('travel', e.target.value)} className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary transition-all" placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Overheads (INR)</label>
            <input type="number" value={data.overheads} onChange={e => onChange('overheads', e.target.value)} className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary transition-all" placeholder="0" />
          </div>
          <div className="col-span-full">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Other / Miscellaneous (INR)</label>
            <input type="number" value={data.other} onChange={e => onChange('other', e.target.value)} className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary transition-all" placeholder="0" />
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Budget Justification</label>
          <textarea 
            value={data.justification}
            onChange={e => onChange('justification', e.target.value)}
            className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary transition-all" 
            placeholder="Explain why these costs are necessary for the project..." 
            rows="6"
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default BudgetStep;
