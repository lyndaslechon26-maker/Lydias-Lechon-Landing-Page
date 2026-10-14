import { branches } from "@/lib/data/branches"
import { MapPin, Phone, Clock, CheckCircle, ExternalLink, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Our Branches - Lydia's Lechon",
  description: "Find a Lydia's Lechon branch near you. 9 locations across Metro Manila and Luzon.",
}

export default function BranchesPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-rose-950/20">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Home</span>
          </Link>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-600/10 border border-amber-600/20 mb-6">
              <MapPin className="size-4 text-amber-600" />
              <span className="text-amber-600 text-sm font-semibold uppercase tracking-wider">
                Our Locations
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              All <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Branches</span>
            </h1>
            
            <p className="text-lg text-muted-foreground">
              Visit any of our 9 convenient locations across Metro Manila and Luzon to experience authentic Filipino lechon
            </p>
          </div>
        </div>
      </section>

      {/* Branches Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {branches.map((branch) => (
              <div 
                key={branch.id}
                className="group relative bg-card border rounded-2xl overflow-hidden hover:border-amber-600/50 hover:shadow-2xl hover:shadow-amber-600/10 transition-all duration-300"
              >
                {/* Branch Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                  {branch.image ? (
                    <img 
                      src={branch.image}
                      alt={branch.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin className="size-16 text-amber-600/30" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Branch Name */}
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-amber-600 transition-colors">
                    {branch.name}
                  </h3>

                  {/* Address */}
                  <div className="flex items-start gap-3 mb-3 text-muted-foreground">
                    <MapPin className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm leading-relaxed">{branch.address}</p>
                      {branch.landmark && (
                        <p className="text-xs text-muted-foreground/70 mt-1">📍 {branch.landmark}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3 mb-3 text-muted-foreground">
                    <Phone className="size-5 text-amber-600 flex-shrink-0" />
                    <a 
                      href={`tel:${branch.phone.replace(/\s/g, '')}`}
                      className="text-sm hover:text-amber-600 transition-colors font-medium"
                    >
                      {branch.phone}
                    </a>
                  </div>

                  {/* Hours */}
                  <div className="flex items-center gap-3 mb-4 text-muted-foreground">
                    <Clock className="size-5 text-amber-600 flex-shrink-0" />
                    <p className="text-sm">{branch.hours}</p>
                  </div>

                  {/* Services */}
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">
                      Available Services
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {branch.services.map((service) => (
                        <span 
                          key={service}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-600/10 border border-amber-600/20 text-xs text-amber-600 dark:text-amber-500"
                        >
                          <CheckCircle className="size-3" />
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Google Maps Button */}
                  <a
                    href={branch.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-amber-600/30 group"
                  >
                    <MapPin className="size-4" />
                    Get Directions
                    <ExternalLink className="size-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16 max-w-2xl mx-auto">
            <p className="text-lg text-muted-foreground mb-6">
              Can't visit? We deliver to your location!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events/menu">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                >
                  Order Online for Delivery
                </Button>
              </Link>
              <Link href="/events/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-amber-600/50 hover:bg-amber-600/10"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
