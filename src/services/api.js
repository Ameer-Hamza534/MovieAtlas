import axios from 'axios';
// use the base TMDB API root rather than the discover subpath
const api_url = 'https://api.themoviedb.org/3/discover';
const base_api_url = 'https://api.themoviedb.org/3';
const api_key = import.meta.env.VITE_TMDB_API_KEY;

const instance = axios.create({
    baseURL: api_url,
    params: {
        api_key,
    },
});

const baseInstance = axios.create({
    baseURL: base_api_url,
    params: {
        api_key,
    },
});

export async function fetchMovies(page = 1) {
    const response = await instance.get('/movie', {
        params: {
            page,
        },
    });
    return response.data;
}

export async function fetchTvShows(page = 1) {
    const response = await instance.get('/tv', {
        params: {
            page,
        },
    });
    return response.data;
}

export async function fetchMovieDetail(movieId) {
    const response = await baseInstance.get(`/movie/${movieId}`);
    return response.data;
}

export async function fetchTvShowDetail(tvShowId) {
    const response = await baseInstance.get(`/tv/${tvShowId}`);
    return response.data;
}

export async function fetchMovieRecommendations(movieId) {
    const response = await baseInstance.get(`/movie/${movieId}/recommendations`);
    return response.data;
}

export async function fetchTvShowRecommendations(tvShowId) {
    const response = await baseInstance.get(`/tv/${tvShowId}/recommendations`);
    return response.data;
}

export async function fetchMovieReviews(movieId) {
    const response = await baseInstance.get(`/movie/${movieId}/reviews`);
    return response.data;
}

export async function fetchTvShowReviews(tvShowId) {
    const response = await baseInstance.get(`/tv/${tvShowId}/reviews`);
    return response.data;
}

export async function fetchSimilarMovies(movieId) {
    const response = await baseInstance.get(`/movie/${movieId}/similar`);
    return response.data;
}

export async function fetchSimilarTvShows(tvShowId) {
    const response = await baseInstance.get(`/tv/${tvShowId}/similar`);
    return response.data;
}

export async function fetchMovieWatchProviders(movieId) {
    const response = await baseInstance.get(`/movie/${movieId}/watch/providers`);
    return response.data;
}

export async function fetchTvShowWatchProviders(tvShowId) {
    const response = await baseInstance.get(`/tv/${tvShowId}/watch/providers`);
    return response.data;
}

export async function fetchMovieCredits(movieId) {
    const response = await baseInstance.get(`/movie/${movieId}/credits`);
    return response.data;
}

export async function fetchTvShowCredits(tvShowId) {
    const response = await baseInstance.get(`/tv/${tvShowId}/credits`);
    return response.data;
}

export async function fetchMovieVideos(movieId) {
    const response = await baseInstance.get(`/movie/${movieId}/videos`);
    return response.data;
}

export async function fetchTvShowVideos(tvShowId) {
    const response = await baseInstance.get(`/tv/${tvShowId}/videos`);
    return response.data;
}

export async function fetchMovieGenres() {
    const response = await baseInstance.get('/genre/movie/list');
    return response.data;
}

export async function fetchTvGenres() {
    const response = await baseInstance.get('/genre/tv/list');
    return response.data;
}

export async function fetchMoviesByGenre(genreId, page = 1) {
    const response = await instance.get('/movie', {
        params: {
            with_genres: genreId,
            page,
        },
    });
    return response.data;
}

export async function fetchTvShowsByGenre(genreId, page = 1) {
    const response = await instance.get('/tv', {
        params: {
            with_genres: genreId,
            page,
        },
    });
    return response.data;
}

export async function searchMulti(query, page = 1) {
    const response = await baseInstance.get('/search/multi', {
        params: {
            query,
            page,
        },
    });
    return response.data;
}

export async function fetchTrendingMovies() {
    const response = await baseInstance.get('/trending/movie/day');
    return response.data;
}

export async function fetchTvShowSeason(tvShowId, seasonNumber) {
    const response = await baseInstance.get(`/tv/${tvShowId}/season/${seasonNumber}`);
    return response.data;
}

export async function fetchNowPlayingMovies(page = 1) {
    const response = await baseInstance.get('/movie/now_playing', {
        params: { page },
    });
    return response.data;
}

export async function fetchPopularMovies(page = 1) {
    const response = await baseInstance.get('/movie/popular', {
        params: { page },
    });
    return response.data;
}

export async function fetchTopRatedMovies(page = 1) {
    const response = await baseInstance.get('/movie/top_rated', {
        params: { page },
    });
    return response.data;
}

export async function fetchUpcomingMovies(page = 1) {
    const response = await baseInstance.get('/movie/upcoming', {
        params: { page },
    });
    return response.data;
}