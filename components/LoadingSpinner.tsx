import React from 'react';

const SkeletonBox: React.FC<{ width: string; height?: string }> = ({ width, height = 'h-4' }) => (
  <div className={`bg-gray-700/50 rounded ${width} ${height} animate-pulse`}></div>
);

const LoadingSpinner: React.FC = () => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl ring-1 ring-white/10">
      <div className="border-b border-white/10 pb-6 mb-6">
        <SkeletonBox width="w-3/5" height="h-10" />
        <SkeletonBox width="w-1/4" height="h-6 mt-4" />
      </div>
      
      <div className="space-y-4 mb-8">
        <SkeletonBox width="w-full" />
        <SkeletonBox width="w-5/6" />
      </div>

      <div className="space-y-8">
        {/* Section Skeleton */}
        <div className="space-y-3">
          <SkeletonBox width="w-1/3" height="h-6" />
          <div className="pl-[40px] space-y-2">
            <SkeletonBox width="w-full" />
            <SkeletonBox width="w-full" />
          </div>
        </div>
        {/* Section Skeleton */}
        <div className="space-y-3">
          <SkeletonBox width="w-1/3" height="h-6" />
          <div className="pl-[40px] space-y-2">
            <SkeletonBox width="w-full" />
            <SkeletonBox width="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;