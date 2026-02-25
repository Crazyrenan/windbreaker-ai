import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Navigation, AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react';

const DelayPredictor = () => {
  const [formData, setFormData] = useState({
    airline: '',
    origin: '',
    destination: '',
    date: '2026-05-20',
    time: '14:00'
  });

  const [options, setOptions] = useState<{airlines: string[], cities: string[]}>({ airlines: [], cities: [] });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{prediction: string, probability: number, risk_score: number} | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/delay-options');
        setOptions(res.data);
        if (res.data.airlines.length > 0) {
          setFormData(prev => ({ ...prev, airline: res.data.airlines[0] }));
        }
      } catch (err) {
        console.error("Gagal memuat opsi:", err);
      }
    };
    fetchOptions();
  }, []);

  const handlePredict = async () => {
    setLoading(true);
    setResult(null);
    try {
      const token = localStorage.getItem("user_token");
      const response = await axios.post('http://127.0.0.1:8000/api/predict-delay', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(response.data);
    } catch (error) {
      alert("Gagal memprediksi delay. Periksa koneksi backend atau sesi token.");
    } finally {
      setLoading(false);
    }
  };

  // Logika Visualisasi Risiko (Risk Engine Logic)
  const getRiskMeta = (score: number) => {
    if (score < 40) return { 
      label: "LOW RISK", 
      desc: "On-Time Likely",
      color: "text-emerald-400", 
      bg: "bg-emerald-500", 
      border: "border-emerald-500/30",
      icon: <CheckCircle size={24} className="text-emerald-400" />
    };
    if (score < 65) return { 
      label: "MODERATE RISK", 
      desc: "Potential Delay",
      color: "text-amber-400", 
      bg: "bg-amber-500", 
      border: "border-amber-500/30",
      icon: <AlertTriangle size={24} className="text-amber-400" />
    };
    return { 
      label: "HIGH RISK", 
      desc: "Delay Likely",
      color: "text-rose-500", 
      bg: "bg-rose-500", 
      border: "border-rose-500/30",
      icon: <AlertOctagon size={24} className="text-rose-500" />
    };
  };

  const riskMeta = result ? getRiskMeta(result.risk_score) : null;

  return (
    <div className="max-w-6xl w-full grid grid-cols-12 gap-6 mx-auto">
      <div className="col-span-12 mb-6">
        <h2 className="text-3xl font-black italic tracking-tighter uppercase">
          Delay<span className="text-brand-blue"> Risk Engine</span>
        </h2>
        <p className="text-nav-fg font-bold text-xs uppercase tracking-[0.2em]">Flight Schedule Volatility Analysis</p>
      </div>

      <div className="col-span-12 lg:col-span-7 bg-slate-900/40 border border-app-border p-10 rounded-4xl backdrop-blur-md">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8">
          <div className="col-span-2">
            <label className="text-[10px] font-black text-nav-fg uppercase tracking-widest mb-3 block">Carrier Network</label>
            <select 
              className="w-full bg-app-bg border border-app-border rounded-2xl p-4 text-sm outline-none focus:border-brand-blue transition-all"
              value={formData.airline}
              onChange={(e) => setFormData({...formData, airline: e.target.value})}
            >
              <option value="">Select Airline</option>
              {options.airlines.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div className="col-span-1">
            <label className="text-[10px] font-black text-nav-fg uppercase tracking-widest mb-3 block">Origin City</label>
            <select 
              className="w-full bg-app-bg border border-app-border rounded-2xl p-4 text-sm outline-none focus:border-brand-blue"
              value={formData.origin}
              onChange={(e) => setFormData({...formData, origin: e.target.value})}
            >
              <option value="">Select Origin</option>
              {options.cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="col-span-1">
            <label className="text-[10px] font-black text-nav-fg uppercase tracking-widest mb-3 block">Destination</label>
            <select 
              className="w-full bg-app-bg border border-app-border rounded-2xl p-4 text-sm outline-none focus:border-brand-blue"
              value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
            >
              <option value="">Select Destination</option>
              {options.cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="col-span-1">
            <label className="text-[10px] font-black text-nav-fg uppercase tracking-widest mb-3 block">Date</label>
            <input 
              type="date" 
              className="w-full bg-app-bg border border-app-border rounded-2xl p-4 text-sm outline-none focus:border-brand-blue" 
              value={formData.date} 
              onChange={(e) => setFormData({...formData, date: e.target.value})} 
            />
          </div>

          <div className="col-span-1">
            <label className="text-[10px] font-black text-nav-fg uppercase tracking-widest mb-3 block">Time</label>
            <input 
              type="time" 
              className="w-full bg-app-bg border border-app-border rounded-2xl p-4 text-sm outline-none focus:border-brand-blue"
              value={formData.time} 
              onChange={(e) => setFormData({...formData, time: e.target.value})} 
            />
          </div>
        </div>

        <button 
          onClick={handlePredict}
          disabled={loading}
          className="w-full mt-10 bg-brand-blue hover:opacity-90 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs transition-all shadow-xl shadow-brand-blue/20"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Analyze Flight Risk'}
        </button>
      </div>

      <div className="col-span-12 lg:col-span-5 h-full min-h-100">
        {result && riskMeta ? (
          <div className="h-full bg-linear-to-b from-slate-900 to-black border border-app-border p-10 rounded-5xl flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
            {/* Ambient Glow sesuai tingkat risiko */}
            <div className={`absolute -top-20 -right-20 w-64 h-64 blur-[120px] rounded-full opacity-20 ${riskMeta.bg}`}></div>
            
            <h3 className="text-[10px] font-black text-nav-fg uppercase tracking-widest mb-2">Calculated Risk Score</h3>
            
            <h3 className="text-8xl font-black mb-2 tracking-tighter italic text-white">
              {result.risk_score}
            </h3>
            
            <div className="flex items-center gap-2 mb-8 opacity-60">
              <span className="text-xs font-bold uppercase tracking-widest">Probability: {(result.probability * 100).toFixed(1)}%</span>
            </div>

            <div className={`w-full py-6 px-8 rounded-3xl border flex items-center justify-between ${riskMeta.bg}/10 ${riskMeta.border}`}>
              <div className="flex flex-col items-start">
                <span className={`text-[10px] font-black uppercase tracking-widest opacity-70 mb-1 ${riskMeta.color}`}>Risk Level</span>
                <span className={`text-2xl font-black italic tracking-tight ${riskMeta.color}`}>{riskMeta.label}</span>
              </div>
              <div className={`p-3 rounded-full ${riskMeta.bg}/20`}>
                {riskMeta.icon}
              </div>
            </div>
            
            <p className="mt-6 text-[10px] font-bold text-nav-fg uppercase tracking-widest opacity-40">
              {riskMeta.desc} • Based on Historical Patterns
            </p>
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-app-border rounded-5xl flex flex-col items-center justify-center p-12 text-nav-fg bg-app-bg text-center">
            <Navigation className="opacity-10 animate-pulse mb-4" size={64} />
            <p className="font-bold uppercase tracking-widest text-[10px]">Awaiting Flight Data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DelayPredictor;