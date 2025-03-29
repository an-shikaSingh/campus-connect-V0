import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-md">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gradient">Campus Connect</h3>
            <p className="text-sm text-muted-foreground">Where Students and Opportunities Meet</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-foreground transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">Email: info@campusconnect.com</li>
              <li className="text-muted-foreground">Phone: (123) 456-7890</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Campus Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

