import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  const supabase = createServerSupabaseClient()

  let query = supabase.from("events").select("*").eq("status", "active").order("start_date", { ascending: true })

  if (searchParams.category) {
    query = query.eq("category", searchParams.category)
  }

  if (searchParams.search) {
    query = query.or(`title.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`)
  }

  const { data: events } = await query

  // Get categories for filter
  const { data: categories } = await supabase.from("events").select("category").eq("status", "active").order("category")

  // Remove duplicates
  const uniqueCategories = Array.from(new Set(categories?.map((item) => item.category)))

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8 text-gradient">Events</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <Card className="glassmorphism border-white/10 sticky top-20">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Categories</h3>
                <div className="space-y-2">
                  <Button
                    variant={!searchParams.category ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/events">All Categories</Link>
                  </Button>
                  {uniqueCategories.map((category) => (
                    <Button
                      key={category}
                      variant={searchParams.category === category ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href={`/events?category=${category}`}>{category}</Link>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-3/4">
          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="glassmorphism overflow-hidden card-hover border-white/10">
                  <div className="relative h-48 w-full">
                    <Image
                      src={event.image_url || "/placeholder.svg?height=200&width=400"}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>{formatDate(event.start_date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <p className="line-clamp-3 text-sm mt-2">{event.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/events/${event.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

