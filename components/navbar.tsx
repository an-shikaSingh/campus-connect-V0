"use client"

import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Menu, User } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { createClientClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function Navbar() {
  const { user, profile, signOut } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()
  const supabase = createClientClient()

  useEffect(() => {
    if (!user) return

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) {
        console.error("Error fetching notifications:", error)
        return
      }

      setNotifications(data || [])
      setUnreadCount(data?.filter((n) => !n.read).length || 0)
    }

    fetchNotifications()

    // Subscribe to new notifications
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev].slice(0, 5))
          setUnreadCount((prev) => prev + 1)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, supabase])

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id)

    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = async () => {
    if (!user) return

    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false)

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const getInitials = () => {
    if (!profile) return "CC"
    return `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-md bg-black/50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gradient">Campus Connect</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/events" className="text-sm font-medium hover:text-primary transition-colors">
              Events
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            {user && (
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex justify-between items-center">
                    Notifications
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                        Mark all as read
                      </Button>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={`p-3 cursor-pointer ${!notification.read ? "bg-primary/10" : ""}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex flex-col gap-1">
                          <div className="text-sm">{notification.message}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(notification.created_at).toLocaleString()}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-3 text-center text-sm text-muted-foreground">No notifications</div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || ""} alt={profile?.first_name || ""} />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  {profile?.user_type === "admin" && (
                    <DropdownMenuItem onClick={() => router.push("/admin")}>
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => router.push("/my-events")}>
                    <span>My Events</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            </div>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/events" className="text-lg font-medium hover:text-primary transition-colors">
                  Events
                </Link>
                <Link href="/about" className="text-lg font-medium hover:text-primary transition-colors">
                  About
                </Link>
                {user && (
                  <Link href="/dashboard" className="text-lg font-medium hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                )}
                {!user && (
                  <>
                    <Link href="/auth/login" className="text-lg font-medium hover:text-primary transition-colors">
                      Log in
                    </Link>
                    <Link href="/auth/signup" className="text-lg font-medium hover:text-primary transition-colors">
                      Sign up
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

