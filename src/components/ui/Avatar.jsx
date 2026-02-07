import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Avatar Component
 * Display user avatar with fallback to initials
 */

export const Avatar = React.forwardRef(({
  src,
  alt,
  fallback,
  size = 'md',
  className,
  ...props
}, ref) => {
  const [imgError, setImgError] = React.useState(false)

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden',
        'bg-primary-100 text-primary-700 font-medium',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  )
})

Avatar.displayName = 'Avatar'
