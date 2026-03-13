import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPopularMovies } from '../../services/api';
import MovieCard from './MovieCard';
import { SkeletonGrid } from '../Skeleton';
import { ChevronRight  } from 'lucide-react';

const PopularMoviesSection = ({ limit = 10 }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const data = await fetchPopularMovies();
        setMovies(data.results.slice(0, limit));
      } catch (error) {
        console.error('Error fetching popular movies:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [limit]);

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-white tracking-tight">🔥 Popular Movies</h2>
        <Link
          to="/movies?category=popular"
          className="text-gray-300 p-2 flex items-center gap-1 hover:text-white transition-colors"
        >
          More
          <ChevronRight size={20} />  
        </Link>
        
      </div>
      {loading ? (
        <SkeletonGrid count={limit} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularMoviesSection;