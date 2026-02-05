import React from 'react'
import MaterialsList from '@/components/materials/MaterialsList'

/**
 * Materials Page
 */

const Materials = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Materials</h1>
          <p className="text-slate-600 mt-1">Manage your inventory</p>
        </div>
      </div>

      <MaterialsList />
    </div>
  )
}

export default Materials
