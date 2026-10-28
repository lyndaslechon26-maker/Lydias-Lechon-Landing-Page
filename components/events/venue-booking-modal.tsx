'use client'

import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft, Calendar, Users, Clock, Package, FileText, CreditCard, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface VenueBookingModalProps {
  isOpen: boolean
  onClose: () => void
  venue: {
    id: string
    name: string
    base_rate: number
    capacity_max: number
    duration: string
    location: string
  }
}

type Step = 1 | 2 | 3 | 4 | 5

export function VenueBookingModal({ isOpen, onClose, venue }: VenueBookingModalProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Event Details
    eventType: '',
    eventName: '',
    eventDate: '',
    eventStartTime: '',
    eventEndTime: '',
    numGuests: '',
    
    // Step 2: Event Package Selection
    packageId: '',
    packageName: '',
    packagePrice: 0,
    
    // Step 3: Additional Services
    specialRequests: '',
    dietaryRestrictions: '',
    
    // Step 4: Contact Information
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    
    // Step 5: Review & Confirm
  })

  const [eventPackages, setEventPackages] = useState<any[]>([])
  const [loadingPackages, setLoadingPackages] = useState(false)

  // Fetch event packages
  useEffect(() => {
    async function fetchPackages() {
      setLoadingPackages(true)
      const supabase = createClient()
      
      console.log('Fetching event packages...')
      
      const { data, error } = await supabase
        .from('event_packages')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
      
      console.log('Event packages result:', { data, error })
      
      if (data) {
        setEventPackages(data)
      }
      if (error) {
        console.error('Error fetching packages:', error)
      }
      setLoadingPackages(false)
    }
    fetchPackages()
  }, [])

  const eventTypes = [
    'Wedding',
    'Birthday Party',
    'Corporate Event',
    'Baptism',
    'Anniversary',
    'Reunion',
    'Other'
  ]

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handlePackageSelect = (pkg: any) => {
    setFormData(prev => ({
      ...prev,
      packageId: pkg.id,
      packageName: pkg.name,
      packagePrice: Number(pkg.base_price || pkg.price_per_person || 0)
    }))
    setError(null)
  }

  const calculateTotal = () => {
    return venue.base_rate + formData.packagePrice
  }

  const validateStep = (step: Step): boolean => {
    switch (step) {
      case 1:
        if (!formData.eventType || !formData.eventDate || !formData.eventStartTime || !formData.eventEndTime || !formData.numGuests) {
          setError('Please fill in all required fields')
          return false
        }
        if (parseInt(formData.numGuests) > venue.capacity_max) {
          setError(`Guest count exceeds venue capacity (${venue.capacity_max} max)`)
          return false
        }
        return true
      case 2:
        // Package selection is optional
        return true
      case 3:
        return true // Optional fields
      case 4:
        if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
          setError('Please fill in all contact information')
          return false
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.customerEmail)) {
          setError('Please enter a valid email address')
          return false
        }
        return true
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5) as Step)
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as Step)
    setError(null)
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      
      // Check if user is logged in and get customer_id
      const { data: { user } } = await supabase.auth.getUser()
      let customerId: string | null = null
      
      if (user) {
        // Fetch customer record to get customer_id
        const { data: customerData } = await supabase
          .from('event_customers')
          .select('id')
          .eq('auth_id', user.id)
          .single()
        
        if (customerData) {
          customerId = customerData.id
        }
      }
      
      // Calculate duration
      const start = new Date(`2000-01-01T${formData.eventStartTime}`)
      const end = new Date(`2000-01-01T${formData.eventEndTime}`)
      const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

      const totalAmount = calculateTotal()

      // Generate booking number
      const date = new Date()
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
      const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase()
      const bookingNumber = `BK-${dateStr}-${randomStr}`

      // Create booking with customer_id if user is logged in
      const bookingData: any = {
        booking_number: bookingNumber,
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        event_type: formData.eventType,
        event_name: formData.eventName || `${formData.eventType} at ${venue.name}`,
        event_date: formData.eventDate,
        event_start_time: formData.eventStartTime,
        event_end_time: formData.eventEndTime,
        duration_hours: durationHours,
        venue_id: venue.id,
        venue_name: venue.name,
        num_guests: parseInt(formData.numGuests),
        package_id: formData.packageId || null,
        package_name: formData.packageName || null,
        special_requests: formData.specialRequests || null,
        dietary_restrictions: formData.dietaryRestrictions || null,
        venue_cost: venue.base_rate,
        subtotal: totalAmount,
        total_amount: totalAmount,
        status: 'pending',
        payment_status: 'pending',
      }
      
      // Add customer_id if user is authenticated
      if (customerId) {
        bookingData.customer_id = customerId
      }

      console.log('Submitting booking:', bookingData)

      const { data, error: bookingError } = await supabase
        .from('event_bookings')
        .insert(bookingData)
        .select()
        .single()

      if (bookingError) {
        console.error('Booking error:', bookingError)
        throw bookingError
      }

      console.log('Booking created:', data)

      // Success - redirect to dashboard or confirmation page
      router.push('/events/dashboard/bookings')
      onClose()
    } catch (err: any) {
      console.error('Booking error:', err)
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        details: err.details,
        hint: err.hint
      })
      setError(err.message || err.details || 'Failed to create booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const steps = [
    { number: 1, title: 'Event Details', icon: Calendar },
    { number: 2, title: 'Event Package', icon: Package },
    { number: 3, title: 'Services', icon: FileText },
    { number: 4, title: 'Contact Info', icon: FileText },
    { number: 5, title: 'Review', icon: Check },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-amber-500 to-orange-500">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 size-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors z-10"
          >
            <X className="size-5" />
          </button>
          
          <h2 className="text-2xl font-bold text-white mb-1">Book Your Venue</h2>
          <p className="text-white/90 text-sm">{venue.name} • {venue.location}</p>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`size-10 rounded-full flex items-center justify-center transition-all ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                  }`}>
                    {currentStep > step.number ? (
                      <Check className="size-5" />
                    ) : (
                      <step.icon className="size-5" />
                    )}
                  </div>
                  <span className={`text-xs mt-1 font-medium hidden sm:block ${
                    currentStep >= step.number ? 'text-amber-600' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 transition-all ${
                    currentStep > step.number
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Step 1: Event Details */}
          {currentStep === 1 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <Label htmlFor="eventType" className="text-base font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="size-4" />
                  Event Type *
                </Label>
                <select
                  id="eventType"
                  value={formData.eventType}
                  onChange={(e) => handleInputChange('eventType', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select event type</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="eventName" className="text-base font-semibold mb-2">
                  Event Name (Optional)
                </Label>
                <Input
                  id="eventName"
                  value={formData.eventName}
                  onChange={(e) => handleInputChange('eventName', e.target.value)}
                  placeholder="e.g., John & Jane's Wedding"
                  className="h-12 text-base"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eventDate" className="text-base font-semibold mb-2">
                    Event Date *
                  </Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => handleInputChange('eventDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="h-12 text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="numGuests" className="text-base font-semibold mb-2 flex items-center gap-2">
                    <Users className="size-4" />
                    Number of Guests *
                  </Label>
                  <Input
                    id="numGuests"
                    type="number"
                    value={formData.numGuests}
                    onChange={(e) => handleInputChange('numGuests', e.target.value)}
                    placeholder={`Max ${venue.capacity_max}`}
                    min="1"
                    max={venue.capacity_max}
                    className="h-12 text-base"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eventStartTime" className="text-base font-semibold mb-2 flex items-center gap-2">
                    <Clock className="size-4" />
                    Start Time *
                  </Label>
                  <Input
                    id="eventStartTime"
                    type="time"
                    value={formData.eventStartTime}
                    onChange={(e) => handleInputChange('eventStartTime', e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="eventEndTime" className="text-base font-semibold mb-2">
                    End Time *
                  </Label>
                  <Input
                    id="eventEndTime"
                    type="time"
                    value={formData.eventEndTime}
                    onChange={(e) => handleInputChange('eventEndTime', e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Event Package Selection */}
          {currentStep === 2 && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Red Notice Banner */}
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
                <p className="text-sm text-red-900 dark:text-red-100 font-medium">
                  ⚠️ Package prices will be added to the venue rental cost. Total = Venue Rent + Event Package
                </p>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 flex items-center gap-2">
                  <Package className="size-5" />
                  Choose Your Event Package (Optional)
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Select a package that fits your event needs. You can also skip this and book venue only.
                </p>

                {loadingPackages ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="size-8 animate-spin text-amber-600" />
                  </div>
                ) : eventPackages.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* None/Skip Option */}
                    <button
                      onClick={() => handlePackageSelect({ id: '', name: '', base_price: 0 })}
                      className={`p-5 rounded-xl border-2 text-left transition-all hover:shadow-lg ${
                        !formData.packageId
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-lg">No Package</h4>
                        {!formData.packageId && (
                          <div className="size-6 rounded-full bg-amber-500 flex items-center justify-center">
                            <Check className="size-4 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Venue rental only, no package included
                      </p>
                      <p className="text-2xl font-bold text-amber-600">₱0</p>
                    </button>

                    {/* Event Packages */}
                    {eventPackages.map((pkg) => (
                      <button
                        key={pkg.id}
                        onClick={() => handlePackageSelect(pkg)}
                        className={`p-5 rounded-xl border-2 text-left transition-all hover:shadow-lg ${
                          formData.packageId === pkg.id
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-lg">{pkg.name}</h4>
                            <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                              {pkg.event_type}
                            </span>
                          </div>
                          {formData.packageId === pkg.id && (
                            <div className="size-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                              <Check className="size-4 text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {pkg.short_description || pkg.description}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-bold text-amber-600">
                            ₱{Number(pkg.base_price || pkg.price_per_person || 0).toLocaleString()}
                          </p>
                          {pkg.price_per_person && (
                            <span className="text-xs text-muted-foreground">/person</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="size-12 mx-auto mb-3 opacity-30" />
                    <p>No event packages available at the moment.</p>
                  </div>
                )}
              </div>

              {/* Current Selection Summary */}
              {formData.packageId && (
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                    ✓ Selected: {formData.packageName}
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Package Price: ₱{formData.packagePrice.toLocaleString()} • Total: ₱{calculateTotal().toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Additional Services */}
          {currentStep === 3 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  💡 These services are optional. You can skip this step and add them later.
                </p>
              </div>

              <div>
                <Label htmlFor="specialRequests" className="text-base font-semibold mb-2">
                  Special Requests
                </Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  placeholder="Any special setup, decorations, or requirements?"
                  rows={4}
                  className="text-base resize-none"
                />
              </div>

              <div>
                <Label htmlFor="dietaryRestrictions" className="text-base font-semibold mb-2">
                  Dietary Restrictions
                </Label>
                <Textarea
                  id="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                  placeholder="Any food allergies or dietary requirements for your guests?"
                  rows={3}
                  className="text-base resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 4: Contact Information */}
          {currentStep === 4 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <Label htmlFor="customerName" className="text-base font-semibold mb-2">
                  Full Name *
                </Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="Juan Dela Cruz"
                  className="h-12 text-base"
                />
              </div>

              <div>
                <Label htmlFor="customerEmail" className="text-base font-semibold mb-2">
                  Email Address *
                </Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  placeholder="juan@example.com"
                  className="h-12 text-base"
                />
              </div>

              <div>
                <Label htmlFor="customerPhone" className="text-base font-semibold mb-2">
                  Phone Number *
                </Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  placeholder="+63 912 345 6789"
                  className="h-12 text-base"
                />
              </div>

              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-900 dark:text-amber-100">
                  📧 We'll send booking confirmation and updates to this email address.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Review & Confirm */}
          {currentStep === 5 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="p-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border">
                <h3 className="text-lg font-bold mb-4">Booking Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Venue</span>
                    <span className="font-semibold">{venue.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Event Type</span>
                    <span className="font-semibold">{formData.eventType}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-semibold">
                      {new Date(formData.eventDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })} • {formData.eventStartTime} - {formData.eventEndTime}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Guests</span>
                    <span className="font-semibold">{formData.numGuests} persons</span>
                  </div>
                  {formData.packageId && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Event Package</span>
                      <span className="font-semibold">{formData.packageName}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Contact</span>
                    <span className="font-semibold">{formData.customerName}</span>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="mt-6 pt-4 border-t-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Venue Rental</span>
                    <span className="font-medium">₱{venue.base_rate.toLocaleString()}</span>
                  </div>
                  {formData.packageId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Event Package</span>
                      <span className="font-medium">₱{formData.packagePrice.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 pt-4 border-t-2">
                    <span className="font-bold text-base">Total Amount</span>
                    <span className="font-bold text-2xl text-amber-600">₱{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-900 dark:text-green-100">
                  ✓ By confirming, you agree to our booking terms and conditions.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 max-w-2xl mx-auto">
              <p className="text-sm text-red-900 dark:text-red-100">{error}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            {currentStep < 5 ? (
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8"
              >
                Continue
                <ChevronRight className="size-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <Check className="size-4 mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
