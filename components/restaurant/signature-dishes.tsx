import { createAdminClient } from "@/lib/supabase/server"
import { SignatureDishesClient } from "./signature-dishes-client"

export async function SignatureDishes() {
  const supabase = await createAdminClient()
  
  // Fetch best selling items (max 5 items marked as best selling)
  const { data: menuItems, error } = await supabase
    .from('menu_items')
    .select('id, name, description, base_price, image_url, category_id')
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

  let dishes = menuItems?.map((item, index) => ({
    id: item.id,
    name: item.name,
    description: item.description || 'Delicious Filipino dish',
    price: item.base_price,
    image: item.image_url || `https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80`,
    category: 'Featured', // Don't use "Best Seller" as category since we have a separate badge
    isBestSeller: true // All items here are best sellers
  })) || []

  // Fallback data if no best selling items marked yet
  if (dishes.length === 0) {
    console.log('Using fallback data - no best sellers found')
    dishes = [
      {
        id: '1',
        name: 'Whole Lechon',
        description: 'Our legendary crispy-skinned lechon, perfectly roasted. Serves 15-20 people.',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
        category: 'Lechon Specialties',
        isBestSeller: true
      },
      {
        id: '2',
        name: 'Lechon Belly',
        description: 'The crispiest, most flavorful part - pure belly goodness',
        price: 850,
        image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80',
        category: 'Lechon Specialties',
        isBestSeller: false
      },
      {
        id: '3',
        name: 'Crispy Pata',
        description: 'Deep-fried pork leg with crispy skin and tender meat',
        price: 850,
        image: 'https://images.unsplash.com/photo-1603073363-e04e9b0ca9f5?w=800&q=80',
        category: 'Appetizers',
        isBestSeller: false
      },
      {
        id: '4',
        name: 'Sisig',
        description: 'Sizzling pork sisig with onions and chili',
        price: 380,
        image: 'https://images.unsplash.com/photo-1616847220575-1e5c4789ab74?w=800&q=80',
        category: 'Main Courses',
        isBestSeller: false
      },
      {
        id: '5',
        name: 'Kare-Kare',
        description: 'Oxtail and vegetables in rich peanut sauce',
        price: 520,
        image: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800&q=80',
        category: 'Main Courses',
        isBestSeller: false
      }
    ]
  }

  return <SignatureDishesClient dishes={dishes} />
}
