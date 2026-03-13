import React, { useEffect, useState, useRef, useCallback } from 'react';
import TVBannerSlider from '../components/TVBannerSlider';
import { fetchTvShows } from '../services/api';
import TvShowCard from '../components/tv/TvShowCard';
import { SkeletonGrid } from '../components/Skeleton';

const TVShows = () => {
  const [tvShows, setTvShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const observer = useRef();

  const lastShowElementRef = useCallback(node => {
    if (loading || isFetching) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && currentPage < totalPages) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, isFetching, currentPage, totalPages]);

  useEffect(() => {
    const loadTVShows = async () => {
      setIsFetching(true);
      try {
        const data = await fetchTvShows(currentPage);
        setTvShows(prev => {
          const newMap = new Map((currentPage === 1 ? data.results : [...prev, ...data.results]).map(s => [s.id, s]));
          return Array.from(newMap.values());
        });
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error('Error fetching TV shows:', error);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };
    loadTVShows();
  }, [currentPage]);

  return (
    <>
      {/* TV Shows Banner */}
      <section className="mb-12">
        <TVBannerSlider />
      </section>

      <main className="container mx-auto p-4 md:px-8 lg:px-12 mb-20 relative z-10">
        <div className="flex items-end justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">📺 All TV Shows</h1>
        </div>

        {loading && currentPage === 1 ? (
          <SkeletonGrid count={12} />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-12">
              {tvShows.map((tvShow, index) => {
                if (tvShows.length === index + 1) {
                  return (
                    <div ref={lastShowElementRef} key={tvShow.id}>
                      <TvShowCard movie={tvShow} />
                    </div>
                  );
                } else {
                  return <TvShowCard key={tvShow.id} movie={tvShow} />;
                }
              })}
            </div>

            {isFetching && currentPage > 1 && (
              <div className="my-8">
                <SkeletonGrid count={6} />
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default TVShows;