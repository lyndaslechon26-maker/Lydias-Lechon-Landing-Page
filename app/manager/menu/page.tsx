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

  // Fetch menu items with categories
  const { data: items } = await supabase
    .from("signature_dishes")
    .select(`
      *,
      category:food_categories(*)
    `)
    .order("created_at", { ascending: false })

  return <MenuManager categories={categories || []} items={items || []} />
}
