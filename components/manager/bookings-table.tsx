'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export function BookingsTable({ bookings }: { bookings?: any[] }) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        No bookings found
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Booking #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Event Date</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Guests</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">{booking.booking_number}</TableCell>
              <TableCell>{booking.customer_name}</TableCell>
              <TableCell>{new Date(booking.event_date).toLocaleDateString()}</TableCell>
              <TableCell>{booking.venue_name || 'N/A'}</TableCell>
              <TableCell>{booking.num_guests}</TableCell>
              <TableCell>₱{Number(booking.total_amount).toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                  {booking.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
