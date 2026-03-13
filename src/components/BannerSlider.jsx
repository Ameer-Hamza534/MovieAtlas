import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchMovies } from "../services/api";
import { SkeletonBanner } from "./Skeleton";
import { getBackdropImage } from "../utils/imageUtils";

// slick-carousel styles required for proper rendering
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

const BannerSlider = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchMovies();
        setMovies(data.results?.slice(0, 8) || []);
      } catch (err) {
        console.error("failed to load banner movies", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <SkeletonBanner />;
  }

  if (movies.length === 0) return null;

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
    arrows: false,
  };

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    sliderRef.current?.slickPrev();
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    sliderRef.current?.slickNext();
  };

  return (
    <div className="relative w-full mb-0 h-[70vh] md:h-[85vh] lg:h-[90vh] group/banner">
      <Slider ref={sliderRef} {...settings} className="h-full w-full [&_.slick-list]:h-full [&_.slick-track]:h-full">
        {movies.map((movie) => {
          const poster = getBackdropImage(movie.backdrop_path || movie.poster_path);
          const title = movie.title || movie.name || 'Untitled';

          return (
            <Link 
              to={`/detail/movie/${movie.id}`} 
              key={movie.id} 
              aria-label={`View details for ${title}`}
              className="relative h-[70vh] md:h-[85vh] lg:h-[90vh] w-full group focus:outline-none block"
            >
              <img
                src={poster}
                alt={title}
                className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
              />
              
              {/* Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent"></div>
              <div className="absolute inset-y-0 left-0 w-full md:w-2/3 lg:w-1/2 bg-gradient-to-r from-zinc-950 to-transparent"></div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full md:w-2/3 lg:w-1/2 p-6 md:p-12 lg:p-16 z-10 text-white flex flex-col gap-3 md:gap-4 pb-16 md:pb-32 pt-28 md:pt-0">
                <div className="flex items-center gap-3">
                  <span className="bg-red-600 font-bold px-2 py-0.5 rounded text-[10px] md:text-xs tracking-wider uppercase">Hot</span>
                  <span className="flex items-center gap-1.5 text-yellow-500 font-semibold bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-xs md:text-sm border border-white/10">
                    <Star size={14} className="fill-yellow-500" />
                    {movie.vote_average?.toFixed(1) || '0.0'}
                  </span>
                </div>
                
                <h1 className="text-lg md:text-5xl lg:text-7xl font-black tracking-tight drop-shadow-lg leading-tight line-clamp-2">
                  {title}
                </h1>
                
                {movie.overview && (
                  <p className="text-zinc-300 text-xs md:text-base leading-relaxed line-clamp-2 md:line-clamp-3 max-w-xl md:mt-2 opacity-90">
                    {movie.overview}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 md:mt-4 text-zinc-400 font-medium text-[10px] md:text-sm uppercase tracking-widest">
                  <span>{movie.original_language || 'EN'}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 hidden sm:block"></span>
                  <span>{movie.release_date?.slice(0, 4) || 'N/A'}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </Slider>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        aria-label="Previous slide"
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20
                   w-10 h-10 md:w-13 md:h-13 rounded-full
                   flex items-center justify-center
                   bg-black/30 backdrop-blur-md border border-white/10
                   text-white/70 hover:text-white hover:bg-white/20 hover:border-white/25
                   opacity-0 group-hover/banner:opacity-100
                   transition-all duration-300 ease-out
                   hover:scale-110 active:scale-95
                   cursor-pointer shadow-lg shadow-black/30 hidden sm:flex"
      >
        <ChevronLeft size={22} strokeWidth={2.5} />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next slide"
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20
                   w-10 h-10 md:w-13 md:h-13 rounded-full
                   flex items-center justify-center
                   bg-black/30 backdrop-blur-md border border-white/10
                   text-white/70 hover:text-white hover:bg-white/20 hover:border-white/25
                   opacity-0 group-hover/banner:opacity-100
                   transition-all duration-300 ease-out
                   hover:scale-110 active:scale-95
                   cursor-pointer shadow-lg shadow-black/30 hidden sm:flex"
      >
        <ChevronRight size={22} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default BannerSlider;

