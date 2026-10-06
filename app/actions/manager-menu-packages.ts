"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

// ============================================================
// MENU PACKAGE ACTIONS
// ============================================================

export async function createMenuPackage(data: {
  name: string
  category: string
  description?: string
  price_per_person: number
  min_guests: number
  items: string[]
  is_active: boolean
}) {
  const supabase = await createClient()

  // Get max sort_order
  const { data: packages } = await supabase
    .from("event_menu_packages")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)

  const nextSortOrder = packages && packages.length > 0 ? packages[0].sort_order + 1 : 0

  const { error } = await supabase
    .from("event_menu_packages")
    .insert({
      name: data.name,
      category: data.category,
      description: data.description || null,
      price_per_person: data.price_per_person,
      min_guests: data.min_guests,
      items: data.items || [],
      is_active: data.is_active,
      sort_order: nextSortOrder,
    })

  if (error) {
    console.error("Failed to create menu package:", error)
    return { error: "Failed to create menu package" }
  }

  revalidatePath("/manager/menu-packages")
  return { success: true }
}

export async function updateMenuPackage(
  id: string,
  data: {
    name: string
    category: string
    description?: string
    price_per_person: number
    min_guests: number
    items: string[]
    is_active: boolean
  }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("event_menu_packages")
    .update({
      name: data.name,
      category: data.category,
      description: data.description || null,
      price_per_person: data.price_per_person,
      min_guests: data.min_guests,
      items: data.items || [],
      is_active: data.is_active,
    })
    .eq("id", id)

  if (error) {
    console.error("Failed to update menu package:", error)
    return { error: "Failed to update menu package" }
  }

  revalidatePath("/manager/menu-packages")
  revalidatePath(`/manager/menu-packages/${id}/edit`)
  return { success: true }
}

export async function deleteMenuPackage(id: string) {
  const supabase = await createClient()

  // Check if package has bookings
  const { count } = await supabase
    .from("event_bookings")
    .select("*", { count: "exact", head: true })
    .eq("menu_package_id", id)

  if (count && count > 0) {
    return { error: "Cannot delete menu package with existing bookings" }
  }

  const { error } = await supabase
    .from("event_menu_packages")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Failed to delete menu package:", error)
    return { error: "Failed to delete menu package" }
  }

  revalidatePath("/manager/menu-packages")
  return { success: true }
}

export async function toggleMenuPackageStatus(id: string, is_active: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("event_menu_packages")
    .update({ is_active })
    .eq("id", id)

  if (error) {
    console.error("Failed to toggle menu package status:", error)
    return { error: "Failed to toggle menu package status" }
  }

  revalidatePath("/manager/menu-packages")
  return { success: true }
}

export async function getMenuPackageById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("event_menu_packages")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Failed to get menu package:", error)
    return { menuPackage: null, error: "Menu package not found" }
  }

  return { menuPackage: data, error: null }
}
