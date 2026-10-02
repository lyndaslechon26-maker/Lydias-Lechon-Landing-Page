'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface MenuItem {
  id: string
  name: string
  category?: string
  price?: number
  is_available?: boolean
}

interface MenuItemsTableProps {
  items?: MenuItem[]
}

export function MenuItemsTable({ items = [] }: MenuItemsTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        No menu items yet
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="capitalize">{item.category || '-'}</TableCell>
              <TableCell>₱{(item.price || 0).toLocaleString()}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  item.is_available 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                }`}>
                  {item.is_available ? 'Available' : 'Unavailable'}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
