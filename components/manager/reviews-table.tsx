'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Review {
  id: string
  customer_name: string
  rating: number
  comment?: string
  created_at: string
  is_approved?: boolean
}

interface ReviewsTableProps {
  reviews?: Review[]
}

export function ReviewsTable({ reviews = [] }: ReviewsTableProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        No reviews yet
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell className="font-medium">{review.customer_name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate">{review.comment || '-'}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(review.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  review.is_approved 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {review.is_approved ? 'Approved' : 'Pending'}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
