/**
 * Cart page - Full cart view with edit/remove options
 * Displays all cart items with price breakdown and checkout button
 * Requirements: Cart system
 */

"use client";

import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, isLoading, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  const handleRemove = async (itemId: string) => {
    await removeFromCart(itemId);
  };

  const handleClearCart = async () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      const success = await clearCart();
      if (success) {
        router.push("/");
      }
    }
  };

  const handleCheckout = () => {
    if (cart && cart.summary.allAvailable) {
      router.push("/checkout");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
          <div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <ShoppingCart className="h-24 w-24 text-muted-foreground" />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Your cart is empty</h1>
            <p className="text-muted-foreground text-lg">
              Start exploring properties and add them to your cart
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/">
              Browse Properties
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        {cart.items.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearCart}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        )}
      </div>

      {/* Cart Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <CartItem key={item.id} item={item} onRemove={handleRemove} />
          ))}
        </div>

        {/* Summary and Checkout */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            <CartSummary summary={cart.summary} showUnavailableWarning />

            {/* Checkout Button */}
            <Button
              className="w-full"
              size="lg"
              disabled={!cart.summary.allAvailable}
              onClick={handleCheckout}
            >
              Proceed to Checkout
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            {/* Continue Shopping */}
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Continue Shopping</Link>
            </Button>

            {/* Availability Notice */}
            {!cart.summary.allAvailable && (
              <div className="text-sm text-center text-muted-foreground">
                Please remove unavailable items before proceeding
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h2 className="font-semibold mb-2">Before you checkout</h2>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• All dates are subject to availability confirmation</li>
          <li>• Service fee (10%) is included in the total price</li>
          <li>
            • You can modify or cancel bookings according to the property&apos;s
            policy
          </li>
          <li>
            • Payment will be processed securely through our payment gateway
          </li>
        </ul>
      </div>
    </div>
  );
}
