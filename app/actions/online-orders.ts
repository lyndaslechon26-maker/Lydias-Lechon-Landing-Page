"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface CheckoutItem {
  item_id: string
  type: 'menu_item' | 'menu_package'
  name: string
  price: number
  quantity: number
  image_url?: string
}

/**
 * Generate unique order number
 */
async function generateOrderNumber(): Promise<string> {
  const supabase = await createClient()
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "")

  // Get today's order count
  const { count } = await supabase
    .from("online_orders")
    .select("*", { count: "exact", head: true })
    .gte("created_at", new Date(date.setHours(0, 0, 0, 0)).toISOString())

  const sequence = String((count || 0) + 1).padStart(3, "0")
  return `ONL-${dateStr}-${sequence}`
}

/**
 * Create online order
 */
export async function createOnlineOrder(input: {
  items: CheckoutItem[]
  order_type: 'delivery' | 'pickup'
  delivery_address?: string
  delivery_notes?: string
  payment_method: 'cash' | 'gcash' | 'card' | 'bank_transfer'
  scheduled_time?: string
}) {
  const supabase = await createClient()

  // 1. Get authenticated customer
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { data: customer } = await supabase
    .from("event_customers")
    .select("id, full_name, email, phone")
    .eq("auth_id", user.id)
    .single()

  if (!customer) return { error: "Customer profile not found" }

  // 2. Validate items
  if (!input.items || input.items.length === 0) {
    return { error: "Cart is empty" }
  }

  // 3. Calculate totals
  const subtotal = input.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const delivery_fee = input.order_type === 'delivery' ? 50 : 0 // ₱50 delivery fee
  const total_amount = subtotal + delivery_fee

  // 4. Generate order number
  const order_number = await generateOrderNumber()

  // 5. Create order
  const { data: order, error: orderError } = await supabase
    .from("online_orders")
    .insert({
      order_number,
      customer_id: customer.id,
      customer_name: customer.full_name,
      customer_email: customer.email,
      customer_phone: customer.phone || "",
      items: input.items,
      subtotal,
      delivery_fee,
      total_amount,
      order_type: input.order_type,
      delivery_address: input.delivery_address || null,
      delivery_notes: input.delivery_notes || null,
      scheduled_time: input.scheduled_time || null,
      payment_method: input.payment_method,
      status: "pending",
      payment_status: "pending"
    })
    .select()
    .single()

  if (orderError) return { error: orderError.message }

  // 6. Log activity
  await supabase.rpc("log_activity", {
    p_action: "online_order.created",
    p_entity: "online_order",
    p_entity_id: order.id,
    p_detail: {
      order_number,
      order_type: input.order_type,
      total_amount,
      item_count: input.items.length,
    },
  })

  revalidatePath("/events/dashboard")
  revalidatePath("/manager/orders")

  return { order, error: null }
}

/**
 * Get customer's online orders
 */
export async function getCustomerOnlineOrders() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { data: customer } = await supabase
    .from("event_customers")
    .select("id")
    .eq("auth_id", user.id)
    .single()

  if (!customer) return { error: "Customer profile not found" }

  const { data, error } = await supabase
    .from("online_orders")
    .select("*")
    .eq("customer_id", customer.id)
    .order("created_at", { ascending: false })

  if (error) return { error: error.message }
  return { orders: data, error: null }
}

/**
 * Get single online order
 */
export async function getOnlineOrder(orderId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("online_orders")
    .select("*")
    .eq("id", orderId)
    .single()

  if (error) return { error: error.message }
  return { order: data, error: null }
}

/**
 * Cancel online order
 */
export async function cancelOnlineOrder(orderId: string, reason?: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("online_orders")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason || null
    })
    .eq("id", orderId)

  if (error) return { error: error.message }

  revalidatePath("/events/dashboard")
  revalidatePath("/manager/orders")

  return { success: true, error: null }
}
