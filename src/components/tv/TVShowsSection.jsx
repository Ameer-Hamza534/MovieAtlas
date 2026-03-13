import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTvShows } from '../../services/api';
import TvShowCard from '../tv/TvShowCard';
import { SkeletonGrid } from '../Skeleton';
import { ChevronRight } from 'lucide-react';

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
    <div className="mb-12 relative">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span className="text-purple-500">📺</span> Popular TV Shows
        </h2>
        <Link
          to="/tv-shows"
          className="text-zinc-400 text-sm font-medium flex items-center gap-1 hover:text-white transition-colors group"
        >
          Explore All
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {loading ? (
        <SkeletonGrid count={5} />
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory hide-scroll-bar [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tvShows.map(tvShow => (
            <div key={tvShow.id} className="w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] md:w-[calc(25%-18px)] lg:w-[calc(20%-19.2px)] xl:w-[calc(16.666%-20px)] snap-start shrink-0">
              <TvShowCard movie={tvShow} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TVShowsSection;