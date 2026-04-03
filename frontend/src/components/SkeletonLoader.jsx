/**
 * Skeleton Loader Component
 * Provides loading placeholders for data while fetching from API
 * Uses Tailwind animations for smooth shimmer effect
 */
import React from 'react'

/**
 * SkeletonLoader - Generic skeleton for any content
 * @param {Object} props
 * @param {string} props.height - Height class (e.g., 'h-6', 'h-12')
 * @param {string} props.width - Width class (e.g., 'w-full', 'w-1/2')
 * @param {boolean} props.rounded - Whether to apply full border radius
 */
const SkeletonLoader = ({ height = 'h-6', width = 'w-full', rounded = false }) => (
  <div
    className={`${width} ${height} skeleton ${rounded ? 'rounded-full' : 'rounded-lg'}`}
  />
)

/**
 * CardSkeleton - Skeleton for a card component
 */
const CardSkeleton = () => (
  <div className="card-elevated p-6 space-y-4">
    <div className="space-y-3">
      <SkeletonLoader height="h-8" width="w-3/4" />
      <SkeletonLoader height="h-6" width="w-full" />
      <SkeletonLoader height="h-6" width="w-5/6" />
    </div>
    <div className="flex gap-2 pt-4">
      <SkeletonLoader height="h-8" width="w-16" rounded />
      <SkeletonLoader height="h-8" width="w-20" rounded />
    </div>
  </div>
)

/**
 * SkillCardSkeleton - Skeleton for skill card
 */
const SkillCardSkeleton = () => (
  <div className="card-elevated overflow-hidden">
    {/* Header */}
    <div className="px-6 py-4 bg-slate-200">
      <SkeletonLoader height="h-6" width="w-3/4" />
    </div>
    {/* Content */}
    <div className="p-6 space-y-4">
      <SkeletonLoader height="h-4" width="w-full" />
      <SkeletonLoader height="h-4" width="w-5/6" />
      <div className="flex gap-2 pt-4">
        <SkeletonLoader height="h-6" width="w-12" rounded />
        <SkeletonLoader height="h-6" width="w-16" rounded />
      </div>
    </div>
    {/* Footer */}
    <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <SkeletonLoader height="h-10" width="w-10" rounded />
        <div className="space-y-2">
          <SkeletonLoader height="h-4" width="w-24" />
          <SkeletonLoader height="h-3" width="w-20" />
        </div>
      </div>
    </div>
  </div>
)

export { SkeletonLoader, CardSkeleton, SkillCardSkeleton }
