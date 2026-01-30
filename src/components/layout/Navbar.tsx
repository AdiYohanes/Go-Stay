"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, User, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { MobileSearchWizard } from "@/components/home/MobileSearchWizard";
import { cn } from "@/lib/utils";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut, isLoading } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  // Check if we're on the homepage
  const isHomePage = pathname === "/";

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "top-0 z-50 h-[80px] transition-all duration-300 w-full",
        isHomePage
          ? isScrolled
            ? "fixed bg-background/80 backdrop-blur-md shadow-sm"
            : "fixed bg-transparent"
          : "sticky bg-background border-b border-border/40 shadow-sm",
      )}
    >
      <div className="w-full max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
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
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 3.162.726 4.692-.246 2.039-1.487 3.818-3.418 4.908l-.132.071c-.704.372-1.503.627-2.368.75l-.27.03c-2.02.197-4.023-.197-5.91-.977l-.466-.2-1.037-.461-.653.287c-2.31 1.055-4.636 1.34-6.852 1.045l-.469-.074c-2.333-.42-4.226-2.062-5.06-4.305l-.112-.32c-.528-1.571-.476-3.19.167-4.81l.143-.341c.983-2.28 5.152-11.01 7.114-14.85l.536-1.015C12.536 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.926 3.776-6.06 12.43-7.031 14.692-.513 1.239-.569 2.508-.157 3.73l.07.199c.642 1.738 2.052 3.003 3.8 3.32l.275.042c1.725.228 3.518-.016 5.257-.864l1.192-.598.106.05c1.458.694 3.018.995 4.58.913l.354-.025c.607-.058 1.189-.2 1.716-.426l.169-.077c1.493-.765 2.457-2.025 2.666-3.51.139-1.127-.052-2.327-.565-3.551l-.146-.333c-.981-2.28-5.148-10.993-7.098-14.81l-.545-1.049C18.053 3.539 17.24 3 16 3zm0 5c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 2c-1.105 0-2 .895-2 2s.895 2 2 2 2 2-.895 2-2-.895-2-2-2z"></path>
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

        {/* Mobile Search Trigger - Only show when not on homepage */}
        {!isHomePage && (
          <div className="md:hidden flex-1 flex justify-center px-4">
            <MobileSearchWizard />
          </div>
        )}

        {/* Spacer on homepage mobile */}
        {isHomePage && <div className="md:hidden flex-1" />}

        {/* User Menu */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block mr-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full",
                isHomePage && !isScrolled && "text-white hover:bg-white/20",
              )}
            >
              <Globe className="h-4 w-4" />
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-3 rounded-full border p-1 pl-3 hover:shadow-md transition-all ml-1",
                  isHomePage && !isScrolled
                    ? "border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
                    : "border-border",
                )}
              >
                <Menu className="h-4 w-4" />
                {/* Show user name when logged in */}
                {user && (
                  <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                    Hi, {user.user_metadata?.full_name?.split(" ")[0] || "User"}
                  </span>
                )}
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
                    <Link href="/my-bookings">Trips</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2.5 font-medium">
                    Wishlists
                  </DropdownMenuItem>
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
    </nav>
  );
}
