import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, CalendarDays, DollarSign, Users } from "lucide-react";
import { getProperties } from "@/actions/properties";
import { getBookings } from "@/actions/bookings";

export default async function AdminDashboard() {
  const [propertiesResult, bookings] = await Promise.all([
    getProperties({ includeInactive: true }),
    getBookings(),
  ]);

  const properties = propertiesResult.success
    ? propertiesResult.data.properties
    : [];
  const totalRevenue = bookings.reduce((acc, b) => acc + b.total_price, 0);
  const totalBookings = bookings.length;
  const totalProperties = properties.length;
  const activeBookings = bookings.filter(
    (b) => b.status === "confirmed",
  ).length;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Properties
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalProperties}</div>
            <p className="text-xs text-muted-foreground">+2 since yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Guests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{activeBookings * 2}</div>
            <p className="text-xs text-muted-foreground">+19 since last hour</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No bookings yet.
                </p>
              ) : (
                bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {/* 
                          // @ts-ignore: Supabase join typing is tricky without manual types 
                        */}
                        {booking.property?.title || "Unknown Property"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.start_date).toLocaleDateString()} -{" "}
                        {new Date(booking.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      +${booking.total_price}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
