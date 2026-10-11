"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import {
  UtensilsCrossed,
  Plus,
  Edit,
  Eye,
  Users,
  DollarSign,
  ChefHat,
  X,
  Tag,
  Trash2,
  MoreVertical,
  Search,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/page-header"
import { EditMenuPackageDialog } from "@/components/manager/edit-menu-package-dialog"
import { createPackageCategory, updatePackageCategory, deletePackageCategory } from "@/app/actions/manager-package-categories"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

export const dynamic = "force-dynamic"

export default function ManagerMenuPackagesPage() {
  const [menuPackages, setMenuPackages] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewingPackage, setViewingPackage] = useState<any | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [categoryDialog, setCategoryDialog] = useState<{ open: boolean; category: any | null }>({ open: false, category: null })
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "best-selling">("all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  useEffect(() => {
    loadPackages()
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("package_categories")
      .select("*")
      .order("sort_order")
    
    setCategories(data || [])
  }

  const loadPackages = async () => {
    setLoading(true)
    const supabase = createClient()
    
    // Join with categories to get category info
    const { data, error } = await supabase
      .from("menu_packages")
      .select(`
        *,
        category:package_categories(id, name, description)
      `)
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

  const handleView = (pkg: any) => {
    setViewingPackage(pkg)
    setViewDialogOpen(true)
  }

  const handleEditSuccess = () => {
    loadPackages()
  }

  const handleDeleteCategory = async () => {
    if (!deleteCategoryId) return
    
    const result = await deletePackageCategory(deleteCategoryId)
    if (result?.error) {
      setError(result.error)
    } else {
      await loadCategories()
      await loadPackages()
    }
    setDeleteCategoryId(null)
  }

  const refreshData = async () => {
    await loadCategories()
    await loadPackages()
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

  // Filter packages based on category ID, search, and status
  const filteredPackages = menuPackages.filter(pkg => {
    // Category filter
    if (categoryFilter !== "all" && pkg.category_id !== categoryFilter) return false
    
    // Status filter
    if (statusFilter === "active" && !pkg.is_active) return false
    if (statusFilter === "inactive" && pkg.is_active) return false
    if (statusFilter === "best-selling" && !pkg.is_best_selling) return false
    
    // Search filter
    if (search) {
      const q = search.toLowerCase()
      return (
        pkg.name.toLowerCase().includes(q) ||
        (pkg.description || "").toLowerCase().includes(q) ||
        (pkg.category?.name || "").toLowerCase().includes(q)
      )
    }
    
    return true
  })

  return (
    <div className="space-y-6 bg-white dark:bg-zinc-950">
      <EditMenuPackageDialog
        open={editDialogOpen || createDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open)
          setCreateDialogOpen(open)
          if (!open) setEditingPackageId(null)
        }}
        packageId={editingPackageId}
        onSuccess={handleEditSuccess}
      />
      
      <PageHeader
        title="Menu Package Management"
        description="Manage your event catering and menu options"
        crumbs={[{ label: "Lydia's Lechon" }, { label: "Manager" }, { label: "Menu Packages" }]}
        actions={
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="size-4 mr-2" />
            Add Menu Package
          </Button>
        }
      />

      {/* Search and Filters */}
      {!showCategoryManager && (
        <Card className="transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
          <CardContent className="flex flex-wrap items-center gap-3 p-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search items by name or description..."
                className="h-9 pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as "all" | "active" | "inactive" | "best-selling")}
            >
              <SelectTrigger className="h-9 w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="best-selling">Best Seller</SelectItem>
              </SelectContent>
            </Select>
            {(search || categoryFilter !== "all" || statusFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("")
                  setCategoryFilter("all")
                  setStatusFilter("all")
                }}
              >
                <Filter className="mr-1 size-3" />
                Clear
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Content - All Packages on Left, Category Filter on Right */}
      <div className="flex gap-6">
        {/* LEFT: All Menu Packages Grid */}
        <div className="flex-1 min-w-0">
          {filteredPackages.length === 0 ? (
            <div className="text-center py-16 border rounded-2xl bg-muted/30">
              <UtensilsCrossed className="size-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No menu packages</h3>
              <p className="text-muted-foreground mb-6">
                {categoryFilter !== "all" ? "No packages in this category" : "Create your first menu package to offer catering options"}
              </p>
              {categoryFilter === "all" && (
                <Button 
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  onClick={() => setCreateDialogOpen(true)}
                >
                  <Plus className="size-4 mr-2" />
                  Add Your First Menu Package
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="rounded-xl border-2 bg-card shadow-md hover:shadow-xl hover:border-amber-300 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                  >
                    {/* Package Image - Full Cover with Badges */}
                    {pkg.photo && (
                      <div className="w-full h-36 bg-muted overflow-hidden relative">
                        <img
                          src={pkg.photo}
                          alt={pkg.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Badges on top of image */}
                        <div className="absolute top-2 right-2 flex flex-row items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 dark:bg-green-900/30 text-green-600 whitespace-nowrap text-center">
                            Active
                          </span>
                          {pkg.is_best_selling && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white whitespace-nowrap text-center">
                              Best Seller
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className={pkg.photo ? "p-4" : "p-6"}>
                      {/* Header - Smaller Text */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="text-base font-bold mb-1">{pkg.name}</h3>
                          {pkg.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {pkg.description}
                            </p>
                          )}
                        </div>
                      </div>

                    {/* Pricing & Serves - Compact */}
                    <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-t pt-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-1">Bundle Price</p>
                        <div className="flex items-center gap-1">
                          <DollarSign className="size-3 text-amber-600" />
                          <span className="text-sm font-semibold">
                            ₱{Number(pkg.bundle_price).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-1">Good For</p>
                        <div className="flex items-center gap-1">
                          <Users className="size-3 text-blue-600" />
                          <span className="text-sm font-semibold">{pkg.serves_persons} persons</span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items Preview - Compact */}
                    {pkg.items && pkg.items.length > 0 && (
                      <div className="mb-3 pb-3 border-t pt-3">
                        <p className="text-[10px] text-muted-foreground mb-1.5">
                          Menu Items ({pkg.items.length})
                        </p>
                        <div className="space-y-0.5">
                          {pkg.items.slice(0, 2).map((item: any, idx: number) => (
                            <div key={idx} className="text-xs flex items-center gap-1.5">
                              <span className="size-1 rounded-full bg-amber-600 flex-shrink-0" />
                              <span className="text-muted-foreground line-clamp-1">{item.name}</span>
                            </div>
                          ))}
                          {pkg.items.length > 2 && (
                            <p className="text-[10px] text-muted-foreground pl-2.5">
                              +{pkg.items.length - 2} more items
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
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleView(pkg)}
                        >
                          <Eye className="size-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEdit(pkg.id)}
                        >
                          <Edit className="size-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Category Sidebar */}
        <div className="w-[240px] flex-shrink-0 space-y-4">
          <Card className="sticky top-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Categories</h3>
                {categoryFilter !== "all" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setCategoryFilter("all")}
                    className="h-auto p-1 text-xs"
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="space-y-1">
                {/* All Packages */}
                <button
                  onClick={() => setCategoryFilter("all")}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    categoryFilter === "all"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="size-4" />
                    <span className="font-medium">All Packages</span>
                  </div>
                  <span className={`text-xs font-semibold tabular-nums ${
                    categoryFilter === "all" ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}>
                    {menuPackages.length}
                  </span>
                </button>

                {/* Dynamic Categories */}
                {categories.filter(c => c.is_active).map((cat) => {
                  const catPackages = menuPackages.filter(pkg => pkg.category_id === cat.id)
                  const isActive = categoryFilter === cat.id
                  
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`flex size-5 shrink-0 items-center justify-center text-xs ${
                          isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                        }`}>
                          {cat.sort_order}
                        </span>
                        <span className="font-medium truncate">{cat.name}</span>
                      </div>
                      <span className={`text-xs font-semibold tabular-nums shrink-0 ml-2 ${
                        isActive ? "text-primary-foreground" : "text-emerald-600 dark:text-emerald-400"
                      }`}>
                        {catPackages.length}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Manage Categories Button */}
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={() => setShowCategoryManager(true)}
              >
                <ChefHat className="mr-2 size-3.5" />
                Manage Categories
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Category Manager Section */}
      {showCategoryManager && (
        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCategoryManager(false)}
            >
              ← Back to Packages
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Package Categories</h3>
                  <p className="text-sm text-muted-foreground">Manage package category organization</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setCategoryDialog({ open: true, category: null })}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                >
                  <Plus className="size-4 mr-2" />
                  New Category
                </Button>
              </div>

              {categories.length === 0 ? (
                <div className="text-center py-12">
                  <ChefHat className="size-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm font-medium">No categories yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Create your first package category</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.map((cat) => {
                    const catPackages = menuPackages.filter(pkg => pkg.category_id === cat.id)
                    return (
                      <div
                        key={cat.id}
                        className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
                          {cat.sort_order}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{cat.name}</span>
                            {!cat.is_active && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-900/30 text-gray-600">
                                Inactive
                              </span>
                            )}
                          </div>
                          {cat.description && (
                            <p className="text-xs text-muted-foreground truncate">{cat.description}</p>
                          )}
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <div>{catPackages.length} packages</div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCategoryDialog({ open: true, category: cat })}
                          >
                            <Edit className="size-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteCategoryId(cat.id)}
                            disabled={catPackages.length > 0}
                          >
                            <X className="size-3" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Details Modal */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogOverlay className="bg-gradient-to-br from-black/70 via-black/50 to-black/70 backdrop-blur-md" />
        <DialogContent className="max-w-2xl max-h-[90vh] bg-white dark:bg-zinc-900">
          <DialogHeader>
            <DialogTitle>Package Details</DialogTitle>
          </DialogHeader>

          {viewingPackage && (
            <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
              <div className="space-y-6">
                {/* Package Image */}
                {viewingPackage.photo && (
                  <div className="w-full h-64 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={viewingPackage.photo}
                      alt={viewingPackage.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Basic Info */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-2xl font-bold">{viewingPackage.name}</h2>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        viewingPackage.is_active 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                          : 'bg-gray-100 dark:bg-gray-900/30 text-gray-600'
                      }`}>
                        {viewingPackage.is_active ? 'Active' : 'Inactive'}
                      </span>
                      {viewingPackage.is_best_selling && (
                        <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-600 text-white">
                          Best Seller
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground capitalize mb-1">
                    Category: {viewingPackage.category?.name || 'No category'}
                  </p>
                  {viewingPackage.description && (
                    <p className="text-sm text-muted-foreground">
                      {viewingPackage.description}
                    </p>
                  )}
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Bundle Price</p>
                    <div className="flex items-center gap-2">
                      <DollarSign className="size-5 text-amber-600" />
                      <span className="text-2xl font-bold">
                        ₱{Number(viewingPackage.bundle_price).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Good For</p>
                    <div className="flex items-center gap-2">
                      <Users className="size-5 text-blue-600" />
                      <span className="text-2xl font-bold">
                        {viewingPackage.serves_persons} persons
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                {viewingPackage.items && viewingPackage.items.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Menu Items ({viewingPackage.items.length})</h3>
                    <div className="space-y-2">
                      {viewingPackage.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg">
                          <span className="flex-shrink-0 size-6 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center text-sm font-bold">
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            {item.description && (
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            Qty: {item.quantity || 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Category Form Dialog */}
      <CategoryFormDialog
        key={categoryDialog.category?.id ?? "new-category"}
        open={categoryDialog.open}
        category={categoryDialog.category}
        onClose={() => setCategoryDialog({ open: false, category: null })}
        onSaved={() => {
          setCategoryDialog({ open: false, category: null })
          refreshData()
        }}
      />

      {/* Delete Category Confirmation */}
      <Dialog open={!!deleteCategoryId} onOpenChange={(o) => !o && setDeleteCategoryId(null)}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader className="space-y-3">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <Trash2 className="size-6 text-red-600 dark:text-red-500" />
            </div>
            <DialogTitle className="text-center text-xl">Delete Category?</DialogTitle>
            <DialogDescription className="text-center">
              Categories with existing packages cannot be deleted. Please reassign or remove packages first.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteCategoryId(null)}
              disabled={loading}
              className="w-full sm:w-auto sm:flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCategory}
              disabled={loading}
              className="w-full sm:w-auto sm:flex-1"
            >
              {loading ? "Deleting..." : "Delete Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================================
// Category form dialog
// ============================================================
function CategoryFormDialog({
  open,
  category,
  onClose,
  onSaved,
}: {
  open: boolean
  category: any | null
  onClose: () => void
  onSaved: () => void
}) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setPending(true)

    const fd = new FormData(e.currentTarget)
    const name = fd.get("name") as string
    const description = fd.get("description") as string
    const isActive = fd.get("is_active") === "true"

    try {
      const result = category
        ? await updatePackageCategory(category.id, { name, description, is_active: isActive })
        : await createPackageCategory({ name, description, is_active: isActive })

      if (result?.error) {
        setError(result.error)
        setPending(false)
        return
      }
      
      setPending(false)
      onSaved()
    } catch (err) {
      setError("An unexpected error occurred")
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogOverlay className="bg-gradient-to-br from-black/70 via-black/50 to-black/70 backdrop-blur-md" />
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "New Category"}</DialogTitle>
          <DialogDescription>
            {category
              ? "Update category details."
              : "Create a new package category."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="cat-name" className="block text-sm font-medium">Name *</label>
            <Input
              id="cat-name"
              name="name"
              required
              defaultValue={category?.name ?? ""}
              placeholder="e.g. Buffet Packages"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="cat-desc" className="block text-sm font-medium">Description</label>
            <Textarea
              id="cat-desc"
              name="description"
              rows={3}
              defaultValue={category?.description ?? ""}
              placeholder="Optional description"
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-sm">Active</p>
              <p className="text-xs text-muted-foreground">
                {category?.is_active !== false ? "Visible in filters" : "Hidden from filters"}
              </p>
            </div>
            <input
              type="hidden"
              name="is_active"
              value={category?.is_active !== false ? "true" : "false"}
            />
            <button
              type="button"
              role="switch"
              aria-checked={category?.is_active !== false}
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement
                input.value = input.value === "true" ? "false" : "true"
                e.currentTarget.setAttribute("aria-checked", input.value)
              }}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                ${category?.is_active !== false ? 'bg-orange-500' : 'bg-gray-300'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${category?.is_active !== false ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending} className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
              {pending ? "Saving..." : category ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
