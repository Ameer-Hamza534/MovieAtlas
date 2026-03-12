import React, { useEffect, useState } from 'react';
import TVBannerSlider from '../components/TVBannerSlider';
import Pagination from '../components/Pagination';
import { fetchTvShows } from '../services/api';
import TvShowCard from '../components/tv/TvShowCard';
import { SkeletonGrid } from '../components/Skeleton';

const TVShows = () => {
  const [tvShows, setTvShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTVShows = async () => {
      setLoading(true);
      try {
        const data = await fetchTvShows(currentPage);
        setTvShows(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error('Error fetching TV shows:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTVShows();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {/* TV Shows Banner */}
      <section className="mb-8">
        <TVBannerSlider />
      </section>

      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-white mb-6">📺 All TV Shows</h1>

        {loading ? (
          <SkeletonGrid count={20} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
              {tvShows.map(tvShow => (
                <TvShowCard key={tvShow.id} movie={tvShow} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>
    </>
  );
};

export default TVShows;