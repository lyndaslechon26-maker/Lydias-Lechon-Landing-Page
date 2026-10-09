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
  Leaf,
  Eye,
  EyeOff,
} from "lucide-react"
import { updateMenuPackage, getMenuPackageById, deleteMenuPackage } from "@/app/actions/manager-menu-packages"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MenuItem {
  name: string
  description: string
  is_signature: boolean
}

interface EditMenuPackageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  packageId: string | null
  onSuccess: () => void
}

export function EditMenuPackageDialog({ open, onOpenChange, packageId, onSuccess }: EditMenuPackageDialogProps) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [menuPackage, setMenuPackage] = useState({
    name: "",
    category: "buffet",
    description: "",
    price_per_person: 500,
    min_order: 50,
    items: [] as MenuItem[],
    dietary_info: {
      vegetarian: false,
      vegan: false,
      halal: false,
      gluten_free: false,
    },
    photo: "",
    is_active: true,
  })

  const [newItem, setNewItem] = useState<MenuItem>({
    name: "",
    description: "",
    is_signature: false,
  })

  useEffect(() => {
    if (open && packageId) {
      loadMenuPackage()
    }
  }, [open, packageId])

  const loadMenuPackage = async () => {
    if (!packageId) return
    
    setLoading(true)
    const { menuPackage: data, error } = await getMenuPackageById(packageId)
    
    if (error || !data) {
      setError(error || "Menu package not found")
      setLoading(false)
      return
    }

    setMenuPackage({
      name: data.name || "",
      category: data.category || "buffet",
      description: data.description || "",
      price_per_person: Number(data.price_per_person) || 500,
      min_order: data.min_order || 50,
      items: data.items || [],
      dietary_info: data.dietary_info || {
        vegetarian: false,
        vegan: false,
        halal: false,
        gluten_free: false,
      },
      photo: data.photo || "",
      is_active: data.is_active ?? true,
    })
    setLoading(false)
  }

  const handleSave = async () => {
    if (!packageId) return
    
    if (!menuPackage.name || !menuPackage.category) {
      setError("Please fill in all required fields")
      return
    }

    if (menuPackage.items.length === 0) {
      setError("Please add at least one menu item")
      return
    }

    setSaving(true)
    setError(null)
    
    const result = await updateMenuPackage(packageId, menuPackage)
    
    if (result?.error) {
      setError(result.error)
      setSaving(false)
    } else {
      setSaving(false)
      onSuccess()
      onOpenChange(false)
    }
  }

  const handleDelete = async () => {
    if (!packageId) return
    
    if (!confirm("Are you sure you want to delete this menu package? This action cannot be undone.")) {
      return
    }

    setDeleting(true)
    setError(null)

    const result = await deleteMenuPackage(packageId)

    if (result?.error) {
      setError(result.error)
      setDeleting(false)
    } else {
      setDeleting(false)
      onSuccess()
      onOpenChange(false)
    }
  }

  const addItem = () => {
    if (newItem.name.trim()) {
      setMenuPackage({
        ...menuPackage,
        items: [...menuPackage.items, newItem]
      })
      setNewItem({ name: "", description: "", is_signature: false })
    } else {
      setError("Please enter a menu item name")
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

    setUploadingPhoto(true)
    const file = files[0]

    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        setMenuPackage({...menuPackage, photo: reader.result as string})
        setUploadingPhoto(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setError("Failed to upload photo")
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
          <DialogTitle>Edit Menu Package</DialogTitle>
          <DialogDescription>Update menu package information</DialogDescription>
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
                      value={menuPackage.category}
                      onValueChange={(value) => value && setMenuPackage({...menuPackage, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buffet">Buffet</SelectItem>
                        <SelectItem value="plated">Plated Meal</SelectItem>
                        <SelectItem value="drinks">Drinks Package</SelectItem>
                        <SelectItem value="dessert">Dessert Package</SelectItem>
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
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="font-semibold">Pricing & Requirements</h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Package Price (₱) *</label>
                    <Input
                      type="number"
                      value={menuPackage.price_per_person}
                      onChange={(e) => setMenuPackage({...menuPackage, price_per_person: Number(e.target.value)})}
                      min="0"
                      step="50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Current: ₱{menuPackage.price_per_person.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Minimum Order (pax) *</label>
                    <Input
                      type="number"
                      value={menuPackage.min_order}
                      onChange={(e) => setMenuPackage({...menuPackage, min_order: Number(e.target.value)})}
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-4">
                <h3 className="font-semibold">Menu Items *</h3>
                
                {/* Add Item Form */}
                <div className="space-y-3 p-4 rounded-lg bg-muted/30">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      placeholder="Item name (e.g., Grilled Chicken)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
                    />
                    <Input
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      placeholder="Description (optional)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={newItem.is_signature}
                        onCheckedChange={(checked) => setNewItem({...newItem, is_signature: checked as boolean})}
                      />
                      <label className="text-sm">Signature dish</label>
                    </div>
                    <Button onClick={addItem} type="button" size="sm">
                      <Plus className="size-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Items List */}
                {menuPackage.items.length > 0 ? (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {menuPackage.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{item.name}</span>
                            {item.is_signature && (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600">
                                Signature
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(index)}
                          className="p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
                          type="button"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                    No menu items added yet
                  </div>
                )}
              </div>

              {/* Dietary Information */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Leaf className="size-4 text-green-600" />
                  Dietary Information
                </h3>
                
                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.entries(menuPackage.dietary_info).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 p-2 rounded-lg border">
                      <Checkbox
                        checked={value}
                        onCheckedChange={(checked) => 
                          setMenuPackage({
                            ...menuPackage,
                            dietary_info: {...menuPackage.dietary_info, [key]: checked as boolean}
                          })
                        }
                      />
                      <label className="text-sm capitalize cursor-pointer">
                        {key.replace('_', ' ')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo */}
              <div className="space-y-4">
                <h3 className="font-semibold">Package Photo</h3>
                
                <div>
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
                    variant="outline"
                    size="sm"
                    className="w-full"
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

                {menuPackage.photo && (
                  <div className="relative group rounded-lg overflow-hidden border max-w-xs">
                    <img
                      src={menuPackage.photo}
                      alt="Package preview"
                      className="w-full h-32 object-cover"
                    />
                    <button
                      onClick={() => setMenuPackage({...menuPackage, photo: ""})}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      type="button"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold">Settings</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Active Status</p>
                    <p className="text-xs text-muted-foreground">
                      {menuPackage.is_active ? "Visible to customers" : "Hidden from customers"}
                    </p>
                  </div>
                  <Button
                    variant={menuPackage.is_active ? "default" : "outline"}
                    onClick={() => setMenuPackage({...menuPackage, is_active: !menuPackage.is_active})}
                    type="button"
                    size="sm"
                  >
                    {menuPackage.is_active ? (
                      <>
                        <Eye className="size-4 mr-2" />
                        Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="size-4 mr-2" />
                        Inactive
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        )}

        {/* Actions */}
        <div className="flex justify-between gap-4 pt-4 border-t">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={saving || deleting || loading}
            size="sm"
          >
            {deleting ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4 mr-2" />
                Delete
              </>
            )}
          </Button>

          <div className="flex gap-3">
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
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
