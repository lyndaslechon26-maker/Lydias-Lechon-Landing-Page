"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
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
  Save, 
  Plus,
  X,
  Trash2,
  Upload,
  Image as ImageIcon,
  Loader2
} from "lucide-react"
import { updateVenue, getVenueById, deleteVenue, createVenue } from "@/app/actions/manager-venues"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import { compressImageToBase64, formatFileSize, COMPRESSION_PRESETS } from "@/lib/image-compression"

interface EditVenueDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  venueId: string | null
  onSuccess: () => void
}

export function EditVenueDialog({ open, onOpenChange, venueId, onSuccess }: EditVenueDialogProps) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
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
    if (open && venueId) {
      loadVenue()
    } else if (open && !venueId) {
      // Create mode - reset form
      setVenue({
        name: "",
        location: "",
        description: "",
        capacity_min: 50,
        capacity_max: 200,
        base_rate: 50000,
        photos: [],
        amenities: [],
        is_active: true,
      })
      setNewAmenity("")
      setError(null)
      setLoading(false)
    }
  }, [open, venueId])

  const loadVenue = async () => {
    if (!venueId) return
    
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
    
    const result = venueId
      ? await updateVenue(venueId, venue)
      : await createVenue(venue)
    
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
    if (!venueId) return

    setDeleting(true)
    setError(null)

    const result = await deleteVenue(venueId)

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

    // Calculate how many more photos can be added
    const remainingSlots = 5 - venue.photos.length
    
    if (remainingSlots === 0) {
      setError("Maximum 5 photos allowed per venue")
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    // Limit files to remaining slots
    const filesToUpload = Array.from(files).slice(0, remainingSlots)
    
    if (files.length > remainingSlots) {
      setError(`Only ${remainingSlots} more photo(s) can be added (maximum 5 total)`)
    }

    setUploadingPhoto(true)
    setError(null)

    try {
      const compressedPhotos: string[] = []
      
      // Process all files
      for (const file of filesToUpload) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          console.warn(`Skipping ${file.name}: not an image file`)
          continue
        }

        // Validate file size (max 10MB before compression)
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
          console.warn(`Skipping ${file.name}: file size exceeds 10MB`)
          continue
        }

        const originalSize = file.size
        
        // Compress image using venue preset (optimized for multiple uploads)
        const compressedBase64 = await compressImageToBase64(file, COMPRESSION_PRESETS.venue)
        
        // Calculate compressed size (rough estimate from base64 length)
        const compressedSize = Math.round((compressedBase64.length * 3) / 4)
        
        // Show compression info in console
        console.log(`Venue photo compressed: ${file.name} - ${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)} (${Math.round((compressedSize / originalSize) * 100)}% of original)`)
        
        compressedPhotos.push(compressedBase64)
      }
      
      if (compressedPhotos.length > 0) {
        setVenue({...venue, photos: [...venue.photos, ...compressedPhotos]})
      }
      
      setUploadingPhoto(false)
      
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Compression error:', error)
      setError("Failed to compress and upload photos")
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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogOverlay className="bg-gradient-to-br from-black/70 via-black/50 to-black/70 backdrop-blur-md" />
        <DialogContent className="max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-900">
          <DialogHeader>
            <DialogTitle>{venueId ? 'Edit Venue' : 'Create Venue'}</DialogTitle>
            <DialogDescription>{venueId ? 'Update venue information' : 'Create a new event venue'}</DialogDescription>
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

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Venue Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={venue.name}
                      onChange={(e) => setVenue({...venue, name: e.target.value})}
                      placeholder="e.g., Grand Ballroom"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Location <span className="text-red-500">*</span>
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
                <div className="space-y-4">
                  <h3 className="font-semibold">Capacity & Pricing</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Minimum Capacity <span className="text-red-500">*</span></label>
                      <Input
                        type="number"
                        value={venue.capacity_min}
                        onChange={(e) => setVenue({...venue, capacity_min: Number(e.target.value)})}
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Maximum Capacity <span className="text-red-500">*</span></label>
                      <Input
                        type="number"
                        value={venue.capacity_max}
                        onChange={(e) => setVenue({...venue, capacity_max: Number(e.target.value)})}
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Base Rate (₱) <span className="text-red-500">*</span></label>
                    <Input
                      type="number"
                      value={venue.base_rate}
                      onChange={(e) => setVenue({...venue, base_rate: Number(e.target.value)})}
                      min="0"
                      step="1000"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Current: ₱{(venue.base_rate || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Photos */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Photos</h3>
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
                        multiple
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
                            Upload Photos ({venue.photos.length}/5)
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Select multiple photos (up to {5 - venue.photos.length} more). Max 10MB each, JPG/PNG/WebP
                      </p>
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
                          Upload Photos (up to 5)
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Amenities</h3>
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
              </div>
            </ScrollArea>
          )}

          <DialogFooter className="flex justify-between">
            {venueId ? (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                disabled={saving || deleting}
              >
                <Trash2 className="size-4 mr-2" />
                Delete
              </Button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
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
                    {venueId ? 'Saving...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="size-4 mr-2" />
                    {venueId ? 'Save Changes' : 'Create Venue'}
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Venue?"
        description="This action cannot be undone. This venue will be permanently removed from your system."
        itemName={venue.name}
        isDeleting={deleting}
      />
    </>
  )
}
