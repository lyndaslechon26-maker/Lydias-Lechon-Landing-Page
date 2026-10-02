'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Venue {
  id: string
  name: string
  capacity?: number
  price_per_hour?: number
  is_active?: boolean
}

interface VenuesTableProps {
  venues?: Venue[]
}

export function VenuesTable({ venues = [] }: VenuesTableProps) {
  if (venues.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        No venues yet
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Price/Hour</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {venues.map((venue) => (
            <TableRow key={venue.id}>
              <TableCell className="font-medium">{venue.name}</TableCell>
              <TableCell>{venue.capacity || '-'} guests</TableCell>
              <TableCell>₱{(venue.price_per_hour || 0).toLocaleString()}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  venue.is_active 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                }`}>
                  {venue.is_active ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
