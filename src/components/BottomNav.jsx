import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { House, Clapperboard, Tv, Sparkles, MonitorPlay } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: House },
    { label: 'Movie', path: '/movies', icon: Clapperboard },
    { label: 'TV Show', path: '/tv-shows', icon: Tv },
    { label: 'Anime', path: '/animated', icon: Sparkles },
    { label: 'Dramas', path: '/tv-shows?category=drama', icon: MonitorPlay },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#121212]/95 backdrop-blur-md border-t border-white/5 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `
                flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300
                ${isActive ? 'text-white' : 'text-gray-400'}
              `}
            >
              <div
                className={`flex items-center justify-center p-1.5 rounded-full transition-all duration-300
                  ${isActive ? 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-[0_0_15px_rgba(45,212,191,0.3)] scale-110' : ''}
                `}
              >
                <Icon size={isActive ? 20 : 22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'text-white font-bold' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
