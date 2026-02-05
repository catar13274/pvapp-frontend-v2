import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDateTime } from '@/lib/utils'
import { Package, ShoppingCart, AlertCircle } from 'lucide-react'

/**
 * Recent Activity Component
 * Display recent system activities
 */

const RecentActivity = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'material':
        return Package
      case 'purchase':
        return ShoppingCart
      case 'alert':
        return AlertCircle
      default:
        return Package
    }
  }

  const getActivityVariant = (type) => {
    switch (type) {
      case 'material':
        return 'primary'
      case 'purchase':
        return 'success'
      case 'alert':
        return 'warning'
      default:
        return 'default'
    }
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 text-center py-4">
            No recent activity
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type)
            return (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'alert' ? 'bg-yellow-50' : 
                  activity.type === 'purchase' ? 'bg-green-50' : 
                  'bg-primary-50'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    activity.type === 'alert' ? 'text-yellow-600' : 
                    activity.type === 'purchase' ? 'text-green-600' : 
                    'text-primary-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    {activity.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDateTime(activity.timestamp)}
                  </p>
                </div>
                {activity.badge && (
                  <Badge variant={getActivityVariant(activity.type)}>
                    {activity.badge}
                  </Badge>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentActivity
