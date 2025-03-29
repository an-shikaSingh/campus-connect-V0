"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClientClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminPage() {
  const { user, profile, isLoading } = useAuth()
  const [events, setEvents] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [registrations, setRegistrations] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientClient()

  // Form state for creating events
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    if (isLoading) return

    if (!user || (profile && profile.user_type !== "admin")) {
      router.push("/")
      toast({
        title: "Access denied",
        description: "You do not have permission to access this page.",
        variant: "destructive",
      })
      return
    }

    const fetchData = async () => {
      try {
        // Fetch events
        const { data: eventsData } = await supabase.from("events").select("*").order("created_at", { ascending: false })

        setEvents(eventsData || [])

        // Fetch users
        const { data: usersData } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false })

        setUsers(usersData || [])

        // Fetch registrations
        const { data: registrationsData } = await supabase
          .from("registrations")
          .select("*, profiles(*), events(*)")
          .order("created_at", { ascending: false })

        setRegistrations(registrationsData || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    if (user && profile?.user_type === "admin") {
      fetchData()
    }
  }, [user, profile, isLoading, router, supabase, toast])

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!startDate || !endDate) {
      toast({
        title: "Missing dates",
        description: "Please select both start and end dates.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("events")
        .insert({
          title,
          description,
          location,
          category,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          image_url: imageUrl,
          organizer_id: user!.id,
          status: "active",
        })
        .select()

      if (error) throw error

      toast({
        title: "Event created",
        description: "The event has been created successfully.",
      })

      // Reset form
      setTitle("")
      setDescription("")
      setLocation("")
      setCategory("")
      setStartDate(undefined)
      setEndDate(undefined)
      setImageUrl("")

      // Refresh events list
      setEvents((prev) => [data[0], ...prev])
    } catch (error: any) {
      toast({
        title: "Failed to create event",
        description: error.message || "An error occurred while creating the event.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateEventStatus = async (eventId: string, status: string) => {
    try {
      const { error } = await supabase.from("events").update({ status }).eq("id", eventId)

      if (error) throw error

      toast({
        title: "Event updated",
        description: `The event status has been updated to ${status}.`,
      })

      // Update events list
      setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, status } : event)))
    } catch (error: any) {
      toast({
        title: "Failed to update event",
        description: error.message || "An error occurred while updating the event.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <Card className="glassmorphism border-white/10">
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If not admin, don't render the admin content
  if (!user || (profile && profile.user_type !== "admin")) {
    return null
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8 text-gradient">Admin Dashboard</h1>

      <Tabs defaultValue="overview">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="create">Create Event</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glassmorphism border-white/10">
              <CardHeader>
                <CardTitle>Total Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{events.length}</p>
              </CardContent>
            </Card>
            <Card className="glassmorphism border-white/10">
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{users.length}</p>
              </CardContent>
            </Card>
            <Card className="glassmorphism border-white/10">
              <CardHeader>
                <CardTitle>Total Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{registrations.length}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="glassmorphism border-white/10">
            <CardHeader>
              <CardTitle>Recent Registrations</CardTitle>
              <CardDescription>Latest event registrations</CardDescription>
            </CardHeader>
            <CardContent>
              {registrations.slice(0, 5).map((registration) => (
                <div
                  key={registration.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/50 mb-2"
                >
                  <div>
                    <h3 className="font-medium">{registration.events?.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {registration.profiles?.first_name} {registration.profiles?.last_name}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(registration.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {registrations.length === 0 && (
                <p className="text-center py-4 text-muted-foreground">No registrations found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card className="glassmorphism border-white/10">
            <CardHeader>
              <CardTitle>Manage Events</CardTitle>
              <CardDescription>View and manage all events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.start_date).toLocaleDateString()} | {event.status}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/events/${event.id}`} target="_blank" rel="noreferrer">
                          View
                        </a>
                      </Button>
                      {event.status === "active" ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleUpdateEventStatus(event.id, "cancelled")}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Button variant="default" size="sm" onClick={() => handleUpdateEventStatus(event.id, "active")}>
                          Activate
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {events.length === 0 && <p className="text-center py-4 text-muted-foreground">No events found</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="glassmorphism border-white/10">
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
              <CardDescription>View all registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                    <div>
                      <h3 className="font-medium">
                        {user.first_name} {user.last_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {user.email} | {user.user_type}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
                {users.length === 0 && <p className="text-center py-4 text-muted-foreground">No users found</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card className="glassmorphism border-white/10">
            <CardHeader>
              <CardTitle>Create New Event</CardTitle>
              <CardDescription>Add a new event to the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="bg-background/50 min-h-32"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Seminar">Seminar</SelectItem>
                        <SelectItem value="Conference">Conference</SelectItem>
                        <SelectItem value="Networking">Networking</SelectItem>
                        <SelectItem value="Career Fair">Career Fair</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date & Time</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-background/50",
                            !startDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP HH:mm") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                        <div className="p-3 border-t border-border">
                          <Input
                            type="time"
                            onChange={(e) => {
                              if (startDate && e.target.value) {
                                const [hours, minutes] = e.target.value.split(":")
                                const newDate = new Date(startDate)
                                newDate.setHours(Number.parseInt(hours, 10))
                                newDate.setMinutes(Number.parseInt(minutes, 10))
                                setStartDate(newDate)
                              }
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date & Time</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-background/50",
                            !endDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP HH:mm") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                        <div className="p-3 border-t border-border">
                          <Input
                            type="time"
                            onChange={(e) => {
                              if (endDate && e.target.value) {
                                const [hours, minutes] = e.target.value.split(":")
                                const newDate = new Date(endDate)
                                newDate.setHours(Number.parseInt(hours, 10))
                                newDate.setMinutes(Number.parseInt(minutes, 10))
                                setEndDate(newDate)
                              }
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="bg-background/50"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Event"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

