import React from 'react'
import { Package, TrendingDown, ShoppingCart, DollarSign } from 'lucide-react'
import StatsCard from '@/components/dashboard/StatsCard'
import QuickActions from '@/components/dashboard/QuickActions'
import RecentActivity from '@/components/dashboard/RecentActivity'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Loading'
import { useMaterialsByCompany, useLowStock } from '@/hooks/useMaterials'
import { usePurchasesByCompany } from '@/hooks/usePurchases'
import useCompanyStore from '@/store/companyStore'

/**
 * Dashboard Page
 */

const Dashboard = () => {
  const { selectedCompany } = useCompanyStore()

  const { data: materials = [], isLoading: materialsLoading } = useMaterialsByCompany(selectedCompany?.id)
  const { data: lowStockItems = [], isLoading: lowStockLoading } = useLowStock(selectedCompany?.id)
  const { data: purchases = [], isLoading: purchasesLoading } = usePurchasesByCompany(selectedCompany?.id)

  const isLoading = materialsLoading || lowStockLoading || purchasesLoading

  // Calculate stats
  const totalMaterials = materials.length
  const lowStockCount = lowStockItems.length
  const recentPurchases = purchases.slice(0, 5).length
  const totalValue = materials.reduce((sum, m) => sum + (m.current_stock * (m.unit_price || 0)), 0)

  // Mock recent activity (in production, this would come from API)
  const recentActivity = React.useMemo(() => {
    const activities = []
    
    // Add low stock alerts
    lowStockItems.slice(0, 3).forEach(item => {
      activities.push({
        type: 'alert',
        title: `Low stock alert: ${item.name}`,
        timestamp: new Date().toISOString(),
        badge: 'Low Stock',
      })
    })
    
    // Add recent purchases
    purchases.slice(0, 2).forEach(purchase => {
      activities.push({
        type: 'purchase',
        title: `New purchase: ${purchase.invoice_number}`,
        timestamp: purchase.purchase_date,
        badge: purchase.supplier_name,
      })
    })
    
    return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [lowStockItems, purchases])

  if (!selectedCompany) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">Welcome to PVApp 2.0</p>
          </div>
        </div>

        <Card className="p-12 text-center">
          <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No Company Selected</h2>
          <p className="text-slate-600">
            Please select a company from the dropdown above to view your dashboard.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">{selectedCompany.name}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Materials"
              value={totalMaterials}
              icon={Package}
              variant="default"
            />
            <StatsCard
              title="Low Stock Items"
              value={lowStockCount}
              icon={TrendingDown}
              variant="danger"
            />
            <StatsCard
              title="Recent Purchases"
              value={recentPurchases}
              icon={ShoppingCart}
              variant="success"
            />
            <StatsCard
              title="Inventory Value"
              value={`$${totalValue.toFixed(0)}`}
              icon={DollarSign}
              variant="default"
            />
          </div>

          {/* Quick Actions */}
          <QuickActions />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Low Stock Items */}
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                {lowStockItems.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">
                    No low stock items
                  </p>
                ) : (
                  <div className="space-y-3">
                    {lowStockItems.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{item.name}</p>
                          <p className="text-sm text-red-600">
                            Stock: {item.current_stock} {item.unit}
                          </p>
                        </div>
                        <Badge variant="danger">Low</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <RecentActivity activities={recentActivity} />
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
