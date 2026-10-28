"use server"

import { createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface TableReservation {
  id: string
  customer_id: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  reservation_date: string
  reservation_time: string
  num_guests: number
  special_requests: string | null
  branch_id: string | null
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show"
  created_at: string
  updated_at: string
  cancelled_at: string | null
  cancellation_reason: string | null
}

/**
 * Get all table reservations
 */
export async function getAllTableReservations(filters?: {
  status?: string
  date_from?: string
  date_to?: string
  search?: string
}) {
  const supabase = await createAdminClient()

  let query = supabase
    .from("table_reservations")
    .select("*")
    .order("reservation_date", { ascending: false })
    .order("reservation_time", { ascending: false })

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status)
  }

  if (filters?.date_from) {
    query = query.gte("reservation_date", filters.date_from)
  }

  if (filters?.date_to) {
    query = query.lte("reservation_date", filters.date_to)
  }

  if (filters?.search) {
    query = query.or(
      `customer_name.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%,customer_phone.ilike.%${filters.search}%`
    )
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching table reservations:", error)
    return { reservations: [], error: error.message }
  }

  return { reservations: data as TableReservation[], error: null }
}

/**
 * Get table reservations statistics
 */
export async function getTableReservationsStats() {
  const supabase = await createAdminClient()

  const today = new Date().toISOString().split("T")[0]

  // Total reservations
  const { count: total } = await supabase
    .from("table_reservations")
    .select("*", { count: "exact", head: true })

  // Today's reservations
  const { count: todayCount } = await supabase
    .from("table_reservations")
    .select("*", { count: "exact", head: true })
    .eq("reservation_date", today)

  // Upcoming reservations (pending or confirmed, future dates)
  const { count: upcoming } = await supabase
    .from("table_reservations")
    .select("*", { count: "exact", head: true })
    .in("status", ["pending", "confirmed"])
    .gte("reservation_date", today)

  // Pending approval
  const { count: pending } = await supabase
    .from("table_reservations")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  return {
    total: total || 0,
    today: todayCount || 0,
    upcoming: upcoming || 0,
    pending: pending || 0,
  }
}

/**
 * Update table reservation status
 */
export async function updateTableReservationStatus(
  reservationId: string,
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show",
  reason?: string
) {
  const supabase = await createAdminClient()

  const updateData: any = { status }

  if (status === "cancelled" && reason) {
    updateData.cancelled_at = new Date().toISOString()
    updateData.cancellation_reason = reason
  }

  const { error } = await supabase
    .from("table_reservations")
    .update(updateData)
    .eq("id", reservationId)

  if (error) {
    console.error("Error updating reservation status:", error)
    return { error: error.message }
  }

  revalidatePath("/manager/table-reservations")
  return { success: true, error: null }
}

/**
 * Delete table reservation
 */
export async function deleteTableReservation(reservationId: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from("table_reservations")
    .delete()
    .eq("id", reservationId)

  if (error) {
    console.error("Error deleting reservation:", error)
    return { error: error.message }
  }

  revalidatePath("/manager/table-reservations")
  return { success: true, error: null }
}
