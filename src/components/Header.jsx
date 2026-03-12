import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import logo from "../assets/logo.svg";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

const Header = ({ onMenuClick }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        `fixed top-0 left-0 right-0 z-50 p-4 transition-all duration-300 ` +
        (scrolled
          ? "bg-gray-900 text-white border-b border-gray-700"
          : "bg-transparent text-white border-b border-transparent")
      }
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="text-white hover:text-gray-300 cursor-pointer">
            <Menu />
          </button>
          <Link to="/" className="text-2xl font-bold flex items-center gap-1">
            <img src={logo} alt="MovieBox" className="h-10 mr-2" /> MovieBox
          </Link>
        </div>
        <SearchBar />
      </div>
    </header>
  );
};

export default Header;
