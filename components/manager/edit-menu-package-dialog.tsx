"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Save, 
  Plus,
  Upload,
  Trash2,
  Loader2,
} from "lucide-react"
import { updateMenuPackage, getMenuPackageById, deleteMenuPackage, createMenuPackage } from "@/app/actions/manager-menu-packages"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/lib/supabase/client"
import { compressImageToBase64, formatFileSize, COMPRESSION_PRESETS } from "@/lib/image-compression"

interface MenuItem {
  name: string
  description: string
  is_signature: boolean
  quantity: number
}

interface MenuItemFromDB {
  id: string
  name: string
  description: string
  category: string
  price: number
  image_url?: string
}

interface EditMenuPackageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  packageId: string | null
  onSuccess: () => void
}

interface PackageCategory {
  id: string
  name: string
  description: string | null
  sort_order: number
  is_active: boolean
}

export function EditMenuPackageDialog({ open, onOpenChange, packageId, onSuccess }: EditMenuPackageDialogProps) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableMenuItems, setAvailableMenuItems] = useState<MenuItemFromDB[]>([])
  const [packageCategories, setPackageCategories] = useState<PackageCategory[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [menuPackage, setMenuPackage] = useState({
    name: "",
    category_id: "", // Changed from category to category_id
    description: "",
    bundle_price: 500,
    serves_persons: 50,
    items: [] as MenuItem[],
    photo: "",
    is_active: true,
    is_best_selling: false,
  })

  useEffect(() => {
    if (open && packageId) {
      loadMenuPackage()
      loadAvailableMenuItems()
      loadPackageCategories()
    } else if (open && !packageId) {
      // Create mode - load categories and menu items, reset form
      loadAvailableMenuItems()
      loadPackageCategories()
      setMenuPackage({
        name: "",
        category_id: "",
        description: "",
        bundle_price: 500,
        serves_persons: 50,
        items: [],
        photo: "",
        is_active: true,
        is_best_selling: false,
      })
      setLoading(false)
    }
  }, [open, packageId])

  const loadAvailableMenuItems = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("menu_items")
      .select("id, name, description, base_price, image_url")
      .eq("is_available", true)
      .order("name")

    if (!error && data) {
      // Transform to match expected format
      const transformedData = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
        category: "", // Not needed for display
        price: item.base_price || 0,
        image_url: item.image_url || ""
      }))
      setAvailableMenuItems(transformedData)
    } else {
      console.error("Failed to load menu items:", error)
    }
  }

  const loadPackageCategories = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("package_categories")
      .select("id, name, description, sort_order, is_active")
      .eq("is_active", true)
      .order("sort_order")

    if (!error && data) {
      setPackageCategories(data)
    } else {
      console.error("Failed to load package categories:", error)
    }
  }

  const loadMenuPackage = async () => {
    if (!packageId) return
    
    setLoading(true)
    const { menuPackage: data, error } = await getMenuPackageById(packageId)
    
    if (error || !data) {
      setError(error || "Menu package not found")
      setLoading(false)
      return
    }

    // Get menu items from database to look up descriptions and images
    const supabase = createClient()
    const { data: menuItemsData } = await supabase
      .from("menu_items")
      .select("name, description, image_url")
      .eq("is_available", true)

    const menuItemsMap = new Map(
      (menuItemsData || []).map(item => [
        item.name, 
        { description: item.description || "", image_url: item.image_url || "" }
      ])
    )

    // Transform items to include quantity and descriptions
    const itemsWithQuantity = (data.items || []).map((item: any) => {
      // Handle string format (old data)
      if (typeof item === 'string') {
        // Try to parse if it looks like JSON
        if (item.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(item)
            if (parsed.name) {
              const dbItem = menuItemsMap.get(parsed.name)
              return {
                name: String(parsed.name),
                description: String(parsed.description || dbItem?.description || ""),
                is_signature: Boolean(parsed.is_signature),
                quantity: Number(parsed.quantity) || 1
              }
            }
          } catch (e) {
            console.warn("Failed to parse item JSON string:", item, e)
          }
        }
        // Regular string - just item name
        const dbItem = menuItemsMap.get(item)
        return {
          name: item,
          description: dbItem?.description || "",
          is_signature: false,
          quantity: 1
        }
      }
      
      // Handle object format (new data) - but validate it's a proper object
      if (item && typeof item === 'object' && item.name) {
        const dbItem = menuItemsMap.get(item.name)
        return {
          name: String(item.name),
          description: String(item.description || dbItem?.description || ""),
          is_signature: Boolean(item.is_signature),
          quantity: Number(item.quantity) || 1
        }
      }
      
      // Invalid format - return empty object
      console.warn("Invalid item format:", item)
      return {
        name: "",
        description: "",
        is_signature: false,
        quantity: 1
      }
    }).filter((item: MenuItem) => item.name !== "") // Remove invalid items

    setMenuPackage({
      name: data.name || "",
      category_id: data.category_id || "", // Changed from category to category_id
      description: data.description || "",
      bundle_price: Number(data.bundle_price) || 500,
      serves_persons: data.serves_persons || 50,
      items: itemsWithQuantity,
      photo: data.photo || "",
      is_active: data.is_active ?? true,
      is_best_selling: data.is_best_selling ?? false,
    })
    setLoading(false)
  }

  const handleSave = async () => {
    if (!menuPackage.name || !menuPackage.category_id) {
      setError("Please fill in all required fields")
      return
    }

    if (menuPackage.items.length === 0) {
      setError("Please add at least one menu item")
      return
    }

    setSaving(true)
    setError(null)
    
    // Transform items to include full data (name, quantity, description, is_signature)
    const itemsWithFullData = menuPackage.items.map(item => ({
      name: item.name,
      description: item.description || "",
      quantity: item.quantity,
      is_signature: item.is_signature || false
    }))
    
    const result = packageId
      ? await updateMenuPackage(packageId, {
          name: menuPackage.name,
          category_id: menuPackage.category_id,
          description: menuPackage.description,
          bundle_price: menuPackage.bundle_price,
          serves_persons: menuPackage.serves_persons,
          items: itemsWithFullData,
          photo: menuPackage.photo || undefined,
          is_active: menuPackage.is_active,
          is_best_selling: menuPackage.is_best_selling,
        })
      : await createMenuPackage({
          name: menuPackage.name,
          category_id: menuPackage.category_id,
          description: menuPackage.description,
          bundle_price: menuPackage.bundle_price,
          serves_persons: menuPackage.serves_persons,
          items: itemsWithFullData,
          photo: menuPackage.photo || undefined,
          is_active: menuPackage.is_active,
          is_best_selling: menuPackage.is_best_selling,
        })
    
    if (result?.error) {
      setError(result.error)
      setSaving(false)
    } else if (result?.success) {
      setSaving(false)
      onSuccess()
      onOpenChange(false)
    } else {
      // Unexpected result format
      console.error("Unexpected save result:", result)
      setError("Failed to save changes")
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!packageId) return

    setDeleting(true)
    setError(null)

    const result = await deleteMenuPackage(packageId)

    if (result?.error) {
      setError(result.error)
      setDeleting(false)
      setShowDeleteDialog(false)
    } else {
      setDeleting(false)
      setShowDeleteDialog(false)
      onSuccess()
      onOpenChange(false)
    }
  }

  const removeItem = (index: number) => {
    setMenuPackage({
      ...menuPackage,
      items: menuPackage.items.filter((_, i) => i !== index)
    })
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file")
      return
    }

    // Validate file size (max 10MB before compression)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      setError("Image size must be less than 10MB")
      return
    }

    setUploadingPhoto(true)
    setError(null)

    try {
      const originalSize = file.size
      
      // Compress image using product preset
      const compressedBase64 = await compressImageToBase64(file, COMPRESSION_PRESETS.product)
      
      // Calculate compressed size (rough estimate from base64 length)
      const compressedSize = Math.round((compressedBase64.length * 3) / 4)
      
      // Show compression info in console
      console.log(`Image compressed: ${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)} (${Math.round((compressedSize / originalSize) * 100)}% of original)`)
      
      setMenuPackage({...menuPackage, photo: compressedBase64})
      setUploadingPhoto(false)
      
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Compression error:', error)
      setError("Failed to compress and upload photo")
      setUploadingPhoto(false)
      
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-gradient-to-br from-black/70 via-black/50 to-black/70 backdrop-blur-md" />
      <DialogContent className="max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-900">
        <DialogHeader>
          <DialogTitle>{packageId ? 'Edit Menu Package' : 'Create Menu Package'}</DialogTitle>
          <DialogDescription>{packageId ? 'Update menu package information' : 'Create a new menu package'}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
            <div className="space-y-6">
              {error && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">Basic Information</h3>
                
                <div className="grid sm:grid-cols-[1fr,300px] gap-6">
                  {/* Left Column - Form Fields */}
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Package Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={menuPackage.name}
                          onChange={(e) => setMenuPackage({...menuPackage, name: e.target.value})}
                          placeholder="e.g., Classic Filipino Buffet"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={menuPackage.category_id}
                          onValueChange={(value) => value && setMenuPackage({...menuPackage, category_id: value})}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category">
                              {menuPackage.category_id && packageCategories.length > 0
                                ? packageCategories.find(c => c.id === menuPackage.category_id)?.name || "Select a category"
                                : "Select a category"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="w-auto min-w-[200px]">
                            {packageCategories.length === 0 ? (
                              <div className="p-2 text-sm text-muted-foreground text-center">
                                No categories available
                              </div>
                            ) : (
                              packageCategories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id} className="whitespace-nowrap">
                                  {cat.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        value={menuPackage.description}
                        onChange={(e) => setMenuPackage({...menuPackage, description: e.target.value})}
                        placeholder="Describe this menu package..."
                        rows={3}
                      />
                    </div>

                    {/* Pricing & Requirements moved here */}
                    <div className="rounded-lg border p-4 space-y-4">
                      <h4 className="font-medium">Pricing & Requirements</h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Package Price (₱) *</label>
                          <Input
                            type="number"
                            value={menuPackage.bundle_price}
                            onChange={(e) => setMenuPackage({...menuPackage, bundle_price: Number(e.target.value)})}
                            min="0"
                            step="50"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Current: ₱{menuPackage.bundle_price.toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Good for (persons) *</label>
                          <Input
                            type="number"
                            value={menuPackage.serves_persons}
                            onChange={(e) => setMenuPackage({...menuPackage, serves_persons: Number(e.target.value)})}
                            min="1"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Number of persons this package can serve
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Package Photo Upload Area */}
                  <div className="border-2 border-dashed rounded-lg p-4 flex flex-col">
                    <label className="block text-sm font-medium mb-2">Package Photo</label>
                    
                    {menuPackage.photo ? (
                      <div className="relative group rounded-lg overflow-hidden border flex-1 min-h-[250px]">
                        <img
                          src={menuPackage.photo}
                          alt="Package preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => setMenuPackage({...menuPackage, photo: ""})}
                          className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          type="button"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center flex-1 min-h-[250px] bg-muted/30 rounded-lg">
                        <Upload className="size-12 text-muted-foreground/50 mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">No photo uploaded</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          disabled={uploadingPhoto}
                        />
                        <Button 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingPhoto}
                          type="button"
                          variant="default"
                          size="sm"
                        >
                          {uploadingPhoto ? (
                            <>
                              <Loader2 className="size-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="size-4 mr-2" />
                              Upload Photo
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Items - Rebuilt Clean */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Menu Items *</h3>
                  <Button 
                    onClick={() => {
                      setMenuPackage({
                        ...menuPackage,
                        items: [...menuPackage.items, { name: "", description: "", is_signature: false, quantity: 1 }]
                      })
                    }} 
                    type="button" 
                    size="sm" 
                    variant="outline"
                  >
                    <Plus className="size-4 mr-2" />
                    Add Item Slot
                  </Button>
                </div>

                {menuPackage.items.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-sm text-muted-foreground mb-3">No menu items added yet</p>
                    <Button 
                      onClick={() => {
                        setMenuPackage({
                          ...menuPackage,
                          items: [{ name: "", description: "", is_signature: false, quantity: 1 }]
                        })
                      }} 
                      type="button" 
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="size-4 mr-2" />
                      Add First Item
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {menuPackage.items.map((item, index) => (
                      <div key={index} className="border-2 rounded-lg p-4 hover:border-primary/50 transition-colors">
                        {item.name ? (
                          <div className="flex items-center gap-4">
                            {/* Number Badge */}
                            <div className="flex-shrink-0 size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>

                            {/* Item Image */}
                            <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-md overflow-hidden">
                              <img
                                src={availableMenuItems.find(mi => mi.name === item.name)?.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&size=64&background=random`}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&size=64&background=random`
                                }}
                              />
                            </div>

                            {/* Item Info */}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{item.name}</p>
                              {item.description && (
                                <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                              )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 border rounded-lg px-3 py-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = [...menuPackage.items]
                                  if (newItems[index].quantity > 1) {
                                    newItems[index].quantity = newItems[index].quantity - 1
                                    setMenuPackage({ ...menuPackage, items: newItems })
                                  }
                                }}
                                className="text-lg font-bold hover:text-primary px-2"
                              >
                                -
                              </button>
                              <span className="text-sm font-medium min-w-[3ch] text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = [...menuPackage.items]
                                  newItems[index].quantity = newItems[index].quantity + 1
                                  setMenuPackage({ ...menuPackage, items: newItems })
                                }}
                                className="text-lg font-bold hover:text-primary px-2"
                              >
                                +
                              </button>
                            </div>

                            {/* Delete Button */}
                            <button
                              onClick={() => removeItem(index)}
                              className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                              type="button"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            {/* Number Badge */}
                            <div className="flex-shrink-0 size-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>

                            {/* Dropdown */}
                            <div className="flex-1">
                              <Select
                                value=""
                                onValueChange={(value) => {
                                  const selectedItem = availableMenuItems.find(mi => mi.id === value)
                                  if (selectedItem) {
                                    if (menuPackage.items.some(i => i.name === selectedItem.name)) {
                                      setError("This item is already added")
                                      return
                                    }
                                    const newItems = [...menuPackage.items]
                                    newItems[index] = {
                                      name: selectedItem.name,
                                      description: selectedItem.description,
                                      is_signature: false,
                                      quantity: 1
                                    }
                                    setMenuPackage({ ...menuPackage, items: newItems })
                                    setError(null)
                                  }
                                }}
                              >
                                <SelectTrigger className="border-dashed">
                                  <SelectValue placeholder="Click to select menu item" />
                                </SelectTrigger>
                                <SelectContent className="max-w-[400px]">
                                  {availableMenuItems.map((menuItem) => (
                                    <SelectItem key={menuItem.id} value={menuItem.id} className="whitespace-normal">
                                      <div>
                                        <div className="font-medium">{menuItem.name}</div>
                                        {menuItem.description && (
                                          <div className="text-xs text-muted-foreground">{menuItem.description}</div>
                                        )}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Delete Button */}
                            <button
                              onClick={() => removeItem(index)}
                              className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                              type="button"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold">Settings</h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Active Status */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">Active Status</p>
                      <p className="text-xs text-muted-foreground">
                        {menuPackage.is_active ? "Visible to customers" : "Hidden from customers"}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={menuPackage.is_active}
                      onClick={() => setMenuPackage({...menuPackage, is_active: !menuPackage.is_active})}
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                        ${menuPackage.is_active ? 'bg-orange-500' : 'bg-gray-300'}
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${menuPackage.is_active ? 'translate-x-6' : 'translate-x-1'}
                        `}
                      />
                    </button>
                  </div>

                  {/* Best Seller */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">Best Seller</p>
                      <p className="text-xs text-muted-foreground">
                        {menuPackage.is_best_selling ? "Marked as best seller" : "Not marked"}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={menuPackage.is_best_selling}
                      onClick={() => setMenuPackage({...menuPackage, is_best_selling: !menuPackage.is_best_selling})}
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
                        ${menuPackage.is_best_selling ? 'bg-amber-500' : 'bg-gray-300'}
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${menuPackage.is_best_selling ? 'translate-x-6' : 'translate-x-1'}
                        `}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        )}

        {/* Actions */}
        <div className="flex justify-between gap-4 pt-4 border-t">
          {packageId && (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={saving || deleting || loading}
              size="sm"
            >
              <Trash2 className="size-4 mr-2" />
              Delete
            </Button>
          )}

          <div className={`flex gap-3 ${packageId ? '' : 'ml-auto'}`}>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving || deleting || loading}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || deleting || loading}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              size="sm"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  {packageId ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  {packageId ? 'Save Changes' : 'Create Package'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader className="space-y-3">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <Trash2 className="size-6 text-red-600 dark:text-red-500" />
            </div>
            <DialogTitle className="text-center text-xl">Delete Menu Package?</DialogTitle>
            <DialogDescription className="text-center">
              This action cannot be undone. This menu package will be permanently removed.
            </DialogDescription>
            {menuPackage.name && (
              <div className="rounded-lg border bg-muted/50 p-3">
                <p className="text-center text-sm font-medium">{menuPackage.name}</p>
              </div>
            )}
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
              className="w-full sm:w-auto sm:flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="w-full sm:w-auto sm:flex-1"
            >
              {deleting ? "Deleting..." : "Delete Package"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
