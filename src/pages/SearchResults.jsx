import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import Pagination from '../components/Pagination';
import { searchMulti } from '../services/api';
import MovieCard from '../components/movies/MovieCard';
import TvShowCard from '../components/tv/TvShowCard';
import { SkeletonGrid } from '../components/Skeleton';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const keyword = searchParams.get('keyword') || '';

  const loadSearchResults = useCallback(async () => {
    setLoading(true);
    try {
      const data = await searchMulti(keyword, currentPage);
      // Filter to only include movies and tv shows
      const filtered = data.results?.filter(
        (item) => item.media_type === 'movie' || item.media_type === 'tv'
      ) || [];
      setResults(filtered);
      setTotalPages(data.total_pages || 1);
      setTotalResults(data.total_results || 0);
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [keyword, currentPage]);

  useEffect(() => {
    if (keyword.trim()) {
      loadSearchResults();
    }
  }, [keyword, currentPage, loadSearchResults]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <main className="container mx-auto p-4 md:px-8 lg:px-12 pt-36 md:pt-28 min-h-screen">
      <button
        onClick={handleBack}
        className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group w-fit"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Search Results
            </h1>
          </div>
          {keyword && <p className="text-zinc-400 text-lg">for "{keyword}"</p>}
        </div>
        
        {totalResults > 0 && (
          <span className="text-sm font-medium text-white/50 bg-white/5 py-1 px-3 rounded-full w-fit">
            {totalResults.toLocaleString()} items
          </span>
        )}
      </div>

      {loading ? (
        <SkeletonGrid count={12} />
      ) : results.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-12">
            {results.map((item) => (
              item.media_type === 'movie' ? (
                <MovieCard key={item.id} movie={item} />
              ) : (
                <TvShowCard key={item.id} movie={item} />
              )
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : keyword.trim() ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-900/50 rounded-2xl border border-zinc-800">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <Search className="text-zinc-400" size={28} />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No results found for "{keyword}"</h2>
          <p className="text-zinc-400 max-w-sm">
            Try checking your spelling or adjusting your keywords.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-900/50 rounded-2xl border border-zinc-800">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <Search className="text-zinc-400" size={28} />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Start searching</h2>
          <p className="text-zinc-400 max-w-sm">
            Enter a movie or TV show title to get started.
          </p>
        </div>
      )}
    </main>
  );
};

export default SearchResults;