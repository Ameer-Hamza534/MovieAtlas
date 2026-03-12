import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, House, Clapperboard, Tv, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchMovieGenres, fetchTvGenres } from '../services/api';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    movieGenres: true,
    tvGenres: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const [movieData, tvData] = await Promise.all([
          fetchMovieGenres(),
          fetchTvGenres(),
        ]);
        setMovieGenres(movieData.genres || []);
        setTvGenres(tvData.genres || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadGenres();
    }
  }, [isOpen]);

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const handleGenreClick = (genreId, genreName, type) => {
    onClose();
    navigate(`/genres/${type}/${genreId}`, { state: { genreName, type } });
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/25 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col p-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 cursor-pointer"
          >
            <X size={24} />
          </button>
          <h2 className="text-xl font-bold mb-4">Menu</h2>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Main Menu Items */}
            <ul className="space-y-2 mb-6">
              <li>
                <Link to="/" className="block py-2 px-4 hover:bg-gray-700 rounded" onClick={onClose}>
                  <House className="inline mr-2" size={18} />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/movies" className="block py-2 px-4 hover:bg-gray-700 rounded" onClick={onClose}>
                  <Clapperboard className="inline mr-2" size={18} />
                  All Movies
                </Link>
              </li>
              <li>
                <Link to="/tv-shows" className="block py-2 px-4 hover:bg-gray-700 rounded" onClick={onClose}>
                  <Tv className="inline mr-2" size={18} />
                  All TV Shows
                </Link>
              </li>
            </ul>

            {/* Movie Genres Section */}
            <div className="mb-4 border-t border-gray-700 pt-4">
              <button
                onClick={() => toggleSection('movieGenres')}
                className="w-full flex items-center justify-between py-2 px-4 hover:bg-gray-700 rounded font-semibold text-sm"
              >
                <span className="flex items-center">
                  <Clapperboard className="inline mr-2" size={16} />
                  Movie Genres
                </span>
                {expandedSections.movieGenres ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedSections.movieGenres && (
                <ul className="space-y-1 pl-8">
                  {loading ? (
                    <li className="py-1 text-xs text-gray-400">Loading...</li>
                  ) : (
                    movieGenres.map((genre) => (
                      <li key={genre.id}>
                        <button
                          onClick={() => handleGenreClick(genre.id, genre.name, 'movie')}
                          className="block w-full text-left py-1 px-2 text-sm hover:text-blue-400 hover:bg-gray-700 rounded truncate cursor-pointer"
                        >
                          {genre.name}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>

            {/* TV Show Genres Section */}
            <div className="border-t border-gray-700 pt-4">
              <button
                onClick={() => toggleSection('tvGenres')}
                className="w-full flex items-center justify-between py-2 px-4 hover:bg-gray-700 rounded font-semibold text-sm"
              >
                <span className="flex items-center">
                  <Tv className="inline mr-2" size={16} />
                  TV Show Genres
                </span>
                {expandedSections.tvGenres ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedSections.tvGenres && (
                <ul className="space-y-1 pl-8">
                  {loading ? (
                    <li className="py-1 text-xs text-gray-400">Loading...</li>
                  ) : (
                    tvGenres.map((genre) => (
                      <li key={genre.id}>
                        <button
                          onClick={() => handleGenreClick(genre.id, genre.name, 'tv')}
                          className="block w-full text-left py-1 px-2 text-sm hover:text-blue-400 hover:bg-gray-700 rounded truncate cursor-pointer"
                        >
                          {genre.name}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;