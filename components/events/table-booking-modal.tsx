"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, Users, X } from "lucide-react"
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

    toast.success("Table reserved successfully! We'll send you a confirmation email shortly.")
    onOpenChange(false)
    
    // Reset form
    setFormData({
      date: "",
      time: "",
      guests: "",
      specialRequests: "",
    })

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
