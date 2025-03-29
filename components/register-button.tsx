"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { createClientClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface RegisterButtonProps {
  eventId: string
}

export function RegisterButton({ eventId }: RegisterButtonProps) {
  const { user, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientClient()

  // Check if user is already registered
  const checkRegistration = async () => {
    if (!user) return

    const { data } = await supabase
      .from("registrations")
      .select("*")
      .eq("user_id", user.id)
      .eq("event_id", eventId)
      .single()

    setIsRegistered(!!data)
  }

  // Call on component mount
  useState(() => {
    checkRegistration()
  })

  const handleRegister = async () => {
    if (!user) {
      router.push(`/login?redirect=/events/${eventId}`)
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.from("registrations").insert({
        user_id: user.id,
        event_id: eventId,
        status: "registered",
      })

      if (error) throw error

      setIsRegistered(true)
      toast({
        title: "Registration successful",
        description: "You have successfully registered for this event.",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to register for this event.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelRegistration = async () => {
    if (!user) return

    setIsLoading(true)

    try {
      const { error } = await supabase.from("registrations").delete().eq("user_id", user.id).eq("event_id", eventId)

      if (error) throw error

      setIsRegistered(false)
      toast({
        title: "Registration cancelled",
        description: "You have cancelled your registration for this event.",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Cancellation failed",
        description: error.message || "Failed to cancel registration.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return <Button disabled>Loading...</Button>
  }

  if (isRegistered) {
    return (
      <Button variant="outline" onClick={handleCancelRegistration} disabled={isLoading} className="w-full">
        {isLoading ? "Processing..." : "Cancel Registration"}
      </Button>
    )
  }

  return (
    <Button onClick={handleRegister} disabled={isLoading} className="w-full">
      {isLoading ? "Processing..." : "Register Now"}
    </Button>
  )
}

