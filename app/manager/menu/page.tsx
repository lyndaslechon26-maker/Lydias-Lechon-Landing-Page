import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MenuManager } from "@/components/manager/menu-manager"

export const dynamic = "force-dynamic"

export default async function ManagerMenuPage() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/events/login?next=/manager/menu")

  // Fetch categories
  const { data: categories } = await supabase
    .from("food_categories")
    .select("*")
    .order("sort_order", { ascending: true })

  // Fetch menu items - simplified query without JOIN
  const { data: items, error: itemsError } = await supabase
    .from("menu_items")
    .select("*")
    .order("created_at", { ascending: false })

  console.log('Menu items fetch result:', { 
    itemsCount: items?.length || 0, 
    error: itemsError?.message,
    sampleItem: items?.[0]
  })

  return <MenuManager categories={categories || []} items={items || []} />
}
