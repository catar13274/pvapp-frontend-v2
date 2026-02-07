import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Loading Spinner Component
 */
export const Spinner = ({ className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }

  return (
    <Loader2 className={cn('animate-spin', sizeClasses[size], className)} />
  )
}

/**
 * Loading Overlay Component
 */
export const LoadingOverlay = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center gap-4">
        <Spinner size="lg" className="text-primary-600" />
        <p className="text-slate-700 font-medium">{message}</p>
      </div>
    </div>
  )
}

/**
 * Loading Skeleton Component
 */
export const Skeleton = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200 rounded',
        className
      )}
    />
  )
}
