"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Calendar, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface FeaturedEventProps {
  title: string
  date: string
  location: string
  description: string
  image: string
  category: string
}

export function FeaturedEvent({ title, date, location, description, image, category }: FeaturedEventProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div whileHover={{ y: -5 }} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
      <Card className="overflow-hidden transition-all border border-primary/10 bg-black/40 backdrop-blur-sm">
        <div className="relative h-48 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          </motion.div>
          <Badge className="absolute right-2 top-2 z-20 bg-primary/80 hover:bg-primary/90 text-primary-foreground">
            {category}
          </Badge>
          <div className="absolute bottom-2 left-2 z-20 flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-white/80 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
              <Calendar className="h-3 w-3" />
              {date}
            </div>
            <div className="flex items-center gap-1 text-xs text-white/80 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
              <MapPin className="h-3 w-3" />
              {location}
            </div>
          </div>
        </div>
        <CardHeader className="p-4">
          <CardTitle className="line-clamp-1 text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Link href={`/events/${title.toLowerCase().replace(/\s+/g, "-")}`} className="w-full">
            <Button className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-primary-foreground border-0">
              Register Now
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

