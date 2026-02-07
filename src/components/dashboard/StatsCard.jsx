import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

/**
 * Stats Card Component
 * Display key metrics on dashboard
 */

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, variant = 'default' }) => {
  const variants = {
    default: 'text-primary-600 bg-primary-50',
    success: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    danger: 'text-red-600 bg-red-50',
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            {trend && (
              <p className={cn(
                'text-sm mt-2',
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              )}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </p>
            )}
          </div>
          
          {Icon && (
            <div className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center',
              variants[variant]
            )}>
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default StatsCard
