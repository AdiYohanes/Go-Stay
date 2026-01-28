import { redirect } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyGrid, EmptyGridState } from "@/components/layout/PropertyGrid";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Favorites | Hotel Booking",
  description: "View your favorite properties",
};

export default async function FavoritesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user's favorite properties
  const { data: favorites, error } = await supabase
    .from("favorites")
    .select(
      `
      id,
      created_at,
      property:properties (
        id,
        title,
        description,
        price_per_night,
        location,
        image_urls,
        amenities,
        max_guests,
        bedrooms,
        beds,
        bathrooms,
        rating,
        review_count,
        is_active,
        created_at,
        updated_at
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching favorites:", error);
  }

  // Extract properties from favorites
  const properties = ((favorites || []) as any[])
    .map((fav: any) => fav.property)
    .filter((prop: any) => prop && prop.is_active);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-6 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Favorites
          </h1>
          <p className="text-muted-foreground">
            {properties.length > 0
              ? `You have ${properties.length} ${properties.length === 1 ? "favorite property" : "favorite properties"}`
              : "Save properties you love to easily find them later"}
          </p>
        </div>

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <EmptyGridState
            title="No favorites yet"
            description="Start exploring properties and save your favorites by clicking the heart icon. They'll appear here for easy access."
            action={
              <Button asChild size="lg">
                <Link href="/properties">
                  <Heart className="h-4 w-4 mr-2" />
                  Browse Properties
                </Link>
              </Button>
            }
          />
        ) : (
          <PropertyGrid>
            {properties.map((property: any) => (
              <PropertyCard
                key={property.id}
                property={property}
                showRating={true}
              />
            ))}
          </PropertyGrid>
        )}
      </div>
    </div>
  );
}
