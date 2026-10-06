"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Save, 
  ArrowLeft,
  Plus,
  X,
  Trash2,
  Upload,
  Image as ImageIcon,
  Loader2
} from "lucide-react"
import { updateVenue, getVenueById, deleteVenue } from "@/app/actions/manager-venues"

export default function EditVenuePage() {
  const router = useRouter()
  const params = useParams()
  const venueId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [venue, setVenue] = useState({
    name: "",
    location: "",
    description: "",
    capacity_min: 50,
    capacity_max: 200,
    base_rate: 50000,
    photos: [] as string[],
    amenities: [] as string[],
    is_active: true,
  })

  const [newAmenity, setNewAmenity] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadVenue()
  }, [venueId])

  const loadVenue = async () => {
    setLoading(true)
    const { venue: data, error } = await getVenueById(venueId)
    
    if (error || !data) {
      setError(error || "Venue not found")
      setLoading(false)
      return
    }

    setVenue({
      name: data.name,
      location: data.location,
      description: data.description || "",
      capacity_min: data.capacity_min,
      capacity_max: data.capacity_max,
      base_rate: data.base_rate,
      photos: data.photos || [],
      amenities: data.amenities || [],
      is_active: data.is_active,
    })
    setLoading(false)
  }

  const handleSave = async () => {
    if (!venue.name || !venue.location) {
      setError("Please fill in all required fields")
      return
    }

    setSaving(true)
    setError(null)
    
    const result = await updateVenue(venueId, venue)
    
    if (result?.error) {
      setError(result.error)
      setSaving(false)
    } else {
      router.push("/manager/venues")
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this venue? This action cannot be undone.")) {
      return
    }

    setDeleting(true)
    setError(null)

    const result = await deleteVenue(venueId)

    if (result?.error) {
      setError(result.error)
      setDeleting(false)
    } else {
      router.push("/manager/venues")
    }
  }

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setVenue({...venue, amenities: [...venue.amenities, newAmenity.trim()]})
      setNewAmenity("")
    }
  }

  const removeAmenity = (index: number) => {
    setVenue({
      ...venue,
      amenities: venue.amenities.filter((_, i) => i !== index)
    })
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (venue.photos.length >= 5) {
      setError("Maximum 5 photos allowed per venue")
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    setUploadingPhoto(true)
    const file = files[0]

    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        setVenue({...venue, photos: [...venue.photos, reader.result as string]})
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

  const removePhoto = async (index: number) => {
    setVenue({
      ...venue,
      photos: venue.photos.filter((_, i) => i !== index)
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
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
          <h1 className="text-3xl font-bold">Edit Venue</h1>
          <p className="text-muted-foreground">Update venue information</p>
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
            Venue Name * <span className="text-red-500">Required</span>
          </label>
          <Input
            value={venue.name}
            onChange={(e) => setVenue({...venue, name: e.target.value})}
            placeholder="e.g., Grand Ballroom"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Location * <span className="text-red-500">Required</span>
          </label>
          <Input
            value={venue.location}
            onChange={(e) => setVenue({...venue, location: e.target.value})}
            placeholder="e.g., 2nd Floor, Main Building"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            value={venue.description}
            onChange={(e) => setVenue({...venue, description: e.target.value})}
            placeholder="Describe the venue, its features, and what makes it special..."
            rows={4}
          />
        </div>

        <div className="flex items-center gap-2 pt-3 border-t">
          <Switch
            id="is_active"
            checked={venue.is_active}
            onCheckedChange={(checked) => setVenue({...venue, is_active: checked})}
          />
          <Label htmlFor="is_active" className="cursor-pointer">
            Venue is active and available for booking
          </Label>
        </div>
      </div>

      {/* Capacity & Pricing */}
      <div className="rounded-xl border bg-card p-6 space-y-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
        <h2 className="text-xl font-bold">Capacity & Pricing</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Minimum Capacity *</label>
            <Input
              type="number"
              value={venue.capacity_min}
              onChange={(e) => setVenue({...venue, capacity_min: Number(e.target.value)})}
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Maximum Capacity *</label>
            <Input
              type="number"
              value={venue.capacity_max}
              onChange={(e) => setVenue({...venue, capacity_max: Number(e.target.value)})}
              min="1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Base Rate (₱) *</label>
          <Input
            type="number"
            value={venue.base_rate}
            onChange={(e) => setVenue({...venue, base_rate: Number(e.target.value)})}
            min="0"
            step="1000"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Current: ₱{venue.base_rate.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Photos */}
      <div className="rounded-xl border bg-card p-6 space-y-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Photos</h2>
          <span className="text-sm text-muted-foreground">
            {venue.photos.length} / 5 photos
          </span>
        </div>
        <p className="text-sm text-muted-foreground">Upload photos to showcase your venue</p>

        <div className="space-y-4">
          {/* Upload Button */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploadingPhoto || venue.photos.length >= 5}
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto || venue.photos.length >= 5}
              type="button"
              variant="outline"
              className="w-full"
            >
              {uploadingPhoto ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : venue.photos.length >= 5 ? (
                <>
                  <ImageIcon className="size-4 mr-2" />
                  Maximum 5 Photos Reached
                </>
              ) : (
                <>
                  <Upload className="size-4 mr-2" />
                  Upload Photo ({venue.photos.length}/5)
                </>
              )}
            </Button>
          </div>

          {/* Photo Grid */}
          {venue.photos.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {venue.photos.map((photo, index) => (
                <div key={index} className="relative group rounded-lg overflow-hidden border">
                  <img
                    src={photo}
                    alt={`Venue photo ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => removePhoto(index)}
                      className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                      type="button"
                    >
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-black/70 text-white text-xs">
                    Photo {index + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <ImageIcon className="size-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground mb-3">No photos uploaded yet</p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                type="button"
                variant="outline"
                size="sm"
              >
                <Upload className="size-4 mr-2" />
                Upload First Photo
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Amenities */}
      <div className="rounded-xl border bg-card p-6 space-y-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
        <h2 className="text-xl font-bold">Amenities</h2>
        <p className="text-sm text-muted-foreground">List all amenities and features</p>

        <div className="flex gap-2">
          <Input
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            placeholder="e.g., Air Conditioning, Stage, Audio System"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addAmenity()
              }
            }}
          />
          <Button onClick={addAmenity} type="button">
            <Plus className="size-4 mr-2" />
            Add
          </Button>
        </div>

        {venue.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {venue.amenities.map((amenity, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted"
              >
                <span className="text-sm">{amenity}</span>
                <button
                  onClick={() => removeAmenity(index)}
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

      {/* Actions */}
      <div className="flex justify-between gap-4 pt-6 border-t">
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={saving || deleting}
        >
          {deleting ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="size-4 mr-2" />
              Delete Venue
            </>
          )}
        </Button>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={saving || deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || deleting || !venue.name || !venue.location}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
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
    </div>
    </div>
  )
}
