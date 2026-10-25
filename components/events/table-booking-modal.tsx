"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, Users, X, CheckCircle2, Phone, Mail } from "lucide-react"
import { toast } from "sonner"
import { createTableReservation } from "@/app/actions/events"
import { useRouter } from "next/navigation"

interface TableBookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TableBookingModal({ open, onOpenChange }: TableBookingModalProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: "",
    specialRequests: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [reservationDetails, setReservationDetails] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const { reservation, error } = await createTableReservation({
      reservationDate: formData.date,
      reservationTime: formData.time,
      numGuests: parseInt(formData.guests),
      specialRequests: formData.specialRequests || undefined
    })

    setIsSubmitting(false)

    if (error) {
      toast.error(error)
      return
    }

    // Store reservation details and show success dialog
    setReservationDetails({
      date: formData.date,
      time: formData.time,
      guests: formData.guests,
    })
    setShowSuccessDialog(true)
  }

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false)
    onOpenChange(false)
    
    // Reset form
    setFormData({
      date: "",
      time: "",
      guests: "",
      specialRequests: "",
    })
    setReservationDetails(null)

    // Refresh dashboard
    router.refresh()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0]

  // Success Dialog
  if (showSuccessDialog) {
    return (
      <Dialog open={true} onOpenChange={handleCloseSuccess}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="text-center space-y-6 py-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                <CheckCircle2 className="size-16 text-green-600 dark:text-green-400" />
              </div>
            </div>

            {/* Thank You Message */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
                Thank You!
              </h2>
              <p className="text-xl font-semibold">
                Your table reservation has been received
              </p>
            </div>

            {/* Reservation Details */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg p-6 space-y-3 text-left border border-amber-200 dark:border-amber-800">
              <h3 className="font-semibold text-lg text-center mb-4 text-amber-900 dark:text-amber-100">
                Reservation Details
              </h3>
              <div className="grid gap-3">
                <div className="flex items-center gap-3">
                  <Calendar className="size-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-semibold">
                      {new Date(reservationDetails?.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="size-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="font-semibold">{reservationDetails?.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="size-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Number of Guests</p>
                    <p className="font-semibold">{reservationDetails?.guests} {parseInt(reservationDetails?.guests) === 1 ? 'guest' : 'guests'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Reminders */}
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 space-y-4 text-left border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Phone className="size-5 text-blue-600" />
                Important Reminders
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                  <p>
                    <strong>Please ensure your mobile number is always active.</strong> We will send you a confirmation SMS and call you to verify your reservation.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                  <p>
                    A confirmation email has been sent to your registered email address with all the details.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                  <p>
                    Please arrive <strong>15 minutes before</strong> your reservation time.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                  <p>
                    If you need to cancel or modify your reservation, please contact us at least <strong>24 hours in advance</strong>.
                  </p>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="text-sm text-muted-foreground space-y-2 pt-2">
              <p className="flex items-center justify-center gap-2">
                <Phone className="size-4" />
                <span>Questions? Call us at <strong className="text-foreground">+63 123 456 7890</strong></span>
              </p>
              <p className="flex items-center justify-center gap-2">
                <Mail className="size-4" />
                <span>Email: <strong className="text-foreground">reservations@lydiaslechon.com</strong></span>
              </p>
            </div>

            {/* Close Button */}
            <Button
              onClick={handleCloseSuccess}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-6 text-lg"
            >
              Got it, Thanks!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Reserve a Table</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Book your table at Lydia's Lechon and experience authentic Filipino cuisine
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="size-4 text-amber-600" />
              Preferred Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              min={today}
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label htmlFor="time" className="flex items-center gap-2">
              <Clock className="size-4 text-amber-600" />
              Preferred Time <span className="text-red-500">*</span>
            </Label>
            <Input
              id="time"
              name="time"
              type="time"
              min="10:00"
              max="21:00"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Operating hours: 10:00 AM - 9:00 PM
            </p>
          </div>

          {/* Number of Guests */}
          <div className="space-y-2">
            <Label htmlFor="guests" className="flex items-center gap-2">
              <Users className="size-4 text-amber-600" />
              Number of Guests <span className="text-red-500">*</span>
            </Label>
            <Input
              id="guests"
              name="guests"
              type="number"
              min="1"
              max="20"
              value={formData.guests}
              onChange={handleChange}
              placeholder="e.g., 4"
              required
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              For parties of 20+, please contact us directly
            </p>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder="E.g., window seat, birthday celebration, dietary restrictions..."
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              {isSubmitting ? "Reserving..." : "Reserve Table"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
