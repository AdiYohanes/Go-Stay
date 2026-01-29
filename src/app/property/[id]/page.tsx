import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";
import { MobileBookingFooter } from "@/components/booking/MobileBookingFooter";
import { getProperty } from "@/actions/properties";
import { getPropertyReviews } from "@/actions/review";
import { Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DynamicPropertyGallery,
  DynamicBookingWidget,
  DynamicReviewList,
} from "@/lib/dynamic-imports";
import { PropertyDetails } from "@/components/property/PropertyDetails";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getProperty(id);

  if (!result.success || !result.data) {
    return {
      title: "Property Not Found",
    };
  }

  const property = result.data;

  return {
    title: `${property.title} | Hotel Booking`,
    description:
      property.description || `Book ${property.title} in ${property.location}`,
    openGraph: {
      title: property.title,
      description:
        property.description ||
        `Book ${property.title} in ${property.location}`,
      images: property.image_urls?.[0] ? [property.image_urls[0]] : [],
      type: "website",
    },
  };
}

export default async function PropertyPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getProperty(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const property = result.data;

  // Fetch reviews
  const reviewsResult = await getPropertyReviews(id);
  const reviews = reviewsResult.success ? reviewsResult.data : [];

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : null;

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: property.title,
    description: property.description,
    image: property.image_urls,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location,
    },
    priceRange: `$${property.price_per_night}`,
    aggregateRating: averageRating
      ? {
          "@type": "AggregateRating",
          ratingValue: averageRating.toFixed(1),
          reviewCount: reviews.length,
        }
      : undefined,
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen pb-20 md:pb-10">
        <div className="container max-w-[1280px] mx-auto px-4 py-6 md:px-6 md:py-8 lg:py-10">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
              {property.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm md:text-base text-muted-foreground">
              {averageRating && (
                <>
                  <span className="flex items-center gap-1 text-foreground font-semibold">
                    ★ {averageRating.toFixed(2)}
                  </span>
                  <span>·</span>
                  <span className="underline">{reviews.length} reviews</span>
                  <span>·</span>
                </>
              )}
              <span className="underline">{property.location}</span>
            </div>
          </div>

          {/* Gallery */}
          <Suspense
            fallback={
              <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px] rounded-xl overflow-hidden">
                <Skeleton className="col-span-4 md:col-span-2 row-span-2" />
                <Skeleton className="col-span-2 md:col-span-1" />
                <Skeleton className="col-span-2 md:col-span-1" />
                <Skeleton className="col-span-2 md:col-span-1" />
                <Skeleton className="col-span-2 md:col-span-1" />
              </div>
            }
          >
            <DynamicPropertyGallery
              images={property.image_urls || []}
              title={property.title}
            />
          </Suspense>

          <div className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 relative">
            {/* Main Content Column */}
            <div className="space-y-8">
              {/* Property Details */}
              <PropertyDetails property={property} />

              {/* Reviews Section */}
              {reviews.length > 0 && (
                <div className="pb-6 border-t border-border pt-8">
                  <Suspense
                    fallback={
                      <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Skeleton key={i} className="h-32 w-full" />
                        ))}
                      </div>
                    }
                  >
                    <DynamicReviewList
                      propertyId={property.id}
                      initialReviews={reviews}
                    />
                  </Suspense>
                </div>
              )}
            </div>

            {/* Sidebar / Booking Widget (Desktop) */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
                  <DynamicBookingWidget property={property} />
                </Suspense>
                <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground text-sm">
                  <Shield className="h-4 w-4" />
                  <span>Report this listing</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Booking Footer */}
        <MobileBookingFooter property={property} />
      </div>
    </>
  );
}
