import React, { useEffect, useState } from "react";
import { Play, X } from "lucide-react";
import { fetchMovieVideos, fetchTvShowVideos, fetchTvShowSeason } from "../../services/api";

const VideoPlayer = ({ id, type, title, onHeaderVisibilityChange }) => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isStreamOpen, setIsStreamOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [tvSeasons, setTvSeasons] = useState([]);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        let data;
        if (type === "movie") {
          data = await fetchMovieVideos(id);
        } else {
          data = await fetchTvShowVideos(id);
        }
        // Filter for trailers and clips, prioritize trailers
        const trailers =
          data.results?.filter((v) => v.type === "Trailer") || [];
        const clips = data.results?.filter((v) => v.type !== "Trailer") || [];
        setVideos([...trailers, ...clips]);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    loadVideos();
  }, [id, type]);

  // Load episodes for TV shows
  useEffect(() => {
    if (type === "tv" && isStreamOpen) {
      const loadEpisodes = async () => {
        setLoadingEpisodes(true);
        try {
          const seasonData = await fetchTvShowSeason(id, selectedSeason);
          setEpisodes(seasonData.episodes || []);
          setTvSeasons(
            Array.from({ length: seasonData.season_number || 1 }, (_, i) => i + 1)
          );
        } catch (error) {
          console.error("Error fetching episodes:", error);
          setEpisodes([]);
        } finally {
          setLoadingEpisodes(false);
        }
      };
      loadEpisodes();
    }
  }, [id, type, selectedSeason, isStreamOpen]);

  // Hide/show header when player opens/closes
  useEffect(() => {
    if (onHeaderVisibilityChange) {
      onHeaderVisibilityChange(!(isOpen || isStreamOpen));
    }
  }, [isOpen, isStreamOpen, onHeaderVisibilityChange]);

  if (videos.length === 0) {
    return null;
  }

  const mainVideo = selectedVideo || videos[0];

  return (
    <>
      {/* Watch Trailer and Play Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => {
            setSelectedVideo(videos[0]);
            setIsOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] border border-red-500/50"
        >
          <Play size={20} fill="currentColor" />
          Watch Trailer
        </button>

        <button
          onClick={() => setIsStreamOpen(true)}
          className="inline-flex items-center gap-2 bg-white text-zinc-950 hover:bg-zinc-200 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          <Play size={20} fill="currentColor" />
          Play {type === 'movie' ? 'Movie' : 'Show'}
        </button>
      </div>

      {/* Video Player Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white cursor-pointer p-2.5"
              >
                <X size={24} />
              </button>
            </div>

            {/* Video */}
            <div className="aspect-video bg-black">
              {mainVideo?.site === "YouTube" && (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${mainVideo.key}?autoplay=1`}
                  title={mainVideo.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              )}
            </div>

            {/* Video Info */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                {mainVideo?.name}
              </h3>
              <p className="text-gray-300 mb-6 text-sm">
                {mainVideo?.type} • Published:{" "}
                {new Date(mainVideo?.published_at).toLocaleDateString()}
              </p>

              {/* Video List */}
              {videos.length > 1 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">
                    Other Videos
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {videos.map((video) => (
                      <button
                        key={video.id}
                        onClick={() => setSelectedVideo(video)}
                        className={`p-3 rounded-lg text-left transition-colors ${
                          selectedVideo?.id === video.id
                            ? "bg-red-600"
                            : "bg-gray-800 hover:bg-gray-700"
                        }`}
                      >
                        <p className="font-semibold text-white truncate text-sm">
                          {video.name}
                        </p>
                        <p className="text-xs text-gray-400">{video.type}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VidSrc Streaming Modal - FULLSCREEN */}
      {isStreamOpen && (
        <div className="fixed inset-0 bg-black z-50 flex">
          {/* Main Player Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-gray-900 p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">{title}</h2>
              <button
                onClick={() => setIsStreamOpen(false)}
                className="text-gray-300 hover:text-white cursor-pointer p-2.5"
              >
                <X size={24} />
              </button>
            </div>

            {/* Controls for TV Shows */}
            {type === "tv" && (
              <div className="bg-gray-800 p-3 border-b border-gray-700 flex gap-4 items-center flex-wrap">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Season</label>
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
                    className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 text-sm"
                  >
                    {tvSeasons.map((season) => (
                      <option key={season} value={season}>
                        Season {season}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Episode</label>
                  <select
                    value={selectedEpisode}
                    onChange={(e) => setSelectedEpisode(parseInt(e.target.value))}
                    className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 text-sm"
                  >
                    {episodes.map((ep) => (
                      <option key={ep.episode_number} value={ep.episode_number}>
                        Ep {ep.episode_number}: {ep.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Video Player */}
            <div className="flex-1 bg-black">
              {type === "movie" ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://vidsrc.me/embed/movie/${id}`}
                  title={title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  style={{ border: "none" }}
                ></iframe>
              ) : (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://vidsrc.me/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`}
                  title={title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  style={{ border: "none" }}
                ></iframe>
              )}
            </div>
          </div>

          {/* Right Side Panel - Episodes for TV Shows */}
          {type === "tv" && (
            <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col max-h-screen">
              {/* Episodes Header */}
              <div className="p-3 border-b border-gray-700 bg-gray-800">
                <h3 className="font-semibold text-white text-sm">
                  Season {selectedSeason} Episodes
                </h3>
              </div>

              {/* Episodes List */}
              <div className="flex-1 overflow-y-auto">
                {loadingEpisodes ? (
                  <div className="p-4 text-center text-gray-400">
                    <p className="text-sm">Loading episodes...</p>
                  </div>
                ) : episodes.length > 0 ? (
                  <div className="p-2 space-y-2">
                    {episodes.map((episode) => (
                      <button
                        key={episode.episode_number}
                        onClick={() => setSelectedEpisode(episode.episode_number)}
                        className={`w-full p-3 rounded transition-colors text-left text-sm ${
                          selectedEpisode === episode.episode_number
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-800 hover:bg-gray-700"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-white min-w-fit">
                            Ep {episode.episode_number}
                          </span>
                          <span className="text-gray-300 line-clamp-2">
                            {episode.name}
                          </span>
                        </div>
                        {episode.air_date && (
                          <p className="text-xs text-gray-400 mt-1">
                            {episode.air_date}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-gray-400 text-sm">No episodes available</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-700 bg-gray-800">
                <p className="text-xs text-gray-400">
                  Powered by <span className="text-blue-400 font-semibold">VidSrc</span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default VideoPlayer;
