/**
 * Admin Dashboard Overview Page
 * Requirements: 5.1, 5.5
 */

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/ui/FadeIn";
import { ScaleIn } from "@/components/ui/ScaleIn";
import {
  getDashboardMetrics,
  getBookingTrends,
  getRevenueStats,
  getAdminBookings,
  getAdminPayments,
  DashboardMetrics,
  BookingTrendDataPoint,
  RevenueStats,
} from "@/actions/admin";
import { BookingWithDetails } from "@/types/booking.types";
import { PaymentIntent } from "@/types/payment.types";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building,
  CalendarDays,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [bookingTrends, setBookingTrends] = useState<BookingTrendDataPoint[]>(
    [],
  );
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<BookingWithDetails[]>(
    [],
  );
  const [recentPayments, setRecentPayments] = useState<PaymentIntent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      try {
        // Fetch all dashboard data in parallel
        const [
          metricsResult,
          trendsResult,
          revenueResult,
          bookingsResult,
          paymentsResult,
        ] = await Promise.all([
          getDashboardMetrics(),
          getBookingTrends({ groupBy: "day" }),
          getRevenueStats({ groupBy: "month" }),
          getAdminBookings({ limit: 5 }),
          getAdminPayments({ limit: 5 }),
        ]);

        if (metricsResult.success) {
          setMetrics(metricsResult.data);
        }

        if (trendsResult.success) {
          setBookingTrends(trendsResult.data);
        }

        if (revenueResult.success) {
          setRevenueStats(revenueResult.data);
        }

        if (bookingsResult.success) {
          setRecentBookings(bookingsResult.data.bookings);
        }

        if (paymentsResult.success) {
          setRecentPayments(paymentsResult.data.payments);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor your platform's performance and key metrics
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ScaleIn delay={0}>
          <MetricCard
            title="Total Revenue"
            value={`$${metrics?.totalRevenue.toLocaleString() || 0}`}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            trend={revenueStats?.revenueGrowth}
          />
        </ScaleIn>

        <ScaleIn delay={0.1}>
          <MetricCard
            title="Total Bookings"
            value={metrics?.totalBookings || 0}
            icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
            subtitle={`${metrics?.confirmedBookings || 0} confirmed`}
          />
        </ScaleIn>

        <ScaleIn delay={0.2}>
          <MetricCard
            title="Active Properties"
            value={metrics?.activeProperties || 0}
            icon={<Building className="h-4 w-4 text-muted-foreground" />}
            subtitle={`${metrics?.totalProperties || 0} total`}
          />
        </ScaleIn>

        <ScaleIn delay={0.3}>
          <MetricCard
            title="Pending Bookings"
            value={metrics?.pendingBookings || 0}
            icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            subtitle="Awaiting confirmation"
          />
        </ScaleIn>
      </div>

      {/* Booking Status Overview */}
      <FadeIn delay={0.4}>
        <Card>
          <CardHeader>
            <CardTitle>Booking Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <StatusCard
                label="Confirmed"
                value={metrics?.confirmedBookings || 0}
                icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                color="green"
              />
              <StatusCard
                label="Pending"
                value={metrics?.pendingBookings || 0}
                icon={<Clock className="h-5 w-5 text-yellow-500" />}
                color="yellow"
              />
              <StatusCard
                label="Completed"
                value={metrics?.completedBookings || 0}
                icon={<CheckCircle className="h-5 w-5 text-blue-500" />}
                color="blue"
              />
              <StatusCard
                label="Cancelled"
                value={metrics?.cancelledBookings || 0}
                icon={<XCircle className="h-5 w-5 text-red-500" />}
                color="red"
              />
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <FadeIn delay={0.5}>
          <Card>
            <CardHeader>
              <CardTitle>Booking Trends (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingTrendsChart data={bookingTrends} />
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.6}>
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Month</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart data={revenueStats?.revenueByPeriod || []} />
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <FadeIn delay={0.7}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentBookingsList bookings={recentBookings} />
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.8}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentPaymentsList payments={recentPayments} />
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  title,
  value,
  icon,
  subtitle,
  trend,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: number;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            {trend >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span
              className={`text-xs font-medium ${
                trend >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {Math.abs(trend).toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">
              vs last period
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Status Card Component
function StatusCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
      {icon}
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

// Simple Booking Trends Chart (using CSS bars)
function BookingTrendsChart({ data }: { data: BookingTrendDataPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No booking data available</p>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <div className="space-y-2">
      {data.slice(-10).map((point, index) => (
        <div key={point.date} className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-20">
            {format(new Date(point.date), "MMM dd")}
          </span>
          <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${(point.count / maxCount) * 100}%` }}
            >
              <span className="text-xs font-medium text-primary-foreground">
                {point.count}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Simple Revenue Chart (using CSS bars)
function RevenueChart({
  data,
}: {
  data: { period: string; revenue: number }[];
}) {
  if (!data || data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No revenue data available</p>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="space-y-2">
      {data.slice(-6).map((point) => (
        <div key={point.period} className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-20">
            {point.period}
          </span>
          <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
            <div
              className="bg-green-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${(point.revenue / maxRevenue) * 100}%` }}
            >
              <span className="text-xs font-medium text-white">
                ${point.revenue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Recent Bookings List
function RecentBookingsList({ bookings }: { bookings: BookingWithDetails[] }) {
  if (!bookings || bookings.length === 0) {
    return <p className="text-sm text-muted-foreground">No recent bookings</p>;
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="flex items-center justify-between p-3 rounded-lg border"
        >
          <div className="flex-1">
            <p className="font-medium text-sm">{booking.property.title}</p>
            <p className="text-xs text-muted-foreground">
              {booking.user.full_name || booking.user.email}
            </p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(booking.start_date), "MMM dd")} -{" "}
              {format(new Date(booking.end_date), "MMM dd, yyyy")}
            </p>
          </div>
          <div className="text-right">
            <Badge
              variant={
                booking.status === "confirmed"
                  ? "default"
                  : booking.status === "pending"
                    ? "secondary"
                    : booking.status === "completed"
                      ? "outline"
                      : "destructive"
              }
            >
              {booking.status}
            </Badge>
            <p className="text-sm font-medium mt-1">${booking.total_price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Recent Payments List
function RecentPaymentsList({ payments }: { payments: PaymentIntent[] }) {
  if (!payments || payments.length === 0) {
    return <p className="text-sm text-muted-foreground">No recent payments</p>;
  }

  return (
    <div className="space-y-3">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="flex items-center justify-between p-3 rounded-lg border"
        >
          <div className="flex-1">
            <p className="font-medium text-sm">
              Order #{payment.midtrans_order_id}
            </p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(payment.created_at), "MMM dd, yyyy HH:mm")}
            </p>
          </div>
          <div className="text-right">
            <Badge
              variant={
                payment.status === "success"
                  ? "default"
                  : payment.status === "pending"
                    ? "secondary"
                    : "destructive"
              }
            >
              {payment.status}
            </Badge>
            <p className="text-sm font-medium mt-1">${payment.amount}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Dashboard Skeleton
function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 mt-2" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-20 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
