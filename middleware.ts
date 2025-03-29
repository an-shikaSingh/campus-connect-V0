import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function middleware(request: NextRequest) {
  try {
    // Create a Supabase client
    const supabase = createServerClient()

    // Check if the user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If the user is not authenticated and trying to access protected routes
    if (
      !session &&
      (request.nextUrl.pathname.startsWith("/admin") ||
        request.nextUrl.pathname.startsWith("/dashboard") ||
        request.nextUrl.pathname.startsWith("/profile") ||
        request.nextUrl.pathname.startsWith("/my-events"))
    ) {
      // Redirect to the login page
      const redirectUrl = new URL("/auth/login", request.url)
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If the user is authenticated, check if they have admin access for admin routes
    if (session && request.nextUrl.pathname.startsWith("/admin")) {
      // Get the user's profile
      const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", session.user.id).single()

      // If the user is not an admin, redirect to the home page
      if (!profile || profile.user_type !== "admin") {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }
  } catch (error) {
    console.error("Middleware error:", error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/profile/:path*", "/my-events/:path*"],
}

