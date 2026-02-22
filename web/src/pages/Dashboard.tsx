import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { gsap } from 'gsap';
import { Activity, LineChart, Zap, Server } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const [apiStatus, setApiStatus] = useState('CHECKING');
  const [statusColor, setStatusColor] = useState('text-slate-500');

  useEffect(() => {
    const verifyConnection = async () => {
      try {
        await axios.get('http://127.0.0.1:8000/api/options', { timeout: 3000 });
        setApiStatus('ONLINE');
        setStatusColor('text-brand-blue');
      } catch (error) {
        setApiStatus('OFFLINE');
        setStatusColor('text-brand-danger');
      }
    };
    
    verifyConnection();

    const ctx = gsap.context(() => {
      gsap.from(".animate-card", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      });
    }, contentRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={contentRef} className="max-w-6xl w-full mx-auto">
      <div className="mb-12 animate-card">
        <h1 className="text-5xl font-black tracking-tighter mb-3 italic">Control Panel.</h1>
        <p className="text-nav-fg text-lg font-medium max-w-2xl">
          System operational. Access neural modules for flight telemetry and price estimation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'API Status', val: apiStatus, icon: <Server size={18} />, color: statusColor },
          { label: 'Neural Accuracy', val: '94.2%', icon: <Zap size={18} />, color: 'text-green-500' },
          { label: 'Uptime Rate', val: '99.9%', icon: <Activity size={18} />, color: 'text-brand-danger' }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 border border-app-border p-6 rounded-3xl animate-card">
            <div className="flex items-center gap-3 mb-2 opacity-60">
              <span className={stat.color}>{stat.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className="text-3xl font-black tracking-tighter">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div onClick={() => navigate('/delay-predictor')} className="group cursor-pointer bg-slate-900/60 border border-app-border hover:border-brand-blue/50 p-8 rounded-4xl transition-all animate-card">
          <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center mb-6 border border-brand-blue/20">
            <Activity className="text-brand-blue" size={24} />
          </div>
          <h3 className="text-2xl font-black tracking-tighter mb-2 italic">Delay Predictor</h3>
          <p className="text-nav-fg text-sm leading-relaxed mb-6">Inference engine for flight arrival probabilities.</p>
          <div className="text-xs font-bold text-brand-blue uppercase tracking-widest flex items-center gap-2">Execute <Activity size={14}/></div>
        </div>

        <div onClick={() => navigate('/price-oracle')} className="group cursor-pointer bg-slate-900/60 border border-app-border hover:border-brand-blue/50 p-8 rounded-4xl transition-all animate-card">
          <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center mb-6 border border-brand-blue/20">
            <LineChart className="text-brand-blue" size={24} />
          </div>
          <h3 className="text-2xl font-black tracking-tighter mb-2 italic">Price Oracle</h3>
          <p className="text-nav-fg text-sm leading-relaxed mb-6">Neural forecasting for market fare optimizations.</p>
          <div className="text-xs font-bold text-brand-blue uppercase tracking-widest flex items-center gap-2">Execute <LineChart size={14}/></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;