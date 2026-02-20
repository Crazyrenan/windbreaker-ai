import { useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  Plane, LayoutDashboard, Activity, LineChart, 
  Settings, LogOut, User, ShieldCheck, Zap, Server
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem("user_name") || "Captain";
  
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".animate-card", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      });
    }, contentRef);
    return () => ctx.revert();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_name");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-100 font-sans overflow-hidden selection:bg-blue-500 selection:text-white">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900/50 border-r border-slate-800 flex flex-col justify-between backdrop-blur-xl relative z-20">
        <div>
          <div className="h-20 flex items-center px-8 border-b border-slate-800">
            <div className="text-xl font-black italic tracking-tighter flex items-center gap-2">
              WINDBREAKER<span className="text-blue-500">.AI</span>
            </div>
          </div>

          <nav className="p-4 space-y-2 mt-4">
            <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">Core Modules</p>
            
            <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${location.pathname === '/dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
              <LayoutDashboard size={18} /> Overview Hub
            </Link>
            
            <Link to="/delay-predictor" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${location.pathname === '/delay-predictor' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
              <Activity size={18} /> Delay Predictor
            </Link>

            <Link to="/oracle" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${location.pathname === '/oracle' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
              <LineChart size={18} /> Price Oracle
            </Link>
          </nav>

          <nav className="p-4 space-y-2 mt-4">
            <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">System</p>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 text-left">
              <Settings size={18} /> Configurations
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={18} /> Terminate Session
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
       <div className="absolute top-0 right-0 w-125 h-125 bg-blue-600/5 blur-[150px] rounded-full pointer-events-none"></div>

        {/* TOP BAR */}
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/20 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-green-500" size={20} />
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Network Secured</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Active Operator</p>
              <p className="text-sm font-bold text-slate-200 flex items-center justify-end gap-2">
                {userName} <User size={14} className="text-blue-500" />
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Plane size={18} className="text-slate-400" />
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-8 z-10">
          
          <div className="mb-10 animate-card">
            <h1 className="text-4xl font-black tracking-tighter mb-2">Command Center.</h1>
            <p className="text-slate-400 text-lg">Welcome aboard, Captain. Select a neural module to begin telemetry analysis.</p>
          </div>

          {/* SYSTEM STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl animate-card">
              <div className="flex items-center gap-3 mb-2">
                <Server size={18} className="text-blue-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">API Status</span>
              </div>
              <p className="text-3xl font-black tracking-tighter text-white">ONLINE</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl animate-card">
              <div className="flex items-center gap-3 mb-2">
                <Zap size={18} className="text-green-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Model Accuracy</span>
              </div>
              <p className="text-3xl font-black tracking-tighter text-white">94.2%</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl animate-card">
              <div className="flex items-center gap-3 mb-2">
                <Activity size={18} className="text-red-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Queries Today</span>
              </div>
              <p className="text-3xl font-black tracking-tighter text-white">1,024</p>
            </div>
          </div>

          <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6 animate-card">Available AI Modules</h2>

          {/* FEATURE CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Module 1: Delay Predictor */}
            <div onClick={() => navigate('/delay-predictor')} className="group cursor-pointer bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 p-8 rounded-4xl transition-all hover:bg-slate-800/60 hover:shadow-2xl hover:shadow-blue-900/20 relative overflow-hidden animate-card">
              <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity size={200} />
              </div>
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Activity className="text-blue-500" size={24} />
              </div>
              <h3 className="text-2xl font-black tracking-tighter mb-3">Delay Predictor</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
                Utilize our XGBoost model to analyze flight routes, weather patterns, and historical carrier data to predict arrival delays.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest">
                Launch Module <Activity size={14} />
              </div>
            </div>

            {/* Module 2: Price Oracle */}
            <div onClick={() => navigate('/oracle')} className="group cursor-pointer bg-slate-900/60 border border-slate-800 hover:border-green-500/50 p-8 rounded-4xl transition-all hover:bg-slate-800/60 hover:shadow-2xl hover:shadow-green-900/20 relative overflow-hidden animate-card">
              <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <LineChart size={200} />
              </div>
              <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 border border-green-500/20 group-hover:scale-110 transition-transform">
                <LineChart className="text-green-500" size={24} />
              </div>
              <h3 className="text-2xl font-black tracking-tighter mb-3">Price Oracle</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
                Forecast optimal ticket fares based on live market averages, routing codes, and estimated travel durations.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-green-500 uppercase tracking-widest">
                Launch Module <LineChart size={14} />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;