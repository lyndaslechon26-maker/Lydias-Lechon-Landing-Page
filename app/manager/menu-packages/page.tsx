"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import {
  UtensilsCrossed,
  Plus,
  Edit,
  Users,
  DollarSign,
  ChefHat,
  Pizza,
  Wine,
  Cake,
  RefreshCw,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { EditMenuPackageDialog } from "@/components/manager/edit-menu-package-dialog"

export const dynamic = "force-dynamic"

const categoryIcons = {
  buffet: ChefHat,
  plated: Pizza,
  drinks: Wine,
  dessert: Cake,
}

const categoryColors = {
  buffet: "bg-orange-100 dark:bg-orange-900/30 text-orange-600",
  plated: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
  drinks: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
  dessert: "bg-pink-100 dark:bg-pink-900/30 text-pink-600",
}

export default function ManagerMenuPackagesPage() {
  const [menuPackages, setMenuPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  useEffect(() => {
    loadPackages()
  }, [])

  const loadPackages = async () => {
    setLoading(true)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("event_menu_packages")
      .select("*")
      .order("sort_order")

    if (error) {
      setError(error.message)
    } else {
      setMenuPackages(data || [])
    }
    setLoading(false)
  }

  const handleEdit = (packageId: string) => {
    setEditingPackageId(packageId)
    setEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    loadPackages()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  const activePackages = menuPackages?.filter((p) => p.is_active) || []
  const inactivePackages = menuPackages?.filter((p) => !p.is_active) || []

  type MenuPackage = typeof activePackages[number]

  // Group by category
  const byCategory = activePackages.reduce((acc, pkg) => {
    if (!acc[pkg.category]) acc[pkg.category] = []
    acc[pkg.category].push(pkg)
    return acc
  }, {} as Record<string, MenuPackage[]>)

  return (
    <div className="space-y-6 bg-white dark:bg-zinc-950">
      <EditMenuPackageDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        packageId={editingPackageId}
        onSuccess={handleEditSuccess}
      />
      
      <PageHeader
        title="Menu Package Management"
        description="Manage your event catering and menu options"
        crumbs={[{ label: "Lydia's Lechon" }, { label: "Manager" }, { label: "Menu Packages" }]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 size-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 size-4" />
              Export
            </Button>
            <Link href="/manager/menu-packages/new">
              <Button size="sm" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                <Plus className="size-4 mr-2" />
                Add Menu Package
              </Button>
            </Link>
          </>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="Total Packages"
          value={(menuPackages?.length || 0).toString()}
          icon={UtensilsCrossed}
          accent="blue"
          subtitle="all menu packages"
        />
        
        {Object.entries(categoryColors).map(([category, color]) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons]
          const count = byCategory[category]?.length || 0
          return (
            <StatCard
              key={category}
              label={category.charAt(0).toUpperCase() + category.slice(1)}
              value={count.toString()}
              icon={Icon}
              accent={category === 'buffet' ? 'amber' : category === 'plated' ? 'purple' : category === 'drinks' ? 'blue' : 'rose'}
              subtitle={`${category} packages`}
            />
          )
        })}
      </div>

      {/* Active Packages by Category */}
      {Object.keys(byCategory).length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-muted/30">
          <UtensilsCrossed className="size-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No menu packages</h3>
          <p className="text-muted-foreground mb-6">
            Create your first menu package to offer catering options
          </p>
          <Link href="/manager/menu-packages/new">
            <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
              <Plus className="size-4 mr-2" />
              Add Your First Menu Package
            </Button>
          </Link>
        </div>
      ) : (
        (Object.entries(byCategory) as [string, MenuPackage[]][]).map(([category, packages]) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons]
          const colorClass = categoryColors[category as keyof typeof categoryColors]
          
          return (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colorClass} font-semibold`}>
                  <Icon className="size-4" />
                  <span className="capitalize">{category} Packages</span>
                </div>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="grid gap-6 lg:grid-cols-2 xl:gap-8">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-6 rounded-xl border-2 bg-card shadow-md hover:shadow-xl hover:border-amber-300 transition-all duration-300 hover:-translate-y-2"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">{pkg.name}</h3>
                        {pkg.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {pkg.description}
                          </p>
                        )}
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600">
                        Active
                      </span>
                    </div>

                    {/* Pricing & Min Order */}
                    <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-t pt-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Package Price</p>
                        <div className="flex items-center gap-1">
                          <DollarSign className="size-4 text-amber-600" />
                          <span className="font-semibold">
                            ₱{Number(pkg.price_per_person).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Min Order</p>
                        <div className="flex items-center gap-1">
                          <Users className="size-4 text-blue-600" />
                          <span className="font-semibold">{pkg.min_order} pax</span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items Preview */}
                    {pkg.items && pkg.items.length > 0 && (
                      <div className="mb-4 pb-4 border-t pt-3">
                        <p className="text-xs text-muted-foreground mb-2">
                          Menu Items ({pkg.items.length})
                        </p>
                        <div className="space-y-1">
                          {pkg.items.slice(0, 3).map((item: any, idx: number) => (
                            <div key={idx} className="text-sm flex items-center gap-2">
                              <span className="size-1 rounded-full bg-amber-600" />
                              <span className="text-muted-foreground">{item.name}</span>
                            </div>
                          ))}
                          {pkg.items.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              +{pkg.items.length - 3} more items
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Dietary Info */}
                    {pkg.dietary_info && Object.values(pkg.dietary_info).some((v: any) => v) && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Object.entries(pkg.dietary_info).map(([key, value]) => 
                          value ? (
                            <div key={key} className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 text-xs">
                              <span className="capitalize">{key.replace('_', ' ')}</span>
                            </div>
                          ) : null
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => handleEdit(pkg.id)}
                      >
                        <Edit className="size-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}

      {/* Inactive Packages */}
      {inactivePackages.length > 0 && (
        <details className="space-y-4">
          <summary className="cursor-pointer text-lg font-bold hover:text-amber-600">
            Inactive Menu Packages ({inactivePackages.length})
          </summary>

          <div className="grid gap-6 lg:grid-cols-2 xl:gap-8 mt-4">
            {inactivePackages.map((pkg) => (
              <div
                key={pkg.id}
                className="p-6 rounded-xl border-2 bg-card shadow-md opacity-60 hover:opacity-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{pkg.category}</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-900/30 text-gray-600">
                    Inactive
                  </span>
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleEdit(pkg.id)}
                  >
                    <Edit className="size-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}
