import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  MapPinIcon,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { formatRupiah } from "@/lib/mock-data";
import Link from "next/link";

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

const getStatusConfig = (status: string) => {
  switch (status) {
    case "confirmed":
      return {
        label: "Terkonfirmasi",
        icon: CheckCircle2,
        className: "bg-teal-50 text-teal-700 border-teal-200",
      };
    case "pending":
      return {
        label: "Menunggu",
        icon: AlertCircle,
        className: "bg-amber-50 text-amber-700 border-amber-200",
      };
    case "cancelled":
      return {
        label: "Dibatalkan",
        icon: XCircle,
        className: "bg-red-50 text-red-700 border-red-200",
      };
    default:
      return {
        label: status,
        icon: AlertCircle,
        className: "bg-gray-50 text-gray-700 border-gray-200",
      };
  }
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-teal-600 text-white">
        <div className="container px-4 py-12 md:px-6 md:py-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Booking Saya</h1>
          </div>
          <p className="text-teal-50 text-lg">
            {userBookings.length > 0
              ? `${userBookings.length} booking ditemukan`
              : "Belum ada booking"}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container px-4 py-8 md:px-6 md:py-12">
        {userBookings.length === 0 ? (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-teal-600" />
              </div>
              <h3 className="font-bold text-xl mb-2">Mulai Petualangan Anda</h3>
              <p className="text-gray-600 text-sm mb-6">
                Belum ada booking. Jelajahi resort-resort menakjubkan dan buat
                kenangan indah bersama kami!
              </p>
              <Link href="/properties">
                <Button
                  size="lg"
                  className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg"
                >
                  Jelajahi Resort
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 max-w-5xl mx-auto">
            {userBookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              const StatusIcon = statusConfig.icon;
              const nights = differenceInDays(
                parseISO(booking.end_date),
                parseISO(booking.start_date),
              );

              return (
                <div
                  key={booking.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="md:flex">
                    {/* Image Section */}
                    <div className="md:w-2/5 relative overflow-hidden">
                      <div className="aspect-[4/3] md:aspect-auto md:h-full relative">
                        <img
                          src={
                            booking.property?.image_urls?.[0] ||
                            "/placeholder.jpg"
                          }
                          alt={booking.property?.title || "Property"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/30" />

                        {/* Status Badge on Image */}
                        <div className="absolute top-4 left-4">
                          <div
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-sm ${statusConfig.className}`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            <span className="text-xs font-semibold">
                              {statusConfig.label}
                            </span>
                          </div>
                        </div>

                        {/* Nights Badge */}
                        <div className="absolute bottom-4 left-4">
                          <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <span className="text-xs font-semibold text-gray-900">
                              {nights} Malam
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="md:w-3/5 p-6 md:p-8">
                      {/* Property Info */}
                      <div className="mb-6">
                        <h3 className="font-bold text-xl md:text-2xl mb-2 text-gray-900 group-hover:text-teal-600 transition-colors">
                          {booking.property?.title || "Property"}
                        </h3>
                        <div className="flex items-center text-gray-600">
                          <MapPinIcon className="h-4 w-4 mr-1.5 text-teal-600" />
                          <span className="text-sm">
                            {booking.property?.location || "Location"}
                          </span>
                        </div>
                      </div>

                      {/* Date Info */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-teal-100 rounded-lg">
                              <CalendarIcon className="h-4 w-4 text-teal-600" />
                            </div>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Check-in
                            </span>
                          </div>
                          <p className="font-bold text-gray-900">
                            {format(
                              parseISO(booking.start_date),
                              "dd MMM yyyy",
                            )}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-cyan-100 rounded-lg">
                              <CalendarIcon className="h-4 w-4 text-cyan-600" />
                            </div>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Check-out
                            </span>
                          </div>
                          <p className="font-bold text-gray-900">
                            {format(parseISO(booking.end_date), "dd MMM yyyy")}
                          </p>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Total Pembayaran
                          </p>
                          <p className="font-bold text-2xl text-teal-600">
                            {formatRupiah(booking.total_price)}
                          </p>
                        </div>
                        <Link href={`/property/${booking.property_id}`}>
                          <Button
                            variant="outline"
                            className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300"
                          >
                            Lihat Detail
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
