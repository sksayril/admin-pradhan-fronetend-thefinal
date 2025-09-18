import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  rounded?: boolean;
  animate?: boolean;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  height = 'h-4',
  width = 'w-full',
  rounded = true,
  animate = true,
}) => {
  return (
    <div
      className={`
        bg-gray-200 
        ${height} 
        ${width} 
        ${rounded ? 'rounded' : ''} 
        ${animate ? 'animate-pulse' : ''} 
        ${className}
      `}
    />
  );
};

// Table skeleton component
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 6,
}) => {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, index) => (
          <LoadingSkeleton key={index} width="w-24" height="h-6" />
        ))}
      </div>
      
      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <LoadingSkeleton key={colIndex} width="w-20" height="h-4" />
          ))}
        </div>
      ))}
    </div>
  );
};

// Card skeleton component
export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <LoadingSkeleton width="w-20" height="h-4" />
              <LoadingSkeleton width="w-16" height="h-6" />
            </div>
            <LoadingSkeleton width="w-12" height="h-12" rounded />
          </div>
        </div>
      ))}
    </div>
  );
};

// Form skeleton component
export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 5 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <LoadingSkeleton width="w-24" height="h-4" />
          <LoadingSkeleton width="w-full" height="h-10" />
        </div>
      ))}
    </div>
  );
};

// Modal skeleton component
export const ModalSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <LoadingSkeleton width="w-48" height="h-6" />
          <LoadingSkeleton width="w-8" height="h-8" rounded />
        </div>
        
        {/* Content */}
        <div className="space-y-4">
          <LoadingSkeleton width="w-full" height="h-4" />
          <LoadingSkeleton width="w-3/4" height="h-4" />
          <LoadingSkeleton width="w-1/2" height="h-4" />
        </div>
        
        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <LoadingSkeleton width="w-20" height="h-10" />
          <LoadingSkeleton width="w-24" height="h-10" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
