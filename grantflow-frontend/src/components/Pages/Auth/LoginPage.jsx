import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { authAPI } from '../../../services/api';

const LoginPage = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authAPI.login({ email, password });
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('refresh_token', res.data.refresh_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async () => {
      try {
        const res = await authAPI.googleAuth({ token: "mock-google-token" });
        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('refresh_token', res.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        onLogin(res.data.user);
      } catch (err) {
        setError("Google Login Failed");
      }
    },
    onError: () => {
      setError('Google Login Failed');
    }
  });
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
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
              <p className="text-slate-500 dark:text-slate-400">Please enter your credentials to access your grant dashboard.</p>
            </div>
            {error && <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}
            
            <form className="space-y-5" onSubmit={handleManualLogin}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <span className="material-symbols-outlined text-lg">mail</span>
                  </div>
                  <input value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white" placeholder="name@organization.org" type="email" required/>
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
                  <input value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-11 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white" placeholder="••••••••" type="password" required/>
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
              <button disabled={loading} className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-slate-900 font-bold rounded-lg shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50" type="submit">
                <span>{loading ? "Signing In..." : "Sign In to Dashboard"}</span>
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </form>
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-slate-600 dark:text-slate-400 mt-4 mb-4">
                Don't have an account? 
                <button onClick={() => onNavigate('signup')} className="text-primary font-bold hover:underline ml-1">Create an account</button>
              </p>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900/50 px-4 text-slate-400 font-black tracking-widest">Or sign in with</span>
                </div>
              </div>
              <button type="button" onClick={() => loginWithGoogle()} className="w-full flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 font-bold text-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                Google
              </button>
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
