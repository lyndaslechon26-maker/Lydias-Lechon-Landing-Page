import { createAdminClient } from "@/lib/supabase/server"
import { SignatureDishesClient } from "./signature-dishes-client"

export async function SignatureDishes() {
  const supabase = await createAdminClient()
  
  // Fetch best selling items (max 5 items marked as best selling)
  const { data: menuItems, error } = await supabase
    .from('menu_items')
    .select('id, name, description, base_price, image_url, category:categories(name)')
    .eq('is_available', true)
    .eq('is_best_selling', true)
    .order('created_at', { ascending: false })
    .limit(5)

  // Debug logging
  console.log('SignatureDishes Query Results:', {
    itemsFound: menuItems?.length || 0,
    error: error?.message,
    items: menuItems?.map(i => i.name)
  })

  const dishes = menuItems?.map((item) => {
    // Handle category which might be an array from the join
    const categoryName = Array.isArray(item.category) 
      ? item.category[0]?.name 
      : (item.category as any)?.name || 'Best Seller'
    
    return {
      id: item.id,
      name: item.name,
      description: item.description || 'Delicious dish',
      price: item.base_price,
      image: item.image_url || `https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80`,
      category: categoryName,
      isBestSeller: true // All items here are best sellers
    }
  }) || []

  if (dishes.length === 0) {
    console.log('Using fallback data - no best sellers found')
  }

  return <SignatureDishesClient dishes={dishes} />
}
