import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HeroBackground } from "@/components/hero-background"

export default function AboutPage() {
  return (
    <div className="relative">
      <HeroBackground />

      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8 text-gradient">About Campus Connect</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card className="glassmorphism border-white/10">
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <p>
                  Campus Connect is dedicated to bridging the gap between students and opportunities. We believe that
                  every student deserves access to events, workshops, and networking opportunities that can shape their
                  future.
                </p>
                <p>
                  Our platform serves as a central hub where students can discover events tailored to their interests
                  and career goals, while event organizers can reach their target audience efficiently.
                </p>
              </CardContent>
            </Card>

            <Card className="glassmorphism border-white/10">
              <CardHeader>
                <CardTitle>Our Story</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <p>
                  Campus Connect was founded in 2023 by a group of university students who recognized the challenge of
                  finding relevant events and opportunities on campus. What started as a simple bulletin board has
                  evolved into a comprehensive platform serving multiple universities.
                </p>
                <p>
                  Today, we're proud to connect thousands of students with hundreds of events each month, fostering a
                  community of learning, networking, and growth.
                </p>
              </CardContent>
            </Card>

            <Card className="glassmorphism border-white/10">
              <CardHeader>
                <CardTitle>Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex flex-col">
                    <span className="font-bold text-gradient">Accessibility</span>
                    <span className="text-muted-foreground">
                      Making opportunities available to all students regardless of background.
                    </span>
                  </li>
                  <li className="flex flex-col">
                    <span className="font-bold text-gradient">Innovation</span>
                    <span className="text-muted-foreground">
                      Continuously improving our platform to better serve our users.
                    </span>
                  </li>
                  <li className="flex flex-col">
                    <span className="font-bold text-gradient">Community</span>
                    <span className="text-muted-foreground">
                      Fostering connections and collaboration among students and organizations.
                    </span>
                  </li>
                  <li className="flex flex-col">
                    <span className="font-bold text-gradient">Integrity</span>
                    <span className="text-muted-foreground">
                      Maintaining transparency and trust in all our operations.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glassmorphism border-white/10">
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">info@campusconnect.com</p>
                </div>
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-muted-foreground">(123) 456-7890</p>
                </div>
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-muted-foreground">
                    123 University Ave
                    <br />
                    Campus City, ST 12345
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphism border-white/10">
              <CardHeader>
                <CardTitle>Our Team</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Sarah Johnson</h3>
                  <p className="text-muted-foreground">Co-Founder & CEO</p>
                </div>
                <div>
                  <h3 className="font-medium">Michael Chen</h3>
                  <p className="text-muted-foreground">Co-Founder & CTO</p>
                </div>
                <div>
                  <h3 className="font-medium">Aisha Patel</h3>
                  <p className="text-muted-foreground">Head of Operations</p>
                </div>
                <div>
                  <h3 className="font-medium">David Rodriguez</h3>
                  <p className="text-muted-foreground">Head of Marketing</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphism border-white/10">
              <CardHeader>
                <CardTitle>Join Our Team</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We're always looking for talented individuals to join our team. Check out our open positions!
                </p>
                <a href="/careers" className="text-primary hover:underline">
                  View Open Positions →
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

