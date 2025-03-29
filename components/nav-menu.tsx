"use client"

import Link from "next/link"
import { Bell, LogOut, Menu, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"

export function NavMenu() {
  const { user, signOut } = useAuth()

  return (
    <>
      <nav className="mx-6 hidden items-center space-x-4 md:flex lg:space-x-6">
        <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
          Home
        </Link>
        <Link href="/events" className="text-sm font-medium transition-colors hover:text-primary">
          Events
        </Link>
        <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
          About
        </Link>
      </nav>
      <div className="ml-auto flex items-center gap-2">
        {!user ? (
          <>
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="hidden md:flex hover:bg-primary/10 hover:text-primary">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                size="sm"
                className="hidden md:flex bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-primary-foreground border-0"
              >
                Sign Up
              </Button>
            </Link>
          </>
        ) : null}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-primary hover:bg-primary/10">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-black/90 backdrop-blur-md border-primary/20">
            <DropdownMenuItem asChild className="focus:bg-primary/20 focus:text-primary">
              <Link href="/">Home</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="focus:bg-primary/20 focus:text-primary">
              <Link href="/events">Events</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="focus:bg-primary/20 focus:text-primary">
              <Link href="/about">About</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-primary/20" />
            {!user ? (
              <>
                <DropdownMenuItem asChild className="focus:bg-primary/20 focus:text-primary">
                  <Link href="/auth/login">Sign In</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-primary/20 focus:text-primary">
                  <Link href="/auth/signup">Sign Up</Link>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem asChild className="focus:bg-primary/20 focus:text-primary">
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-primary/20 focus:text-primary" onSelect={() => signOut()}>
                  Sign Out
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-primary hover:bg-primary/10">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black/90 backdrop-blur-md border-primary/20">
              <DropdownMenuItem asChild className="focus:bg-primary/20 focus:text-primary">
                <Link href="/dashboard" className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-primary" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-primary/20 focus:text-primary">
                <Link href="/dashboard/notifications" className="flex items-center">
                  <Bell className="mr-2 h-4 w-4 text-primary" />
                  <span>Notifications</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-primary/20" />
              <DropdownMenuItem
                className="focus:bg-primary/20 focus:text-primary flex items-center"
                onSelect={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4 text-primary" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </>
  )
}

