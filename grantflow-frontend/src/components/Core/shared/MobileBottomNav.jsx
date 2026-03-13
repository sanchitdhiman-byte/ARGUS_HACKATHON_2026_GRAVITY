import React, { useState } from 'react';

const MobileBottomNav = ({ onNavigate, currentView }) => {
  const navItems = [
    { icon: "home", label: "Home", view: "landing" },
    { icon: "list_alt", label: "Grants", view: "landing" },
    { icon: "assignment_turned_in", label: "Apps", view: "my-applications" },
    { icon: "person", label: "Profile", view: "profile" },
  ];

  const activeIndex = navItems.findIndex(item => item.view === currentView);
  const activeTab = activeIndex !== -1 ? activeIndex : 0;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 pb-6 pt-2 h-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto">
        {navItems.map((item, i) => (
          <button
            key={item.label}
            onClick={() => onNavigate?.(item.view)}
            className={`group flex flex-col items-center justify-center gap-1 transition-all duration-300 w-full ${
              activeTab === i
                ? "text-primary scale-110"
                : "text-slate-400 dark:text-slate-500 hover:text-primary/60"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[24px] transition-all ${
                activeTab === i ? "font-variation-fill-1" : ""
              }`}
              style={activeTab === i ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${
              activeTab === i ? "opacity-100" : "opacity-60"
            }`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
