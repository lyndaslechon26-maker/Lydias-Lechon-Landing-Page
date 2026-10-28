import { createClient } from "@/lib/supabase/server"
import { MenuPageClient } from "./menu-client"

export default async function MenuPage() {
  const supabase = await createClient()
  
  // Fetch menu items
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select(`
      *,
      food_categories (
        id,
        name
      )
    `)
    .eq("is_available", true)
    .order("category_id", { ascending: true })
    .order("name", { ascending: true })

  // Fetch menu packages
  const { data: menuPackages } = await supabase
    .from("menu_packages")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  // Fetch event packages
  const { data: eventPackages } = await supabase
    .from("event_packages")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  console.log("Server - Event packages fetched:", eventPackages?.length || 0)

  return (
    <MenuPageClient 
      menuItems={menuItems || []}
      menuPackages={menuPackages || []}
      eventPackages={eventPackages || []}
    />
  )
}
