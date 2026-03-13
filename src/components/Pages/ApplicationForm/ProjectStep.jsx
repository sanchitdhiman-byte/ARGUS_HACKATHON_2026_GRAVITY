import React from 'react';

const ProjectStep = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <span className="material-symbols-outlined">description</span>
          </div>
          <div>
            <h3 className="text-xl font-bold">Step 2: Project Details</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Describe the project you are seeking funding for.</p>
          </div>
        </div>
      </div>
      
      <form className="p-8 space-y-8" onSubmit={(e) => e.preventDefault()}>
        {/* Section: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-full">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Project Title <span className="text-primary">*</span>
            </label>
            <input 
              className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" 
              placeholder="e.g. Clean Water Initiative for Bundelkhand" 
              type="text"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Project Location (District, State) <span className="text-primary">*</span>
            </label>
            <input 
              className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" 
              placeholder="e.g. Jhansi, Uttar Pradesh" 
              type="text"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Project Type <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <select className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all appearance-none font-medium text-sm">
                <option>Infrastructure</option>
                <option>Education</option>
                <option>Healthcare</option>
                <option>Livelihood</option>
                <option>Environment</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

        {/* Section: Narrative */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Problem Statement <span className="text-primary">*</span></label>
            <textarea 
              className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" 
              placeholder="What is the core issue you are addressing?" 
              rows="4"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Proposed Solution <span className="text-primary">*</span></label>
            <textarea 
              className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" 
              placeholder="How will your project solve this problem?" 
              rows="4"
            ></textarea>
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

        {/* Section: Beneficiaries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Target Beneficiaries (Number) <span className="text-primary">*</span></label>
            <input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" placeholder="e.g. 500" type="number" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Beneficiary Demographics <span className="text-primary">*</span></label>
            <input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" placeholder="e.g. Women farmers, children aged 5-12" type="text" />
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

        {/* Section: Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Project Start Date <span className="text-primary">*</span></label>
            <input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" type="date" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Project End Date <span className="text-primary">*</span></label>
            <input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" type="date" />
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

        {/* Section: Activities & Outcomes */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Key Activities <span className="text-primary">*</span></label>
            <textarea 
              className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" 
              placeholder="List the main activities of the project..." 
              rows="4"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Expected Outcomes <span className="text-primary">*</span></label>
            <textarea 
              className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" 
              placeholder="What are the measurable results expected?" 
              rows="4"
            ></textarea>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProjectStep;
