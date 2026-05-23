import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Utensils, 
  Sparkles, 
  Calendar, 
  BarChart3, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Plus, 
  Bell 
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Registro de Comidas', to: '/meals', icon: Utensils },
    { name: 'Plan Alimenticio', to: '/plans', icon: Calendar },
    { name: 'Asistente IA', to: '/chat', icon: Sparkles },
    { name: 'Estadísticas', to: '/stats', icon: BarChart3 },
    { name: 'Perfil Nutricional', to: '/profile', icon: User },
    { name: 'Configuración', to: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getPageTitle = () => {
    const activeRoute = navigation.find(item => item.to === location.pathname);
    return activeRoute ? activeRoute.name : 'NutriAI';
  };

  return (
    <div className="bg-background dark:bg-on-tertiary-fixed text-on-surface dark:text-white min-h-screen flex">
      {/* Mobile menu toggle */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-6 right-6 z-50 p-2 bg-primary text-on-primary rounded-full shadow-lg"
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed left-0 top-0 h-screen w-[280px] bg-surface-container dark:bg-on-tertiary-fixed border-r border-outline-variant/20 shadow-md flex flex-col p-4 z-40 transition-transform duration-300
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="px-4 py-8">
          <h1 className="font-headline text-3xl font-extrabold text-primary">NutriAI</h1>
          <p className="text-xs text-on-surface-variant dark:text-tertiary-fixed-dim opacity-70 font-semibold uppercase tracking-wider">Prevención y Longevidad</p>
        </div>

        <nav className="flex-1 space-y-1 px-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm
                  ${isActive 
                    ? 'text-primary bg-primary/10 border-l-4 border-primary rounded-l-none' 
                    : 'text-on-surface-variant dark:text-tertiary-fixed-dim hover:bg-primary/5 hover:text-primary'
                  }
                `}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto px-2 space-y-2 border-t border-outline-variant/10 pt-4 pb-4">
          <button 
            onClick={() => {
              navigate('/meals?add=true');
              setMobileMenuOpen(false);
            }}
            className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all hover:bg-primary/95"
          >
            <Plus size={18} />
            Registrar Comida
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container/10 rounded-xl transition-all duration-200 font-semibold text-sm"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-[280px] flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/70 dark:bg-on-tertiary-fixed/70 backdrop-blur-md h-20 px-6 md:px-12 flex items-center justify-between border-b border-outline-variant/30">
          <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface dark:text-white">{getPageTitle()}</h2>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-on-surface-variant dark:text-tertiary-fixed-dim hover:bg-surface-container rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30">
              <div className="text-right hidden sm:block">
                <p className="font-bold text-sm text-on-surface dark:text-white">Hola, {user?.name || 'Usuario'}</p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider">NutriAI Premium</p>
              </div>
              <img 
                alt="User Profile" 
                className="w-10 h-10 rounded-full border-2 border-primary-container object-cover" 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
              />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 md:p-12 max-w-[1440px] mx-auto w-full flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
