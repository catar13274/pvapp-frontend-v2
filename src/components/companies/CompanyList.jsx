import React from 'react'
import { Search, Plus, Edit, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from '@/components/ui/Table'
import { Spinner } from '@/components/ui/Loading'
import { useCompanies, useDeleteCompany } from '@/hooks/useCompanies'
import { debounce } from '@/lib/utils'
import CompanyDialog from './CompanyDialog'

/**
 * Company List Component
 */

const CompanyList = () => {
  const [search, setSearch] = React.useState('')
  const [selectedCompany, setSelectedCompany] = React.useState(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  // const [deleteId, setDeleteId] = React.useState(null) // TODO: Implement delete confirmation

  const { data: companies = [], isLoading } = useCompanies()
  const deleteCompany = useDeleteCompany()

  // Filter companies based on search
  const filteredCompanies = React.useMemo(() => {
    if (!search) return companies
    const query = search.toLowerCase()
    return companies.filter(
      (company) =>
        company.name?.toLowerCase().includes(query) ||
        company.code?.toLowerCase().includes(query) ||
        company.email?.toLowerCase().includes(query)
    )
  }, [companies, search])

  const handleSearch = debounce((value) => {
    setSearch(value)
  }, 300)

  const handleNew = () => {
    setSelectedCompany(null)
    setDialogOpen(true)
  }

  const handleEdit = (company) => {
    setSelectedCompany(company)
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await deleteCompany.mutateAsync(id)
      } catch (error) {
        alert('Failed to delete company')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <>
      <Card>
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search companies..."
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleNew}>
              <Plus className="w-5 h-5 mr-2" />
              New Company
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.length === 0 ? (
                <TableEmpty colSpan={5} message="No companies found" />
              ) : (
                filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.code}</TableCell>
                    <TableCell>{company.email || '-'}</TableCell>
                    <TableCell>{company.phone || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(company)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(company.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Dialog */}
      <CompanyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        company={selectedCompany}
      />
    </>
  )
}

export default CompanyList
