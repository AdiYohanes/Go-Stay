import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { formatRupiah } from "@/lib/mock-data";

type BookingWithProperty = {
  id: string;
  user_id: string;
  property_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  created_at: string;
  property: {
    id: string;
    title: string;
    location: string;
    image_urls: string[];
  } | null;
};

export default async function MyBookingsPage() {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch bookings from database with property details
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      property:properties (
        id,
        title,
        location,
        image_urls
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Silently handle error - table might not exist yet
  const userBookings = (bookings as BookingWithProperty[]) || [];

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Booking Saya</h1>
      <p className="text-muted-foreground mb-8">
        Kelola dan lihat semua booking Anda
      </p>

      <div className="grid gap-6">
        {userBookings.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                <CalendarIcon className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  Belum Ada Booking
                </h3>
                <p className="text-muted-foreground text-sm">
                  Anda belum memiliki booking. Mulai jelajahi resort dan buat
                  booking pertama Anda!
                </p>
              </div>
              <div className="pt-4">
                <a
                  href="/properties"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Jelajahi Resort
                </a>
              </div>
            </div>
          </Card>
        ) : (
          userBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 lg:w-1/4 h-48 md:h-auto relative">
                  <img
                    src={
                      booking.property?.image_urls?.[0] || "/placeholder.jpg"
                    }
                    alt={booking.property?.title || "Property"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 lg:w-3/4 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-xl mb-1">
                        {booking.property?.title || "Property"}
                      </h3>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {booking.property?.location || "Location"}
                      </div>
                    </div>
                    <Badge
                      variant={
                        booking.status === "confirmed" ? "default" : "secondary"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <CalendarIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                          Check-in
                        </p>
                        <p className="font-medium">
                          {format(parseISO(booking.start_date), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <CalendarIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                          Check-out
                        </p>
                        <p className="font-medium">
                          {format(parseISO(booking.end_date), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Total: </span>
                      <span className="font-bold text-lg">
                        {formatRupiah(booking.total_price)}
                      </span>
                    </div>
                    {/* Add Cancel Booking button logic later */}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
