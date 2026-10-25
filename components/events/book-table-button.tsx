"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { TableBookingModal } from "./table-booking-modal"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface BookTableButtonProps {
  variant?: "default" | "hero" | "cta"
  className?: string
}

export function BookTableButton({ variant = "default", className = "" }: BookTableButtonProps) {
  const router = useRouter()
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    
    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleBookTableClick = () => {
    if (!user) {
      // Not logged in, redirect to login
      router.push("/events/login")
    } else {
      // Logged in, open modal
      setIsBookingModalOpen(true)
    }
  }

  // Hero button variant (large gradient button in hero section)
  if (variant === "hero") {
    return (
      <>
        <Button 
          onClick={handleBookTableClick}
          size="lg"
          className={`group relative overflow-hidden bg-gradient-to-r from-amber-600 to-orange-600 px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-lg font-semibold shadow-2xl shadow-amber-500/25 transition-all hover:shadow-amber-500/40 hover:scale-105 active:scale-95 ${className}`}
        >
          <span className="relative z-10 flex items-center gap-1 sm:gap-2">
            Book A Table
            <ChevronRight className="size-4 sm:size-5 transition-transform group-hover:translate-x-1" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
        </Button>
        <TableBookingModal 
          open={isBookingModalOpen} 
          onOpenChange={setIsBookingModalOpen} 
        />
      </>
    )
  }

  // CTA button variant (bottom section)
  if (variant === "cta") {
    return (
      <>
        <Button 
          onClick={handleBookTableClick}
          size="lg"
          className={`bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-6 text-lg font-semibold shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all ${className}`}
        >
          Book A Table
        </Button>
        <TableBookingModal 
          open={isBookingModalOpen} 
          onOpenChange={setIsBookingModalOpen} 
        />
      </>
    )
  }

  // Default button variant
  return (
    <>
      <Button 
        onClick={handleBookTableClick}
        className={className}
      >
        Book A Table
      </Button>
      <TableBookingModal 
        open={isBookingModalOpen} 
        onOpenChange={setIsBookingModalOpen} 
      />
    </>
  )
}
