/**
 * Central utility for handling TMDB image URLs and fallbacks
 */

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/';

export const getTMDBImage = (path, size = 'original') => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}${size}${path}`;
};

// Default images for different types
export const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=300&h=450';
export const DEFAULT_BACKDROP = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200&h=600';
export const DEFAULT_PROFILE = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200&h=300';

/**
 * Get fallback poster image
 */
export const getPosterImage = (path, size = 'w500') => {
  const url = getTMDBImage(path, size);
  return url || DEFAULT_POSTER;
};

/**
 * Get fallback backdrop image
 */
export const getBackdropImage = (path, size = 'original') => {
  const url = getTMDBImage(path, size);
  return url || DEFAULT_BACKDROP;
};

/**
 * Get fallback profile image (cast/crew)
 */
export const getProfileImage = (path, size = 'w200') => {
  const url = getTMDBImage(path, size);
  return url || DEFAULT_PROFILE;
};
