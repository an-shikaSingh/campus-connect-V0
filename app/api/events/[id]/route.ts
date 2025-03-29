import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerClient()

  const { data: event, error } = await supabase.from("events").select("*").eq("id", params.id).single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get registration count
  const { count, error: countError } = await supabase
    .from("registrations")
    .select("*", { count: "exact" })
    .eq("event_id", params.id)

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 })
  }

  return NextResponse.json({ ...event, attendees: count || 0 })
}

