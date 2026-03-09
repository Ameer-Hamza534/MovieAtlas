import React from 'react';

const MovieDetail = ({ movie, onClose }) => {
  if (!movie) return null;

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-auto max-w-lg w-full p-6 relative max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 text-2xl font-bold"
        >
          &times;
        </button>
        <div className="flex flex-col md:flex-row">
          <img
            src={poster}
            alt={movie.title || movie.name}
            className="w-full md:w-1/3 h-auto object-cover rounded"
          />
          <div className="mt-4 md:mt-0 md:ml-6">
            <h2 className="text-2xl font-bold mb-2">{movie.title || movie.name}</h2>
            {movie.release_date && (
              <p className="text-gray-700 mb-1">
                <strong>Release:</strong> {movie.release_date}
              </p>
            )}
            {movie.genres && movie.genres.length > 0 && (
              <p className="text-gray-700 mb-1">
                {movie.genres.map((g) => g.name).join(', ')}
              </p>
            )}
            {movie.vote_average && (
              <p className="text-gray-700 mb-1">
                <strong>Rating:</strong> {movie.vote_average}/10
              </p>
            )}
            {movie.overview && <p className="text-gray-700 mt-2">{movie.overview}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
