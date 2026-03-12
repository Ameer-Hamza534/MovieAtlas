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
    <div className="relative w-full mb-8">
      <Slider {...settings} className="h-120">
        {tvShows.map((tvShow) => {
          const poster = tvShow.poster_path
            ? `https://image.tmdb.org/t/p/original${tvShow.poster_path}`
            : "https://via.placeholder.com/800x450?text=No+Image";

          return (
            <div key={tvShow.id} className="relative h-120">
              <img
                src={poster}
                alt={tvShow.title || tvShow.name}
                className="w-full h-120 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-opacity-50 z-10 text-white whitespace-nowrap flex flex-col gap-3 ">
                <h1 className="text-5xl font-bold">
                  {tvShow.title || tvShow.name}
                </h1>
                <div className="flex gap-2.5">
                  <span className="uppercase">{tvShow.original_language}</span>
                  <span className="border-l"></span>
                  <span>{tvShow.first_air_date?.slice(0, 4) || 'N/A'}</span>
                  <span className="border-l"></span>
                  <span className="flex items-center gap-1.5"><Star size={18} />{tvShow.vote_average.toFixed(1)}</span>
                </div>
              </div>
              <div className="mask"></div>
              <div className="mask2"></div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default TVBannerSlider;