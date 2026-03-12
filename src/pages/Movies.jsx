import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BannerSlider from '../components/BannerSlider';
import Pagination from '../components/Pagination';
import {
  fetchMovies,
  fetchNowPlayingMovies,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies
} from '../services/api';
import MovieCard from '../components/movies/MovieCard';
import { SkeletonGrid } from '../components/Skeleton';

const Movies = () => {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const category = searchParams.get('category') || 'popular';

  const getCategoryTitle = (cat) => {
    switch (cat) {
      case 'now-playing': return '🎬 Now Playing Movies';
      case 'popular': return '🔥 Popular Movies';
      case 'top-rated': return '⭐ Top Rated Movies';
      case 'upcoming': return '🚀 Upcoming Movies';
      default: return '🎬 All Movies';
    }
  };

  const getCategoryApi = (cat, page) => {
    switch (cat) {
      case 'now-playing': return fetchNowPlayingMovies(page);
      case 'popular': return fetchPopularMovies(page);
      case 'top-rated': return fetchTopRatedMovies(page);
      case 'upcoming': return fetchUpcomingMovies(page);
      default: return fetchMovies(page);
    }
  };

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const data = await getCategoryApi(category, currentPage);
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [category, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {/* Movies Banner */}
      <section className="mb-8">
        <BannerSlider />
      </section>

      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-white mb-6">{getCategoryTitle(category)}</h1>

        {loading ? (
          <SkeletonGrid count={20} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
              {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>
    </>
  );
};

export default Movies;