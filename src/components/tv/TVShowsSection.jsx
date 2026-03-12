import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTvShows } from '../../services/api';
import TvShowCard from '../tv/TvShowCard';
import { SkeletonGrid } from '../Skeleton';

const TVShowsSection = ({ limit = 10 }) => {
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTVShows = async () => {
      setLoading(true);
      try {
        const data = await fetchTvShows();
        setTvShows(data.results.slice(0, limit));
      } catch (error) {
        console.error('Error fetching TV shows:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTVShows();
  }, [limit]);

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">📺 Popular TV Shows</h2>
        <Link
          to="/tv-shows"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Show More
        </Link>
      </div>
      {loading ? (
        <SkeletonGrid count={limit} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {tvShows.map(tvShow => (
            <TvShowCard key={tvShow.id} movie={tvShow} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TVShowsSection;