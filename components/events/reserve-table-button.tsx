"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import { TableBookingModal } from "./table-booking-modal"

export function ReserveTableButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

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
