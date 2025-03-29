import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { eventId, userData } = await request.json()

  if (!eventId) {
    return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
  }

  // Check if user is already registered
  const { data: existingRegistration, error: checkError } = await supabase
    .from("registrations")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_id", session.user.id)
    .maybeSingle()

  if (checkError) {
    return NextResponse.json({ error: checkError.message }, { status: 500 })
  }

  if (existingRegistration) {
    return NextResponse.json({ error: "Already registered for this event" }, { status: 400 })
  }

  // Register user for the event
  const { data, error } = await supabase
    .from("registrations")
    .insert({
      event_id: eventId,
      user_id: session.user.id,
      status: "confirmed",
    })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Create notification for the user
  await supabase.from("notifications").insert({
    user_id: session.user.id,
    title: "Registration Confirmed",
    message: `Your registration for the event has been confirmed.`,
    read: false,
  })

  return NextResponse.json({ success: true, registration: data[0] })
}

