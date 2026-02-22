import { useState, useEffect } from 'react';
import axios from 'axios';
// Hapus 'Activity' dari baris import ini
import { Loader2, Navigation } from 'lucide-react';

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
        console.error(err);
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

  return (
    <div className="max-w-6xl w-full grid grid-cols-12 gap-6 mx-auto">
      <div className="col-span-12 mb-6">
        <h2 className="text-3xl font-black italic tracking-tighter uppercase">
          Delay<span className="text-brand-blue"> Predictor</span>
        </h2>
        <p className="text-nav-fg font-bold text-xs uppercase tracking-[0.2em]">Neural Intelligence Inference Engine</p>
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

      <div className="col-span-12 lg:col-span-5 h-full min-h-[400px]">
        {result ? (
          <div className="h-full bg-gradient-to-b from-slate-900 to-black border border-app-border p-10 rounded-5xl flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
            <div className={`absolute -top-20 -right-20 w-64 h-64 blur-[120px] rounded-full opacity-20 ${result.risk_score > 40 ? 'bg-brand-danger' : 'bg-green-600'}`}></div>
            <h3 className="text-[10px] font-black text-nav-fg uppercase tracking-widest mb-6">Delay Probability</h3>
            <h3 className="text-7xl font-black mb-6 tracking-tighter italic">
              {result.risk_score}<span className="text-3xl not-italic opacity-50">%</span>
            </h3>
            <div className={`py-4 px-8 rounded-2xl border font-black uppercase tracking-widest text-sm ${result.risk_score > 40 ? 'bg-brand-danger/20 text-brand-danger border-brand-danger/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
              STATUS: {result.prediction}
            </div>
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-app-border rounded-5xl flex flex-col items-center justify-center p-12 text-nav-fg bg-slate-900/10 text-center">
            <Navigation className="opacity-10 animate-pulse mb-4" size={64} />
            <p className="font-bold uppercase tracking-widest text-[10px]">Awaiting Telemetry...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DelayPredictor;