"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Users, UtensilsCrossed, ChevronRight } from "lucide-react"
import { TableBookingModal } from "./table-booking-modal"

interface ReserveTableButtonProps {
  variant?: "button" | "card"
}

export function ReserveTableButton({ variant = "button" }: ReserveTableButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (variant === "card") {
    return (
      <>
        <div
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col h-full"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 group-hover:bg-orange-600 dark:group-hover:bg-orange-600 transition-colors">
              <UtensilsCrossed className="size-6 text-orange-600 dark:text-orange-400 group-hover:text-white transition-colors" />
            </div>
            <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-semibold mb-1">Reserve a Table</h3>
          <p className="text-sm text-muted-foreground">Book a table for dine-in</p>
        </div>
        <TableBookingModal 
          open={isModalOpen} 
          onOpenChange={setIsModalOpen} 
        />
      </>
    )
  }

  return (
    <>
      <Button 
        variant="outline"
        onClick={() => setIsModalOpen(true)}
      >
        <Users className="size-4 mr-2" />
        Reserve a Table
      </Button>
      <TableBookingModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </>
  )
}
