import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
  ArrowRight,
  Plane,
  Lock,
  Mail,
  Loader2,
  Fingerprint,
} from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const formRef = useRef<HTMLDivElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
  const formEl = formRef.current;
  const visualEl = visualRef.current;

  if (!formEl || !visualEl) return;

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" }
    });

    const formElements = Array.from(formEl.children);

    tl.from(visualEl, {
      x: -80,
      opacity: 0,
      duration: 1.1,
    }).from(
      formElements,
      {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
      },
      "-=0.7"
    );
  });

  return () => ctx.revert();
}, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Authentication failed.");
      }

      const data = await response.json();

      localStorage.setItem("user_token", data.access_token);
      localStorage.setItem("user_name", data.user_name);

      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Server connection failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg text-slate-100 font-sans grid grid-cols-1 lg:grid-cols-2 overflow-hidden">

      {/* LEFT SIDE */}
      <div
        ref={visualRef}
        className="relative hidden lg:flex flex-col justify-between p-12 bg-slate-900 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-blue-900/20 to-slate-900/90" />

        <div className="relative z-10">
          <Link
            to="/"
            className="text-xl font-black italic tracking-tighter flex items-center gap-2 hover:opacity-80 transition-opacity w-fit"
          >
            <Plane className="text-blue-500" />
            WINDBREAKER<span className="text-blue-500">.AI</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-6xl font-black tracking-tighter leading-[0.9] mb-6">
            CAPTAIN,
            <br />
            <span className="text-blue-500">WELCOME BACK.</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Access predictive telemetry, AI insights, and your operational dashboard.
          </p>
        </div>

        <div className="relative z-10 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          SECURE CONNECTION • ENCRYPTED V2.1
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-6 bg-app-bg relative">
        <div className="absolute w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div ref={formRef} className="w-full max-w-md space-y-10 relative z-10">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">
              Identify Yourself.
            </h1>
            <p className="text-slate-500 text-sm">
              Enter your credentials to access the system.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-500 text-xs font-bold p-4 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-widest">
                Email
              </label>
              <div className="relative mt-2">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-600" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 pl-12 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-widest">
                Password
              </label>
              <div className="relative mt-2">
                <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-600" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 pl-12 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-sm"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Initiate Session <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <button className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 active:scale-[0.98] text-slate-300 font-medium py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-sm">
            <Fingerprint size={18} />
            Biometric / SSO
          </button>

          <p className="text-center text-slate-600 text-sm">
            New here?{" "}
            <Link to="/register" className="text-blue-500 font-semibold">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;