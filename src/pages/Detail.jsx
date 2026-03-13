import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieDetail, fetchTvShowDetail } from '../services/api';
import { addFavorite, removeFavorite } from '../redux/slices/favoritesSlice';
import VideoPlayer from '../components/detail/VideoPlayer';
import CreditsSection from '../components/detail/CreditsSection';
import RecommendationsSection from '../components/detail/RecommendationsSection';
import SimilarSection from '../components/detail/SimilarSection';
import ReviewsSection from '../components/detail/ReviewsSection';
import { SkeletonDetail } from '../components/Skeleton';

const Detail = ({ onHeaderVisibilityChange }) => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const favorites = useSelector((state) => state.favorites.favorites);
  const isFavorite = favorites.some((fav) => fav.id === parseInt(id));

  useEffect(() => {
    // Scroll to top on id change
    window.scrollTo(0, 0);

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

  const handleToggleFavorite = () => {
    if (!detail) return;
    
    if (isFavorite) {
      dispatch(removeFavorite({ id: detail.id }));
    } else {
      dispatch(addFavorite({ ...detail, media_type: type }));
    }
  };

  if (loading) {
    return (
      <main className="text-white min-h-screen pt-20">
        <SkeletonDetail className="container mx-auto px-4" />
      </main>
    );
  }

  if (!detail) {
    return (
      <main className="container mx-auto p-4 min-h-screen pt-24 text-center">
        <p className="text-zinc-400 text-xl">No details found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-red-500 hover:text-red-400">
          Go Back
        </button>
      </main>
    );
  }

  const posterPath = detail.poster_path
    ? `https://image.tmdb.org/t/p/w500${detail.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  const backdropPath = detail.backdrop_path
    ? `https://image.tmdb.org/t/p/original${detail.backdrop_path}`
    : 'https://via.placeholder.com/1200x400?text=No+Image';

  // Format currency
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <main className="text-white min-h-screen pb-20 bg-zinc-950">
      {/* Back Button overlay */}
      <button 
        onClick={() => {
          onHeaderVisibilityChange(true);
          navigate(-1);
        }}
        className="absolute top-6 left-6 z-50 p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Backdrop */}
      <div className="relative w-full h-[50vh] md:h-[65vh] lg:h-[75vh]">
        <img
          src={backdropPath}
          alt={detail.title || detail.name}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-zinc-950"></div>
      </div>

      {/* Details */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative -mt-32 md:-mt-48 z-10">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-16">
          {/* Poster */}
          <div className="shrink-0 mx-auto md:mx-0 -mt-16 md:mt-0 relative group">
            <img
              src={posterPath}
              alt={detail.title || detail.name}
              className="w-48 md:w-64 lg:w-80 h-auto object-cover rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-zinc-800"
            />
          </div>

          {/* Info */}
          <div className="flex-1 mt-4 md:mt-16 lg:mt-24">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight shadow-black drop-shadow-lg text-white">
              {detail.title || detail.name}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 text-zinc-300 text-sm md:text-base font-medium">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="text-white">{detail.vote_average?.toFixed(1)}</span>
                <span className="text-white/50 text-xs">({detail.vote_count})</span>
              </span>
              
              {detail.release_date && (
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">{detail.release_date.slice(0, 4)}</span>
              )}
              {detail.first_air_date && (
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">{detail.first_air_date.slice(0, 4)}</span>
              )}
              
              {detail.runtime > 0 && (
                <span className="px-2">{Math.floor(detail.runtime / 60)}h {detail.runtime % 60}m</span>
              )}
              {detail.episode_run_time?.length > 0 && (
                <span className="px-2">~{detail.episode_run_time[0]}m / ep</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <VideoPlayer id={id} type={type} title={detail.title || detail.name} onHeaderVisibilityChange={onHeaderVisibilityChange} />
              
              <button 
                onClick={handleToggleFavorite}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border ${
                  isFavorite 
                    ? 'bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20' 
                    : 'bg-zinc-800/80 text-white border-zinc-700 hover:bg-zinc-700'
                }`}
              >
                <Heart size={20} className={isFavorite ? 'fill-red-500' : ''} />
                {isFavorite ? 'Saved' : 'Save'}
              </button>
            </div>

            {/* Genres */}
            {detail.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {detail.genres.map(genre => (
                  <span
                    key={genre.id}
                    className="bg-zinc-800/80 text-zinc-300 border border-zinc-700/50 px-4 py-1.5 rounded-full text-sm hover:text-white hover:bg-zinc-700 transition-colors cursor-default"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            {detail.overview && (
              <div className="mb-8">
                <p className="text-zinc-300 leading-relaxed text-lg max-w-4xl">
                  {detail.overview}
                </p>
              </div>
            )}

            {/* Additional Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
              {detail.original_language && (
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500 mb-1">Language</h4>
                  <p className="text-white font-medium uppercase">{detail.original_language}</p>
                </div>
              )}
              {detail.budget > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500 mb-1">Budget</h4>
                  <p className="text-white font-medium">{formatCurrency(detail.budget)}</p>
                </div>
              )}
              {detail.revenue > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500 mb-1">Revenue</h4>
                  <p className="text-white font-medium">{formatCurrency(detail.revenue)}</p>
                </div>
              )}
              {detail.number_of_seasons && (
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500 mb-1">Seasons / Episodes</h4>
                  <p className="text-white font-medium">{detail.number_of_seasons} / {detail.number_of_episodes}</p>
                </div>
              )}
              {detail.status && (
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500 mb-1">Status</h4>
                  <p className="text-white font-medium">{detail.status}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-16">
          {/* Credits */}
          <section>
            <CreditsSection id={id} type={type} />
          </section>

          {/* Recommendations & Similar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section>
              <RecommendationsSection id={id} type={type} />
            </section>
            <section>
              <SimilarSection id={id} type={type} />
            </section>
          </div>

          {/* Reviews */}
          <section>
            <ReviewsSection id={id} type={type} />
          </section>
        </div>
      </div>
    </main>
  );
};

export default Detail;