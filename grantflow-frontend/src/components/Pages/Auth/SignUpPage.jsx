import React, { useState } from 'react';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

const SignUpPage = ({ onNavigate, onLogin }) => {
  const [formData, setFormData] = useState({
    org_name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'applicant'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:8000/api/v1/auth/register', {
        org_name: formData.org_name,
        email: formData.email,
        password: formData.password,
      });
      // Auto-login after registration
      const loginRes = await axios.post('http://localhost:8000/api/v1/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem('access_token', loginRes.data.access_token);
      localStorage.setItem('refresh_token', loginRes.data.refresh_token);
      localStorage.setItem('user', JSON.stringify(loginRes.data.user));
      onLogin(loginRes.data.user);
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post('http://localhost:8000/api/v1/auth/google', { token: "mock-google-token" });
        if (res.status === 200) {
          localStorage.setItem('access_token', res.data.access_token);
          localStorage.setItem('refresh_token', res.data.refresh_token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          onLogin(res.data.user);
        }
      } catch (err) {
        setError("Google Login Failed");
      }
    },
    onError: () => {
      setError('Google Login Failed');
    }
  });
  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 md:px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-2 text-primary cursor-pointer group" onClick={() => onNavigate('landing')}>
          <div className="size-8 flex items-center justify-center transition-transform group-hover:rotate-3">
            <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">GrantStream</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-600 dark:text-slate-400 text-sm hidden sm:block font-medium">Already have an account?</span>
          <button 
            onClick={() => onNavigate('login')}
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 border border-primary text-primary hover:bg-primary/5 transition-colors text-sm font-bold leading-normal hover:text-slate-900"
          >
            <span className="truncate">Sign In</span>
          </button>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="w-full max-w-[480px] bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 md:p-10">
          <div className="flex flex-col gap-2 mb-8 text-center">
            <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-black leading-tight tracking-tight">Create Your Account</h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium">Join GrantStream to manage your grants efficiently</p>
          </div>
          {error && <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}
          
          <form className="flex flex-col gap-5" onSubmit={handleRegister}>
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                <input value={formData.org_name} onChange={e => setFormData({...formData, org_name: e.target.value})} required className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400" placeholder="Enter your full name" type="text"/>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400" placeholder="name@company.com" type="email"/>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Password</label>
              <div className="flex w-full items-stretch rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <span className="material-symbols-outlined flex items-center pl-4 text-slate-400 text-xl">lock</span>
                <input value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required className="flex-1 bg-transparent border-none focus:ring-0 py-3.5 px-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="Create a password" type="password"/>
                <button className="px-4 text-slate-400 hover:text-primary transition-colors" type="button">
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Confirm Password</label>
              <div className="flex w-full items-stretch rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <span className="material-symbols-outlined flex items-center pl-4 text-slate-400 text-xl">lock_reset</span>
                <input value={formData.confirm_password} onChange={e => setFormData({...formData, confirm_password: e.target.value})} required className="flex-1 bg-transparent border-none focus:ring-0 py-3.5 px-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="Repeat your password" type="password"/>
              </div>
            </div>
            <div className="flex items-start gap-3 mt-2">
              <input required className="mt-1 h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary focus:ring-offset-0 dark:bg-slate-800 transition-colors" id="terms" type="checkbox"/>
              <label className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium" htmlFor="terms">
                I agree to the <a className="text-primary hover:underline font-bold" href="#">Terms & Conditions</a> and <a className="text-primary hover:underline font-bold" href="#">Privacy Policy</a>.
              </label>
            </div>
            <button 
              disabled={loading}
              className="w-full bg-primary hover:bg-yellow-400 text-slate-900 font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/20 transform transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-50" 
              type="submit"
            >
              <span>{loading ? "Creating Account..." : "Create Account"}</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-4 text-slate-400 font-black tracking-widest">Or sign up with</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button type="button" onClick={() => loginWithGoogle()} className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 font-bold text-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 font-bold text-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"></path>
              </svg>
              Facebook
            </button>
          </div>
        </div>
      </main>
      <footer className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p>© 2024 GrantStream. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-6">
          <a className="hover:text-primary transition-colors font-medium" href="#">Privacy</a>
          <a className="hover:text-primary transition-colors font-medium" href="#">Terms</a>
          <a className="hover:text-primary transition-colors font-medium" href="#">Help Center</a>
        </div>
      </footer>
    </div>
  );
};

export default SignUpPage;
