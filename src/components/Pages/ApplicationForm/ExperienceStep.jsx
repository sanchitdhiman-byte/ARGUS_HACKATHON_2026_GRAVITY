import React, { useState } from 'react';

const ExperienceStep = () => {
  const [hasPreviousGrants, setHasPreviousGrants] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <span className="material-symbols-outlined">stars</span>
          </div>
          <div>
            <h3 className="text-xl font-bold">Step 4: Experience & Declaration</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your organization's track record and official sign-off.</p>
          </div>
        </div>
      </div>
      
      <form className="p-8 space-y-8" onSubmit={(e) => e.preventDefault()}>
        {/* Section: Prior Projects */}
        <div className="space-y-6">
          <h4 className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined !text-lg text-primary">history</span>
            Relevant Prior Projects
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Project 1 Description <span className="text-primary">*</span></label>
              <textarea 
                className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" 
                placeholder="Title, duration, budget, and key outcomes..." 
                rows="3"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Project 2 Description <span className="text-primary">*</span></label>
              <textarea 
                className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" 
                placeholder="Title, duration, budget, and key outcomes..." 
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

        {/* Section: Grant History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Has the organization received grants before?</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="prev_grants" 
                  checked={hasPreviousGrants} 
                  onChange={() => setHasPreviousGrants(true)}
                  className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
                />
                <span className="text-sm font-medium">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="prev_grants" 
                  checked={!hasPreviousGrants} 
                  onChange={() => setHasPreviousGrants(false)}
                  className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
                />
                <span className="text-sm font-medium">No</span>
              </label>
            </div>
          </div>
          
          {hasPreviousGrants && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Prior Funder Name</label>
                <input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" placeholder="e.g. Ford Foundation" type="text" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Amount Received (INR)</label>
                <input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" placeholder="0" type="number" />
              </div>
            </div>
          )}
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

        {/* Section: Declaration */}
        <div className="space-y-6">
          <h4 className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined !text-lg text-primary">verified_user</span>
            Declaration
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Authorised Signatory Name <span className="text-primary">*</span></label>
              <input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" placeholder="Full name of signatory" type="text" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Designation <span className="text-primary">*</span></label>
              <input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" placeholder="e.g. Director / Chairperson" type="text" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Date of Submission</label>
              <input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <input type="checkbox" className="mt-1 w-4 h-4 text-primary border-primary rounded focus:ring-primary" id="declare-check" />
            <label htmlFor="declare-check" className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
              I hereby declare that the information provided above is true to the best of my knowledge and belief. I understand that any false information may lead to the rejection of the application.
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ExperienceStep;
