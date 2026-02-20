import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { DollarSign, Loader2, Search, LineChart } from 'lucide-react';

const PriceOracle = () => {
  const [formData, setFormData] = useState({
    airline: '',       
    origin: '',
    destination: '',
    duration_hours: ''
  });

  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  
  const cardRef = useRef(null);
  const formRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(headerRef.current, { y: -50, opacity: 0, duration: 0.8, ease: "power3.out" })
        .from(formRef.current, { x: -30, opacity: 0, duration: 0.6 }, "-=0.4");
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (predictedPrice !== null && cardRef.current) {
      gsap.fromTo(cardRef.current, 
        { scale: 0.9, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [predictedPrice]);

  const handlePredict = async () => {
    if (!formData.airline || !formData.origin || !formData.destination || !formData.duration_hours) {
      alert("Harap isi semua bidang!");
      return;
    }

    setLoading(true);
    setPredictedPrice(null);
    
    try {
      const durationInMins = Math.round(parseFloat(formData.duration_hours) * 60);

      const response = await fetch("http://localhost:8000/api/predict-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          airline: formData.airline,
          origin: formData.origin,
          destination: formData.destination,
          duration_mins: durationInMins
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setPredictedPrice(data.estimated_price);
      } else {
        alert("Gagal memprediksi harga: " + data.detail);
      }
    } catch (error) {
      alert("Error: Pastikan backend FastAPI sudah berjalan!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex items-center justify-center p-4 md:p-8 font-sans overflow-x-hidden selection:bg-green-500 selection:text-white">
      <div className="max-w-6xl w-full grid grid-cols-12 gap-6">
        
        <header ref={headerRef} className="col-span-12 mb-4 flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LineChart className="text-green-500 w-6 h-6" />
              <span className="text-green-500 font-black tracking-widest text-xs">PRICE ORACLE</span>
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter">WINDBREAKER<span className="text-green-500">.AI</span></h1>
          </div>
        </header>

        <div ref={formRef} className="col-span-12 lg:col-span-7 bg-slate-900/40 border border-slate-800 p-6 md:p-10 rounded-4xl backdrop-blur-md shadow-2xl flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8">
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
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Estimate Ticket Fare'}
          </button>
        </div>

        <div className="col-span-12 lg:col-span-5 h-full min-h-125 flex flex-col gap-6">
          {predictedPrice !== null ? (
            <div ref={cardRef} className="flex-1 bg-linear-to-b from-slate-900 to-black border border-slate-800 p-8 rounded-4xl flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
              <div className="absolute -top-20 -right-20 w-64 h-64 blur-[120px] rounded-full opacity-20 bg-green-600"></div>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Estimated Fare</h3>
              <div className="flex items-baseline gap-2 mb-6 z-10">
                <span className="text-4xl font-bold text-green-500">$</span>
                <span className="text-7xl font-black tracking-tighter italic text-white">
                  {predictedPrice.toFixed(2)}
                </span>
              </div>
              <div className="py-3 px-8 rounded-2xl border font-black uppercase tracking-widest text-xs bg-green-500/20 text-green-400 border-green-500/30 z-10">
                MARKET AVERAGE
              </div>
            </div>
          ) : (
            <div className="flex-1 border-2 border-dashed border-slate-800/50 rounded-4xl flex flex-col items-center justify-center p-12 text-slate-700 bg-slate-900/10 text-center">
              <DollarSign className="opacity-10 animate-pulse mb-4" size={48} />
              <p className="font-bold uppercase tracking-widest text-[10px]">Awaiting Flight Data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceOracle;