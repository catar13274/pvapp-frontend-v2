import React from 'react'
import PurchasesList from '@/components/purchases/PurchasesList'

/**
 * Purchases Page
 */

const Purchases = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Purchases</h1>
          <p className="text-slate-600 mt-1">Manage purchase orders</p>
        </div>
      </div>

      <PurchasesList />
    </div>
  )
}

export default Purchases
