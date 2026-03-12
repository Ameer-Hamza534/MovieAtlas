import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchUpcomingMovies } from '../../services/api';
import MovieCard from './MovieCard';
import { SkeletonGrid } from '../Skeleton';

const UpcomingSection = ({ limit = 10 }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const data = await fetchUpcomingMovies();
        setMovies(data.results.slice(0, limit));
      } catch (error) {
        console.error('Error fetching upcoming movies:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [limit]);

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">🚀 Upcoming</h2>
        <Link
          to="/movies?category=upcoming"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Show More
        </Link>
      </div>
      {loading ? (
        <SkeletonGrid count={limit} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} upcoming={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingSection;