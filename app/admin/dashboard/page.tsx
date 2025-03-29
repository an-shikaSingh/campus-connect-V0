"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function AdminDashboardPage() {
  const { user, profile, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || (profile && profile.user_type !== "admin"))) {
      router.push("/")
    }
  }, [user, profile, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container py-8">
      <h1>Admin Dashboard</h1>
      <p>This page is being redirected to the main admin page.</p>
    </div>
  )
}

