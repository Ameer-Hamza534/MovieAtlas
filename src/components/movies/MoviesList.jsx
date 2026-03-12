import React, {useEffect, useState}  from 'react'
import { fetchMovies } from '../../services/api';
import MovieCard from './MovieCard';

const MoviesList = () => {
  const [movies, setMovies] = useState([])

  useEffect(() => {
    const loadMovies = async () => {
        try {
            const data = await fetchMovies();
            setMovies(data.results);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    }
    loadMovies()
  }, [])

  return (
    <div>
        <h2 className='text-2xl font-bold text-white mb-4'>🔥 Popular Movies</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
            {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    </div>
  )
}

export default MoviesList