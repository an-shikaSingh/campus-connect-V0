import { createServerSupabaseClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Calendar, Clock, MapPin, User } from "lucide-react"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { RegisterButton } from "@/components/register-button"

export default async function EventPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()

  // Get event details
  const { data: event } = await supabase.from("events").select("*, profiles(*)").eq("id", params.id).single()

  if (!event) {
    notFound()
  }

  // Get registration count
  const { count } = await supabase
    .from("registrations")
    .select("*", { count: "exact", head: true })
    .eq("event_id", params.id)

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="relative h-64 md:h-96 w-full rounded-xl overflow-hidden">
            <Image
              src={event.image_url || "/placeholder.svg?height=400&width=800"}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gradient">{event.title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              <span>{formatDate(event.start_date)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              <span>
                {new Date(event.start_date).toLocaleTimeString()} - {new Date(event.end_date).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-primary" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              <span>{count || 0} registered</span>
            </div>
          </div>

          <div className="glassmorphism p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">About This Event</h2>
            <div className="prose prose-invert max-w-none">
              <p>{event.description}</p>
            </div>
          </div>

          <div className="glassmorphism p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Organizer</h2>
            <div className="flex items-center">
              <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                <Image
                  src={event.profiles?.avatar_url || "/placeholder.svg?height=50&width=50"}
                  alt={`${event.profiles?.first_name} ${event.profiles?.last_name}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium">
                  {event.profiles?.first_name} {event.profiles?.last_name}
                </p>
                <p className="text-sm text-muted-foreground">{event.profiles?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="glassmorphism p-6 rounded-xl sticky top-20">
            <h2 className="text-xl font-bold mb-4">Registration</h2>
            <p className="mb-6">Secure your spot for this event now!</p>
            <RegisterButton eventId={event.id} />
          </div>
        </div>
      </div>
    </div>
  )
}

