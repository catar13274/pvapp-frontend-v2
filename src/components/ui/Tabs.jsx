import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Tabs Component
 * Navigate between different views
 */

const TabsContext = React.createContext()

export const Tabs = ({ defaultValue, value, onValueChange, children, className }) => {
  const [selectedTab, setSelectedTab] = React.useState(defaultValue)

  const currentValue = value !== undefined ? value : selectedTab
  const handleValueChange = onValueChange || setSelectedTab

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={cn('w-full', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export const TabsList = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg',
        className
      )}
      role="tablist"
      {...props}
    >
      {children}
    </div>
  )
})

TabsList.displayName = 'TabsList'

export const TabsTrigger = React.forwardRef(({
  value,
  className,
  children,
  ...props
}, ref) => {
  const context = React.useContext(TabsContext)

  const isSelected = context.value === value

  return (
    <button
      ref={ref}
      role="tab"
      aria-selected={isSelected}
      onClick={() => context.onValueChange(value)}
      className={cn(
        'px-4 py-2 text-sm font-medium rounded-md transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-primary-500',
        isSelected
          ? 'bg-white text-slate-900 shadow-sm'
          : 'text-slate-600 hover:text-slate-900',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})

TabsTrigger.displayName = 'TabsTrigger'

export const TabsContent = React.forwardRef(({
  value,
  className,
  children,
  ...props
}, ref) => {
  const context = React.useContext(TabsContext)

  if (context.value !== value) return null

  return (
    <div
      ref={ref}
      role="tabpanel"
      className={cn('mt-4', className)}
      {...props}
    >
      {children}
    </div>
  )
})

TabsContent.displayName = 'TabsContent'
