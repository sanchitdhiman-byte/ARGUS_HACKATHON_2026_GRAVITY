import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, UserPlus, UploadCloud } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    org_name: '',
    email: '',
    password: '',
    role: 'applicant'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Direct registration using the new endpoints
      const res = await axios.post('http://localhost:8000/api/v1/auth/register', formData);
      if(res.status === 200) {
        navigate('/login', { state: { message: "Account created successfully. Please login." } });
      }
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
      <Link to="/" className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back Home
      </Link>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <div className="w-12 h-12 bg-primary-500/20 text-primary-500 rounded-xl flex items-center justify-center mb-6">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Create your Vault</h2>
          <p className="text-sm text-slate-400 mb-8">Join the GrantFlow network.</p>

          {error && <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 px-4 py-3 rounded-xl text-sm mb-6">{error}</div>}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Organization Name</label>
              <input type="text" required value={formData.org_name} onChange={e => setFormData({...formData, org_name: e.target.value})} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-slate-600" placeholder="e.g. EcoHealth India" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-slate-600" placeholder="hq@ecohealth.org" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Secure Password</label>
              <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-slate-600" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Role Select</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all appearance-none cursor-pointer">
                <option value="applicant">NGO Applicant</option>
                <option value="reviewer">Reviewer Panel</option>
                <option value="officer">Program Officer</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary text-base font-semibold py-3.5 mt-8 disabled:opacity-50">
               {loading ? "Creating..." : "Initialize Vault Profile"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account? <Link to="/login" className="text-primary-500 hover:text-primary-400 font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
