import React from 'react'

interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', children }) => {
  return (
    <div className={`shimmer ${className}`}>
      {children}
    </div>
  )
}

export const CardSkeleton: React.FC = () => {
  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      
      <div className="text-center mb-6">
        <Skeleton className="h-8 w-32 mx-auto mb-2" />
        <Skeleton className="h-4 w-40 mx-auto" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 rounded-lg">
          <Skeleton className="h-3 w-16 mx-auto mb-2" />
          <Skeleton className="h-5 w-12 mx-auto" />
        </div>
        <div className="p-3 rounded-lg">
          <Skeleton className="h-3 w-16 mx-auto mb-2" />
          <Skeleton className="h-5 w-12 mx-auto" />
        </div>
      </div>
      
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  )
}

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="card">
      <Skeleton className="h-6 w-48 mb-6" />
      <div className="space-y-4">
        <div className="grid grid-cols-6 gap-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid grid-cols-6 gap-4 py-3">
            {Array.from({ length: 6 }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}