import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { searchMulti, fetchTrendingMovies } from '../services/api';

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef(null);
  const dropdownRef = useRef(null);

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setSearchHistory(savedHistory);
  }, []);

  // Load trending movies on mount
  useEffect(() => {
    const loadTrending = async () => {
      try {
        const data = await fetchTrendingMovies();
        setTrendingMovies(data.results?.slice(0, 5) || []);
      } catch (error) {
        console.error('Error fetching trending:', error);
      }
    };
    loadTrending();
  }, []);

  // Handle search input change with debouncing
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (query.trim() === '') {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchMulti(query);
        // Filter to only include movies and tv shows
        const filtered = data.results
          ?.filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
          ?.slice(0, 10) || [];
        setSearchResults(filtered);
        setShowDropdown(true);
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer.current);
  }, [query]);

  // Update URL when query changes
  useEffect(() => {
    if (query.trim()) {
      const url = new URL(window.location);
      url.pathname = '/search';
      url.searchParams.set('keyword', query);
      window.history.replaceState({}, '', url);
    } else if (location.pathname === '/search') {
      const url = new URL(window.location);
      url.searchParams.delete('keyword');
      window.history.replaceState({}, '', url);
    }
  }, [query, location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addToSearchHistory = (item) => {
    const displayName = item.title || item.name;
    let updatedHistory = [displayName, ...searchHistory.filter((h) => h !== displayName)];
    updatedHistory = updatedHistory.slice(0, 8); // Keep last 8 searches
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const removeFromHistory = (item) => {
    const updatedHistory = searchHistory.filter((h) => h !== item);
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const handleResultClick = (item) => {
    const itemTitle = item.title || item.name;
    addToSearchHistory(item);
    setQuery(itemTitle);
    navigate(`/search?keyword=${encodeURIComponent(itemTitle)}`);
    setShowDropdown(false);
  };

  const handleHistoryClick = (searchTerm) => {
    setQuery(searchTerm);
    navigate(`/search?keyword=${encodeURIComponent(searchTerm)}`);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      <div className="p-0 flex gap-3 items-center bg-[#fff3] rounded-md px-4 py-2">
        <Search className="text-gray-400" size={20} />
        <input
          className="w-full bg-transparent border-none focus:outline-none text-white placeholder-gray-400"
          type="text"
          placeholder="Search movies/TV shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              navigate(`/search?keyword=${encodeURIComponent(query)}`);
              setShowDropdown(false);
            }
          }}
          onFocus={() => {
            if (query.trim() === '' || searchResults.length > 0) {
              setShowDropdown(true);
            }
          }}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSearchResults([]);
              setShowDropdown(false);
            }}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto border border-gray-700">
          {query.trim() === '' ? (
            <>
              {/* Search History */}
              {searchHistory.length > 0 && (
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-white font-semibold text-sm mb-3">Search History</h3>
                  <div className="space-y-2 flex flex-wrap gap-2">
                    {searchHistory.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-700 px-3 py-2 rounded hover:bg-gray-600 transition group relative m-0"
                      >
                        <button
                          onClick={() => handleHistoryClick(item)}
                          className="flex items-center gap-2 text-white text-[12px] flex-1 text-left"
                        >
                          <Search size={14} className="text-gray-400" />
                          {item}
                        </button>
                        <button
                          onClick={() => removeFromHistory(item)}
                          className=" bg-red-600 p-0.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition absolute -right-2 -top-0.5 -translate-y-1/2 cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending/Everyone's searching */}
              {trendingMovies.length > 0 && (
                <div className="p-4">
                  <h3 className="text-white font-semibold text-sm mb-3">Everyone's searching</h3>
                  <div className="space-y-2">
                    {trendingMovies.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleResultClick(item)}
                        className="flex items-center gap-2 text-gray-300 hover:text-white text-sm w-full text-left px-2 py-1 rounded hover:bg-gray-700 transition"
                      >
                        <Search size={14} />
                        {item.title || item.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {loading ? (
                <div className="p-4 text-center">
                  <p className="text-gray-400 text-sm">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-2">
                  {searchResults.map((item) => (
                    <button
                      key={`${item.media_type}-${item.id}`}
                      onClick={() => handleResultClick(item)}
                      className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-700 rounded transition text-left"
                    >
                      <Search size={16} className="text-gray-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{item.title || item.name}</p>
                        <p className="text-gray-400 text-xs">
                          {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-gray-400 text-sm">No results found</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;