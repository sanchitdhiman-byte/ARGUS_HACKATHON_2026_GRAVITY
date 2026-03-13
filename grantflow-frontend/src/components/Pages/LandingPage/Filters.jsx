import React, { useState } from 'react';

const Filters = () => {
  const [activeTab, setActiveTab] = useState(0);
  const categories = [
    { label: "All Categories", icon: "filter_list" },
    { label: "Community", icon: "groups" },
    { label: "Education", icon: "school" },
    { label: "Environment", icon: "eco" },
    { label: "Innovation", icon: "lightbulb" },
  ];

  return (
    <section className="mb-8 sm:mb-12">
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            className="w-full pl-12 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/40 text-slate-900 dark:text-white transition-all text-sm sm:text-base placeholder:text-slate-400"
            placeholder="Search by keyword, grant name or industry..."
            type="text"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-xl">tune</span>
          </button>
        </div>

        {/* Categories Scroller */}
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar items-center">
          {categories.map((cat, i) => (
            <button
              key={cat.label}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 ${
                activeTab === i
                  ? "bg-primary text-slate-900 shadow-md shadow-primary/10"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <span className="material-symbols-outlined text-sm sm:text-base">
                {cat.icon}
              </span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Filters;
