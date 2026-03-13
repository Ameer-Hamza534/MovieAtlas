import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../../redux/slices/favoritesSlice';
import { Heart } from 'lucide-react';

const TvShowCard = ({ movie }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favorites);
  
  const isFavorite = favorites.some((fav) => fav.id === movie.id);

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFavorite({ id: movie.id }));
    } else {
      // Saving the type as tv to navigate properly from favorites page later
      dispatch(addFavorite({ ...movie, media_type: 'tv' }));
    }
  };

  const handleClick = () => {
    navigate(`/detail/tv/${movie.id}`);
  };

  // Some endpoints return 'first_air_date' instead of 'release_date' for TV shows
  const releaseYear = movie.first_air_date?.slice(0, 4) || movie.release_date?.slice(0, 4) || 'N/A';

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative bg-zinc-900 border border-zinc-800"
    >
      <div className="absolute top-2 left-2 z-10">
        <button 
          onClick={handleToggleFavorite}
          className="p-1.5 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-colors"
        >
          <Heart size={16} className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </button>
      </div>

      <span className="absolute top-2 right-2 z-10 text-white bg-black/60 backdrop-blur-md text-[10px] font-bold py-1 px-2 rounded-full tracking-wider">
        {releaseYear}
      </span>
      
      <div className="relative overflow-hidden aspect-[2/3] w-full">
        <img
          src={poster}
          alt={movie.name || movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-zinc-900 to-transparent opacity-60"></div>
      </div>
      
      <div className="p-3 absolute bottom-0 w-full z-10 bg-zinc-900/40 backdrop-blur-sm border-t border-zinc-800/50 group-hover:bg-zinc-900/80 transition-colors duration-300">
        <h2 className="text-sm font-semibold text-white/90 truncate group-hover:text-white">
          {movie.name || movie.title}
        </h2>
      </div>
    </div>
  );
};

export default TvShowCard;
