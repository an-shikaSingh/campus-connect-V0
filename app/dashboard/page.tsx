"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, MapPin, Settings, User, Users } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [registrations, setRegistrations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientClient()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/auth/login?redirect=/dashboard")
          return
        }

        setUser(session.user)

        // Get user profile
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        setProfile(profileData)

        // Get user registrations
        const { data: registrationsData } = await supabase
          .from("registrations")
          .select("*, events(*)")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })

        setRegistrations(registrationsData || [])

        // Get upcoming events
        const today = new Date().toISOString()
        const { data: eventsData } = await supabase
          .from("events")
          .select("*")
          .eq("status", "active")
          .gt("start_date", today)
          .order("start_date", { ascending: true })
          .limit(5)

        setUpcomingEvents(eventsData || [])
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [router, supabase])

  if (isLoading) {
    return (
      <div className="container py-8">
        <Card className="glassmorphism border-white/10">
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return null // This should not render as we redirect in useEffect
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8 text-gradient">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card className="glassmorphism border-white/10">
            <CardHeader>
              <CardTitle>Welcome back, {profile?.first_name || "User"}!</CardTitle>
              <CardDescription>Here's what's happening with your events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glassmorphism p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Your Registrations</h3>
                  </div>
                  <p className="text-3xl font-bold">{registrations.length}</p>
                </div>
                <div className="glassmorphism p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Upcoming Events</h3>
                  </div>
                  <p className="text-3xl font-bold">{upcomingEvents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border-white/10">
            <CardHeader>
              <CardTitle>Your Registrations</CardTitle>
              <CardDescription>Events you have registered for</CardDescription>
            </CardHeader>
            <CardContent>
              {registrations.length > 0 ? (
                <div className="space-y-4">
                  {registrations.map((registration) => (
                    <div
                      key={registration.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-background/50"
                    >
                      <div>
                        <h3 className="font-medium">{registration.events.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>{formatDate(registration.events.start_date)}</span>
                        </div>
                      </div>
                      <Button variant="outline" asChild>
                        <Link href={`/events/${registration.events.id}`}>View Event</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't registered for any events yet.</p>
                  <Button asChild>
                    <Link href="/events">Browse Events</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="glassmorphism border-white/10">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Events happening soon</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-4 rounded-lg bg-background/50">
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>{formatDate(event.start_date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2" asChild>
                        <Link href={`/events/${event.id}`}>View Details</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">No upcoming events found</p>
              )}
            </CardContent>
          </Card>

          <Card className="glassmorphism border-white/10">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/events">
                    <Calendar className="mr-2 h-4 w-4" />
                    Browse Events
                  </Link>
                </Button>
                {profile?.user_type === "admin" && (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/admin">
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

