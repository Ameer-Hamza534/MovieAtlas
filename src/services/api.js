import axios from 'axios';
// use the base TMDB API root rather than the discover subpath
const api_url = 'https://api.themoviedb.org/3/discover';
const api_key = import.meta.env.VITE_TMDB_API_KEY;

const instance = axios.create({
    baseURL: api_url,
    params: {
        api_key,
    },
});

export async function fetchMovies() {
    const response = await instance.get('/movie');
    const data = response.data.results;
    return data || [];
}

export async function fetchTvShows() {
    const response = await instance.get('/tv');
    const data = response.data.results;
    return data || [];
}