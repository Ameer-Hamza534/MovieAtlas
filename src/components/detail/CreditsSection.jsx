import React, { useEffect, useState } from 'react';
import { fetchMovieCredits, fetchTvShowCredits } from '../../services/api';
import { SkeletonList } from '../Skeleton';

const CreditsSection = ({ id, type }) => {
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCredits = async () => {
      setLoading(true);
      try {
        let data;
        if (type === 'movie') {
          data = await fetchMovieCredits(id);
        } else {
          data = await fetchTvShowCredits(id);
        }
        // Get top 12 cast members
        setCast(data.cast?.slice(0, 12) || []);
        // Get important crew (Director, Producer, Writer, Cinematographer, etc.)
        const importantCrew = data.crew?.filter(person =>
          ['Director', 'Producer', 'Writer', 'Cinematography', 'Screenplay', 'Executive Producer'].includes(person.job)
        ).slice(0, 12) || [];
        setCrew(importantCrew);
      } catch (error) {
        console.error('Error fetching credits:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCredits();
  }, [id, type]);

  if (loading) {
    return (
      <section className="mt-12 pb-12">
        <h2 className="text-2xl font-bold mb-6">Credits</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-semibold mb-6">Cast</h3>
            <SkeletonList count={6} />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-6">Crew</h3>
            <SkeletonList count={6} />
          </div>
        </div>
      </section>
    );
  }

  if (cast.length === 0 && crew.length === 0) {
    return null;
  }

  const getProfileImage = (profilePath) => {
    return profilePath
      ? `https://image.tmdb.org/t/p/w200${profilePath}`
      : 'https://via.placeholder.com/200x300?text=No+Image';
  };

  return (
    <section>
      <div className="flex flex-col gap-12">
        {/* Cast */}
        {cast.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-white tracking-tight">Top Cast</h3>
            <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory hide-scroll-bar [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {cast.map(actor => (
                <div key={actor.id} className="flex flex-col gap-3 min-w-[120px] sm:min-w-[140px] shrink-0 snap-start bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800/50 hover:bg-zinc-800 transition-colors">
                  <img
                    src={getProfileImage(actor.profile_path)}
                    alt={actor.name}
                    className="w-full aspect-[2/3] object-cover rounded-xl shadow-md"
                  />
                  <div className="flex-1 min-w-0 text-center">
                    <p className="font-semibold text-white text-sm truncate">{actor.name}</p>
                    <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2 leading-snug">
                      {actor.character || 'Unknown Role'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Crew */}
        {crew.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-white tracking-tight">Featured Crew</h3>
            <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory hide-scroll-bar [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {crew.map(person => (
                <div key={`${person.id}-${person.job}`} className="flex flex-col gap-3 min-w-[120px] sm:min-w-[140px] shrink-0 snap-start bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800/50 hover:bg-zinc-800 transition-colors">
                  <img
                    src={getProfileImage(person.profile_path)}
                    alt={person.name}
                    className="w-full aspect-[2/3] object-cover rounded-xl shadow-md"
                  />
                  <div className="flex-1 min-w-0 text-center">
                    <p className="font-semibold text-white text-sm truncate">{person.name}</p>
                    <p className="text-xs text-zinc-400 mt-0.5 truncate">
                      {person.job}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CreditsSection;