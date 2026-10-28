"use client"

import { useState } from "react"
import { Calendar, Clock, Users, Phone, Mail } from "lucide-react"
import { TableReservationDetailsModal } from "@/components/manager/table-reservation-details-modal"
import type { TableReservation } from "@/app/actions/manager-table-reservations"

interface ReservationsListProps {
  reservations: TableReservation[]
}

const statusColors = {
  pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  confirmed: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  cancelled: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  completed: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  no_show: "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400",
}

// Helper function to convert 24h to 12h format
const formatTime12Hour = (time24: string) => {
  const [hours, minutes] = time24.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${hour12}:${minutes} ${ampm}`
}

export function ReservationsList({ reservations }: ReservationsListProps) {
  const [selectedReservation, setSelectedReservation] = useState<TableReservation | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Group reservations by date
  const groupedReservations = reservations.reduce((acc, reservation) => {
    const date = reservation.reservation_date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(reservation)
    return acc
  }, {} as Record<string, TableReservation[]>)

  const sortedDates = Object.keys(groupedReservations).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  )

  const handleReservationClick = (reservation: TableReservation) => {
    setSelectedReservation(reservation)
    setIsModalOpen(true)
  }

  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-16 border rounded-lg bg-muted/30">
        <Calendar className="size-16 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">No reservations found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or table reservations will appear here
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {sortedDates.map((date) => {
          const dateReservations = groupedReservations[date]
          const dateObj = new Date(date)
          const isToday = date === new Date().toISOString().split("T")[0]
          const isPast = dateObj < new Date(new Date().setHours(0, 0, 0, 0))

          return (
            <div key={date} className="space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold">
                  {dateObj.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
                {isToday && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    Today
                  </span>
                )}
                {isPast && !isToday && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400">
                    Past
                  </span>
                )}
                <span className="text-sm text-muted-foreground">
                  ({dateReservations.length}{" "}
                  {dateReservations.length === 1 ? "reservation" : "reservations"})
                </span>
              </div>

              <div className="grid gap-4">
                {dateReservations.map((reservation) => (
                  <button
                    key={reservation.id}
                    onClick={() => handleReservationClick(reservation)}
                    className="block p-6 rounded-xl border bg-card hover:shadow-lg hover:border-amber-600 transition-all text-left w-full"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Main Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold">{reservation.customer_name}</h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              statusColors[reservation.status as keyof typeof statusColors]
                            }`}
                          >
                            {reservation.status.replace("_", " ").toUpperCase()}
                          </span>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="size-4 flex-shrink-0" />
                            <span className="font-medium">
                              {formatTime12Hour(reservation.reservation_time)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="size-4 flex-shrink-0" />
                            <span>{reservation.num_guests} guests</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="size-4 flex-shrink-0" />
                            <span className="truncate">{reservation.customer_phone || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                            <Mail className="size-4 flex-shrink-0" />
                            <span className="truncate">{reservation.customer_email}</span>
                          </div>
                        </div>

                        {reservation.special_requests && (
                          <div className="p-3 rounded-lg bg-muted/50 text-sm">
                            <p className="font-medium mb-1">Special Requests:</p>
                            <p className="text-muted-foreground">{reservation.special_requests}</p>
                          </div>
                        )}
                      </div>

                      {/* Booked Date */}
                      <div className="text-sm text-muted-foreground">
                        <p>Booked on {new Date(reservation.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <TableReservationDetailsModal
        reservation={selectedReservation}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  )
}
