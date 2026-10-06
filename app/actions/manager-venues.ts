"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

// ============================================================
// VENUE ACTIONS
// ============================================================

export async function createVenue(data: {
  name: string
  description?: string
  location: string
  capacity_min: number
  capacity_max: number
  base_rate: number
  photos?: string[]
  amenities?: string[]
  is_active: boolean
}) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("event_venues")
    .insert({
      name: data.name,
      description: data.description || null,
      location: data.location,
      capacity_min: data.capacity_min,
      capacity_max: data.capacity_max,
      base_rate: data.base_rate,
      photos: data.photos || [],
      amenities: data.amenities || [],
      is_active: data.is_active,
    })

  if (error) {
    console.error("Failed to create venue:", error)
    return { error: "Failed to create venue" }
  }

  revalidatePath("/manager/venues")
  return { success: true }
}

export async function updateVenue(
  id: string,
  data: {
    name: string
    description?: string
    location: string
    capacity_min: number
    capacity_max: number
    base_rate: number
    photos?: string[]
    amenities?: string[]
    is_active: boolean
  }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("event_venues")
    .update({
      name: data.name,
      description: data.description || null,
      location: data.location,
      capacity_min: data.capacity_min,
      capacity_max: data.capacity_max,
      base_rate: data.base_rate,
      photos: data.photos || [],
      amenities: data.amenities || [],
      is_active: data.is_active,
    })
    .eq("id", id)

  if (error) {
    console.error("Failed to update venue:", error)
    return { error: "Failed to update venue" }
  }

  revalidatePath("/manager/venues")
  revalidatePath(`/manager/venues/${id}/edit`)
  return { success: true }
}

export async function deleteVenue(id: string) {
  const supabase = await createClient()

  // Check if venue has bookings
  const { count } = await supabase
    .from("event_bookings")
    .select("*", { count: "exact", head: true })
    .eq("venue_id", id)

  if (count && count > 0) {
    return { error: "Cannot delete venue with existing bookings" }
  }

  const { error } = await supabase
    .from("event_venues")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Failed to delete venue:", error)
    return { error: "Failed to delete venue" }
  }

  revalidatePath("/manager/venues")
  return { success: true }
}

export async function toggleVenueStatus(id: string, is_active: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("event_venues")
    .update({ is_active })
    .eq("id", id)

  if (error) {
    console.error("Failed to toggle venue status:", error)
    return { error: "Failed to toggle venue status" }
  }

  revalidatePath("/manager/venues")
  return { success: true }
}

export async function getVenueById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("event_venues")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Failed to get venue:", error)
    return { venue: null, error: "Venue not found" }
  }

  return { venue: data, error: null }
}
