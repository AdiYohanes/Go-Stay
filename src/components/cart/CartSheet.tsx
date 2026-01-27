/**
 * CartSheet component for slide-out cart panel
 * Displays cart items in a sheet overlay
 */

"use client";

import { useCart } from "@/hooks/useCart";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { CartItem } from "./CartItem";
import Link from "next/link";
import { useState } from "react";

interface CartSheetProps {
  children?: React.ReactNode;
}

export function CartSheet({ children }: CartSheetProps) {
  const { cart, itemCount, isLoading, removeFromCart } = useCart();
  const [open, setOpen] = useState(false);

  const handleRemove = async (itemId: string) => {
    await removeFromCart(itemId);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {itemCount}
              </span>
            )}
            <span className="sr-only">Shopping cart</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {itemCount === 0
              ? "Your cart is empty"
              : `${itemCount} ${itemCount === 1 ? "item" : "items"} in your cart`}
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading cart...</div>
          </div>
        ) : cart && cart.items.length > 0 ? (
          <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Cart Items */}
            <div className="flex-1 -mx-6 px-6 mt-6 overflow-y-auto">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <CartItem key={item.id} item={item} onRemove={handleRemove} />
                ))}
              </div>
            </div>

            {/* Summary and Actions */}
            <div className="border-t pt-4 mt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cart.summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service fee</span>
                  <span>${cart.summary.totalServiceFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${cart.summary.total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                asChild
                className="w-full"
                disabled={!cart.summary.allAvailable}
                onClick={() => setOpen(false)}
              >
                <Link href="/cart">
                  View Full Cart
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              {!cart.summary.allAvailable && (
                <p className="text-xs text-destructive text-center">
                  Some items are unavailable
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button asChild variant="outline" onClick={() => setOpen(false)}>
              <Link href="/">Browse Properties</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
