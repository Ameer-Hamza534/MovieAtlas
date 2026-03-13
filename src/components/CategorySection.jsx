import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategoryContent } from '../services/api';
import categories from '../data/categories';
import { Filter } from 'lucide-react';

const CategorySection = () => {
  const [backdrops, setBackdrops] = useState({});

  useEffect(() => {
    // Fetch one popular item per category to use its backdrop as card background
    const loadBackdrops = async () => {
      const results = {};
      await Promise.allSettled(
        categories.map(async (cat) => {
          try {
            const data = await fetchCategoryContent(cat.lang, cat.type, 1, cat.genre || null);
            // Pick a result that has a backdrop_path
            const item = data.results?.find(r => r.backdrop_path) || data.results?.[0];
            if (item?.backdrop_path) {
              results[cat.slug] = `https://image.tmdb.org/t/p/w780${item.backdrop_path}`;
            }
          } catch {
            // silently skip
          }
        })
      );
      setBackdrops(results);
    };
    loadBackdrops();
  }, []);

  return (
    <div className="mb-10">
      <h2 className="text-lg md:text-xl font-bold text-white tracking-tight mb-5 flex items-center gap-2">
        <span className="text-cyan-400">⬡</span> Categories
      </h2>

      <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scroll-bar [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* All Category */}
        <Link
          to="/movies"
          className="relative shrink-0 w-36 sm:w-40 md:w-48 h-20 sm:h-22 md:h-24 rounded-xl overflow-hidden snap-start
                     border border-zinc-700/50 bg-zinc-800/80
                     group cursor-pointer flex items-center justify-between px-4
                     transition-all duration-300 hover:scale-105 hover:bg-zinc-700"
        >
          <span className="text-white font-bold text-sm md:text-base tracking-wide z-10">All</span>
          <Filter size={20} className="text-zinc-400 group-hover:text-white transition-colors z-10" />
        </Link>

        {categories.map((cat) => (
          <Link
            to={`/category/${cat.slug}`}
            key={cat.slug}
            className={`relative shrink-0 w-36 sm:w-40 md:w-48 h-20 sm:h-22 md:h-24 rounded-xl overflow-hidden snap-start
                        border ${cat.border}
                        group cursor-pointer
                        transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-black/40`}
          >
            {/* Backdrop Image */}
            {backdrops[cat.slug] && (
              <img
                src={backdrops[cat.slug]}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            )}

            {/* Colored Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${cat.gradient} opacity-80 transition-opacity duration-300 group-hover:opacity-95`}></div>

            {/* Subtle dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>

            {/* Category Name */}
            <div className="relative z-10 h-full flex items-center px-4">
              <span className="text-white font-bold text-sm md:text-base drop-shadow-lg tracking-wide">
                {cat.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
