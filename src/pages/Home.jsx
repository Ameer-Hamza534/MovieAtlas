import React from 'react';
import BannerSlider from '../components/BannerSlider';
import TVBannerSlider from '../components/TVBannerSlider';
import MoviesSection from '../components/movies/MoviesSection';
import NowPlayingSection from '../components/movies/NowPlayingSection';
import PopularMoviesSection from '../components/movies/PopularMoviesSection';
import TopRatedSection from '../components/movies/TopRatedSection';
import UpcomingSection from '../components/movies/UpcomingSection';
import HindiDubSection from '../components/movies/HindiDubSection';
import AnimatedSection from '../components/movies/AnimatedSection';
import CategorySection from '../components/CategorySection';
import TVShowsSection from '../components/tv/TVShowsSection';

const Home = () => {
  return (
    <div className="bg-zinc-950 min-h-screen">
      {/* Movies Banner */}
      <section className="mb-0">
        <BannerSlider />
      </section>

      {/* Movies Sections */}
      <main className="container mx-auto p-4 md:px-8 lg:px-12 relative z-20 space-y-8">
        <CategorySection />
        <MoviesSection limit={10} />
        <NowPlayingSection limit={10} />
        <TopRatedSection limit={10} />
        <UpcomingSection limit={10} />
        <HindiDubSection limit={10} />
        <AnimatedSection limit={10} />
        
        {/* TV Shows Section */}
        <div className="pt-8 mb-16">
          <TVShowsSection limit={10} />
        </div>
      </main>
    </div>
  );
};

export default Home;