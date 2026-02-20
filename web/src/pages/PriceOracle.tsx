import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  DollarSign, Loader2, Search, LineChart, LayoutDashboard, 
  Activity, Settings, LogOut, User, Plane, ShieldCheck 
} from 'lucide-react';

const PriceOracle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem("user_name") || "Captain";

  const [formData, setFormData] = useState({
    airline: '',       
    origin: '',
    destination: '',
    duration_hours: ''
  });

  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".animate-price", { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" });
    });
    return () => ctx.revert();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_name");
    navigate("/login");
  };

  const handlePredict = async () => {
    if (!formData.airline || !formData.origin || !formData.destination || !formData.duration_hours) {
      alert("Harap isi semua bidang!");
      return;
    }

    setLoading(true);
    setPredictedPrice(null);
    
    try {
      const token = localStorage.getItem("user_token");
      const durationInMins = Math.round(parseFloat(formData.duration_hours) * 60);

      const response = await fetch("http://localhost:8000/api/predict-price", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          airline: formData.airline,
          origin: formData.origin,
          destination: formData.destination,
          duration_mins: durationInMins
        }),
      });

      const data = await response.json();
      if (response.ok && data.status === "success") {
        setPredictedPrice(data.estimated_price);
      } else {
        alert("Gagal: " + (data.detail || "Terjadi kesalahan"));
        if (response.status === 401) navigate("/login");
      }
    } catch (error) {
      alert("Error: Gagal terhubung ke server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-100 font-sans overflow-hidden selection:bg-green-500 selection:text-white">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900/50 border-r border-slate-800 flex flex-col justify-between backdrop-blur-xl relative z-20">
        <div>
          <div className="h-20 flex items-center px-8 border-b border-slate-800">
            <div className="text-xl font-black italic tracking-tighter flex items-center gap-2">
              WINDBREAKER<span className="text-green-500">.AI</span>
            </div>
          </div>

          <nav className="p-4 space-y-2 mt-4">
            <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">Core Modules</p>
            <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${location.pathname === '/dashboard' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
              <LayoutDashboard size={18} /> Overview Hub
            </Link>
            <Link to="/delay-predictor" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${location.pathname === '/delay-predictor' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
              <Activity size={18} /> Delay Predictor
            </Link>
            <Link to="/oracle" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${location.pathname === '/oracle' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
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
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300">
            <LogOut size={18} /> Terminate Session
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 w-125 h-125 bg-green-600/5 blur-[150px] rounded-full pointer-events-none"></div>

        {/* TOP BAR */}
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/20 backdrop-blur-sm z-10 animate-price">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-green-500" size={20} />
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Pricing Telemetry Active</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Operator</p>
              <p className="text-sm font-bold text-slate-200 flex items-center justify-end gap-2">
                {userName} <User size={14} className="text-green-500" />
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Plane size={18} className="text-slate-400" />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 z-10">
          <div className="max-w-5xl mx-auto grid grid-cols-12 gap-8">
            
            <div className="col-span-12 lg:col-span-7 space-y-8 animate-price">
              <div>
                <h1 className="text-4xl font-black tracking-tighter mb-2 italic">PRICE<span className="text-green-500">ORACLE</span></h1>
                <p className="text-slate-400">Neural network analysis for market fare estimation.</p>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-4xl backdrop-blur-md shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Carrier Network</label>
                    <div className="relative group">
                      <input 
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-green-500 outline-none transition-all font-mono"
                        value={formData.airline}
                        onChange={(e) => setFormData({...formData, airline: e.target.value})}
                        placeholder="Ex: Emirates, Delta"
                      />
                      <Search className="absolute right-4 top-4 w-4 h-4 text-slate-600 group-focus-within:text-green-500 transition-colors" />
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Origin (Code)</label>
                    <input 
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm outline-none focus:border-green-500 transition-all font-mono uppercase"
                      value={formData.origin}
                      onChange={(e) => setFormData({...formData, origin: e.target.value.toUpperCase()})}
                      placeholder="Ex: DAC"
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Destination (Code)</label>
                    <input 
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm outline-none focus:border-green-500 transition-all font-mono uppercase"
                      value={formData.destination}
                      onChange={(e) => setFormData({...formData, destination: e.target.value.toUpperCase()})}
                      placeholder="Ex: JFK"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Est. Duration (Hours)</label>
                    <input 
                      type="number"
                      step="0.5"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm outline-none focus:border-green-500 transition-all font-mono" 
                      value={formData.duration_hours} 
                      onChange={(e) => setFormData({...formData, duration_hours: e.target.value})} 
                      placeholder="Ex: 5.5"
                    />
                  </div>
                </div>

                <button onClick={handlePredict} disabled={loading} className="w-full mt-10 bg-green-600 hover:bg-green-500 active:scale-[0.98] text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-green-900/20 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Execute Pricing Model'}
                </button>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 animate-price">
              {predictedPrice !== null ? (
                <div ref={cardRef} className="flex-1 bg-linear-to-b from-slate-900 to-black border border-slate-800 p-10 rounded-5xl flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
                  <div className="absolute -top-20 -right-20 w-64 h-64 blur-[120px] rounded-full opacity-20 bg-green-600"></div>
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Predicted Fare</h3>
                  <div className="flex items-baseline gap-2 mb-8 z-10">
                    <span className="text-4xl font-bold text-green-500">$</span>
                    <span className="text-7xl font-black tracking-tighter italic text-white">
                      {predictedPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="py-3 px-8 rounded-2xl border font-black uppercase tracking-widest text-[10px] bg-green-500/20 text-green-400 border-green-500/30 z-10">
                    MARKET STATUS: NORMAL
                  </div>
                </div>
              ) : (
                <div className="flex-1 border-2 border-dashed border-slate-800/50 rounded-5xl flex flex-col items-center justify-center p-12 text-slate-700 bg-slate-900/5 text-center">
                  <DollarSign className="opacity-10 animate-pulse mb-4" size={64} />
                  <p className="font-bold uppercase tracking-widest text-[10px]">Awaiting Flight Data...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PriceOracle;