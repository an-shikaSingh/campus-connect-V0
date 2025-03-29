"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClientClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  const { user, profile, refreshSession } = useAuth()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registrations, setRegistrations] = useState<any[]>([])
  const { toast } = useToast()
  const supabase = createClientClient()

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "")
      setLastName(profile.last_name || "")
      setAvatarUrl(profile.avatar_url || "")
    }
  }, [profile])

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from("registrations")
        .select("*, events(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching registrations:", error)
        return
      }

      setRegistrations(data || [])
    }

    fetchRegistrations()
  }, [user, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      await refreshSession()

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
      toast({
        title: "Update failed",
        description: err.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || !profile) {
    return (
      <div className="container py-8">
        <Card className="glassmorphism border-white/10">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8 text-gradient">My Profile</h1>

      <Tabs defaultValue="profile">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="registrations">My Registrations</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="glassmorphism border-white/10">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex items-center justify-center mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} alt={firstName} />
                  <AvatarFallback>{`${firstName?.[0] || ""}${lastName?.[0] || ""}`}</AvatarFallback>
                </Avatar>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="bg-background/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={profile.email} disabled className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input
                    id="avatarUrl"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="bg-background/50"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registrations">
          <Card className="glassmorphism border-white/10">
            <CardHeader>
              <CardTitle>My Registrations</CardTitle>
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
                        <p className="text-sm text-muted-foreground">
                          {new Date(registration.events.start_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" asChild>
                        <a href={`/events/${registration.events.id}`}>View Event</a>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">You haven't registered for any events yet.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <a href="/events">Browse Events</a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

