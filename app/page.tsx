import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeroBackground } from "@/components/hero-background"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { FeaturedEvents } from "@/components/featured-events"

export default async function Home() {
  const supabase = createServerSupabaseClient()

  // Fetch featured events
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("status", "active")
    .order("start_date", { ascending: true })
    .limit(3)

  return (
    <div className="relative">
      <HeroBackground />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container flex flex-col items-center text-center">
          <div className="hero-gradient absolute inset-0 -z-10" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6 neon-glow animate-float">
            <span className="text-gradient">Campus Connect</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">Where Students and Opportunities Meet</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="neon-border">
              <Link href="/events">Explore Events</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/signup">Join Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 relative">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-gradient">Featured Events</h2>
          <FeaturedEvents events={events || []} />
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 relative">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center text-gradient">Why Campus Connect?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glassmorphism p-6 rounded-xl card-hover">
              <h3 className="text-xl font-bold mb-4">Discover Events</h3>
              <p className="text-muted-foreground">Find and join events that match your interests and career goals.</p>
            </div>
            <div className="glassmorphism p-6 rounded-xl card-hover">
              <h3 className="text-xl font-bold mb-4">Connect with Peers</h3>
              <p className="text-muted-foreground">Network with like-minded students and professionals.</p>
            </div>
            <div className="glassmorphism p-6 rounded-xl card-hover">
              <h3 className="text-xl font-bold mb-4">Grow Your Skills</h3>
              <p className="text-muted-foreground">Attend workshops and seminars to enhance your knowledge.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative">
        <div className="container">
          <div className="glassmorphism p-8 md:p-12 rounded-xl text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join Campus Connect today and never miss an opportunity again.
            </p>
            <Button asChild size="lg" className="neon-border">
              <Link href="/auth/signup">Sign Up Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

