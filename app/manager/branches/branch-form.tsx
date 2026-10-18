"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/ui/image-upload"
import {
  Branch,
  BranchInput,
  createBranch,
  updateBranch,
} from "@/app/actions/manager-branches"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

interface BranchFormProps {
  branch?: Branch
}

export function BranchForm({ branch }: BranchFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<BranchInput>({
    name: branch?.name || "",
    location: branch?.location || "",
    phone: branch?.phone || "",
    hours: branch?.hours || "10:00 AM - 9:00 PM",
    landmark: branch?.landmark || "",
    image_url: branch?.image_url || "",
    google_maps_url: branch?.google_maps_url || "",
    has_dine_in: branch?.has_dine_in ?? true,
    has_takeout: branch?.has_takeout ?? true,
    has_delivery: branch?.has_delivery ?? true,
    has_catering: branch?.has_catering ?? true,
    has_event_venue: branch?.has_event_venue ?? false,
    is_active: branch?.is_active ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log('Submitting form data:', formData)
      
      let result
      if (branch?.id) {
        console.log('Updating branch:', branch.id)
        result = await updateBranch(branch.id, formData)
      } else {
        console.log('Creating new branch')
        result = await createBranch(formData)
      }

      console.log('Result:', result)

      if (result.error) {
        console.error('Error from server:', result.error)
        toast.error(result.error)
      } else if (result.branch) {
        toast.success(
          branch?.id
            ? "Branch updated successfully!"
            : "Branch created successfully!"
        )
        console.log('Success, redirecting...')
        router.push("/manager/branches")
        router.refresh()
      } else {
        console.error('Unexpected result:', result)
        toast.error("Unexpected response from server")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="rounded-lg border bg-card p-6 space-y-6">
        <h2 className="text-lg font-semibold">Basic Information</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">
              Branch Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Baclaran Branch"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="e.g., (02) 8123-4567"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">
            Location <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="location"
            required
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="e.g., Baclaran, Parañaque City, Metro Manila"
            rows={2}
          />
          <p className="text-xs text-muted-foreground">
            Format: Address, City, Region
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="landmark">Landmark (Optional)</Label>
            <Input
              id="landmark"
              value={formData.landmark}
              onChange={(e) =>
                setFormData({ ...formData, landmark: e.target.value })
              }
              placeholder="e.g., Near Baclaran Church"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours">
              Operating Hours <span className="text-red-500">*</span>
            </Label>
            <Input
              id="hours"
              required
              value={formData.hours}
              onChange={(e) =>
                setFormData({ ...formData, hours: e.target.value })
              }
              placeholder="e.g., 10:00 AM - 9:00 PM"
            />
          </div>
        </div>
      </div>

      {/* Media & Links */}
      <div className="rounded-lg border bg-card p-6 space-y-6">
        <h2 className="text-lg font-semibold">Media & Links</h2>

        <ImageUpload
          id="branch_image"
          label="Branch Image"
          description="Upload a photo of the branch (will be compressed to save space)"
          value={formData.image_url}
          onChange={(base64) =>
            setFormData({ ...formData, image_url: base64 })
          }
          onClear={() => setFormData({ ...formData, image_url: "" })}
          preset="venue"
        />

        <div className="space-y-2">
          <Label htmlFor="google_maps_url">Google Maps URL (Optional)</Label>
          <Input
            id="google_maps_url"
            type="url"
            value={formData.google_maps_url}
            onChange={(e) =>
              setFormData({ ...formData, google_maps_url: e.target.value })
            }
            placeholder="https://maps.google.com/?q=..."
          />
          <p className="text-xs text-muted-foreground">
            Link to Google Maps location
          </p>
        </div>
      </div>

      {/* Available Services */}
      <div className="rounded-lg border bg-card p-6 space-y-6">
        <h2 className="text-lg font-semibold">Available Services</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, has_dine_in: !formData.has_dine_in })
            }
            className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-all ${
              formData.has_dine_in
                ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                : "border-border hover:border-orange-300"
            }`}
          >
            <div className="text-left">
              <Label className="cursor-pointer font-medium">Dine-In</Label>
              <p className="text-xs text-muted-foreground">
                Accept dine-in customers
              </p>
            </div>
            <div
              className={`flex-shrink-0 size-6 rounded-full border-2 flex items-center justify-center transition-all ${
                formData.has_dine_in
                  ? "border-orange-500 bg-orange-500"
                  : "border-gray-300"
              }`}
            >
              {formData.has_dine_in && (
                <svg
                  className="size-4 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, has_takeout: !formData.has_takeout })
            }
            className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-all ${
              formData.has_takeout
                ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                : "border-border hover:border-orange-300"
            }`}
          >
            <div className="text-left">
              <Label className="cursor-pointer font-medium">Takeout</Label>
              <p className="text-xs text-muted-foreground">
                Offer takeout service
              </p>
            </div>
            <div
              className={`flex-shrink-0 size-6 rounded-full border-2 flex items-center justify-center transition-all ${
                formData.has_takeout
                  ? "border-orange-500 bg-orange-500"
                  : "border-gray-300"
              }`}
            >
              {formData.has_takeout && (
                <svg
                  className="size-4 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, has_delivery: !formData.has_delivery })
            }
            className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-all ${
              formData.has_delivery
                ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                : "border-border hover:border-orange-300"
            }`}
          >
            <div className="text-left">
              <Label className="cursor-pointer font-medium">Delivery</Label>
              <p className="text-xs text-muted-foreground">
                Provide delivery service
              </p>
            </div>
            <div
              className={`flex-shrink-0 size-6 rounded-full border-2 flex items-center justify-center transition-all ${
                formData.has_delivery
                  ? "border-orange-500 bg-orange-500"
                  : "border-gray-300"
              }`}
            >
              {formData.has_delivery && (
                <svg
                  className="size-4 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, has_catering: !formData.has_catering })
            }
            className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-all ${
              formData.has_catering
                ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                : "border-border hover:border-orange-300"
            }`}
          >
            <div className="text-left">
              <Label className="cursor-pointer font-medium">Catering</Label>
              <p className="text-xs text-muted-foreground">
                Offer catering services
              </p>
            </div>
            <div
              className={`flex-shrink-0 size-6 rounded-full border-2 flex items-center justify-center transition-all ${
                formData.has_catering
                  ? "border-orange-500 bg-orange-500"
                  : "border-gray-300"
              }`}
            >
              {formData.has_catering && (
                <svg
                  className="size-4 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                has_event_venue: !formData.has_event_venue,
              })
            }
            className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-all sm:col-span-2 ${
              formData.has_event_venue
                ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                : "border-border hover:border-orange-300"
            }`}
          >
            <div className="text-left">
              <Label className="cursor-pointer font-medium">Event Venue</Label>
              <p className="text-xs text-muted-foreground">
                Has event venue space
              </p>
            </div>
            <div
              className={`flex-shrink-0 size-6 rounded-full border-2 flex items-center justify-center transition-all ${
                formData.has_event_venue
                  ? "border-orange-500 bg-orange-500"
                  : "border-gray-300"
              }`}
            >
              {formData.has_event_venue && (
                <svg
                  className="size-4 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Active Status */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Active Status</h2>

        <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4 gap-4">
          <div className="flex-1">
            <Label
              htmlFor="is_active"
              className="cursor-pointer text-base font-medium block"
            >
              Visible to customers
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              This branch is available on public pages
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              type="button"
              role="switch"
              aria-checked={formData.is_active}
              onClick={() =>
                setFormData({ ...formData, is_active: !formData.is_active })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                formData.is_active ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.is_active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="size-4 mr-2" />
              {branch?.id ? "Update Branch" : "Create Branch"}
            </>
          )}
        </Button>
        <Link href="/manager/branches">
          <Button type="button" variant="outline" disabled={isSubmitting}>
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  )
}
