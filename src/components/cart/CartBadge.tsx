/**
 * CartBadge component for header icon with count
 * Displays shopping cart icon with item count badge
 */

"use client";

import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

interface CartBadgeProps {
  variant?: "link" | "button";
  className?: string;
}

export function CartBadge({
  variant = "link",
  className = "",
}: CartBadgeProps) {
  const { itemCount, isLoading } = useCart();

  if (variant === "button") {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`relative ${className}`}
        asChild
      >
        <Link href="/cart">
          <ShoppingCart className="h-5 w-5" />
          {!isLoading && itemCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
          <span className="sr-only">Shopping cart with {itemCount} items</span>
        </Link>
      </Button>
    );
  }

  return (
    <Link
      href="/cart"
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <ShoppingCart className="h-5 w-5" />
      {!isLoading && itemCount > 0 && (
        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
      <span className="sr-only">Shopping cart with {itemCount} items</span>
    </Link>
  );
}
