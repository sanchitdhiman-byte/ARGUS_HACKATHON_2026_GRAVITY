import React from 'react';

const GlobalFooter = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 flex items-center justify-center rounded-lg">
                <span className="material-symbols-outlined text-primary text-xl font-black">
                  account_balance_wallet
                </span>
              </div>
              <span className="text-xl font-black dark:text-white tracking-tight">GrantStream</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs font-medium">
              Empowering organizations and individuals through transparent and accessible grant tracking and application management.
            </p>
            <div className="flex gap-4">
              {["public", "share", "mail"].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary hover:border-primary/50 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-xl">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h5 className="font-black mb-6 dark:text-white uppercase text-[11px] tracking-[0.2em] text-slate-400">
              Navigation
            </h5>
            <ul className="space-y-4 text-sm font-bold text-slate-600 dark:text-slate-400">
              {["Active Programmes", "My Applications", "Eligibility Checker", "Deadlines"].map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h5 className="font-black mb-6 dark:text-white uppercase text-[11px] tracking-[0.2em] text-slate-400">
              Support
            </h5>
            <ul className="space-y-4 text-sm font-bold text-slate-600 dark:text-slate-400">
              {["Help Center", "Technical Support", "Guidelines", "Privacy Policy", "Terms of Service"].map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <h5 className="font-black mb-2 dark:text-white text-sm">Stay Updated</h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium leading-relaxed">
                Join our newsletter to receive updates on new funding cycles.
              </p>
              <div className="flex flex-col gap-3">
                <input
                  className="w-full bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold focus:ring-primary focus:border-primary dark:text-white"
                  placeholder="name@organization.com"
                  type="email"
                />
                <button className="w-full bg-primary py-3 rounded-xl text-slate-900 font-black text-xs hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/10">
                  SUBSCRIBE
                </button>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined !text-8xl">notifications</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <span className="material-symbols-outlined text-sm">enhanced_encryption</span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Secure Data Infrastructure • ISO 27001 Certified
            </p>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            © 2024 GrantStream Systems Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
