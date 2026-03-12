import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import { fetchMovieDetail, fetchTvShowDetail } from '../services/api';
import VideoPlayer from '../components/detail/VideoPlayer';
import CreditsSection from '../components/detail/CreditsSection';
import RecommendationsSection from '../components/detail/RecommendationsSection';
import SimilarSection from '../components/detail/SimilarSection';
import ReviewsSection from '../components/detail/ReviewsSection';
import { SkeletonDetail } from '../components/Skeleton';

const Detail = ({ onHeaderVisibilityChange }) => {
  const { id, type } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      try {
        let data;
        if (type === 'movie') {
          data = await fetchMovieDetail(id);
        } else {
          data = await fetchTvShowDetail(id);
        }
        setDetail(data);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id, type]);

  if (loading) {
    return (
      <main className="text-white">
        <SkeletonDetail className="container mx-auto px-4 relative -mt-32 z-10" />
      </main>
    );
  }

  if (!detail) {
    return (
      <main className="container mx-auto p-4">
        <p className="text-white text-center">No details found.</p>
      </main>
    );
  }

  const posterPath = detail.poster_path
    ? `https://image.tmdb.org/t/p/w500${detail.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  const backdropPath = detail.backdrop_path
    ? `https://image.tmdb.org/t/p/original${detail.backdrop_path}`
    : 'https://via.placeholder.com/1200x400?text=No+Image';

  return (
    <main className="text-white">
      {/* Backdrop */}
      <div className="relative w-full h-96">
        <img
          src={backdropPath}
          alt={detail.title || detail.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
      </div>

      {/* Details */}
      <div className="container mx-auto px-4 relative -mt-32 z-10">
        <div className="flex gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <img
              src={posterPath}
              alt={detail.title || detail.name}
              className="w-48 h-72 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">
              {detail.title || detail.name}
            </h1>

            {/* Meta Info */}
            <div className="flex gap-4 mb-6 text-gray-300">
              {detail.release_date && (
                <span>{detail.release_date?.slice(0, 4) || detail.first_air_date?.slice(0, 4)}</span>
              )}
              {detail.runtime && (
                <span>{detail.runtime} min</span>
              )}
              {detail.episode_run_time?.length > 0 && (
                <span>~{detail.episode_run_time[0]} min/ep</span>
              )}
              <span className="flex items-center gap-2">
                <Star size={18} className="text-yellow-400" />
                {detail.vote_average.toFixed(1)}/10
              </span>
            </div>

            {/* Genres */}
            {detail.genres?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Genres</h3>
                <div className="flex gap-2 flex-wrap">
                  {detail.genres.map(genre => (
                    <span
                      key={genre.id}
                      className="bg-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Watch Button */}
            <div className="mb-6">
              <VideoPlayer id={id} type={type} title={detail.title || detail.name} onHeaderVisibilityChange={onHeaderVisibilityChange} />
            </div>

            {/* Overview */}
            {detail.overview && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Overview</h3>
                <p className="text-gray-300 leading-relaxed">
                  {detail.overview}
                </p>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4">
              {detail.original_language && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-400">Language</h4>
                  <p className="uppercase">{detail.original_language}</p>
                </div>
              )}
              {detail.budget && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-400">Budget</h4>
                  <p>${(detail.budget / 1000000).toFixed(1)}M</p>
                </div>
              )}
              {detail.revenue && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-400">Revenue</h4>
                  <p>${(detail.revenue / 1000000).toFixed(1)}M</p>
                </div>
              )}
              {detail.number_of_seasons && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-400">Seasons</h4>
                  <p>{detail.number_of_seasons}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Credits */}
        <CreditsSection id={id} type={type} />

        {/* Reviews */}
        <ReviewsSection id={id} type={type} />

        {/* Recommendations */}
        <RecommendationsSection id={id} type={type} />

        {/* Similar */}
        <SimilarSection id={id} type={type} />
      </div>
    </main>
  );
};

export default Detail;