'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  total_orders?: number
  total_spent?: number
  created_at: string
}

interface CustomersTableProps {
  customers?: Customer[]
}

export function CustomersTable({ customers = [] }: CustomersTableProps) {
  if (customers.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        No customers yet
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone || '-'}</TableCell>
              <TableCell>{customer.total_orders || 0}</TableCell>
              <TableCell>₱{(customer.total_spent || 0).toLocaleString()}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(customer.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
