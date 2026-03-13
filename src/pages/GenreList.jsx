import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchMoviesByGenre, fetchTvShowsByGenre } from '../services/api';
import MovieCard from '../components/movies/MovieCard';
import TvShowCard from '../components/tv/TvShowCard';
import { SkeletonGrid } from '../components/Skeleton';

const GenreList = () => {
  const { type, genreId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [genreName, setGenreName] = useState('');
  const observer = useRef();

  const lastElementRef = useCallback(node => {
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
    setContent([]);
    setCurrentPage(1);
    setTotalPages(1);
    setLoading(true);
  }, [genreId, type]);
  // Extract genre name from location state or set default
  useEffect(() => {
    if (location.state?.genreName) {
      setGenreName(location.state.genreName);
    }
  }, [location.state]);

  useEffect(() => {
    const loadContent = async () => {
      setIsFetching(true);
      try {
        let data;
        if (type === 'movie') {
          data = await fetchMoviesByGenre(genreId, currentPage);
        } else if (type === 'tv') {
          data = await fetchTvShowsByGenre(genreId, currentPage);
        }
        setContent(prev => {
          const newMap = new Map((currentPage === 1 ? data.results : [...prev, ...data.results]).map(item => [item.id, item]));
          return Array.from(newMap.values());
        });
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error(`Error fetching ${type} by genre:`, error);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };

    if (genreId && type) {
      loadContent();
    }
  }, [genreId, type, currentPage]);

  return (
    <main className="container mx-auto p-4 md:px-8 lg:px-12 pt-36 md:pt-28 min-h-screen relative z-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group w-fit"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="flex items-end justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          {genreName && `${genreName} ${type === 'movie' ? 'Movies' : 'TV Shows'}`}
        </h1>
      </div>

      {loading && currentPage === 1 ? (
        <SkeletonGrid count={12} />
      ) : content.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-12">
            {content.map((item, index) => {
              if (content.length === index + 1) {
                return (
                  <div ref={lastElementRef} key={item.id}>
                    {type === 'movie' ? <MovieCard movie={item} /> : <TvShowCard movie={item} />}
                  </div>
                );
              } else {
                return (
                  <React.Fragment key={item.id}>
                    {type === 'movie' ? <MovieCard movie={item} /> : <TvShowCard movie={item} />}
                  </React.Fragment>
                );
              }
            })}
          </div>
          {isFetching && currentPage > 1 && (
            <div className="my-8">
              <SkeletonGrid count={6} />
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-900/50 rounded-2xl border border-zinc-800">
          <p className="text-zinc-400 text-lg">
            No {type === 'movie' ? 'movies' : 'TV shows'} found in this genre.
          </p>
        </div>
      )}
    </main>
  );
};

export default GenreList;
