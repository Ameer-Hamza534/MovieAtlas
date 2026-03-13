import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchHindiDubMovies } from '../services/api';
import MovieCard from '../components/movies/MovieCard';
import { SkeletonGrid } from '../components/Skeleton';

const HindiDubMovies = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const observer = useRef();

  // Intersection Observer callback for infinite scroll
  const lastMovieElementRef = useCallback(node => {
    if (isFetching || loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && currentPage < totalPages) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isFetching, loading, currentPage, totalPages]);

  useEffect(() => {
    const loadMovies = async () => {
      setIsFetching(true);
      try {
        const data = await fetchHindiDubMovies(currentPage);
        setMovies(prev => {
          const newMoviesMap = new Map((currentPage === 1 ? data.results : [...prev, ...data.results]).map(m => [m.id, m]));
          return Array.from(newMoviesMap.values());
        });
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error('Error fetching Hindi dub movies:', error);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };
    loadMovies();
  }, [currentPage]);

  return (
    <main className="container mx-auto p-4 md:px-8 lg:px-12 pt-36 md:pt-24 mb-20 relative z-10">
      <div className="flex items-end justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          🎬 Hindi DUB Movies
        </h1>
      </div>

      {loading && currentPage === 1 ? (
        <SkeletonGrid count={12} />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-12">
            {movies.map((movie, index) => {
              if (movies.length === index + 1) {
                return (
                  <div ref={lastMovieElementRef} key={movie.id}>
                    <MovieCard movie={movie} />
                  </div>
                );
              } else {
                return <MovieCard key={movie.id} movie={movie} />;
              }
            })}
          </div>

          {isFetching && currentPage > 1 && (
            <div className="my-8">
              <SkeletonGrid count={6} />
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default HindiDubMovies;
