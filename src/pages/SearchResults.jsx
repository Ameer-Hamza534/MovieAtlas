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
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <button
        onClick={handleBack}
        className="mb-6 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition mt-15"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Search className="text-gray-400" size={24} />
          <h1 className="text-3xl font-bold text-white">
            Search Results for "{keyword}"
          </h1>
        </div>
        {totalResults > 0 && (
          <p className="text-gray-400">
            Found {totalResults.toLocaleString()} results
          </p>
        )}
      </div>

      {loading ? (
        <SkeletonGrid count={20} />
      ) : results.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
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
        <div className="text-center py-12">
          <Search className="mx-auto text-gray-400 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-white mb-2">No results found</h2>
          <p className="text-gray-400">
            Try adjusting your search to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="mx-auto text-gray-400 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-white mb-2">Start searching</h2>
          <p className="text-gray-400">
            Enter a movie or TV show title to get started.
          </p>
        </div>
      )}
    </main>
  );
};

export default SearchResults;