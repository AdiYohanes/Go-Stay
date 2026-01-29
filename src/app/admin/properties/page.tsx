/**
 * Admin Property Management Page
 * Requirements: 5.4
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/ui/FadeIn";
import { AnimatedList } from "@/components/ui/AnimatedList";
import { getAdminProperties } from "@/actions/admin";
import { deleteProperty } from "@/actions/properties";
import { Property } from "@/types/property.types";
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminPropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const limit = 12;

  useEffect(() => {
    fetchProperties();
  }, [page]);

  async function fetchProperties() {
    setIsLoading(true);
    try {
      const result = await getAdminProperties({
        page,
        limit,
        includeInactive: true,
      });

      if (result.success) {
        setProperties(result.data.properties);
        setTotalPages(result.data.totalPages);
        setHasMore(result.data.hasMore);
      } else {
        toast.error(result.error || "Failed to fetch properties");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to fetch properties");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteProperty() {
    if (!propertyToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteProperty(propertyToDelete.id);

      if (result.success) {
        toast.success("Property deleted successfully");
        setDeleteDialogOpen(false);
        setPropertyToDelete(null);
        // Refresh the list
        fetchProperties();
      } else {
        toast.error(result.error || "Failed to delete property");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
    } finally {
      setIsDeleting(false);
    }
  }

  function openDeleteDialog(property: Property) {
    setPropertyToDelete(property);
    setDeleteDialogOpen(true);
  }

  if (isLoading && page === 1) {
    return <PropertiesPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground mt-2">
            Manage all properties on the platform
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/properties/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No properties found</p>
            <Button asChild>
              <Link href="/admin/properties/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Property
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <AnimatedList
            items={properties}
            keyExtractor={(property) => property.id}
            renderItem={(property, index) => (
              <FadeIn delay={index * 0.05}>
                <PropertyCard
                  property={property}
                  onEdit={() =>
                    router.push(`/admin/properties/${property.id}/edit`)
                  }
                  onDelete={() => openDeleteDialog(property)}
                />
              </FadeIn>
            )}
            animation="fade"
            staggerDelay={0.05}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                      disabled={isLoading}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasMore || isLoading}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{propertyToDelete?.title}"? This
              action will soft-delete the property and it will no longer appear
              in search results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProperty}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Property Card Component
function PropertyCard({
  property,
  onEdit,
  onDelete,
}: {
  property: Property;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const imageUrl = property.image_urls?.[0] || "/placeholder-property.jpg";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative w-full md:w-48 h-48 md:h-auto bg-muted">
          <img
            src={imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          {!property.is_active && (
            <div className="absolute top-2 left-2">
              <Badge variant="destructive">Inactive</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <MapPin className="h-4 w-4" />
                <span>{property.location}</span>
              </div>

              {property.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {property.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    ${property.price_per_night}
                  </span>
                  <span className="text-muted-foreground">/night</span>
                </div>

                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{property.max_guests} guests</span>
                </div>

                {property.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">
                      {property.rating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                      ({property.review_count || 0})
                    </span>
                  </div>
                )}
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {property.amenities.slice(0, 3).map((amenity) => (
                    <Badge
                      key={amenity}
                      variant="secondary"
                      className="text-xs"
                    >
                      {amenity}
                    </Badge>
                  ))}
                  {property.amenities.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{property.amenities.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 ml-4">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Properties Page Skeleton
function PropertiesPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <div className="flex flex-col md:flex-row">
              <Skeleton className="w-full md:w-48 h-48" />
              <div className="flex-1 p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
