"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { EventType } from "@/lib/types/events"

// ============================================================
// PACKAGE ACTIONS
// ============================================================

export async function createPackage(data: {
  name: string
  slug: string
  event_type: EventType
  description?: string
  short_description?: string
  price_per_person: number
  base_price: number
  min_guests: number
  max_guests: number
  duration_hours: number
  inclusions?: any[]
  available_addons?: string[]
  featured_image?: string
  gallery?: string[]
  is_active: boolean
  is_featured: boolean
}) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("event_packages")
    .insert({
      name: data.name,
      slug: data.slug,
      event_type: data.event_type,
      description: data.description || null,
      short_description: data.short_description || null,
      price_per_person: data.price_per_person,
      base_price: data.base_price,
      min_guests: data.min_guests,
      max_guests: data.max_guests,
      duration_hours: data.duration_hours,
      inclusions: data.inclusions || [],
      available_addons: data.available_addons || [],
      featured_image: data.featured_image || null,
      gallery: data.gallery || [],
      is_active: data.is_active,
      is_featured: data.is_featured,
    })

  if (error) {
    console.error("Failed to create package:", error)
    return { error: "Failed to create package" }
  }

  revalidatePath("/manager/packages")
  return { success: true }
}

export async function updatePackage(
  id: string,
  data: {
    name: string
    slug: string
    event_type: EventType
    description?: string
    short_description?: string
    price_per_person: number
    base_price: number
    min_guests: number
    max_guests: number
    duration_hours: number
    inclusions?: any[]
    available_addons?: string[]
    featured_image?: string
    gallery?: string[]
    is_active: boolean
    is_featured: boolean
  }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("event_packages")
    .update({
      name: data.name,
      slug: data.slug,
      event_type: data.event_type,
      description: data.description || null,
      short_description: data.short_description || null,
      price_per_person: data.price_per_person,
      base_price: data.base_price,
      min_guests: data.min_guests,
      max_guests: data.max_guests,
      duration_hours: data.duration_hours,
      inclusions: data.inclusions || [],
      available_addons: data.available_addons || [],
      featured_image: data.featured_image || null,
      gallery: data.gallery || [],
      is_active: data.is_active,
      is_featured: data.is_featured,
    })
    .eq("id", id)

  if (error) {
    console.error("Failed to update package:", error)
    return { error: "Failed to update package" }
  }

  revalidatePath("/manager/packages")
  revalidatePath(`/manager/packages/${id}/edit`)
  return { success: true }
}

export async function deletePackage(id: string) {
  const supabase = await createClient()

  // Check if package has bookings
  const { count } = await supabase
    .from("event_bookings")
    .select("*", { count: "exact", head: true })
    .eq("package_id", id)

  if (count && count > 0) {
    return { error: "Cannot delete package with existing bookings" }
  }

  const { error } = await supabase
    .from("event_packages")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Failed to delete package:", error)
    return { error: "Failed to delete package" }
  }

  revalidatePath("/manager/packages")
  return { success: true }
}

export async function togglePackageStatus(id: string, is_active: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("event_packages")
    .update({ is_active })
    .eq("id", id)

  if (error) {
    console.error("Failed to toggle package status:", error)
    return { error: "Failed to toggle package status" }
  }

  revalidatePath("/manager/packages")
  return { success: true }
}

export async function togglePackageFeatured(id: string, is_featured: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("event_packages")
    .update({ is_featured })
    .eq("id", id)

  if (error) {
    console.error("Failed to toggle package featured status:", error)
    return { error: "Failed to toggle package featured status" }
  }

  revalidatePath("/manager/packages")
  return { success: true }
}

export async function getPackageById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("event_packages")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Failed to get package:", error)
    return { package: null, error: "Package not found" }
  }

  return { package: data, error: null }
}
