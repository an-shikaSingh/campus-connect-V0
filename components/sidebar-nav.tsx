"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Bell, Calendar, ChevronLeft, ChevronRight, Home, LogOut, Settings, User, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function SidebarNav() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      href: "/dashboard",
    },
    {
      title: "Events",
      icon: <Calendar className="h-5 w-5" />,
      href: "/events",
    },
    {
      title: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      href: "/dashboard/notifications",
      badge: 2,
    },
    {
      title: "Network",
      icon: <Users className="h-5 w-5" />,
      href: "/dashboard/network",
    },
    {
      title: "Profile",
      icon: <User className="h-5 w-5" />,
      href: "/dashboard/profile",
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/dashboard/settings",
    },
  ]

  return (
    <motion.div
      initial={{ width: 240 }}
      animate={{ width: collapsed ? 80 : 240 }}
      transition={{ duration: 0.3 }}
      className="relative h-screen border-r border-primary/10 bg-black/40 backdrop-blur-md"
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-primary/10 bg-background text-primary hover:bg-primary/10"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-bold"
              >
                Campus Connect
              </motion.span>
            )}
          </Link>
        </div>

        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-2 ${
                      isActive
                        ? "bg-primary/20 text-primary hover:bg-primary/30"
                        : "hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {item.icon}
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 text-left"
                      >
                        {item.title}
                      </motion.span>
                    )}
                    {!collapsed && item.badge && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-primary to-purple-500 text-xs font-medium text-primary-foreground"
                      >
                        {item.badge}
                      </motion.div>
                    )}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="border-t border-primary/10 p-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9 border border-primary/20">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback className="bg-primary/20 text-primary">JD</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-1 flex-col overflow-hidden"
              >
                <span className="text-sm font-medium">John Doe</span>
                <span className="truncate text-xs text-muted-foreground">john.doe@example.com</span>
              </motion.div>
            )}
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                  <LogOut className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

