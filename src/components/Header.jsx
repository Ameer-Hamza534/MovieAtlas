import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import logo from "../assets/logo.svg";
import { Menu, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

const Header = ({ onMenuClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const favorites = useSelector((state) => state.favorites.favorites);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/60 backdrop-blur-md border-b border-white/10 py-3 shadow-lg"
          : "bg-gradient-to-b from-black/80 to-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={onMenuClick} 
              className="text-white hover:text-red-500 transition-colors cursor-pointer p-2 rounded-full hover:bg-white/5"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="text-2xl font-bold flex items-center gap-2 group">
              <img src={logo} alt="MovieAtlas" className="h-8 transition-transform group-hover:scale-110" /> 
              <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-300">
                MovieAtlas
              </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4 flex-1 justify-end">
            <div className="hidden md:block flex-1 max-w-sm ml-4">
              <SearchBar />
            </div>
            
            <Link 
              to="/favorites" 
              className="relative p-2 text-white hover:text-red-500 transition-colors rounded-full hover:bg-white/5"
              aria-label="Favorites"
            >
              <Heart size={24} />
              {favorites.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full transform translate-x-1/4 -translate-y-1/4">
                  {favorites.length}
                </span>
              )}
            </Link>
            
            {/* Mobile search is within the sidebar or a separate toggle usually, we'll keep it simple here */}
            <div className="md:hidden">
               <SearchBar />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
