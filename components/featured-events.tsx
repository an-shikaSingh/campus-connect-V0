"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin } from "lucide-react"
import Image from "next/image"
import { formatDate } from "@/lib/utils"

interface FeaturedEventsProps {
  events: any[]
}

export function FeaturedEvents({ events }: FeaturedEventsProps) {
  if (!events.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No events found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <p className="line-clamp-2 text-sm mt-2">{event.description}</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/events/${event.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

