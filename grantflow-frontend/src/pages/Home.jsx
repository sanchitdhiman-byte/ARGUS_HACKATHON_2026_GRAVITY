import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Zap, ArrowRight, LineChart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-200/40 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200/40 blur-[120px]" />

      <nav className="relative z-10 glass-panel mx-4 mt-4 px-6 py-4 flex justify-between items-center max-w-7xl lg:mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-slate-800 tracking-tight">Grant<span className="text-primary-600">Flow</span></span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="btn-secondary">Login</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-4xl mb-6">
          Intelligent Grant Lifecycle <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">Platform</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed font-normal">
          Beyond form-collection. Agentic AI actively assists in screening, technical scoring, and automated compliance tracking for NGOs and institutions.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col sm:flex-row gap-4">
          <Link to="/register" className="btn-primary text-lg px-8 py-4">Start Application <ArrowRight className="w-5 h-5" /></Link>
          <Link to="/catalogue" className="btn-secondary text-lg px-8 py-4">Browse Catalogue</Link>
        </motion.div>
      </main>
    </div>
  );
}
