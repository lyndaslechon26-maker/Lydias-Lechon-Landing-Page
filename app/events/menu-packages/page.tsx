'use client'

import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Package, ChevronRight, X, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { FloatingCartButton } from "@/components/cart/floating-cart-button"
import { CartModal } from "@/components/cart/cart-modal"

// Category icons and colors
const categoryConfig: Record<string, { color: string; gradient: string }> = {
  lechon: { color: "text-orange-600", gradient: "from-orange-500 to-amber-500" },
  "quick meals": { color: "text-red-600", gradient: "from-red-500 to-rose-500" },
  "party trays": { color: "text-amber-600", gradient: "from-amber-500 to-yellow-500" },
  "family boxes": { color: "text-pink-600", gradient: "from-pink-500 to-rose-500" },
  "bento box": { color: "text-blue-600", gradient: "from-blue-500 to-cyan-500" },
  "promo deals": { color: "text-green-600", gradient: "from-green-500 to-emerald-500" },
}

function MenuPackagesContent() {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category')
  const { addToCart, checkAuth } = useCart()
  
  const [packages, setPackages] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState<any>(null)

  useEffect(() => {
    async function fetchMenuPackages() {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from("menu_packages")
        .select(`
          *,
          category:package_categories(id, name, description)
        `)
        .eq("is_active", true)
        .order("category_id", { ascending: true })
        .order("name", { ascending: true })

      if (error) {
        console.error("Menu packages fetch error:", error)
      }

      if (data) {
        setPackages(data)
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(pkg => pkg.category?.name).filter(Boolean))] as string[]
        setCategories(uniqueCategories)
        
        // Set initial category from URL if provided
        if (categoryFromUrl && uniqueCategories.includes(categoryFromUrl)) {
          setSelectedCategory(categoryFromUrl)
        }
      }

      setLoading(false)
    }

    fetchMenuPackages()
  }, [categoryFromUrl])

  // Filter packages by selected category
  const filteredPackages = selectedCategory === "all" 
    ? packages 
    : packages.filter(pkg => pkg.category?.name === selectedCategory)

  const handleAddToCart = async (pkg: any) => {
    const authenticated = await checkAuth()
    if (!authenticated) {
      window.location.href = '/events/login?next=' + window.location.pathname
      return
    }

    addToCart({
      id: pkg.id,
      type: 'menu_package',
      name: pkg.name,
      price: Number(pkg.bundle_price),
      image_url: pkg.photo,
      description: pkg.description,
      serves_persons: pkg.serves_persons,
      items: pkg.items,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <FloatingCartButton />
      <CartModal />
      {/* Header */}
      <section className="relative py-16 sm:py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-rose-950/20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 text-sm font-medium mb-4">
            <Package className="size-4" />
            <span>Menu Packages</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Food Bundles & Meal Packages
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Perfect for groups and families—from our signature lechon to convenient meal bundles, all freshly prepared with authentic Filipino flavors.
          </p>
        </div>
      </section>

      {/* Category Filter Buttons */}
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
              All Packages
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

      {/* Packages Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Loading packages...</p>
            </div>
          ) : filteredPackages.length > 0 ? (
            <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className="group relative cursor-pointer"
                    >
                      {/* Card with modern design */}
                      <div className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white dark:bg-slate-800">
                        {/* Main Image */}
                        <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                          {pkg.image_url ? (
                            <img
                              src={pkg.image_url}
                              alt={pkg.name}
                              className="size-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="size-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100">
                              <Package className="size-24 text-muted-foreground/30" />
                            </div>
                          )}
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />

                          {/* Category Badge - Top Left */}
                          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-amber-900 text-xs font-semibold uppercase tracking-wide">
                            {pkg.category?.name || "Other"}
                          </div>

                          {/* Featured Badge */}
                          {pkg.is_featured && (
                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold">
                              Featured
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          {/* Package Name */}
                          <h3 className="text-lg font-bold mb-2 line-clamp-2 text-slate-900 dark:text-white">
                            {pkg.name}
                          </h3>

                          {/* Description */}
                          {pkg.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
                              {pkg.description}
                            </p>
                          )}

                          {/* Good for */}
                          {pkg.serves_persons && (
                            <p className="text-xs text-muted-foreground mb-3">
                              Good for: {pkg.serves_persons} persons
                            </p>
                          )}

                          {/* Price */}
                          <div className="mb-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">
                              ₱{Number(pkg.bundle_price).toLocaleString()}
                            </div>
                          </div>

                          {/* View Details Link */}
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer">
                              View Details
                              <ChevronRight className="size-4" />
                            </div>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAddToCart(pkg)
                              }}
                              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                            >
                              <ShoppingCart className="size-3 mr-1" />
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Package className="size-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {selectedCategory === "all" 
                      ? "No menu packages available at the moment."
                      : `No ${selectedCategory} packages available at the moment.`
                    }
                  </p>
                </div>
              )}
            </div>
          </section>

      {/* Package Details Modal */}
      {selectedPackage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedPackage(null)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPackage(null)}
              className="absolute top-4 right-4 z-10 size-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <X className="size-6" />
            </button>

            {/* Content */}
            <div className="flex flex-col md:flex-row">
              {/* Image Section */}
              <div className="relative w-full md:w-2/5 bg-slate-100 dark:bg-slate-800">
                <div className="aspect-square md:aspect-auto md:h-full">
                  {selectedPackage.image_url ? (
                    <img
                      src={selectedPackage.image_url}
                      alt={selectedPackage.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center">
                      <Package className="size-32 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              </div>

              {/* Info Section */}
              <div className="w-full md:w-3/5 p-6 sm:p-8 overflow-y-auto max-h-[50vh] md:max-h-full">
                {/* Category Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 text-xs font-semibold mb-4 uppercase tracking-wide">
                  {selectedPackage.category?.name || "Other"}
                </div>

                {/* Package Name */}
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                  {selectedPackage.name}
                </h2>

                {/* Description */}
                {selectedPackage.description && (
                  <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                    {selectedPackage.description}
                  </p>
                )}

                {/* Good for */}
                {selectedPackage.serves_persons && (
                  <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Good for:</span> {selectedPackage.serves_persons} persons
                    </p>
                  </div>
                )}

                {/* Menu Items */}
                {selectedPackage.items && selectedPackage.items.length > 0 && (
                  <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Package Includes:</h3>
                    <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                      {selectedPackage.items.map((item: any, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-amber-600 mt-1">•</span>
                          <span>{item.name} {item.quantity && `(${item.quantity})`}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-amber-600 dark:text-amber-500">
                      ₱{Number(selectedPackage.bundle_price).toLocaleString()}
                    </span>
                  </div>
                  {selectedPackage.serves_persons && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Good for {selectedPackage.serves_persons} persons
                    </p>
                  )}
                </div>

                {/* Featured Badge (if applicable) */}
                {selectedPackage.is_featured && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold mb-6">
                    <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured Package
                  </div>
                )}

                {/* Action Button */}
                <div>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => setSelectedPackage(null)}
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
            Choose from our meal packages perfect for families and celebrations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/events/contact">
              <Button size="lg" variant="secondary" className="min-w-[160px]">
                Contact Us
              </Button>
            </Link>
            <Link href="/events">
              <Button size="lg" variant="outline" className="min-w-[160px] border-white text-white hover:bg-white/10">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function MenuPackagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading packages...</p>
        </div>
      </div>
    }>
      <MenuPackagesContent />
    </Suspense>
  )
}
