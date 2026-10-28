'use client'

import Link from "next/link"
import { UtensilsCrossed, X, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { FloatingCartButton } from "@/components/cart/floating-cart-button"
import { CartModal } from "@/components/cart/cart-modal"

// Category icons and colors
const categoryConfig: Record<string, { color: string; gradient: string }> = {
  appetizers: { color: "text-orange-600", gradient: "from-orange-500 to-amber-500" },
  "main course": { color: "text-red-600", gradient: "from-red-500 to-rose-500" },
  burgers: { color: "text-amber-600", gradient: "from-amber-500 to-yellow-500" },
  desserts: { color: "text-pink-600", gradient: "from-pink-500 to-rose-500" },
  beverages: { color: "text-blue-600", gradient: "from-blue-500 to-cyan-500" },
  sides: { color: "text-green-600", gradient: "from-green-500 to-emerald-500" },
}

interface MenuPageClientProps {
  menuItems: any[]
  menuPackages: any[]
  eventPackages: any[]
}

export function MenuPageClient({ menuItems: initialMenuItems, menuPackages: initialMenuPackages, eventPackages: initialEventPackages }: MenuPageClientProps) {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category')
  const { addToCart, checkAuth } = useCart()
  
  const [menuItems] = useState<any[]>(initialMenuItems)
  const [menuPackages] = useState<any[]>(initialMenuPackages)
  const [eventPackages] = useState<any[]>(initialEventPackages)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedMainTab, setSelectedMainTab] = useState<'single' | 'family' | 'celebration'>('single')
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<any>(null)

  useEffect(() => {
    // Extract unique categories from menu items
    const uniqueCategories = [...new Set(menuItems.map(item => item.food_categories?.name).filter(Boolean))] as string[]
    setCategories(uniqueCategories)
    
    // Set initial category from URL if provided
    if (categoryFromUrl && uniqueCategories.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl)
    }

    console.log("Client - Menu items:", menuItems.length)
    console.log("Client - Menu packages:", menuPackages.length)
    console.log("Client - Event packages:", eventPackages.length)
  }, [categoryFromUrl, menuItems, menuPackages, eventPackages])

  // Filter items based on main tab and category
  const getDisplayItems = () => {
    if (selectedMainTab === 'single') {
      return selectedCategory === "all" 
        ? menuItems 
        : menuItems.filter(item => item.food_categories?.name === selectedCategory)
    } else if (selectedMainTab === 'family') {
      return menuPackages
    } else {
      return eventPackages
    }
  }

  const displayItems = getDisplayItems()

  const handleAddToCart = async (item: any, type: 'menu_item' | 'menu_package' | 'event_package') => {
    const authenticated = await checkAuth()
    if (!authenticated) {
      window.location.href = '/events/login?next=' + window.location.pathname
      return
    }

    const cartItem: any = {
      id: item.id,
      type: type === 'menu_item' ? 'menu_item' : 'menu_package',
      name: item.name,
      price: Number(type === 'event_package' ? item.base_price : (type === 'menu_package' ? item.bundle_price : item.base_price)),
      image_url: item.image_url,
      description: item.description,
    }

    if (type === 'menu_package') {
      cartItem.serves_persons = item.serves_persons
    }

    addToCart(cartItem)
  }

  return (
    <div className="min-h-screen bg-background">
      <FloatingCartButton />
      <CartModal />
      {/* Header */}
      <section className="relative py-16 sm:py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-rose-950/20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 text-sm font-medium mb-4">
            <UtensilsCrossed className="size-4" />
            <span>Our Menu</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Our Signature Menu
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover Lydia's Lechon favorites—from our iconic roasted lechon to authentic Filipino dishes, all freshly prepared with the same tradition since 1965.
          </p>
        </div>
      </section>

      {/* Main Menu Tabs - Single | Family | Celebration */}
      <section className="py-6 border-b bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSelectedMainTab('single')
                setSelectedCategory('all')
              }}
              className={`px-8 py-3 rounded-lg text-base font-bold transition-all ${
                selectedMainTab === 'single'
                  ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-700 hover:border-amber-400"
              }`}
            >
              Single Menu
            </button>
            <button
              onClick={() => {
                setSelectedMainTab('family')
                setSelectedCategory('all')
              }}
              className={`px-8 py-3 rounded-lg text-base font-bold transition-all ${
                selectedMainTab === 'family'
                  ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-700 hover:border-amber-400"
              }`}
            >
              Family Menu
            </button>
            <button
              onClick={() => {
                setSelectedMainTab('celebration')
                setSelectedCategory('all')
              }}
              className={`px-8 py-3 rounded-lg text-base font-bold transition-all ${
                selectedMainTab === 'celebration'
                  ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-700 hover:border-amber-400"
              }`}
            >
              Celebration Menu
            </button>
          </div>
        </div>
      </section>

      {/* Category Filter Buttons - Only show for Single Menu */}
      {selectedMainTab === 'single' && (
        <section className="py-8 border-b bg-white dark:bg-slate-950 sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {/* All Button */}
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 sm:px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === "all"
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                All Items
              </button>

              {/* Category Buttons */}
              {categories.map((category) => {
                const config = categoryConfig[category.toLowerCase()] || { gradient: "from-slate-500 to-gray-500" }
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 sm:px-6 py-2 rounded-full text-sm font-semibold transition-all capitalize ${
                      selectedCategory === category
                        ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Menu Items Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {displayItems.length > 0 ? (
            <div className="grid gap-6 sm:gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {displayItems.map((item) => {
                const itemType = selectedMainTab === 'single' ? 'menu_item' : selectedMainTab === 'family' ? 'menu_package' : 'event_package'
                // Handle different price field names across tables
                let price = 0
                if (selectedMainTab === 'celebration') {
                  // event_packages might use price_per_person or base_price
                  price = item.price_per_person || item.base_price || 0
                } else if (selectedMainTab === 'family') {
                  price = item.bundle_price || 0
                } else {
                  price = item.base_price || 0
                }
                
                return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="group relative cursor-pointer"
                    >
                      {/* Card with stacked effect - Travel Style */}
                      <div className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
                        {/* Main Image */}
                        <div className="aspect-[3/4] overflow-hidden bg-muted relative">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="size-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="size-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100">
                              <UtensilsCrossed className="size-24 text-muted-foreground/30" />
                            </div>
                          )}
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />

                          {/* Top Right Icons */}
                          <div className="absolute top-4 right-4 flex gap-2">
                            <button className="size-8 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors flex items-center justify-center">
                              <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </button>
                          </div>

                          {/* Overlay Content - Bottom */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            {/* Description */}
                            {item.description && (
                              <p className="text-xs opacity-90 mb-3 line-clamp-2">
                                {item.description}
                              </p>
                            )}

                            {/* Serves Persons (for packages) */}
                            {item.serves_persons && (
                              <p className="text-xs opacity-90 mb-2">
                                Good for {item.serves_persons} persons
                              </p>
                            )}

                            {/* Price and Add to Cart */}
                            <div className="flex items-center justify-between mb-0">
                              <div className="text-2xl font-bold">₱{Number(price).toLocaleString()}</div>
                              {selectedMainTab !== 'celebration' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleAddToCart(item, itemType)
                                  }}
                                  className="size-9 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center transition-colors"
                                >
                                  <ShoppingCart className="size-4 text-white" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Footer Bar - Item Name + Category */}
                        <div className="bg-black/90 backdrop-blur-sm p-3">
                          <h3 className="text-white font-bold text-sm mb-1 line-clamp-1">
                            {item.name}
                          </h3>
                          <p className="text-white/70 text-xs uppercase tracking-wide">
                            {selectedMainTab === 'single' && item.food_categories?.name ? item.food_categories.name : 
                             selectedMainTab === 'family' ? 'Family Package' : 
                             'Event Package'}
                          </p>
                        </div>

                        {/* Popular Badge (if applicable) */}
                        {item.is_featured && (
                          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-lg">
                            Popular
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <UtensilsCrossed className="size-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {selectedMainTab === 'single' && selectedCategory === "all" 
                      ? "No menu items available at the moment."
                      : selectedMainTab === 'single'
                      ? `No ${selectedCategory} items available at the moment.`
                      : selectedMainTab === 'family'
                      ? "No family packages available at the moment."
                      : "No celebration packages available at the moment."
                    }
                  </p>
                </div>
              )}
            </div>
          </section>

      {/* Image Lightbox Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 size-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <X className="size-6" />
            </button>

            {/* Content */}
            <div className="flex flex-col md:flex-row">
              {/* Image Section */}
              <div className="relative w-full md:w-3/5 bg-slate-100 dark:bg-slate-800">
                <div className="aspect-square md:aspect-auto md:h-full">
                  {selectedItem.image_url ? (
                    <img
                      src={selectedItem.image_url}
                      alt={selectedItem.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center">
                      <UtensilsCrossed className="size-32 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              </div>

              {/* Info Section */}
              <div className="w-full md:w-2/5 p-6 sm:p-8 overflow-y-auto max-h-[50vh] md:max-h-full">
                {/* Category Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 text-xs font-semibold mb-4 uppercase tracking-wide">
                  {selectedItem.food_categories?.name || "Other"}
                </div>

                {/* Item Name */}
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                  {selectedItem.name}
                </h2>

                {/* Description */}
                {selectedItem.description && (
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {selectedItem.description}
                  </p>
                )}

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-amber-600 dark:text-amber-500">
                      ₱{Number(selectedItem.base_price || selectedItem.bundle_price || selectedItem.price_per_person || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Featured Badge (if applicable) */}
                {selectedItem.is_featured && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold mb-6">
                    <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Popular Item
                  </div>
                )}

                {/* Action Button */}
                <div>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => setSelectedItem(null)}
                    className="w-full"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-amber-600 to-orange-600">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Order?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Browse our full menu and place your order for dine-in, takeout, or delivery
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/order">
              <Button size="lg" variant="secondary" className="min-w-[160px]">
                Order Now
              </Button>
            </Link>
            <Link href="/events/contact">
              <Button size="lg" variant="outline" className="min-w-[160px] border-white text-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
