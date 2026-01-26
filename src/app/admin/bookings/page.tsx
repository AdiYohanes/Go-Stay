import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { getBookings } from '@/actions/bookings'

export default async function AdminBookingsPage() {
  const bookings = await getBookings()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Manage Bookings</h1>
      
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
               <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                     {/* @ts-ignore */}
                     {booking.property?.title || 'Unknown Property'}
                  </TableCell>
                  <TableCell>
                    {/* In real app, we might join profile/user data */}
                    {booking.user_id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${booking.total_price}</TableCell>
                  <TableCell>
                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
