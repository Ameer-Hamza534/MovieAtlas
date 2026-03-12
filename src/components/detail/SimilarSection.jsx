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
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Similar {type === 'movie' ? 'Movies' : 'TV Shows'}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {similar.map(item => {
          const poster = item.poster_path
            ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
            : 'https://via.placeholder.com/300x450?text=No+Image';

          return (
            <div
              key={item.id}
              onClick={() => navigate(`/detail/${type}/${item.id}`)}
              className="cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <img
                src={poster}
                alt={item.title || item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-2 bg-gray-800">
                <p className="text-sm font-semibold text-white truncate">
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