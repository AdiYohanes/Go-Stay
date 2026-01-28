/**
 * Payment pending page
 * Displays pending payment status and instructions
 * Requirements: Payment gateway
 */

"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Home, Receipt, RefreshCw } from "lucide-react";
import Link from "next/link";
import { getPaymentStatus } from "@/actions/payment";
import { PaymentIntent } from "@/types/payment.types";
import { Skeleton } from "@/components/ui/skeleton";

function PaymentPendingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const [payment, setPayment] = useState<PaymentIntent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPayment = async () => {
    if (!paymentId) {
      router.push("/");
      return;
    }

    try {
      const result = await getPaymentStatus(paymentId);
      if (result.success) {
        setPayment(result.data);

        // Redirect if payment status changed
        if (
          result.data.status === "settlement" ||
          result.data.status === "capture"
        ) {
          router.push(`/checkout/success?payment_id=${paymentId}`);
        } else if (
          result.data.status === "deny" ||
          result.data.status === "cancel" ||
          result.data.status === "expire"
        ) {
          router.push(`/checkout/failed?payment_id=${paymentId}`);
        }
      } else {
        console.error("Failed to fetch payment:", result.error);
      }
    } catch (error) {
      console.error("Error fetching payment:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId, router]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchPayment();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center space-y-6">
          <Skeleton className="h-24 w-24 rounded-full mx-auto" />
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center space-y-6">
        {/* Pending Icon with Animation */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-pulse" />
            <Clock className="h-24 w-24 text-yellow-500 relative animate-in zoom-in duration-500" />
          </div>
        </div>

        {/* Pending Message */}
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-3xl font-bold text-yellow-600">
            Payment Pending
          </h1>
          <p className="text-lg text-muted-foreground">
            Your payment is being processed
          </p>
        </div>

        {/* Payment Details Card */}
        {payment && (
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono font-medium">
                  {payment.midtrans_order_id}
                </span>
              </div>

              {payment.midtrans_transaction_id && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono font-medium">
                    {payment.midtrans_transaction_id}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold text-lg">
                  ${payment.amount.toLocaleString()}
                </span>
              </div>

              {payment.payment_type && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium capitalize">
                    {payment.payment_type.replace(/_/g, " ")}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {payment.status}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information */}
        <div className="bg-muted p-4 rounded-lg text-sm text-left space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <p className="font-medium">What does this mean?</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Your payment is being verified by the payment gateway</li>
            <li>
              • This usually takes a few minutes, but can take up to 24 hours
            </li>
            <li>
              • You&apos;ll receive an email once the payment is confirmed
            </li>
            <li>
              • You can check the status anytime in &quot;My Bookings&quot;
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Checking..." : "Refresh Status"}
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/my-bookings">
              <Receipt className="h-4 w-4 mr-2" />
              My Bookings
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-muted-foreground">
          Need help? Contact our support team at{" "}
          <a href="mailto:support@example.com" className="underline">
            support@example.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default function PaymentPendingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Skeleton className="w-full max-w-md h-96" />
        </div>
      }
    >
      <PaymentPendingContent />
    </Suspense>
  );
}
