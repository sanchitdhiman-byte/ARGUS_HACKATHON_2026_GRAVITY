import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Loader2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message || null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/auth/login', formData);
      if(res.status === 200) {
        // Store JWT tokens
        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('refresh_token', res.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleMock = async () => {
    setGoogleLoading(true);
    setError(null);
    // In actual production, you trigger Google OAuth pop-up, grab the credential string, and POST it.
    // We will bypass it for testing locally via a generic test OAuth structure or mocked API since we don't have a real active ClientID inside the browser.
    
    // Actually, sending a mock implicit bypass to the backend! We would need the real Google JS Library here.
    // For Hackathon prototype demo purposes:
    setTimeout(() => {
        setGoogleLoading(false);
        setError("Google OAuth 2.0 requires active ClientId configuration in Dashboard. Use email login instead for local dev.");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
      <Link to="/" className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back Home
      </Link>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <div className="w-12 h-12 bg-primary-500/20 text-primary-500 rounded-xl flex items-center justify-center mb-6">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-sm text-slate-400 mb-8">Access your grant portfolio securely.</p>

          {message && <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-xl text-sm mb-6">{message}</div>}
          {error && <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 px-4 py-3 rounded-xl text-sm mb-6">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-slate-600" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <a href="#" className="text-xs text-primary-500 hover:text-primary-400">Forgot?</a>
              </div>
              <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-slate-600" />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary text-base font-semibold py-3.5 mt-4">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Sign In to Vault"}
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-slate-800 text-slate-500">Or continue with</span>
            </div>
          </div>

          <button onClick={handleGoogleMock} disabled={googleLoading} className="mt-6 w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 text-slate-900 rounded-xl font-semibold transition-colors disabled:opacity-50">
             {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                 <>
                   <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                   Google
                 </>
             )}
          </button>

          <p className="text-center text-sm text-slate-400 mt-8">
            New organization? <Link to="/register" className="text-primary-500 hover:text-primary-400 font-medium">Apply here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
