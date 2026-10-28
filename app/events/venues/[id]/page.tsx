'use client'

import { useEffect, useState } from 'react'
import { createClient } from "@/lib/supabase/client"
import { notFound } from "next/navigation"
import { 
  MapPin, 
  Users, 
  Clock,
  Check,
  Star,
  Sparkles,
  Calendar,
  Phone,
  Mail,
  ChevronRight
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { VenueBookingModal } from "@/components/events/venue-booking-modal"

interface VenuePageProps {
  params: Promise<{
    id: string
  }>
}

export default function VenuePage({ params }: VenuePageProps) {
  const [venue, setVenue] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  
  useEffect(() => {
    async function loadVenue() {
      const { id } = await params
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('event_venues')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        notFound()
      }
      
      setVenue(data)
      setLoading(false)
    }
    
    loadVenue()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  if (!venue) {
    notFound()
  }

  // Parse photos array
  const photos = venue.photos || []
  const amenities = venue.amenities || []

  return (
    <div className="min-h-screen bg-background">
      {/* Booking Modal */}
      <VenueBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        venue={venue}
      />
      
      {/* Hero Section with Main Image */}
      <section className="relative h-[60vh] min-h-[400px]">
        <div className="absolute inset-0">
          <img 
            src={photos[0] || 'https://images.unsplash.com/photo-1519167758481-83f29da8a77a?w=1200&q=80'}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        
        <div className="relative h-full container mx-auto px-4 flex items-end pb-12">
          <div className="text-white max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 rounded-full mb-4">
              <Sparkles className="size-4" />
              <span className="text-sm font-bold">FEATURED VENUE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              {venue.name}
            </h1>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="size-5" />
              <span className="text-lg">{venue.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="size-5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="text-lg font-semibold">4.9</span>
                <span className="text-muted-foreground">(127 reviews)</span>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold mb-4">About This Venue</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {venue.description}
                </p>
              </div>

              {/* Key Features */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/50">
                  <Users className="size-8 text-amber-600 mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">Capacity</p>
                  <p className="text-3xl font-bold">{venue.capacity_max}</p>
                  <p className="text-xs text-muted-foreground">max guests</p>
                </div>
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200/50">
                  <Clock className="size-8 text-blue-600 mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">Duration</p>
                  <p className="text-3xl font-bold">{venue.duration}</p>
                  <p className="text-xs text-muted-foreground">booking</p>
                </div>
                <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200/50">
                  <Calendar className="size-8 text-green-600 mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">Price From</p>
                  <p className="text-3xl font-bold">₱{venue.base_rate.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">per day</p>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Amenities & Features</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                      <div className="size-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <Check className="size-5 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo Gallery */}
              {photos.length > 1 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Photo Gallery</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {photos.slice(1).map((photo: string, index: number) => (
                      <div key={index} className="aspect-[4/3] rounded-xl overflow-hidden">
                        <img 
                          src={photo}
                          alt={`${venue.name} view ${index + 2}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                
                {/* Pricing Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white shadow-2xl">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <p className="text-sm text-slate-300 mb-1">Starting from</p>
                      <p className="text-4xl font-bold">₱{venue.base_rate.toLocaleString()}</p>
                      <p className="text-sm text-slate-400">per day</p>
                    </div>
                    <Calendar className="size-10 text-amber-500 opacity-50" />
                  </div>
                  
                  <div className="h-px bg-white/10 my-4" />
                  
                  <p className="text-xs text-slate-400 mb-4">
                    Price includes venue rental, basic setup, and standard amenities
                  </p>

                  <div className="space-y-3">
                    <Button 
                      size="lg"
                      onClick={() => setIsBookingModalOpen(true)}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg"
                    >
                      Book Now
                      <ChevronRight className="size-5 ml-2" />
                    </Button>
                    
                    <Link href="tel:+639123456789" className="block">
                      <Button 
                        variant="outline"
                        size="lg"
                        className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white"
                      >
                        <Phone className="size-4 mr-2" />
                        Call for Inquiry
                      </Button>
                    </Link>

                    <Link href="/events/contact" className="block">
                      <Button 
                        variant="ghost"
                        size="lg"
                        className="w-full text-white hover:bg-white/10"
                      >
                        <Mail className="size-4 mr-2" />
                        Send Message
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="p-6 rounded-xl bg-muted border">
                  <h3 className="font-bold mb-4">Why Choose This Venue?</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Professional event coordination included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Flexible booking hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Complete catering services available</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Free consultation and site visit</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
