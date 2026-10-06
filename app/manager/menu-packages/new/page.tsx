"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Save, 
  ArrowLeft,
  Plus,
  X,
  Upload,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Leaf,
  Eye,
  EyeOff,
} from "lucide-react"
import { createMenuPackage } from "@/app/actions/manager-menu-packages"
import { Checkbox } from "@/components/ui/checkbox"

interface MenuItem {
  name: string
  description: string
  is_signature: boolean
}

export default function NewMenuPackagePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
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

  const handleSave = async () => {
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
    
    const result = await createMenuPackage(menuPackage)
    
    if (result?.error) {
      setError(result.error)
      setSaving(false)
    } else {
      router.push("/manager/menu-packages")
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
      // For now, create a local preview URL
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
    <div className="space-y-6 bg-white dark:bg-zinc-950">
      {/* Back Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.back()}
      >
        <ArrowLeft className="size-4 mr-2" />
        Back
      </Button>

      {/* Content - Centered */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Add Menu Package</h1>
          <p className="text-muted-foreground">Create a new catering menu package</p>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="rounded-xl border bg-card p-6 space-y-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
          <h2 className="text-xl font-bold">Basic Information</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Package Name * <span className="text-red-500">Required</span>
              </label>
              <Input
                value={menuPackage.name}
                onChange={(e) => setMenuPackage({...menuPackage, name: e.target.value})}
                placeholder="e.g., Classic Filipino Buffet"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Category * <span className="text-red-500">Required</span>
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
        <div className="rounded-xl border bg-card p-6 space-y-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
          <h2 className="text-xl font-bold">Pricing & Requirements</h2>

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
        <div className="rounded-xl border bg-card p-6 space-y-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
          <h2 className="text-xl font-bold">Menu Items *</h2>

          {/* Add Item Form */}
          <div className="space-y-3 p-4 rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground">Add menu items to this package:</p>
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
                <label className="text-sm">Mark as signature dish</label>
              </div>
              <Button onClick={addItem} type="button">
                <Plus className="size-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          {/* Items List */}
          {menuPackage.items.length > 0 ? (
            <div className="space-y-2">
              {menuPackage.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg border bg-card"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{item.name}</span>
                      {item.is_signature && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600">
                          Signature
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(index)}
                    className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                    type="button"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              <p>No menu items added yet. Add your first item above.</p>
            </div>
          )}
        </div>

        {/* Dietary Information */}
        <div className="rounded-xl border bg-card p-6 space-y-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Leaf className="size-5 text-green-600" />
            Dietary Information
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {Object.entries(menuPackage.dietary_info).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3 p-3 rounded-lg border">
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
        <div className="rounded-xl border bg-card p-6 space-y-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
          <h2 className="text-xl font-bold">Package Photo</h2>

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
            <p className="text-xs text-muted-foreground mt-2">
              Supported: JPG, PNG, WebP (Max 5MB)
            </p>
          </div>

          {menuPackage.photo && (
            <div className="relative group rounded-lg overflow-hidden border max-w-sm">
              <img
                src={menuPackage.photo}
                alt="Package preview"
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => setMenuPackage({...menuPackage, photo: ""})}
                className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                type="button"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="rounded-xl border bg-card p-6 space-y-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
          <h2 className="text-xl font-bold">Settings</h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Active Status</p>
              <p className="text-sm text-muted-foreground">
                {menuPackage.is_active ? "Visible to customers" : "Hidden from customers"}
              </p>
            </div>
            <Button
              variant={menuPackage.is_active ? "default" : "outline"}
              onClick={() => setMenuPackage({...menuPackage, is_active: !menuPackage.is_active})}
              type="button"
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

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !menuPackage.name || !menuPackage.category || menuPackage.items.length === 0}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
          >
            {saving ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="size-4 mr-2" />
                Create Menu Package
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
