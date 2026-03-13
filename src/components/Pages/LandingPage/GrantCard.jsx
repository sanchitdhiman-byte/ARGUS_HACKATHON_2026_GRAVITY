import React from 'react';

const GrantCard = ({ grant, onOpenDetails, onApplyNow }) => {
  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:border-primary/30 transition-all duration-300 flex flex-col h-full active:scale-[0.99]">
      {/* Card Image Wrapper */}
      <div className="h-40 sm:h-48 relative overflow-hidden">
        <img
          alt={grant.imageAlt}
          src={grant.image}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Category Tag */}
        <div className={`absolute top-4 right-4 ${grant.categoryColor} text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm transition-transform group-hover:translate-y-[-2px]`}>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px] sm:text-sm">{grant.mobileIcon || 'bookmark'}</span>
            {grant.category}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        <h3 className="text-lg sm:text-xl font-bold mb-3 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
          {grant.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mb-6 flex-1 line-clamp-2 sm:line-clamp-3">
          {grant.description}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          {grant.meta.slice(0, 4).map((m) => (
            <div key={m.label} className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {m.label}
              </span>
              <span className={`text-[11px] sm:text-sm font-bold truncate ${m.highlight ? 'text-primary' : m.danger ? 'text-red-500' : 'dark:text-slate-200'}`}>
                {m.value}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onApplyNow(grant)}
            className="flex-1 py-3 bg-primary text-slate-900 hover:bg-primary/90 transition-all font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-primary/10 active:scale-95"
          >
            Apply Now
          </button>
          <button
            onClick={() => onOpenDetails(grant)}
            className="px-4 py-3 border-2 border-slate-100 dark:border-slate-800 text-slate-400 hover:text-primary hover:border-primary transition-all font-bold rounded-xl text-xs sm:text-sm active:scale-95"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrantCard;
