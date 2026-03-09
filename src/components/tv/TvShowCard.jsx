import React from 'react';

const TvShowCard = ({ movie, onSelect }) => {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <div
      onClick={() => onSelect(movie)}
      className="cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow relative"
    >
        <span className='absolute top-2 right-2 text-white bg-zinc-800 text-xs font-bold py-1 px-2 rounded-full'>{movie.release_date?.slice(0, 4) || 'N/A'}</span>
      <img
        src={poster}
        alt={movie.title || movie.name}
        className="w-full h-72 object-cover bg-no-repeat bg-center"
      />
      <div className="p-2 flex justify-between items-center bg-zinc-800">
        <h2 className="text-[14px] font-semibold text-white truncate max-w-full">
          {movie.title || movie.name}
        </h2>
      </div>
    </div>
  );
};

export default TvShowCard;
