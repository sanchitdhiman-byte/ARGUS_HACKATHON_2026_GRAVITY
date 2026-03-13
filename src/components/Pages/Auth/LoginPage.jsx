import React from 'react';

const LoginPage = ({ onLogin, onNavigate }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display dark:text-slate-100 min-h-screen flex flex-col text-brand-grey">
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2 text-primary cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="size-8 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">payments</span>
          </div>
          <h1 className="dark:text-white text-xl font-bold leading-tight tracking-tight text-slate-900">GrantStream</h1>
        </div>
        <div className="hidden sm:block">
          <a className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">Help Center</a>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[480px] bg-white dark:bg-slate-900/50 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="h-32 w-full bg-primary/10 relative overflow-hidden" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAUB90wcwL0iI7kPtgsbjAfpNAEnp-EJf6rCExId61QVLjOHDLIjn9XAKtVnjCk1PzEZQOpljyChIT2TGBVUznAErZz-G1uXUlkIpWV6mrzOfRwKgfZvfZVNvwTEmlqNM4OJHlLC3OzDeVCLcJUVlJCyBlsNdm4DC4sfWNolU8rkx1WA-3pOhMXt02CVvv07oBF-VXs354hsjbvV-pqDxz732-OKYcBKOpmLQPbXZJ1wxAQwj7Nr2ZCCRtMK85pQ5kFgbRIesY6hkY")', backgroundPosition: 'center', backgroundSize: 'cover' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
          </div>
          <div className="px-8 pb-10 pt-4">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
              <p className="text-slate-500 dark:text-slate-400">Please enter your credentials to access your grant dashboard.</p>
            </div>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <span className="material-symbols-outlined text-lg">mail</span>
                  </div>
                  <input className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white" placeholder="name@organization.org" type="email" required/>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  <button type="button" onClick={() => onNavigate('reset-password')} className="text-sm font-medium text-primary hover:underline">Forgot password?</button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <span className="material-symbols-outlined text-lg">lock</span>
                  </div>
                  <input className="w-full pl-11 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white" placeholder="••••••••" type="password" required/>
                  <button className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" type="button">
                    <span className="material-symbols-outlined text-lg">visibility</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <input className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary" id="remember-me" type="checkbox"/>
                <label className="ml-2 block text-sm text-slate-600 dark:text-slate-400" htmlFor="remember-me">
                  Remember me for 30 days
                </label>
              </div>
              <button className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-slate-900 font-bold rounded-lg shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group" type="submit">
                <span>Sign In to Dashboard</span>
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </form>
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                Don't have an account? 
                <button onClick={() => onNavigate('signup')} className="text-primary font-bold hover:underline ml-1">Create an account</button>
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="p-6 text-center text-slate-500 dark:text-slate-500 text-sm">
        <p>© 2024 GrantStream Management Systems. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a className="hover:text-slate-800 dark:hover:text-slate-200" href="#">Privacy Policy</a>
          <a className="hover:text-slate-800 dark:hover:text-slate-200" href="#">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
