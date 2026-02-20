import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  ArrowRight, 
  Plane, 
  Lock, 
  Mail, 
  Loader2,
  AlertTriangle
} from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const formRef = useRef(null);
  const visualRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(visualRef.current, {
        y: -50,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2
      });
      
      gsap.from(formRef.current, {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2
      });
    });
    return () => ctx.revert();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch("http://localhost:8000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, new_password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.detail || "Reset gagal. Email tidak ditemukan.");
      }
    } catch (err) {
      setError("Gagal terhubung ke server backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans grid grid-cols-1 lg:grid-cols-2 overflow-hidden selection:bg-red-500 selection:text-white">
      
      <div ref={visualRef} className="relative hidden lg:flex flex-col justify-between p-12 bg-slate-900 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1544256718-3b6102f1d24c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity grayscale"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-slate-900/90 via-red-900/10 to-slate-900/90"></div>
        
        <div className="relative z-10">
           <div className="text-xl font-black italic tracking-tighter flex items-center gap-2">
            <Plane className="text-red-500" />
            WINDBREAKER<span className="text-red-500">.AI</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-6xl font-black tracking-tighter leading-[0.9] mb-6">
            SYSTEM<br/>
            <span className="text-red-500">OVERRIDE.</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Identity verification required to reset access codes. Ensure you are on a secured network.
          </p>
        </div>

        <div className="relative z-10 flex gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          <span>EMERGENCY PROTOCOL</span>
          <span>•</span>
          <span>RESTRICTED ACCESS</span>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 bg-[#0f172a] relative">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div ref={formRef} className="w-full max-w-md space-y-10 relative z-10">
          
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
              <AlertTriangle className="text-red-500" size={32} />
              <h1 className="text-4xl font-black tracking-tighter">Lost Access?</h1>
            </div>
            <p className="text-slate-500">Reset your neural network passcode below.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] font-bold uppercase tracking-widest p-4 rounded-xl">
              ERROR: {error}
            </div>
          )}

          {success ? (
            <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm font-bold tracking-wide p-6 rounded-xl text-center space-y-2">
              <p>PASSCODE OVERRIDDEN</p>
              <p className="text-[10px] uppercase tracking-widest text-green-600">Redirecting to login port...</p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-600 group-focus-within:text-red-500 transition-colors" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pilot@windbreaker.ai"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 pl-12 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all font-medium placeholder-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Passcode</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-600 group-focus-within:text-red-500 transition-colors" />
                  <input 
                    type="password" 
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 pl-12 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all font-medium placeholder-slate-700"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-red-900/20 uppercase tracking-widest text-xs flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Force Reset <ArrowRight size={16} /></>}
              </button>
            </form>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0f172a] px-4 text-slate-600 font-bold tracking-widest">System Status</span></div>
          </div>

          <p className="text-center text-slate-600 text-sm">
            Remembered your credentials? <Link to="/login" className="text-red-500 font-bold hover:text-red-400">Abort & Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;