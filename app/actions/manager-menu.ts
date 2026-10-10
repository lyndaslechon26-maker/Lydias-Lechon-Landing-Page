"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

// ============================================================
// CATEGORY ACTIONS
// ============================================================

export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get("name") as string
  const description = formData.get("description") as string | null
  const sort_order = parseInt(formData.get("sort_order") as string) || 0

  const { error } = await supabase
    .from("food_categories")
    .insert({
      name,
      description,
      sort_order,
      is_active: true,
    })

  if (error) {
    console.error("Failed to create category:", error)
    return { error: "Failed to create category" }
  }

  revalidatePath("/manager/menu")
  return { success: true }
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get("name") as string
  const description = formData.get("description") as string | null
  const sort_order = parseInt(formData.get("sort_order") as string) || 0

  const { error } = await supabase
    .from("food_categories")
    .update({
      name,
      description,
      sort_order,
    })
    .eq("id", id)

  if (error) {
    console.error("Failed to update category:", error)
    return { error: "Failed to update category" }
  }

  revalidatePath("/manager/menu")
  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()

  // Check if category has items
  const { count } = await supabase
    .from("menu_items")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id)

  if (count && count > 0) {
    return { error: "Cannot delete category with existing items" }
  }

  const { error } = await supabase
    .from("food_categories")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Failed to delete category:", error)
    return { error: "Failed to delete category" }
  }

  revalidatePath("/manager/menu")
  return { success: true }
}

// ============================================================
// MENU ITEM ACTIONS
// ============================================================

export async function createMenuItem(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get("name") as string
  const description = formData.get("description") as string | null
  const base_price = parseFloat(formData.get("base_price") as string)
  const category_id = formData.get("category_id") as string | null
  const is_available = formData.get("is_available") === "on"
  const is_alcoholic = formData.get("is_alcoholic") === "on"
  const imageFile = formData.get("image_file") as File | null

  let image_url: string | null = null

  // Handle image upload
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `menu-items/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("restaurant-images")
      .upload(filePath, imageFile)

    if (!uploadError) {
      const { data } = supabase.storage
        .from("restaurant-images")
        .getPublicUrl(filePath)
      image_url = data.publicUrl
    }
  }

  const { error } = await supabase
    .from("menu_items")
    .insert({
      name,
      description,
      base_price,
      category_id: category_id === "none" ? null : category_id,
      is_available,
      is_alcoholic,
      image_url,
    })

  if (error) {
    console.error("Failed to create menu item:", error)
    return { error: "Failed to create menu item" }
  }

  revalidatePath("/manager/menu")
  return { success: true }
}

export async function updateMenuItem(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get("name") as string
  const description = formData.get("description") as string | null
  const base_price = parseFloat(formData.get("base_price") as string)
  const category_id = formData.get("category_id") as string | null
  const is_available = formData.get("is_available") === "on"
  const is_alcoholic = formData.get("is_alcoholic") === "on"
  const imageFile = formData.get("image_file") as File | null
  const existingImageUrl = formData.get("image_url") as string

  console.log("Update menu item - Form data:", {
    name,
    description,
    base_price,
    category_id,
    is_available,
    is_alcoholic,
    existingImageUrl,
    hasImageFile: !!imageFile && imageFile.size > 0,
  })

  let image_url: string | null = existingImageUrl || null

  // Handle image upload
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `menu-items/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("restaurant-images")
      .upload(filePath, imageFile)

    if (!uploadError) {
      const { data } = supabase.storage
        .from("restaurant-images")
        .getPublicUrl(filePath)
      image_url = data.publicUrl
    }
  }

  const { error } = await supabase
    .from("menu_items")
    .update({
      name,
      description,
      base_price,
      category_id: category_id === "none" ? null : category_id,
      is_available,
      is_alcoholic,
      image_url,
    })
    .eq("id", id)

  if (error) {
    console.error("Failed to update menu item:", error)
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    })
    return { error: `Failed to update menu item: ${error.message}` }
  }

  revalidatePath("/manager/menu")
  return { success: true }
}

export async function deleteMenuItem(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Failed to delete menu item:", error)
    return { error: "Failed to delete menu item" }
  }

  revalidatePath("/manager/menu")
  return { success: true }
}

export async function toggleMenuItemAvailability(id: string, is_available: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("menu_items")
    .update({ is_available })
    .eq("id", id)

  if (error) {
    console.error("Failed to toggle availability:", error)
    return { error: "Failed to toggle availability" }
  }

  revalidatePath("/manager/menu")
  return { success: true }
}
