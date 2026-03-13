import { useNavigate } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-50 font-sans">
                <h1 className="text-2xl font-bold text-slate-800 mb-4">Unauthorized Access</h1>
                <button onClick={() => navigate('/login')} className="btn-primary">Back to Login</button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center font-bold text-xl rounded-full">
                        {user.org_name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 leading-tight">Dashboard</h2>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">{user.role} workspace</p>
                    </div>
                </div>
                
                <button onClick={handleLogout} className="flex items-center gap-2 text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-xl transition-colors font-semibold shadow-sm border border-rose-100">
                    <LogOut className="w-5 h-5" /> Terminate Session
                </button>
            </header>

            <main className="flex-1 p-8 max-w-4xl mx-auto w-full">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-2">
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome, {user.org_name}</h3>
                    <p className="text-slate-500 font-medium">Email: <span className="text-slate-800">{user.email}</span> • JWT Security: <span className="text-emerald-500 font-bold">Active</span></p>
                </div>
            </main>
        </div>
    );
}
