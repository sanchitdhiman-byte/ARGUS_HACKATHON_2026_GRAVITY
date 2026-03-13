import React from 'react';
import { NavLink } from 'react-router-dom';

const MobileBottomNav = () => {
  const navItems = [
    { icon: "home", label: "Home", path: "/" },
    { icon: "list_alt", label: "Grants", path: "/" },
    { icon: "assignment_turned_in", label: "Apps", path: "/my-applications" },
    { icon: "person", label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 pb-6 pt-2 h-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => `group flex flex-col items-center justify-center gap-1 transition-all duration-300 w-full ${
              isActive
                ? "text-primary scale-110"
                : "text-slate-400 dark:text-slate-500 hover:text-primary/60"
            }`}
          >
            {({ isActive }) => (
              <>
                <span
                  className={`material-symbols-outlined text-[24px] transition-all ${
                    isActive ? "font-variation-fill-1" : ""
                  }`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-tighter ${
                  isActive ? "opacity-100" : "opacity-60"
                }`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
