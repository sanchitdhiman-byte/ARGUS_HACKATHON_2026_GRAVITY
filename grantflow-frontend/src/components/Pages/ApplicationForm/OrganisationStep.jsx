import React from 'react';

const OrganisationStep = ({ data, onChange }) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-full">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Organisation Legal Name <span className="text-primary">*</span>
            </label>
            <input 
              value={data.orgName}
              onChange={e => onChange('orgName', e.target.value)}
              className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" 
              placeholder="e.g. Community Reach Foundation" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Registration Number <span className="text-primary">*</span>
            </label>
            <input 
              value={data.regNumber}
              onChange={e => onChange('regNumber', e.target.value)}
              className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" 
              placeholder="CR-XXXX-2024" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Entity Type <span className="text-primary">*</span>
            </label>
            <select 
              value={data.entityType}
              onChange={e => onChange('entityType', e.target.value)}
              className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium text-sm"
            >
              <option value="">Select Entity Type</option>
              <option value="Non-Profit Organisation">Non-Profit Organisation</option>
              <option value="Social Enterprise">Social Enterprise</option>
              <option value="Community Group">Community Group</option>
              <option value="Educational Institution">Educational Institution</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Year of Establishment <span className="text-primary">*</span>
            </label>
            <input 
              type="number"
              value={data.establishedYear}
              onChange={e => onChange('establishedYear', e.target.value)}
              className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" 
              placeholder="e.g. 2018" 
            />
          </div>
          <div className="col-span-full">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Annual Operating Budget (INR) <span className="text-primary">*</span>
            </label>
            <input 
              type="number"
              value={data.budget}
              onChange={e => onChange('budget', e.target.value)}
              className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" 
              placeholder="0.00" 
            />
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

        <div>
          <h4 className="text-md font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined !text-lg text-primary">contact_mail</span>
            Primary Contact Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Contact Person Name</label>
              <input value={data.contactName} onChange={e => onChange('contactName', e.target.value)} className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Job Title / Role</label>
              <input value={data.contactRole} onChange={e => onChange('contactRole', e.target.value)} className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email</label>
              <input type="email" value={data.email} onChange={e => onChange('email', e.target.value)} className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Phone</label>
              <input type="tel" value={data.phone} onChange={e => onChange('phone', e.target.value)} className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" />
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-full">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Registered Address</label>
            <textarea value={data.address} onChange={e => onChange('address', e.target.value)} className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" rows="3"></textarea>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">City</label>
            <input value={data.city} onChange={e => onChange('city', e.target.value)} className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Region/State</label>
            <input value={data.stateRegion} onChange={e => onChange('stateRegion', e.target.value)} className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Postal Code</label>
            <input value={data.postalCode} onChange={e => onChange('postalCode', e.target.value)} className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrganisationStep;
