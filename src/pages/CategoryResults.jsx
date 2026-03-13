import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCategoryContent } from '../services/api';
import MovieCard from '../components/movies/MovieCard';
import TvShowCard from '../components/tv/TvShowCard';
import { SkeletonGrid } from '../components/Skeleton';
import categories from '../data/categories';

const CategoryResults = () => {
  const { slug } = useParams();
  const category = categories.find((cat) => cat.slug === slug);
  
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const observer = useRef();

  const lastElementRef = useCallback(node => {
    if (isFetching || loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && currentPage < totalPages) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isFetching, loading, currentPage, totalPages]);

  useEffect(() => {
    // Reset state when slug changes
    setItems([]);
    setCurrentPage(1);
    setTotalPages(1);
    setLoading(true);
  }, [slug]);

  useEffect(() => {
    if (!category) return;

    const loadContent = async () => {
      setIsFetching(true);
      try {
        const data = await fetchCategoryContent(
          category.lang, 
          category.type, 
          currentPage, 
          category.genre || null
        );
        
        setItems(prev => {
          const newItemsMap = new Map((currentPage === 1 ? data.results : [...prev, ...data.results]).map(m => [m.id, m]));
          return Array.from(newItemsMap.values());
        });
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error('Error fetching category content:', error);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };
    loadContent();
  }, [category, currentPage]);

  if (!category) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        <h1 className="text-2xl">Category not found</h1>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 md:px-8 lg:px-12 pt-36 md:pt-28 mb-20 relative z-10">
      <div className="flex items-end justify-between mb-8 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <span className={`w-3 h-8 rounded-full bg-gradient-to-b ${category.gradient}`}></span>
            {category.name}
          </h1>
          <p className="text-zinc-500 mt-2 text-sm uppercase tracking-widest font-medium">
            Discover {category.type === 'tv' ? 'Series' : 'Movies'}
          </p>
        </div>
      </div>

      {loading && currentPage === 1 ? (
        <SkeletonGrid count={12} />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-12">
            {items.map((item, index) => {
              const commonProps = { key: item.id, movie: item };
              const Card = category.type === 'tv' ? TvShowCard : MovieCard;
              
              if (items.length === index + 1) {
                return (
                  <div ref={lastElementRef} key={item.id}>
                    <Card {...commonProps} />
                  </div>
                );
              } else {
                return <Card {...commonProps} />;
              }
            })}
          </div>

          {isFetching && currentPage > 1 && (
            <div className="my-8">
              <SkeletonGrid count={6} />
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default CategoryResults;
