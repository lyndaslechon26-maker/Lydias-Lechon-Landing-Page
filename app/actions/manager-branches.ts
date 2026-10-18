"use server"

import { createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface Branch {
  id: string
  name: string
  location: string
  phone: string
  hours: string
  landmark?: string
  image_url?: string
  google_maps_url?: string
  has_dine_in: boolean
  has_takeout: boolean
  has_delivery: boolean
  has_catering: boolean
  has_event_venue: boolean
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface BranchInput {
  name: string
  location: string
  phone: string
  hours: string
  landmark?: string
  image_url?: string
  google_maps_url?: string
  has_dine_in: boolean
  has_takeout: boolean
  has_delivery: boolean
  has_catering: boolean
  has_event_venue: boolean
  is_active: boolean
}

/**
 * Get all branches (manager)
 */
export async function getAllBranches() {
  const supabase = await createAdminClient()

  console.log('🔍 Fetching all branches...')

  const { data, error } = await supabase
    .from("branches")
    .select("*")
    .order("sort_order", { ascending: true })

  console.log('📊 All branches result:', {
    count: data?.length || 0,
    data: data,
    error: error?.message
  })

  if (error) {
    console.error('❌ Error fetching branches:', error)
    return { branches: null, error: error.message }
  }

  return { branches: data as Branch[], error: null }
}

/**
 * Get active branches (public)
 */
export async function getActiveBranches() {
  const supabase = await createAdminClient()

  console.log('🔍 Fetching active branches...')

  const { data, error } = await supabase
    .from("branches")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  console.log('📊 Active branches result:', {
    count: data?.length || 0,
    data: data,
    error: error?.message
  })

  if (error) {
    console.error('❌ Error fetching active branches:', error)
    return { branches: null, error: error.message }
  }

  return { branches: data as Branch[], error: null }
}

/**
 * Get single branch
 */
export async function getBranch(id: string) {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from("branches")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    return { branch: null, error: error.message }
  }

  return { branch: data as Branch, error: null }
}

/**
 * Create branch
 */
export async function createBranch(input: BranchInput) {
  const supabase = await createAdminClient()

  // Get max sort_order
  const { data: maxData } = await supabase
    .from("branches")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .single()

  const sort_order = (maxData?.sort_order || 0) + 1

  const { data, error } = await supabase
    .from("branches")
    .insert({
      ...input,
      sort_order,
    })
    .select()
    .single()

  if (error) {
    return { branch: null, error: error.message }
  }

  revalidatePath("/manager/branches")
  revalidatePath("/events/branches")
  revalidatePath("/events")

  return { branch: data as Branch, error: null }
}

/**
 * Update branch
 */
export async function updateBranch(id: string, input: Partial<BranchInput>) {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from("branches")
    .update(input)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { branch: null, error: error.message }
  }

  revalidatePath("/manager/branches")
  revalidatePath("/events/branches")
  revalidatePath("/events")

  return { branch: data as Branch, error: null }
}

/**
 * Delete branch
 */
export async function deleteBranch(id: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase.from("branches").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/manager/branches")
  revalidatePath("/events/branches")
  revalidatePath("/events")

  return { success: true, error: null }
}
