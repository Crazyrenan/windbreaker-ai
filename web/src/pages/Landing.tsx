import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import {
  Plane,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Cpu,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const navigate = useNavigate();
  const container = useRef(null);

  useEffect(() => {
    // Timer singkat untuk memastikan DOM sudah stabil sebelum hitung posisi ScrollTrigger
    const timer = setTimeout(() => ScrollTrigger.refresh(), 200);

    const ctx = gsap.context(() => {
      
      // HERO REVEAL - Gunakan fromTo agar opacity 0 benar-benar terpicu
      gsap.fromTo(".hero-reveal", 
        { y: 80, opacity: 0, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out"
        }
      );

      // PARALLAX MOCKUP
      gsap.to(".mockup", {
        y: -30,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // SECTION REVEAL
      gsap.utils.toArray(".section-animate").forEach((section: any) => {
        gsap.fromTo(section,
          { y: 60, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      });

      // COUNTER ANIMATION - Perbaikan logika innerText
      gsap.utils.toArray(".counter").forEach((el: any) => {
        const target = +el.getAttribute("data-target");
        gsap.fromTo(
          el,
          { innerText: 0 },
          {
            innerText: target,
            duration: 2,
            ease: "power2.out",
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
            },
            onUpdate: function() {
              // Menambahkan pemisah ribuan jika perlu
              if (el.innerText > 999) {
                el.innerText = Math.floor(el.innerText).toLocaleString();
              }
            }
          }
        );
      });

    }, container);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={container}
      className="bg-[#050B14] text-white overflow-x-hidden font-sans relative"
    >
      {/* Background Mesh */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.12),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(99,102,241,0.1),transparent_40%)]" />

      {/* NAV */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-50">
        <div className="flex items-center gap-2 font-black italic tracking-tight text-xl cursor-pointer" onClick={() => navigate("/")}>
          <Plane className="text-blue-500" size={24} />
          WINDBREAKER<span className="text-blue-500">.AI</span>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition font-bold text-sm uppercase tracking-widest"
        >
          Control Panel
        </button>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-start text-center px-6 pt-32">
        <h1 className="hero-reveal text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] max-w-5xl tracking-tighter">
          Predict Flight Delays
          <br />
          <span className="text-blue-500 italic">
            Before They Disrupt You.
          </span>
        </h1>

        <p className="hero-reveal mt-8 text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
          Machine learning–powered aviation intelligence that forecasts delay
          probabilities and estimates fair ticket pricing in real time.
        </p>

        <div className="hero-reveal mt-12 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="group px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl shadow-blue-600/20 uppercase tracking-widest text-sm"
          >
            Launch Platform
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-10 py-5 border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 transition font-black uppercase tracking-widest text-sm">
            Documentation
          </button>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mockup mt-24 relative z-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <img
              src="/dashboard-preview.png" 
              alt="Dashboard Preview"
              className="relative rounded-2xl border border-white/10 shadow-2xl w-250 max-w-full"
            />
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="section-animate py-32 border-y border-white/5 bg-white/2 backdrop-blur-3xl relative z-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { value: 88, suffix: "%", label: "Prediction Accuracy" },
            { value: 50000, suffix: "+", label: "Flights Trained" },
            { value: 1200, suffix: "+", label: "Global Routes" },
            { value: 2, suffix: "s", label: "Avg. Response Time" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-black text-white flex items-baseline">
                <span
                  className="counter"
                  data-target={item.value}
                >
                  0
                </span>
                <span className="text-blue-500">{item.suffix}</span>
              </div>
              <div className="text-slate-500 mt-3 text-xs font-black uppercase tracking-widest">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="section-animate py-40 max-w-7xl mx-auto px-6 relative z-20">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">
            Built for <span className="text-blue-500">Intelligence.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <TrendingUp size={32} />,
              title: "Delay Forecasting",
              desc: "Supervised ML model optimized for structured aviation datasets with XGBoost integration."
            },
            {
              icon: <Cpu size={32} />,
              title: "Dynamic Pricing",
              desc: "Real-time fair ticket value estimation using historical volatility and carrier demand."
            },
            {
              icon: <ShieldCheck size={32} />,
              title: "Risk Scoring",
              desc: "Probability-based risk assessment to provide clarity for safer itinerary decisions."
            }
          ].map((item, i) => (
            <div
              key={i}
              className="p-10 rounded-3xl bg-white/3 border border-white/10 backdrop-blur-xl hover:border-blue-500/40 hover:bg-white/6 transition-all group"
            >
              <div className="text-blue-500 mb-8 p-3 bg-blue-500/10 w-fit rounded-2xl group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="font-black italic text-xl mb-4 uppercase tracking-tight">
                {item.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
      
      {/* PRICING */}
      <section className="section-animate py-40 max-w-7xl mx-auto px-6 relative z-20">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">
            Transparent <span className="text-blue-500">Pricing</span>
          </h2>
          <p className="text-slate-400 mt-6">
            Built for individuals, teams, and enterprise aviation partners.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Starter", price: "$29", desc: "For individual analysts & travelers." },
            { name: "Pro", price: "$99", desc: "Advanced forecasting & API access." },
            { name: "Enterprise", price: "Custom", desc: "Dedicated ML pipelines & SLA." }
          ].map((plan, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -8 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-blue-500/40 transition-all"
            >
              <h3 className="text-xl font-black uppercase mb-6">{plan.name}</h3>
              <div className="text-4xl font-black text-blue-500 mb-6">{plan.price}</div>
              <p className="text-slate-400 text-sm mb-8">{plan.desc}</p>
              <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-bold uppercase text-sm tracking-widest">
                Choose Plan
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* API SECTION */}
      <section className="section-animate py-40 border-y border-white/5 bg-white/5 relative z-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">

          <div>
            <h2 className="text-4xl font-black italic uppercase mb-8">
              Developer <span className="text-blue-500">API</span>
            </h2>
            <p className="text-slate-400 mb-10">
              Integrate our delay prediction and pricing intelligence directly into your platform.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-black uppercase text-sm tracking-widest transition"
            >
              View Documentation
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="bg-black/40 border border-white/10 rounded-2xl p-8 font-mono text-sm text-slate-300"
          >
      {`POST /api/v1/predict
      {
        "origin": "CGK",
        "destination": "HND",
        "airline": "ANA",
        "departure_time": "2026-05-02T08:00:00"
      }

      Response:
      {
        "delay_probability": 0.18,
        "fair_price_estimate": 742.50
      }`}
          </motion.div>

        </div>
      </section>

      {/* AI RESEARCH */}
      <section className="section-animate py-40 max-w-7xl mx-auto px-6 relative z-20 text-center">
        <h2 className="text-4xl md:text-5xl font-black italic uppercase mb-12">
          Built for <span className="text-blue-500">AI Competitions</span>
        </h2>

        <p className="text-slate-400 max-w-3xl mx-auto mb-20">
          WINDBREAKER.AI is architected as a modular ML system suitable for
          research, Kaggle competitions, and predictive modeling showcases.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            "XGBoost-based structured data modeling",
            "Feature engineering pipeline for time-series aviation data",
            "Scalable evaluation & cross-validation system"
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04 }}
              className="p-10 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl"
            >
              <p className="text-slate-300 font-medium">{item}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section-animate py-40 text-center relative z-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-blue-600/10 blur-[150px] -z-10" />

        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-black mb-8 italic tracking-tighter uppercase leading-none">
            Ready for <span className="text-blue-500">Takeoff?</span>
          </h2>
          <p className="text-slate-400 text-lg mb-12 font-medium">
            Join the next generation of predictive aviation intelligence.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-12 py-6 bg-white text-black hover:bg-slate-200 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl shadow-white/10 active:scale-95"
          >
            Get Started Now
          </button>
        </div>
      </section>

      <footer className="border-t border-white/5 py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto text-slate-500 text-[10px] font-black uppercase tracking-widest relative z-20">
        <div>© 2026 Windbreaker AI Systems</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-blue-500 transition">Privacy</a>
          <a href="#" className="hover:text-blue-500 transition">Terms</a>
          <a href="#" className="hover:text-blue-500 transition">GitHub</a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;