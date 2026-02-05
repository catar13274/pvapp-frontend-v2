import React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

/**
 * Select Component
 * Dropdown select with consistent styling
 */

export const Select = React.forwardRef(({
  className,
  children,
  error,
  ...props
}, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10',
          'text-base text-slate-900',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
          'transition-colors duration-200',
          'appearance-none cursor-pointer',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
    </div>
  )
})

Select.displayName = 'Select'

/**
 * SelectOption Component
 */
export const SelectOption = ({ value, children, ...props }) => {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  )
}
