import React from 'react'
import CompanyList from '@/components/companies/CompanyList'

/**
 * Companies Page
 */

const Companies = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Companies</h1>
          <p className="text-slate-600 mt-1">Manage your companies</p>
        </div>
      </div>

      <CompanyList />
    </div>
  )
}

export default Companies
