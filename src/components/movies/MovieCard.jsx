import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie, upcoming }) => {
  const navigate = useNavigate();
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  const formatReleaseDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    return `${year} ${month}`;
  };

  const handleClick = () => {
    navigate(`/detail/movie/${movie.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow relative"
    >
        <span className='absolute top-2 right-2 text-white bg-zinc-800 text-xs font-bold py-1 px-2 rounded-full'>{ upcoming ? formatReleaseDate(movie.release_date) : movie.release_date?.slice(0, 4) || 'N/A'}</span>
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

export default MovieCard;
