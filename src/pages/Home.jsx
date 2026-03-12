import React from 'react';
import BannerSlider from '../components/BannerSlider';
import TVBannerSlider from '../components/TVBannerSlider';
import MoviesSection from '../components/movies/MoviesSection';
import NowPlayingSection from '../components/movies/NowPlayingSection';
import PopularMoviesSection from '../components/movies/PopularMoviesSection';
import TopRatedSection from '../components/movies/TopRatedSection';
import UpcomingSection from '../components/movies/UpcomingSection';
import TVShowsSection from '../components/tv/TVShowsSection';

const Home = () => {
  return (
    <>
      {/* Movies Banner */}
      <section className="mb-12">
        <BannerSlider />
      </section>

      {/* Movies Sections */}
      <main className="container mx-auto p-4">
        <MoviesSection limit={10} />
        <NowPlayingSection limit={10} />
        <PopularMoviesSection limit={10} />
        <TopRatedSection limit={10} />
        <UpcomingSection limit={10} />
      </main>

      {/* TV Shows Banner */}
      {/* <section className="mb-12">
        <TVBannerSlider />
      </section> */}

      {/* TV Shows Section */}
      <main className="container mx-auto p-4">
        <TVShowsSection limit={10} />
      </main>
    </>
  );
};

export default Home;