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
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Reviews</h2>
      <div className="space-y-6">
        {reviews.map(review => (
          <div key={review.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{review.author}</h3>
                <p className="text-sm text-gray-400">{new Date(review.created_at).toLocaleDateString()}</p>
              </div>
              {review.author_details?.rating && (
                <div className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded">
                  <Star size={16} className="text-yellow-400" />
                  <span className="text-sm font-semibold">{review.author_details.rating}/10</span>
                </div>
              )}
            </div>
            <p className="text-gray-300 leading-relaxed line-clamp-4">
              {review.content}
            </p>
            <a
              href={review.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-blue-400 hover:text-blue-300 text-sm"
            >
              Read Full Review →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewsSection;