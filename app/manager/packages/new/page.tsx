"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Save, 
  ArrowLeft,
  Plus,
  X,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Loader2
} from "lucide-react"
import { createPackage } from "@/app/actions/manager-packages"
import type { EventType } from "@/lib/types/events"

export default function NewPackagePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [pkg, setPkg] = useState({
    name: "",
    slug: "",
    event_type: "wedding" as EventType,
    description: "",
    short_description: "",
    price_per_person: 0,
    base_price: 0,
    min_guests: 50,
    max_guests: 200,
    duration_hours: 4,
    inclusions: [] as Array<{ item: string; description?: string; quantity?: string; duration?: string }>,
    available_addons: [] as string[],
    featured_image: "",
    gallery: [] as string[],
    is_active: true,
    is_featured: false,
  })

  const [newInclusion, setNewInclusion] = useState("")
  const [newInclusionDesc, setNewInclusionDesc] = useState("")
  const [newAddon, setNewAddon] = useState("")
  const [newGalleryImage, setNewGalleryImage] = useState("")

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setPkg({...pkg, name, slug})
  }

  const addInclusion = () => {
    if (newInclusion.trim()) {
      setPkg({
        ...pkg,
        inclusions: [
          ...pkg.inclusions,
          {
            item: newInclusion.trim(),
            description: newInclusionDesc.trim() || undefined
          }
        ]
      })
      setNewInclusion("")
      setNewInclusionDesc("")
    }
  }

  const removeInclusion = (index: number) => {
    setPkg({
      ...pkg,
      inclusions: pkg.inclusions.filter((_, i) => i !== index)
    })
  }

  const addAddon = () => {
    if (newAddon.trim()) {
      setPkg({...pkg, available_addons: [...pkg.available_addons, newAddon.trim()]})
      setNewAddon("")
    }
  }

  const removeAddon = (index: number) => {
    setPkg({
      ...pkg,
      available_addons: pkg.available_addons.filter((_, i) => i !== index)
    })
  }

  const addGalleryImage = () => {
    if (newGalleryImage.trim()) {
      setPkg({...pkg, gallery: [...pkg.gallery, newGalleryImage.trim()]})
      setNewGalleryImage("")
    }
  }

  const removeGalleryImage = (index: number) => {
    setPkg({
      ...pkg,
      gallery: pkg.gallery.filter((_, i) => i !== index)
    })
  }

  const handleSave = async () => {
    if (!pkg.name || !pkg.slug || !pkg.event_type) {
      setError("Please fill in all required fields")
      return
    }

    setSaving(true)
    setError(null)
    
    const result = await createPackage(pkg)
    
    if (result?.error) {
      setError(result.error)
      setSaving(false)
    } else {
      router.push("/manager/packages")
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
          <h1 className="text-3xl font-bold">Create New Package</h1>
          <p className="text-muted-foreground">Add a new event package for customers</p>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="rounded-xl border bg-card p-6 space-y-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
          <h2 className="text-xl font-bold">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium mb-2">
              Package Name * <span className="text-red-500">Required</span>
            </label>
            <Input
              value={pkg.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Premium Wedding Package"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              URL Slug * <span className="text-red-500">Required</span>
            </label>
            <Input
              value={pkg.slug}
              onChange={(e) => setPkg({...pkg, slug: e.target.value})}
              placeholder="premium-wedding-package"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Preview: /events/packages/{pkg.slug || 'your-slug'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Event Type * <span className="text-red-500">Required</span>
            </label>
            <select
              value={pkg.event_type}
              onChange={(e) => setPkg({...pkg, event_type: e.target.value as EventType})}
              className="w-full px-3 py-2 rounded-lg border bg-background"
            >
              <option value="wedding">Wedding</option>
              <option value="birthday">Birthday</option>
              <option value="corporate">Corporate</option>
              <option value="christening">Christening</option>
              <option value="graduation">Graduation</option>
              <option value="anniversary">Anniversary</option>
              <option value="reunion">Reunion</option>
              <option value="seminar">Seminar</option>
              <option value="product_launch">Product Launch</option>
              <option value="team_building">Team Building</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Short Description</label>
            <Input
              value={pkg.short_description}
              onChange={(e) => setPkg({...pkg, short_description: e.target.value})}
              placeholder="Brief description for cards (max 100 characters)"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Full Description</label>
            <Textarea
              value={pkg.description}
              onChange={(e) => setPkg({...pkg, description: e.target.value})}
              placeholder="Detailed description of the package..."
              rows={5}
            />
          </div>
        </div>

        {/* Pricing & Capacity */}
        <div className="rounded-xl border bg-card p-6 space-y-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
          <h2 className="text-xl font-bold">Pricing & Capacity</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price Per Person (₱)</label>
              <Input
                type="number"
                value={pkg.price_per_person}
                onChange={(e) => setPkg({...pkg, price_per_person: Number(e.target.value)})}
                min="0"
                step="100"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave 0 if using base price instead
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Base Price (₱)</label>
              <Input
                type="number"
                value={pkg.base_price}
                onChange={(e) => setPkg({...pkg, base_price: Number(e.target.value)})}
                min="0"
                step="1000"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Fixed price regardless of guests
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Min Guests *</label>
              <Input
                type="number"
                value={pkg.min_guests}
                onChange={(e) => setPkg({...pkg, min_guests: Number(e.target.value)})}
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max Guests *</label>
              <Input
                type="number"
                value={pkg.max_guests}
                onChange={(e) => setPkg({...pkg, max_guests: Number(e.target.value)})}
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Duration (hours) *</label>
              <Input
                type="number"
                value={pkg.duration_hours}
                onChange={(e) => setPkg({...pkg, duration_hours: Number(e.target.value)})}
                min="1"
                max="24"
              />
            </div>
          </div>
        </div>

        {/* Inclusions */}
        <div className="rounded-xl border bg-card p-6 space-y-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
          <h2 className="text-xl font-bold">Package Inclusions</h2>

          <div className="space-y-2">
            <Input
              value={newInclusion}
              onChange={(e) => setNewInclusion(e.target.value)}
              placeholder="e.g., Venue rental for 4 hours"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclusion())}
            />
            <Input
              value={newInclusionDesc}
              onChange={(e) => setNewInclusionDesc(e.target.value)}
              placeholder="Optional description or details"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclusion())}
            />
            <Button onClick={addInclusion} type="button" className="w-full">
              <Plus className="size-4 mr-2" />
              Add Inclusion
            </Button>
          </div>

          {pkg.inclusions.length > 0 && (
            <div className="space-y-2">
              {pkg.inclusions.map((inc, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted"
                >
                  <div className="flex-1">
                    <p className="font-medium">{inc.item}</p>
                    {inc.description && (
                      <p className="text-sm text-muted-foreground">{inc.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeInclusion(index)}
                    className="text-red-500 hover:text-red-600"
                    type="button"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Add-ons */}
        <div className="rounded-xl border bg-card p-6 space-y-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
          <h2 className="text-xl font-bold">Available Add-ons</h2>

          <div className="flex gap-2">
            <Input
              value={newAddon}
              onChange={(e) => setNewAddon(e.target.value)}
              placeholder="e.g., Photo booth"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAddon())}
            />
            <Button onClick={addAddon} type="button">
              <Plus className="size-4 mr-2" />
              Add
            </Button>
          </div>

          {pkg.available_addons.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {pkg.available_addons.map((addon, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted"
                >
                  <span className="text-sm">{addon}</span>
                  <button
                    onClick={() => removeAddon(index)}
                    className="hover:text-red-500"
                    type="button"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Images */}
        <div className="rounded-xl border bg-card p-6 space-y-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
          <h2 className="text-xl font-bold">Images</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Featured Image URL</label>
            <Input
              value={pkg.featured_image}
              onChange={(e) => setPkg({...pkg, featured_image: e.target.value})}
              placeholder="Enter image URL"
            />
            {pkg.featured_image && (
              <div className="mt-2 rounded-lg overflow-hidden border max-w-md">
                <img
                  src={pkg.featured_image}
                  alt="Featured"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Gallery Images</label>
            <div className="flex gap-2">
              <Input
                value={newGalleryImage}
                onChange={(e) => setNewGalleryImage(e.target.value)}
                placeholder="Enter image URL"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryImage())}
              />
              <Button onClick={addGalleryImage} type="button">
                <Plus className="size-4 mr-2" />
                Add
              </Button>
            </div>

            {pkg.gallery.length > 0 && (
              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                {pkg.gallery.map((image, index) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden border">
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      type="button"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="rounded-xl border bg-card p-6 space-y-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
          <h2 className="text-xl font-bold">Settings</h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Active Status</p>
              <p className="text-sm text-muted-foreground">
                {pkg.is_active ? "Visible to customers" : "Hidden from customers"}
              </p>
            </div>
            <Button
              variant={pkg.is_active ? "default" : "outline"}
              onClick={() => setPkg({...pkg, is_active: !pkg.is_active})}
              type="button"
            >
              {pkg.is_active ? (
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

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Featured Package</p>
              <p className="text-sm text-muted-foreground">
                {pkg.is_featured ? "Highlighted on homepage" : "Standard listing"}
              </p>
            </div>
            <Button
              variant={pkg.is_featured ? "default" : "outline"}
              onClick={() => setPkg({...pkg, is_featured: !pkg.is_featured})}
              type="button"
            >
              {pkg.is_featured ? (
                <>
                  <Star className="size-4 mr-2 fill-current" />
                  Featured
                </>
              ) : (
                <>
                  <Star className="size-4 mr-2" />
                  Not Featured
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
            disabled={saving || !pkg.name || !pkg.slug || !pkg.event_type}
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
                Create Package
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
