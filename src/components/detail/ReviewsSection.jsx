import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { fetchMovieReviews, fetchTvShowReviews } from '../../services/api';
import { SkeletonList } from '../Skeleton';

const ReviewsSection = ({ id, type }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      try {
        let data;
        if (type === 'movie') {
          data = await fetchMovieReviews(id);
        } else {
          data = await fetchTvShowReviews(id);
        }
        setReviews(data.results.slice(0, 5));
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, [id, type]);

  if (loading) {
    return (
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        <SkeletonList count={3} />
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">User Reviews</h2>
      </div>
      <div className="space-y-6">
        {reviews.map(review => (
          <div key={review.id} className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-white">{review.author}</h3>
                <p className="text-sm text-zinc-500">{new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              {review.author_details?.rating && (
                <div className="flex items-center gap-1.5 bg-zinc-800/80 px-3 py-1.5 rounded-full border border-zinc-700/50">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-white">{review.author_details.rating}</span>
                </div>
              )}
            </div>
            <p className="text-zinc-300 leading-relaxed line-clamp-4">
              {review.content}
            </p>
            <a
              href={review.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              Read Full Review <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewsSection;