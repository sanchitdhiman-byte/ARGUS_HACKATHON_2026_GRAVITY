import React from 'react';

const EmailVerificationPage = ({ onNavigate }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex items-center justify-center p-4">
      <div className="max-w-[480px] w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="pt-12 pb-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 text-primary cursor-pointer group" onClick={() => onNavigate('landing')}>
            <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-3">
              <span className="material-symbols-outlined text-4xl font-black">payments</span>
            </div>
            <h1 className="text-slate-900 dark:text-slate-100 text-2xl font-black leading-tight tracking-tight">GrantStream</h1>
          </div>
        </div>
        <div className="px-10 flex justify-center">
          <div className="w-full h-56 bg-primary/5 rounded-2xl flex items-center justify-center border-2 border-dashed border-primary/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
            <span className="material-symbols-outlined text-primary text-9xl relative z-10 animate-bounce">mark_email_unread</span>
          </div>
        </div>
        <div className="px-10 pt-10 pb-12 text-center">
          <h2 className="text-slate-900 dark:text-slate-100 text-3xl font-black mb-4 tracking-tight">Verify Your Email</h2>
          <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-10 font-medium">
            We've sent a unique verification link to your email address. Please check your inbox and click the link to confirm your account and start applying.
          </p>
          <div className="space-y-4">
            <button className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-16 px-5 bg-primary hover:bg-primary/90 text-slate-900 text-lg font-black transition-all shadow-xl shadow-primary/20 active:scale-[0.98]">
              <span className="truncate">Resend Verification Email</span>
            </button>
            <button 
              onClick={() => onNavigate('login')}
              className="w-full flex items-center justify-center gap-2 text-sm font-black text-primary hover:text-primary/80 transition-all group"
            >
              <span className="material-symbols-outlined text-xl transition-transform group-hover:-translate-x-1">arrow_back</span>
              Back to Login
            </button>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 py-6 px-10 text-center">
          <p className="text-slate-500 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
            Didn't receive the email? Check your spam folder or contact 
            <a className="text-primary hover:underline ml-1" href="#">support@grantstream.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
