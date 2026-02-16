import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';
import { Plane, Navigation, Calendar, Clock, AlertCircle, CheckCircle2, Loader2, PlaneTakeoff, Search } from 'lucide-react';

const Dashboard = () => {
  // 1. STATE MANAGEMENT
  const [formData, setFormData] = useState({
    airline: '',       
    origin: '',
    destination: '',
    date: '2026-05-20',
    time: '14:00'
  });
  
  // State untuk menyimpan daftar opsi dari API
  const [options, setOptions] = useState<{airlines: string[], cities: string[]}>({ airlines: [], cities: [] });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{prediction: string, probability: number, risk_score: number} | null>(null);
  
  const cardRef = useRef(null);
  const formRef = useRef(null);
  const headerRef = useRef(null);

  // 2. FETCH OPTIONS ON LOAD
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/options');
        setOptions(res.data);
        
        // Set default value valid pertama
        setFormData(prev => ({
          ...prev, 
          airline: res.data.airlines[0] || 'AA',
          origin: 'Dallas/Fort Worth, TX', 
          destination: 'New York, NY'      
        }));
      } catch (err) {
        console.error("Gagal memuat opsi:", err);
      }
    };
    fetchOptions();

    // Animasi Intro
    if (headerRef.current && formRef.current) {
      const tl = gsap.timeline();
      tl.from(headerRef.current, { y: -50, opacity: 0, duration: 0.8, ease: "power3.out" })
        .from(formRef.current, { x: -30, opacity: 0, duration: 0.6 }, "-=0.4");
    }
  }, []);

  // 3. ANIMATION: RESULT CARD
  useEffect(() => {
    if (result && cardRef.current) {
      gsap.fromTo(cardRef.current, 
        { scale: 0.9, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [result]);

  const handlePredict = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/predict', formData);
      setResult(response.data);
    } catch (error) {
      console.error("API Error:", error);
      alert("Error: Pastikan input sesuai dengan opsi yang tersedia!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex items-center justify-center p-4 md:p-8 font-sans overflow-x-hidden">
      <div className="max-w-6xl w-full grid grid-cols-12 gap-6">
        
        <header ref={headerRef} className="col-span-12 mb-4 flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PlaneTakeoff className="text-blue-500 w-6 h-6" />
              <span className="text-blue-500 font-black tracking-widest text-xs">V.2.1.0 (AUTO-COMPLETE)</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white italic">WINDBREAKER<span className="text-blue-600">.AI</span></h1>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Neural Network Flight Analysis</p>
            <p className="text-slate-300 text-xs font-mono">STATUS: SYSTEMS_OPERATIONAL</p>
          </div>
        </header>

        {/* --- Form Section --- */}
        {/* Updated: rounded-[2rem] -> rounded-4xl */}
        <div ref={formRef} className="col-span-12 lg:col-span-7 bg-slate-900/40 border border-slate-800 p-6 md:p-10 rounded-4xl backdrop-blur-md shadow-2xl">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8">
            
            {/* INPUT AIRLINE DENGAN DATALIST */}
            <div className="col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Carrier Network</label>
              <div className="relative">
                <input 
                  list="airline-options" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono"
                  value={formData.airline}
                  onChange={(e) => setFormData({...formData, airline: e.target.value})}
                  placeholder="Type to search (e.g. AA)"
                />
                <datalist id="airline-options">
                  {options.airlines.map(airline => <option key={airline} value={airline} />)}
                </datalist>
                <Search className="absolute right-4 top-4 w-4 h-4 text-slate-600 pointer-events-none" />
              </div>
            </div>
            
            {/* INPUT ORIGIN */}
            <div className="col-span-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Origin City</label>
              <input 
                list="city-options"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm outline-none focus:border-blue-500 placeholder-slate-700"
                value={formData.origin}
                onChange={(e) => setFormData({...formData, origin: e.target.value})}
                placeholder="e.g. Dallas..."
              />
              <datalist id="city-options">
                {options.cities.map(city => <option key={city} value={city} />)}
              </datalist>
            </div>

            {/* INPUT DESTINATION */}
            <div className="col-span-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Destination</label>
              <input 
                list="city-options" 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm outline-none focus:border-blue-500 placeholder-slate-700"
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                placeholder="e.g. New York..."
              />
            </div>

            <div className="col-span-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Departure Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-4 w-4 h-4 text-slate-600" />
                <input type="date" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 pl-12 text-sm outline-none" 
                  value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              </div>
            </div>

            <div className="col-span-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Scheduled Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-4 w-4 h-4 text-slate-600" />
                <input type="time" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 pl-12 text-sm outline-none"
                  value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
              </div>
            </div>
          </div>

          <button 
            onClick={handlePredict}
            disabled={loading}
            className="w-full mt-10 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] disabled:bg-slate-800 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-900/20 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3"
          >
            {loading ? <><Loader2 className="animate-spin" size={18} /> Processing Model...</> : 'Analyze Flight Risk'}
          </button>
        </div>

        {/* --- Display Section --- */}
        {/* Updated: min-h-[400px] -> min-h-100 */}
        <div className="col-span-12 lg:col-span-5 h-full min-h-100">
          {result ? (
            /* Updated: bg-gradient-to-b -> bg-linear-to-b, rounded-[2.5rem] -> rounded-5xl (opsional, agar konsisten v4) */
            <div ref={cardRef} className="h-full bg-linear-to-b from-slate-900 to-black border border-slate-800 p-10 rounded-5xl flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className={`absolute -top-20 -right-20 w-64 h-64 blur-[120px] rounded-full opacity-20 ${result.risk_score > 40 ? 'bg-red-600' : 'bg-green-600'}`}></div>
              
              <div className={`w-28 h-28 rounded-3xl flex items-center justify-center mb-8 rotate-3 border-2 ${result.risk_score > 40 ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-green-500/10 border-green-500/50 text-green-500'}`}>
                {result.risk_score > 40 ? <AlertCircle size={56} /> : <CheckCircle2 size={56} />}
              </div>
              
              <h3 className="text-7xl font-black mb-2 tracking-tighter italic">{result.risk_score}<span className="text-3xl not-italic opacity-50">%</span></h3>
              <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] mb-10">Neural Delay Probability</p>
              
              <div className="w-full space-y-4">
                <div className={`py-4 px-8 rounded-2xl border font-black uppercase tracking-widest text-sm ${result.risk_score > 40 ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-green-500/20 border-green-500/30 text-green-400'}`}>
                  STATUS: {result.prediction}
                </div>
                <p className="text-slate-500 text-[10px] px-6 italic font-medium leading-relaxed">
                  Based on XGBoost analysis of historical patterns for {formData.airline} departing at {formData.time}.
                </p>
              </div>
            </div>
          ) : (
            /* Updated: rounded-[2.5rem] -> rounded-5xl */
            <div className="h-full border-2 border-dashed border-slate-800/50 rounded-5xl flex flex-col items-center justify-center p-12 text-slate-700 bg-slate-900/10">
              <div className="relative mb-6">
                <Navigation className="opacity-10 animate-pulse" size={80} />
                <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 rotate-45" size={32} />
              </div>
              <p className="text-center font-bold uppercase tracking-widest text-[10px] leading-loose">
                Awaiting Input Stream...<br/>
                <span className="font-medium normal-case text-slate-600">Enter flight telemetry to begin prediction</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;