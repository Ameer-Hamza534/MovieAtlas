import React from 'react';

const Skeleton = ({ className = '', variant = 'default' }) => {
  const baseClasses = 'animate-pulse bg-gray-700 rounded';

  const variants = {
    default: '',
    text: 'h-4',
    title: 'h-6',
    subtitle: 'h-5',
    card: 'h-48',
    poster: 'h-72 w-48',
    avatar: 'h-16 w-16 rounded-full',
    button: 'h-10 w-24',
    banner: 'h-96 w-full',
  };

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${className}`}
    />
  );
};

// Pre-built skeleton components
export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-gray-800 rounded-lg overflow-hidden ${className}`}>
    <Skeleton variant="card" className="w-full" />
    <div className="p-3 space-y-2">
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 5, className = '' }) => (
  // If count is exactly 5, assume it's a row layout, else it's a grid (like 20 items)
  <div className={count <= 6 
      ? `flex gap-6 overflow-hidden pb-6 pt-2 ${className}`
      : `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 ${className}`
  }>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className={count <= 6 ? "min-w-[160px] md:min-w-[200px] lg:min-w-[220px] shrink-0" : ""}>
        <SkeletonCard />
      </div>
    ))}
  </div>
);

export const SkeletonList = ({ count = 3, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="flex gap-4">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-1/3" />
          <Skeleton variant="text" className="w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonBanner = ({ className = '' }) => (
  <div className={`relative ${className}`}>
    <Skeleton variant="banner" />
    <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
      <Skeleton variant="title" className="w-1/2" />
      <div className="flex gap-4">
        <Skeleton variant="text" className="w-16" />
        <Skeleton variant="text" className="w-12" />
        <Skeleton variant="text" className="w-20" />
      </div>
    </div>
  </div>
);

export const SkeletonDetail = ({ className = '' }) => (
  <div className={`flex gap-8 ${className}`}>
    <Skeleton variant="poster" className="flex-shrink-0" />
    <div className="flex-1 space-y-4">
      <Skeleton variant="title" className="w-3/4" />
      <div className="flex gap-4">
        <Skeleton variant="text" className="w-12" />
        <Skeleton variant="text" className="w-16" />
        <Skeleton variant="text" className="w-20" />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="text" className="w-16" />
        <Skeleton variant="text" className="w-20" />
        <Skeleton variant="text" className="w-14" />
      </div>
      <Skeleton variant="button" />
      <div className="space-y-2">
        <Skeleton variant="subtitle" className="w-1/4" />
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-5/6" />
      </div>
    </div>
  </div>
);

export default Skeleton;