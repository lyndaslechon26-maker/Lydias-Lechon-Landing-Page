'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Package {
  id: string
  name: string
  event_type?: string
  base_price?: number
  is_active?: boolean
}

interface PackagesTableProps {
  packages?: Package[]
}

export function PackagesTable({ packages = [] }: PackagesTableProps) {
  if (packages.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        No packages yet
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Event Type</TableHead>
            <TableHead>Base Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.map((pkg) => (
            <TableRow key={pkg.id}>
              <TableCell className="font-medium">{pkg.name}</TableCell>
              <TableCell className="capitalize">{pkg.event_type?.replace(/_/g, ' ') || '-'}</TableCell>
              <TableCell>₱{(pkg.base_price || 0).toLocaleString()}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  pkg.is_active 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                }`}>
                  {pkg.is_active ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
