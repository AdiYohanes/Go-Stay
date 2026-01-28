/**
 * Header component with responsive navigation
 * Requirements: 8.7
 *
 * Features:
 * - Hamburger menu for mobile
 * - Full navigation for desktop
 * - User menu dropdown with profile/bookings/logout
 * - CartBadge and NotificationBell integration
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  Globe,
  Home,
  Search,
  Heart,
  Calendar,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { CartBadge } from "@/components/cart/CartBadge";
import { NotificationBell } from "@/components/notification/NotificationBell";
import { MobileSearchWizard } from "@/components/home/MobileSearchWizard";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

// Navigation links configuration
const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/favorites", label: "Favorites", icon: Heart, requiresAuth: true },
  {
    href: "/my-bookings",
    label: "My Bookings",
    icon: Calendar,
    requiresAuth: true,
  },
];

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Settings },
  { href: "/admin/properties", label: "Properties", icon: Home },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
];

export function Header({ className }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut, isLoading } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if user is admin (you'd typically check this from user metadata or a separate query)
  const isAdmin = user?.user_metadata?.role === "admin";

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
    router.refresh();
  };

  // Check if we're on the homepage
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter nav links based on auth status
  const filteredNavLinks = navLinks.filter(
    (link) => !link.requiresAuth || user,
  );

  return (
    <header
      className={cn(
        "top-0 z-50 h-[80px] transition-all duration-300 w-full",
        isHomePage
          ? isScrolled
            ? "fixed bg-background/80 backdrop-blur-md shadow-sm"
            : "fixed bg-transparent"
          : "sticky bg-background border-b border-border/40 shadow-sm",
        className,
      )}
    >
      <div className="w-full max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 shrink-0">
          <svg
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="presentation"
            focusable="false"
            className={cn(
              "block h-8 w-8 fill-current transition-colors",
              isHomePage && !isScrolled ? "text-white" : "text-primary",
            )}
          >
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 3.162.726 4.692-.246 2.039-1.487 3.818-3.418 4.908l-.132.071c-.704.372-1.503.627-2.368.75l-.27.03c-2.02.197-4.023-.197-5.91-.977l-.466-.2-1.037-.461-.653.287c-2.31 1.055-4.636 1.34-6.852 1.045l-.469-.074c-2.333-.42-4.226-2.062-5.06-4.305l-.112-.32c-.528-1.571-.476-3.19.167-4.81l.143-.341c.983-2.28 5.152-11.01 7.114-14.85l.536-1.015C12.536 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.926 3.776-6.06 12.43-7.031 14.692-.513 1.239-.569 2.508-.157 3.73l.07.199c.642 1.738 2.052 3.003 3.8 3.32l.275.042c1.725.228 3.518-.016 5.257-.864l1.192-.598.106.05c1.458.694 3.018.995 4.58.913l.354-.025c.607-.058 1.189-.2 1.716-.426l.169-.077c1.493-.765 2.457-2.025 2.666-3.51.139-1.127-.052-2.327-.565-3.551l-.146-.333c-.981-2.28-5.148-10.993-7.098-14.81l-.545-1.049C18.053 3.539 17.24 3 16 3zm0 5c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 2c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z"></path>
          </svg>
          <span
            className={cn(
              "font-bold text-xl hidden md:block transition-colors",
              isHomePage && !isScrolled ? "text-white" : "text-primary",
            )}
          >
            go-stay
          </span>
        </Link>

        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="hidden lg:flex items-center gap-1">
          {filteredNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  isHomePage && !isScrolled
                    ? isActive
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                    : isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Search Trigger - Only show when not on homepage */}
        {!isHomePage && (
          <div className="lg:hidden flex-1 flex justify-center px-4">
            <MobileSearchWizard />
          </div>
        )}

        {/* Spacer on homepage mobile */}
        {isHomePage && <div className="lg:hidden flex-1" />}

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Language selector - Desktop only */}
          <div className="hidden md:block">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full",
                isHomePage && !isScrolled && "text-white hover:bg-white/20",
              )}
            >
              <Globe className="h-4 w-4" />
              <span className="sr-only">Select language</span>
            </Button>
          </div>

          {/* Cart Badge */}
          {user && (
            <div
              className={cn(
                isHomePage && !isScrolled && "text-white [&_svg]:text-white",
              )}
            >
              <CartBadge variant="button" />
            </div>
          )}

          {/* Notification Bell - Only for authenticated users */}
          {user && (
            <div
              className={cn(
                isHomePage && !isScrolled && "text-white [&_svg]:text-white",
              )}
            >
              <NotificationBell />
            </div>
          )}

          {/* Mobile Menu - Hamburger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full",
                  isHomePage && !isScrolled && "text-white hover:bg-white/20",
                )}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-6">
                {filteredNavLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    </SheetClose>
                  );
                })}

                {/* Admin links for admin users */}
                {isAdmin && (
                  <>
                    <div className="border-t my-2" />
                    <p className="px-4 py-2 text-sm font-semibold text-muted-foreground">
                      Admin
                    </p>
                    {adminLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href;
                      return (
                        <SheetClose asChild key={link.href}>
                          <Link
                            href={link.href}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-foreground hover:bg-muted",
                            )}
                          >
                            <Icon className="h-5 w-5" />
                            {link.label}
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </>
                )}

                {/* Auth section in mobile menu */}
                <div className="border-t my-2" />
                {user ? (
                  <>
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={user.user_metadata?.avatar_url}
                            alt={user.email || ""}
                          />
                          <AvatarFallback>
                            {user.email?.charAt(0).toUpperCase() || (
                              <User className="h-4 w-4" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {user.user_metadata?.full_name || "Guest"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        className="justify-start px-4 py-3 h-auto text-base font-medium"
                        onClick={handleSignOut}
                      >
                        Log out
                      </Button>
                    </SheetClose>
                  </>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Link
                        href="/login"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-colors hover:bg-muted"
                      >
                        Log in
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/register"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors hover:bg-muted"
                      >
                        Sign up
                      </Link>
                    </SheetClose>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop User Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden lg:flex">
              <button
                className={cn(
                  "flex items-center gap-3 rounded-full border p-1 pl-3 hover:shadow-md transition-all ml-1",
                  isHomePage && !isScrolled
                    ? "border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
                    : "border-border",
                )}
              >
                <Menu className="h-4 w-4" />
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.user_metadata?.avatar_url}
                    alt={user?.email || ""}
                  />
                  <AvatarFallback
                    className={cn(
                      "text-xs",
                      isHomePage && !isScrolled
                        ? "bg-white/30 text-white"
                        : "bg-muted-foreground/30",
                    )}
                  >
                    {isLoading
                      ? ""
                      : user?.email?.charAt(0).toUpperCase() || (
                          <User className="h-4 w-4" />
                        )}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 mt-2" align="end" forceMount>
              {user ? (
                <>
                  <DropdownMenuLabel className="font-normal p-4 pb-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.user_metadata?.full_name || "Guest"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="py-2.5 font-medium" asChild>
                    <Link href="/my-bookings">My Bookings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2.5 font-medium" asChild>
                    <Link href="/favorites">Favorites</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2.5 font-medium" asChild>
                    <Link href="/cart">Cart</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1">
                        Admin
                      </DropdownMenuLabel>
                      <DropdownMenuItem className="py-2.5" asChild>
                        <Link href="/admin/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="py-2.5" asChild>
                        <Link href="/admin/properties">Properties</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="py-2.5" asChild>
                        <Link href="/admin/bookings">Bookings</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="py-2.5" onClick={handleSignOut}>
                    Log out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem
                    className="font-semibold py-2.5 text-base"
                    asChild
                  >
                    <Link href="/login">Log in</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2.5 text-base" asChild>
                    <Link href="/register">Sign up</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="py-2.5">
                    Partner with us
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2.5">
                    Help Center
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
