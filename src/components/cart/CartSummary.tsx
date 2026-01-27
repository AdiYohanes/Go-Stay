/**
 * CartSummary component for displaying cart totals
 * Shows subtotal, service fees, and total price
 */

"use client";

import { CartSummary as CartSummaryType } from "@/types/cart.types";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";

interface CartSummaryProps {
  summary: CartSummaryType;
  showUnavailableWarning?: boolean;
}

export function CartSummary({
  summary,
  showUnavailableWarning = true,
}: CartSummaryProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      <div className="space-y-3">
        {/* Item Count */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {summary.itemCount} {summary.itemCount === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Subtotal */}
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${summary.subtotal.toFixed(2)}</span>
        </div>

        {/* Service Fee */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Service fee (10%)</span>
          <span className="text-muted-foreground">
            ${summary.totalServiceFee.toFixed(2)}
          </span>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${summary.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Unavailable Warning */}
      {showUnavailableWarning && !summary.allAvailable && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive rounded-md flex gap-2">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">
            Some items in your cart are no longer available. Please remove them
            before proceeding to checkout.
          </p>
        </div>
      )}
    </Card>
  );
}
