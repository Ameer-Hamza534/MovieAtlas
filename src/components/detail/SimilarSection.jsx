import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSimilarMovies, fetchSimilarTvShows } from '../../services/api';
import { SkeletonGrid } from '../Skeleton';

const SimilarSection = ({ id, type }) => {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSimilar = async () => {
      setLoading(true);
      try {
        let data;
        if (type === 'movie') {
          data = await fetchSimilarMovies(id);
        } else {
          data = await fetchSimilarTvShows(id);
        }
        setSimilar(data.results.slice(0, 10));
      } catch (error) {
        console.error('Error fetching similar:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSimilar();
  }, [id, type]);

  if (loading) {
    return (
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Similar {type === 'movie' ? 'Movies' : 'TV Shows'}</h2>
        <SkeletonGrid count={10} />
      </section>
    );
  }

  if (similar.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Similar {type === 'movie' ? 'Movies' : 'TV Shows'}</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scroll-bar [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {similar.map(item => {
          const poster = item.poster_path
            ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
            : 'https://via.placeholder.com/300x450?text=No+Image';

          return (
            <div
              key={item.id}
              onClick={() => navigate(`/detail/${type}/${item.id}`)}
              className="cursor-pointer group relative rounded-xl overflow-hidden shrink-0 w-[140px] sm:w-[160px] snap-start border border-zinc-800 bg-zinc-900"
            >
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src={poster}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80"></div>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-3 bg-zinc-900/40 backdrop-blur-sm border-t border-zinc-800/50 group-hover:bg-zinc-900/80 transition-colors">
                <p className="text-xs font-semibold text-white truncate">
                  {item.title || item.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SimilarSection;