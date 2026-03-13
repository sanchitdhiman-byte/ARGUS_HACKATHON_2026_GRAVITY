import React from 'react';

const OrganisationStep = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <span className="material-symbols-outlined">business</span>
          </div>
          <div>
            <h3 className="text-xl font-bold">Step 1: Organisation Details</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Please provide the legal and contact information for your registered entity.</p>
          </div>
        </div>
      </div>
      
      <form className="p-8 space-y-8" onSubmit={(e) => e.preventDefault()}>
        {/* Section: Identity */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-full">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Organisation Legal Name <span className="text-primary">*</span>
              <span className="material-symbols-outlined text-slate-400 !text-sm cursor-help ml-1" title="Must match your official registration documents">info</span>
            </label>
            <input 
              className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" 
              placeholder="e.g. Community Reach Foundation" 
              type="text"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Registration Number <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <input 
                className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" 
                placeholder="CR-XXXX-2024" 
                type="text"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-green-500 !text-xl">check_circle</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Entity Type <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <select className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all appearance-none font-medium text-sm">
                <option>Non-Profit Organisation</option>
                <option>Social Enterprise</option>
                <option>Community Group</option>
                <option>Educational Institution</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 pointer-events-none">expand_more</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Year of Establishment <span className="text-primary">*</span>
            </label>
            <input 
              className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" 
              placeholder="e.g. 2018" 
              type="number"
            />
          </div>
          <div className="col-span-full">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Annual Operating Budget (INR) <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
              <input 
                className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" 
                placeholder="0.00" 
                type="number"
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

        {/* Section: Contact */}
        <div>
          <h4 className="text-md font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined !text-lg text-primary">contact_mail</span>
            Primary Contact Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Contact Person Name <span className="text-primary">*</span></label>
              <input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" placeholder="Full legal name" type="text" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Job Title / Role</label>
              <input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" placeholder="e.g. Program Director" type="text" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address <span className="text-primary">*</span></label>
              <input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" placeholder="contact@org.org" type="email" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Phone Number <span className="text-primary">*</span></label>
              <input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" placeholder="+1 (555) 000-0000" type="tel" />
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

        {/* Section: Address */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-full">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Registered Address <span className="text-primary">*</span></label>
            <textarea className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" placeholder="Street address, Suite, Floor..." rows="3"></textarea>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">City</label>
            <input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" type="text" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Region/State</label>
            <input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" type="text" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Postal Code</label>
            <input className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" type="text" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrganisationStep;
