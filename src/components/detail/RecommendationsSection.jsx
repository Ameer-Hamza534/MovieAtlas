import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMovieRecommendations, fetchTvShowRecommendations } from '../../services/api';
import { SkeletonGrid } from '../Skeleton';

const RecommendationsSection = ({ id, type }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      try {
        let data;
        if (type === 'movie') {
          data = await fetchMovieRecommendations(id);
        } else {
          data = await fetchTvShowRecommendations(id);
        }
        setRecommendations(data.results.slice(0, 10));
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRecommendations();
  }, [id, type]);

  if (loading) {
    return (
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Recommendations</h2>
        <SkeletonGrid count={10} />
      </section>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Recommendations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {recommendations.map(item => {
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

export default RecommendationsSection;