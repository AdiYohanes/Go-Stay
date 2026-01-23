'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  Menu
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/store/authStore'
import { Toaster } from '@/components/ui/sonner'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    } else if (!isLoading && user && user.user_metadata.role !== 'admin') {
      // Basic client-side check, middleware usually handles this
      // router.push('/') // Uncomment if middleware is not enough
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  // Very basic authorization check
  if (!user) return null

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar pathname={pathname} />
        <main className="flex-1 w-full flex flex-col transition-all duration-300 ease-in-out">
           <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="font-semibold text-lg">Admin Dashboard</div>
          </header>
          <div className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  )
}

function AppSidebar({ pathname }: { pathname: string }) {
    const { signOut } = useAuthStore()
    const router = useRouter()

    return (
        <Sidebar>
            <SidebarHeader className="p-4 border-b">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary px-2">
                    <Building className="h-6 w-6" />
                    <span>Go-Stay Admin</span>
                </Link>
            </SidebarHeader>
            <SidebarContent className="p-2 gap-1">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === '/admin/dashboard'}>
                            <Link href="/admin/dashboard">
                                <LayoutDashboard />
                                <span>Overview</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                         <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/properties')}>
                            <Link href="/admin/properties">
                                <Building />
                                <span>Properties</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/bookings')}>
                             <Link href="/admin/bookings">
                                <CalendarDays />
                                <span>Bookings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {/* <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/admin/users">
                                <Users />
                                <span>Users</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem> */}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={async () => {
                             await signOut()
                             router.push('/login')
                        }}>
                            <LogOut />
                            <span>Sign out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
