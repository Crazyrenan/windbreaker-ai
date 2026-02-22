import { type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  PlaneTakeoff, LogOut, User, LayoutDashboard, 
  Timer, BadgeDollarSign 
} from 'lucide-react';

interface Props { children: ReactNode; }

const MainLayout = ({ children }: Props) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("user_name") || "Operator";

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Delay Predictor', path: '/delay-predictor', icon: <Timer size={20} /> },
    { name: 'Price Oracle', path: '/price-oracle', icon: <BadgeDollarSign size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen text-slate-100">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-app-border flex flex-col p-6 fixed h-full bg-app-bg z-50">
        <div className="flex items-center gap-2 mb-10 px-2">
          <PlaneTakeoff className="text-brand-blue w-8 h-8" />
          <h1 className="text-xl font-black italic tracking-tighter">
            WINDBREAKER<span className="text-brand-blue">.AI</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive 
                    ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/40' 
                    : 'text-nav-fg hover:bg-nav-hover hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* USER PROFILE & LOGOUT */}
        <div className="border-t border-app-border pt-6 mt-6">
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue border border-brand-blue/20">
              <User size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-nav-fg uppercase tracking-widest leading-none mb-1">Active User</p>
              <p className="text-sm font-bold truncate">{userName}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-brand-danger hover:bg-brand-danger/10 transition-all group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Terminate</span>
          </button>
        </div>
      </aside>

      {/* VIEWPORT */}
      <main className="ml-64 flex-1 p-10 overflow-y-auto">
        {children}
      </main>
      
    </div>
  );
};

export default MainLayout;