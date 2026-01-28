import { redirect } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { BookingCard } from "@/components/booking/BookingCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Bookings | Hotel Booking",
  description: "View and manage your bookings",
};

export default async function BookingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all user bookings with property details
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      property:properties (
        id,
        title,
        location,
        image_urls,
        price_per_night
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookings:", error);
  }

  const allBookings = (bookings || []) as any[];

  // Filter bookings by status
  const today = new Date();
  const upcomingBookings = allBookings.filter(
    (booking: any) =>
      new Date(booking.start_date) > today &&
      (booking.status === "confirmed" || booking.status === "pending"),
  );
  const completedBookings = allBookings.filter(
    (booking: any) =>
      new Date(booking.end_date) < today || booking.status === "completed",
  );
  const cancelledBookings = allBookings.filter(
    (booking: any) => booking.status === "cancelled",
  );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Bookings
          </h1>
          <p className="text-muted-foreground">
            View and manage all your property bookings
          </p>
        </div>

        {/* Tabs for filtering */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all">All ({allBookings.length})</TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledBookings.length})
            </TabsTrigger>
          </TabsList>

          {/* All Bookings */}
          <TabsContent value="all" className="space-y-6">
            {allBookings.length === 0 ? (
              <EmptyState />
            ) : (
              allBookings.map((booking: any) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>

          {/* Upcoming Bookings */}
          <TabsContent value="upcoming" className="space-y-6">
            {upcomingBookings.length === 0 ? (
              <EmptyState message="You have no upcoming bookings" />
            ) : (
              upcomingBookings.map((booking: any) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>

          {/* Completed Bookings */}
          <TabsContent value="completed" className="space-y-6">
            {completedBookings.length === 0 ? (
              <EmptyState message="You have no completed bookings" />
            ) : (
              completedBookings.map((booking: any) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>

          {/* Cancelled Bookings */}
          <TabsContent value="cancelled" className="space-y-6">
            {cancelledBookings.length === 0 ? (
              <EmptyState message="You have no cancelled bookings" />
            ) : (
              cancelledBookings.map((booking: any) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function EmptyState({
  message = "You have no bookings yet",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Calendar className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{message}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Start exploring amazing properties and book your next adventure
      </p>
      <Button asChild>
        <Link href="/properties">
          <Package className="h-4 w-4 mr-2" />
          Browse Properties
        </Link>
      </Button>
    </div>
  );
}
