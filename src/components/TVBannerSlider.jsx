import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Star } from "lucide-react";
import { fetchTvShows } from "../services/api";
import { SkeletonBanner } from "./Skeleton";

// slick-carousel styles required for proper rendering
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TVBannerSlider = () => {
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchTvShows();
        setTvShows(data.results.slice(0, 8));
      } catch (err) {
        console.error("failed to load banner TV shows", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <SkeletonBanner />;
  }

  if (tvShows.length === 0) return null;

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

  return (
    <div className="relative w-full mb-0 h-[70vh] md:h-[85vh] lg:h-[90vh]">
      <Slider {...settings} className="h-full w-full [&_.slick-list]:h-full [&_.slick-track]:h-full">
        {tvShows.map((tvShow) => {
          const poster = tvShow.backdrop_path
            ? `https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`
            : tvShow.poster_path ? `https://image.tmdb.org/t/p/original${tvShow.poster_path}` : "https://via.placeholder.com/800x450?text=No+Image";

          return (
            <div key={tvShow.id} className="relative h-[70vh] md:h-[85vh] lg:h-[90vh] w-full group focus:outline-none">
              <img
                src={poster}
                alt={tvShow.title || tvShow.name}
                className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
              />
              
              {/* Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent"></div>
              <div className="absolute inset-y-0 left-0 w-full md:w-2/3 lg:w-1/2 bg-gradient-to-r from-zinc-950 to-transparent"></div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full md:w-2/3 lg:w-1/2 p-6 md:p-12 lg:p-16 z-10 text-white flex flex-col gap-3 md:gap-4 pb-16 md:pb-32 pt-28 md:pt-0">
                <div className="flex items-center gap-3">
                  <span className="bg-purple-600 font-bold px-2 py-0.5 rounded text-[10px] md:text-xs tracking-wider uppercase">Hot</span>
                  <span className="flex items-center gap-1.5 text-yellow-500 font-semibold bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-xs md:text-sm border border-white/10">
                    <Star size={14} className="fill-yellow-500" />
                    {tvShow.vote_average?.toFixed(1) || '0.0'}
                  </span>
                </div>
                
                <h1 className="text-lg md:text-5xl lg:text-7xl font-black tracking-tight drop-shadow-lg leading-tight line-clamp-2">
                  {tvShow.title || tvShow.name}
                </h1>
                
                {tvShow.overview && (
                  <p className="text-zinc-300 text-xs md:text-base leading-relaxed line-clamp-2 md:line-clamp-3 max-w-xl md:mt-2 opacity-90">
                    {tvShow.overview}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 md:mt-4 text-zinc-400 font-medium text-[10px] md:text-sm uppercase tracking-widest">
                  <span>{tvShow.original_language || 'EN'}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 hidden sm:block"></span>
                  <span>{tvShow.first_air_date?.slice(0, 4) || 'N/A'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default TVBannerSlider;