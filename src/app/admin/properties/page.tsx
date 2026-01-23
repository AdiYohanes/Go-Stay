'use client'

import React from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MOCK_PROPERTIES } from '@/lib/mock-data'

export default function AdminPropertiesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
        <Button asChild>
          <Link href="/admin/properties/new">
            <Plus className="mr-2 h-4 w-4" /> Add Property
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_PROPERTIES.map((property) => (
              <TableRow key={property.id}>
                <TableCell>
                    <img 
                        src={property.image_urls?.[0]} 
                        alt={property.title} 
                        className="h-10 w-16 object-cover rounded-md"
                    />
                </TableCell>
                <TableCell className="font-medium">{property.title}</TableCell>
                <TableCell>{property.location}</TableCell>
                <TableCell>${property.price_per_night}/night</TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/properties/${property.id}/edit`}>Edit</Link>
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
