"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Calendar, 
  Clock, 
  Users, 
  Phone, 
  Mail, 
  User,
  CheckCircle2,
  XCircle,
  Ban,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { updateTableReservationStatus } from "@/app/actions/manager-table-reservations"
import { useRouter } from "next/navigation"

interface TableReservation {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  reservation_date: string
  reservation_time: string
  num_guests: number
  special_requests: string | null
  status: string
  created_at: string
  cancelled_at: string | null
  cancellation_reason: string | null
}

interface TableReservationDetailsModalProps {
  reservation: TableReservation | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TableReservationDetailsModal({
  reservation,
  open,
  onOpenChange,
}: TableReservationDetailsModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReasonDialog, setShowReasonDialog] = useState(false)
  const [actionType, setActionType] = useState<"cancelled" | "no_show" | null>(null)
  const [reason, setReason] = useState("")

  if (!reservation) return null

  const handleApprove = async () => {
    setIsSubmitting(true)
    const { error } = await updateTableReservationStatus(reservation.id, "confirmed")
    setIsSubmitting(false)

    if (error) {
      toast.error(error)
      return
    }

    toast.success("Reservation confirmed successfully!")
    onOpenChange(false)
    router.refresh()
  }

  const handleDecline = () => {
    setActionType("cancelled")
    setShowReasonDialog(true)
  }

  const handleNoShow = () => {
    setActionType("no_show")
    setShowReasonDialog(true)
  }

  const handleSubmitReason = async () => {
    if (!actionType) return
    
    if (!reason.trim()) {
      toast.error("Please provide a reason")
      return
    }

    setIsSubmitting(true)
    const { error } = await updateTableReservationStatus(
      reservation.id,
      actionType,
      reason
    )
    setIsSubmitting(false)

    if (error) {
      toast.error(error)
      return
    }

    const message = actionType === "cancelled" 
      ? "Reservation cancelled successfully"
      : "Reservation marked as no-show"
    
    toast.success(message)
    setShowReasonDialog(false)
    setReason("")
    setActionType(null)
    onOpenChange(false)
    router.refresh()
  }

  const handleMarkComplete = async () => {
    setIsSubmitting(true)
    const { error } = await updateTableReservationStatus(reservation.id, "completed")
    setIsSubmitting(false)

    if (error) {
      toast.error(error)
      return
    }

    toast.success("Reservation marked as completed!")
    onOpenChange(false)
    router.refresh()
  }

  // Helper function to convert 24h to 12h format
  const formatTime12Hour = (time24: string) => {
    const [hours, minutes] = time24.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${hour12}:${minutes} ${ampm}`
  }

  const statusColors = {
    pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    confirmed: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    cancelled: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    completed: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    no_show: "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400",
  }

  const reservationDate = new Date(reservation.reservation_date)
  const isPast = reservationDate < new Date(new Date().setHours(0, 0, 0, 0))

  // Reason Dialog
  if (showReasonDialog) {
    return (
      <Dialog open={true} onOpenChange={() => {
        setShowReasonDialog(false)
        setReason("")
        setActionType(null)
      }}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold">
              {actionType === "cancelled" ? "Decline Reservation" : "Mark as No-Show"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Please provide a reason. This will be visible to the customer.
            </p>
          </DialogHeader>

          <div className="space-y-5 py-6">
            <div className="space-y-3">
              <Label htmlFor="reason" className="text-base font-semibold">
                Reason <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder={
                  actionType === "cancelled"
                    ? "e.g., Venue fully booked, Kitchen capacity reached, Unable to accommodate party size..."
                    : "e.g., Customer did not arrive, No response to confirmation call, Late without notice..."
                }
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={5}
                className="resize-none text-base"
              />
              <p className="text-xs text-muted-foreground">
                Be professional and courteous. The customer will receive this message via email.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => {
                  setShowReasonDialog(false)
                  setReason("")
                  setActionType(null)
                }}
                className="flex-1 font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReason}
                disabled={isSubmitting || !reason.trim()}
                variant="destructive"
                size="lg"
                className="flex-1 font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  `Submit ${actionType === "cancelled" ? "Decline" : "No-Show"}`
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold">
            Reservation Details
          </DialogTitle>
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-muted-foreground">
              Reference: #{reservation.id.slice(0, 8).toUpperCase()} • Created{" "}
              {new Date(reservation.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                statusColors[reservation.status as keyof typeof statusColors]
              }`}
            >
              {reservation.status.replace("_", " ").toUpperCase()}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Reservation Date & Time - Prominent Display */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-rose-950/20 border-2 border-amber-200 dark:border-amber-800">
            <div className="text-center space-y-3">
              <Calendar className="size-8 text-amber-600 mx-auto" />
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Reservation Date
                </p>
                <p className="text-2xl font-bold mt-1">
                  {reservationDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center justify-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <Clock className="size-5 text-amber-600" />
                  <span className="text-lg font-semibold">
                    {formatTime12Hour(reservation.reservation_time)}
                  </span>
                </div>
                <div className="h-6 w-px bg-amber-300 dark:bg-amber-700" />
                <div className="flex items-center gap-2">
                  <Users className="size-5 text-amber-600" />
                  <span className="text-lg font-semibold">
                    {reservation.num_guests} {reservation.num_guests === 1 ? "Guest" : "Guests"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <User className="size-5 text-amber-600" />
              Guest Information
            </h3>
            <div className="grid gap-4 p-4 rounded-lg border bg-card">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Full Name
                  </p>
                  <p className="text-base font-semibold">{reservation.customer_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Phone Number
                  </p>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-muted-foreground" />
                    <p className="text-base font-medium">
                      {reservation.customer_phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Email Address
                </p>
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  <p className="text-base font-medium">{reservation.customer_email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {reservation.special_requests && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Special Requests</h3>
              <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {reservation.special_requests}
                </p>
              </div>
            </div>
          )}

          {/* Cancellation/No-Show Info */}
          {(reservation.status === "cancelled" || reservation.status === "no_show") &&
            reservation.cancellation_reason && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
                  {reservation.status === "cancelled" ? "Cancellation" : "No-Show"} Information
                </h3>
                <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                  <p className="text-sm font-medium mb-2">Reason:</p>
                  <p className="text-sm leading-relaxed">{reservation.cancellation_reason}</p>
                  {reservation.cancelled_at && (
                    <p className="text-xs text-muted-foreground mt-3">
                      {new Date(reservation.cancelled_at).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  )}
                </div>
              </div>
            )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t">
            {reservation.status === "pending" && (
              <>
                <p className="text-sm text-muted-foreground mb-3">
                  Review this reservation and take action:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="size-5 mr-2" />
                        Confirm Reservation
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleDecline}
                    disabled={isSubmitting}
                    size="lg"
                    variant="destructive"
                    className="font-semibold"
                  >
                    <XCircle className="size-5 mr-2" />
                    Decline
                  </Button>
                </div>
              </>
            )}

            {reservation.status === "confirmed" && !isPast && (
              <>
                <p className="text-sm text-muted-foreground mb-3">
                  Update reservation status:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleMarkComplete}
                    disabled={isSubmitting}
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="size-5 mr-2" />
                        Mark Complete
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleNoShow}
                    disabled={isSubmitting}
                    size="lg"
                    variant="outline"
                    className="font-semibold"
                  >
                    <Ban className="size-5 mr-2" />
                    Mark No-Show
                  </Button>
                </div>
              </>
            )}

            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              size="lg"
              className="w-full font-medium"
              disabled={isSubmitting}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
