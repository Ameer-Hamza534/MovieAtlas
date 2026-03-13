import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MovieCard from '../components/movies/MovieCard';
import TvShowCard from '../components/tv/TvShowCard';

const Favorites = () => {
  const favorites = useSelector((state) => state.favorites.favorites);

  return (
    <main className="container mx-auto p-4 md:px-8 lg:px-12 pt-24 min-h-screen">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Your Favorites</h1>
          <p className="text-zinc-400">Movies and TV Shows you've liked.</p>
        </div>
        <span className="text-sm font-medium text-white/50 bg-white/5 py-1 px-3 rounded-full">
          {favorites.length} items
        </span>
      </div>
      
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-900/50 rounded-2xl border border-zinc-800">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">💔</span>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No favorites yet</h2>
          <p className="text-zinc-400 max-w-sm mb-6">Start exploring movies and TV shows and click the heart icon to add them to your collection.</p>
          <Link to="/" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
            Discover Titles
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {favorites.map((item) => (
            item.media_type === 'tv' ? (
              <TvShowCard key={item.id} movie={item} />
            ) : (
              <MovieCard key={item.id} movie={item} />
            )
          ))}
        </div>
      )}
    </main>
  );
};

export default Favorites;