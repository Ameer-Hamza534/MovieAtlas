import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Pagination from '../components/Pagination';
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
  const [loading, setLoading] = useState(false);
  const [genreName, setGenreName] = useState('');

  // Extract genre name from location state or set default
  useEffect(() => {
    if (location.state?.genreName) {
      setGenreName(location.state.genreName);
    }
  }, [location.state]);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        let data;
        if (type === 'movie') {
          data = await fetchMoviesByGenre(genreId, currentPage);
        } else if (type === 'tv') {
          data = await fetchTvShowsByGenre(genreId, currentPage);
        }
        setContent(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error(`Error fetching ${type} by genre:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [genreId, type, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-5 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition mt-15"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <h1 className="text-4xl font-bold text-white mb-5">
        {genreName && `${genreName} ${type === 'movie' ? 'Movies' : 'TV Shows'}`}
      </h1>

      {loading ? (
        <SkeletonGrid count={20} />
      ) : content.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            {content.map((item) =>
              type === 'movie' ? (
                <MovieCard key={item.id} movie={item} />
              ) : (
                <TvShowCard key={item.id} movie={item} />
              )
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p className="text-white text-center text-lg">
          No {type === 'movie' ? 'movies' : 'TV shows'} found in this genre.
        </p>
      )}
    </main>
  );
};

export default GenreList;
