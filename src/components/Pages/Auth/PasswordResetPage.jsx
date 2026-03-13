import React from 'react';

const PasswordResetPage = ({ onNavigate }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="mb-8 flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate('landing')}>
          <div className="bg-primary p-2 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:rotate-3">
            <span className="material-symbols-outlined text-slate-900 font-black">payments</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">GrantStream</h1>
        </div>
        <div className="w-full max-w-md bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">Reset Your Password</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">
              Enter your email and we'll send you a link to reset your password and regain access to your dashboard.
            </p>
          </div>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Reset link sent!"); onNavigate('login'); }}>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">mail</span>
                <input required className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white outline-none" id="email" name="email" placeholder="name@company.com" type="email"/>
              </div>
            </div>
            <button className="w-full bg-primary hover:bg-primary/90 text-slate-900 font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]" type="submit">
              <span>Send Reset Link</span>
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button 
                type="button"
                onClick={() => onNavigate('login')}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors group"
              >
                <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">chevron_left</span>
                Back to Login
              </button>
            </div>
          </form>
        </div>
        <p className="mt-8 text-sm text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">
          Need help? <a className="text-primary hover:underline" href="#">Contact Support</a>
        </p>
      </div>
      <div className="fixed bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/10 via-primary to-primary/10"></div>
    </div>
  );
};

export default PasswordResetPage;
