'use client'

import { useState, useEffect } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Users, 
  Clock,
  Check,
  Star,
  Sparkles,
  Calendar,
  Phone
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { FadeUp } from '@/components/ui/scroll-animations'
import { VenueBookingModal } from '@/components/events/venue-booking-modal'

interface EventSpace {
  id: string
  name: string
  location: string
  description?: string
  capacity_min: number
  capacity_max: number
  base_rate: number
  duration: string
  photos: string[]
  amenities: string[]
  is_active: boolean
}

export function EventsPlace() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [eventSpaces, setEventSpaces] = useState<EventSpace[]>([])
  const [loading, setLoading] = useState(true)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  useEffect(() => {
    async function fetchVenues() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('event_venues')
        .select('*')
        .eq('is_active', true)
        .order('capacity_max', { ascending: false })

      if (data && !error && data.length > 0) {
        setEventSpaces(data)
      } else {
        // Fallback data matching new schema
        setEventSpaces([
          {
            id: '1',
            name: 'Grand Ballroom',
            location: 'Main Building, Ground Floor',
            description: 'Our most spacious and elegant venue, perfect for grand weddings, corporate galas, and large celebrations. Features high ceilings, crystal chandeliers, and a dedicated stage area.',
            capacity_min: 100,
            capacity_max: 200,
            base_rate: 25000,
            duration: 'Full Day',
            photos: ['https://images.unsplash.com/photo-1519167758481-83f29da8a77a?w=1200&q=80'],
            amenities: ['Air-conditioned', 'Professional sound system', '4K LED projector', 'Stage with lighting', 'Bridal room', 'Full catering kitchen', 'Elegant chandeliers', 'Dance floor'],
            is_active: true
          },
          {
            id: '2',
            name: 'Garden Pavilion',
            location: 'Outdoor Garden Area',
            description: 'Beautiful al fresco venue surrounded by lush greenery and natural ambiance. Ideal for garden weddings, intimate celebrations, and daytime events.',
            capacity_min: 75,
            capacity_max: 150,
            base_rate: 18000,
            duration: 'Full Day',
            photos: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80'],
            amenities: ['Garden setting', 'String lights & lanterns', 'Wooden tables & chairs', 'Open-air pavilion', 'Photo wall backdrops', 'Garden bar counter', 'Acoustic sound system'],
            is_active: true
          },
          {
            id: '3',
            name: 'Rooftop Deck',
            location: 'Rooftop Level',
            description: 'Modern and stylish rooftop venue with stunning city skyline views. Perfect for cocktail parties, corporate events, and trendy celebrations.',
            capacity_min: 50,
            capacity_max: 100,
            base_rate: 22000,
            duration: 'Half Day',
            photos: ['https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1200&q=80'],
            amenities: ['City skyline view', 'Retractable awning', 'Modern lounge furniture', 'Bar counter with stools', 'LED mood lighting', 'Bluetooth sound system', 'Heaters for cooler evenings'],
            is_active: true
          },
          {
            id: '4',
            name: 'Function Room A',
            location: 'Second Floor',
            description: 'Versatile and intimate space perfect for birthday parties, small gatherings, corporate meetings, and family celebrations. Fully air-conditioned with flexible setup options.',
            capacity_min: 40,
            capacity_max: 80,
            base_rate: 12000,
            duration: 'Hourly',
            photos: ['https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80'],
            amenities: ['Air-conditioned', 'Smart TV with HDMI', 'Quality sound system', 'Flexible table arrangements', 'Free WiFi', 'Whiteboard & projector screen', 'Private entrance'],
            is_active: true
          }
        ])
      }
      setLoading(false)
    }

    fetchVenues()
  }, [])

  // Reset selected image when venue changes
  useEffect(() => {
    setSelectedImageIndex(0)
  }, [currentIndex])

  if (loading) {
    return null
  }

  if (eventSpaces.length === 0) {
    return null
  }

  const currentSpace = eventSpaces[currentIndex]
  
  // Amenities are already an array from database
  const amenities = currentSpace.amenities || []

  // Get venue images from photos array, fallback to placeholder
  const venueImages = currentSpace.photos && currentSpace.photos.length > 0
    ? currentSpace.photos
    : ['https://images.unsplash.com/photo-1519167758481-83f29da8a77a?w=1200&q=80']
  
  // Ensure we have at least 4 images for gallery (duplicate if needed)
  while (venueImages.length < 4) {
    venueImages.push(venueImages[0])
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === eventSpaces.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? eventSpaces.length - 1 : prev - 1))
  }

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-slate-50 via-white to-amber-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Booking Modal */}
      <VenueBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        venue={currentSpace}
      />
      
      <div className="container mx-auto px-4 lg:px-8 max-w-[1400px]">
        
        {/* Section Header */}
        <FadeUp className="text-center mb-12">
          <p className="text-amber-600 dark:text-amber-500 text-sm font-semibold uppercase tracking-wider mb-3">
            About Our Venues
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Looking for the
            <span className="block text-amber-600 italic font-serif">Perfect Venue?</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            Lydia's Lechon offers beautiful and versatile event spaces perfect for weddings, 
            birthdays, corporate gatherings, and special celebrations.
          </p>
        </FadeUp>

        {/* Main Venue Showcase */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 mb-8">
          
          {/* LEFT: Image Gallery + Amenities */}
          <div className="space-y-6">
            {/* Main Large Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group">
              <img 
                src={venueImages[selectedImageIndex]}
                alt={currentSpace.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Gradient overlay - stronger at bottom for amenities */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Featured Badge */}
              <div className="absolute top-4 left-4 px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center gap-2 z-30">
                <Sparkles className="size-3" />
                FEATURED VENUE
              </div>

              {/* Amenities Overlay - Bottom Section */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                  <Check className="size-4 text-green-400" />
                  Included Amenities
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {amenities.slice(0, 6).map((amenity: string, index: number) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-2 text-white/90 text-xs bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/20"
                    >
                      <div className="size-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0">
                        <Check className="size-3 text-green-400" />
                      </div>
                      <span className="truncate">{amenity}</span>
                    </div>
                  ))}
                </div>
                {amenities.length > 6 && (
                  <p className="text-white/70 text-xs mt-2">
                    + {amenities.length - 6} more amenities
                  </p>
                )}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 dark:bg-slate-800/95 shadow-xl flex items-center justify-center hover:scale-110 transition-all z-30"
                aria-label="Previous venue"
              >
                <ChevronLeft className="size-5 text-slate-900 dark:text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 dark:bg-slate-800/95 shadow-xl flex items-center justify-center hover:scale-110 transition-all z-30"
                aria-label="Next venue"
              >
                <ChevronRight className="size-5 text-slate-900 dark:text-white" />
              </button>
            </div>

            {/* Thumbnail Gallery - Show only 4 thumbnails (exclude currently selected) */}
            <div className="grid grid-cols-4 gap-3">
              {venueImages
                .map((image, originalIndex) => ({ image, originalIndex }))
                .filter(({ originalIndex }) => originalIndex !== selectedImageIndex)
                .slice(0, 4)
                .map(({ image, originalIndex }) => (
                  <button
                    key={originalIndex}
                    onClick={() => setSelectedImageIndex(originalIndex)}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden transition-all opacity-70 hover:opacity-100 hover:scale-105"
                  >
                    <img 
                      src={image}
                      alt={`${currentSpace.name} view ${originalIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
            </div>
          </div>

          {/* RIGHT: Venue Details */}
          <div className="space-y-6">
            
            {/* Venue Name & Rating */}
            <div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="size-4 fill-amber-500 text-amber-500" />
                ))}
                <span className="text-sm text-muted-foreground ml-2">(4.9)</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold mb-2">
                {currentSpace.name}
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4" />
                <span className="text-sm">{currentSpace.location}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-800/30">
                <Users className="size-5 text-amber-600 mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Capacity</p>
                <p className="text-2xl font-bold">{currentSpace.capacity_max}</p>
                <p className="text-xs text-muted-foreground">max guests</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200/50 dark:border-blue-800/30">
                <Clock className="size-5 text-blue-600 mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Duration</p>
                <p className="text-2xl font-bold">{currentSpace.duration}</p>
                <p className="text-xs text-muted-foreground">booking</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-muted-foreground leading-relaxed">
                {currentSpace.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white">
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <p className="text-sm text-slate-300 mb-1">Starting from</p>
                  <p className="text-4xl font-bold">₱{currentSpace.base_rate.toLocaleString()}</p>
                  <p className="text-sm text-slate-400">per day</p>
                </div>
                <Calendar className="size-8 text-amber-500 opacity-50" />
              </div>
              <div className="h-px bg-white/10 my-4" />
              <p className="text-xs text-slate-400 mb-3">
                Price includes venue rental, basic setup, and standard amenities
              </p>
              <Link href={`/events/venues/${currentSpace.id}`} className="block w-full">
                <Button 
                  size="lg"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg"
                >
                  View Details
                  <ChevronRight className="size-4 ml-2" />
                </Button>
              </Link>
              <Button 
                onClick={() => setIsBookingModalOpen(true)}
                size="lg"
                variant="outline"
                className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white"
              >
                <Calendar className="size-4 mr-2" />
                Book This Venue
              </Button>
              <Link href="tel:+639123456789" className="block w-full mt-2">
                <Button 
                  variant="outline"
                  size="lg"
                  className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white"
                >
                  <Phone className="size-4 mr-2" />
                  Call for Inquiry
                </Button>
              </Link>
            </div>

          </div>
        </div>

        {/* Venue Selector Dots */}
        <div className="flex justify-center items-center gap-3 mt-8">
          {eventSpaces.map((space, index) => (
            <button
              key={space.id}
              onClick={() => setCurrentIndex(index)}
              className={`group relative transition-all ${
                currentIndex === index ? 'scale-110' : ''
              }`}
              aria-label={`View ${space.name}`}
            >
              {/* Dot */}
              <div className={`w-3 h-3 rounded-full transition-all ${
                currentIndex === index 
                  ? 'bg-amber-600 w-8' 
                  : 'bg-slate-300 dark:bg-slate-600 hover:bg-amber-400'
              }`} />
              
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {space.name}
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  )
}
