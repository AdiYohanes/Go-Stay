/**
 * Checkout page - Order summary and payment processing
 * Integrates Midtrans Snap popup for payment
 * Requirements: Payment gateway
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import Link from "next/link";
import { createMidtransTransaction } from "@/actions/payment";
import { getMidtransClientKey, getMidtransSnapScriptUrl } from "@/lib/midtrans";
import {
  showPaymentProcessing,
  showPaymentSuccess,
  showPaymentFailed,
  showPaymentPending,
  showValidationError,
  dismissToast,
} from "@/lib/toast-utils";

// Declare Midtrans Snap type
declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess: (result: unknown) => void;
          onPending: (result: unknown) => void;
          onError: (result: unknown) => void;
          onClose: () => void;
        },
      ) => void;
    };
  }
}

export default function CheckoutPage() {
  const { cart, isLoading } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [snapLoaded, setSnapLoaded] = useState(false);

  // Load Midtrans Snap script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = getMidtransSnapScriptUrl();
    script.setAttribute("data-client-key", getMidtransClientKey());
    script.async = true;
    script.onload = () => setSnapLoaded(true);
    script.onerror = () => {
      console.error("Failed to load Midtrans Snap script");
      showValidationError("Failed to load payment gateway");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!cart || cart.items.length === 0) {
      showValidationError("Your cart is empty");
      return;
    }

    if (!cart.summary.allAvailable) {
      showValidationError(
        "Some items are unavailable. Please remove them first.",
      );
      return;
    }

    if (!snapLoaded) {
      showValidationError("Payment gateway is still loading. Please wait.");
      return;
    }

    setIsProcessing(true);
    const loadingToast = showPaymentProcessing();

    try {
      // Create Midtrans transaction
      const result = await createMidtransTransaction();

      if (!result.success) {
        throw new Error(result.error || "Failed to create payment");
      }

      const payment = result.data;
      dismissToast(loadingToast);

      // Open Midtrans Snap popup
      if (window.snap && payment.snap_token) {
        window.snap.pay(payment.snap_token, {
          onSuccess: (result) => {
            console.log("Payment success:", result);
            showPaymentSuccess();
            router.push(`/checkout/success?payment_id=${payment.id}`);
          },
          onPending: (result) => {
            console.log("Payment pending:", result);
            showPaymentPending();
            router.push(`/checkout/pending?payment_id=${payment.id}`);
          },
          onError: (result) => {
            console.error("Payment error:", result);
            showPaymentFailed();
            router.push(`/checkout/failed?payment_id=${payment.id}`);
          },
          onClose: () => {
            console.log("Payment popup closed");
            setIsProcessing(false);
          },
        });
      } else {
        throw new Error("Payment gateway not available");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      dismissToast(loadingToast);
      showPaymentFailed(error instanceof Error ? error.message : undefined);
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground">
            Add items to your cart before checking out
          </p>
          <Button asChild>
            <Link href="/">Browse Properties</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/cart">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      <div className="space-y-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cart Items List */}
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 pb-3 border-b last:border-0"
                >
                  {/* Property Image */}
                  {item.property.image_urls &&
                    item.property.image_urls.length > 0 && (
                      <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.property.image_urls[0]}
                          alt={item.property.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}

                  {/* Property Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">
                      {item.property.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {item.property.location}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.check_in).toLocaleDateString()} -{" "}
                      {new Date(item.check_out).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.guests} guest{item.guests > 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <p className="font-semibold">
                      ${item.pricing.total.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.pricing.nights} night
                      {item.pricing.nights > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <CartSummary summary={cart.summary} />
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You will be redirected to our secure payment gateway to complete
                your transaction.
              </p>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Secured by Midtrans Payment Gateway</span>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>Accepted payment methods:</p>
                <ul className="list-disc list-inside ml-2">
                  <li>Credit/Debit Cards (Visa, Mastercard, JCB)</li>
                  <li>Bank Transfer</li>
                  <li>E-Wallets (GoPay, OVO, DANA, etc.)</li>
                  <li>Convenience Store</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Availability Warning */}
        {!cart.summary.allAvailable && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive font-medium">
                ⚠️ Some items in your cart are no longer available. Please
                return to your cart and remove them before proceeding.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            asChild
            variant="outline"
            className="flex-1"
            disabled={isProcessing}
          >
            <Link href="/cart">Back to Cart</Link>
          </Button>
          <Button
            className="flex-1"
            size="lg"
            onClick={handlePayment}
            disabled={!cart.summary.allAvailable || isProcessing || !snapLoaded}
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Pay ${cart.summary.total.toLocaleString()}
              </>
            )}
          </Button>
        </div>

        {/* Terms */}
        <p className="text-xs text-center text-muted-foreground">
          By completing this purchase, you agree to our{" "}
          <Link href="/terms" className="underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
