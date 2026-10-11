"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

// ============================================================
// PACKAGE CATEGORY ACTIONS
// ============================================================

export async function createPackageCategory(data: {
  name: string
  description?: string
  is_active: boolean
}) {
  const supabase = await createClient()

  // Get max sort_order
  const { data: categories } = await supabase
    .from("package_categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)

  const nextSortOrder = categories && categories.length > 0 ? categories[0].sort_order + 1 : 0

  const { error } = await supabase
    .from("package_categories")
    .insert({
      name: data.name,
      description: data.description || null,
      is_active: data.is_active,
      sort_order: nextSortOrder,
    })

  if (error) {
    console.error("Failed to create package category:", error)
    return { error: "Failed to create package category" }
  }

  revalidatePath("/manager/menu-packages")
  return { success: true }
}

export async function updatePackageCategory(
  id: string,
  data: {
    name: string
    description?: string
    is_active: boolean
  }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("package_categories")
    .update({
      name: data.name,
      description: data.description || null,
      is_active: data.is_active,
    })
    .eq("id", id)

  if (error) {
    console.error("Failed to update package category:", error)
    return { error: "Failed to update package category" }
  }

  revalidatePath("/manager/menu-packages")
  return { success: true }
}

export async function deletePackageCategory(id: string) {
  const supabase = await createClient()

  // Check if category has packages
  const { count } = await supabase
    .from("menu_packages")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id)

  if (count && count > 0) {
    return { error: "Cannot delete category with existing packages" }
  }

  const { error } = await supabase
    .from("package_categories")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Failed to delete package category:", error)
    return { error: "Failed to delete package category" }
  }

  revalidatePath("/manager/menu-packages")
  return { success: true }
}
