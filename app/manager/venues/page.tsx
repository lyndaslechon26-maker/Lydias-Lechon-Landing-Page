import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Building2,
  Plus,
  Users,
  MapPin,
  DollarSign,
  Edit,
  Eye,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"

export const dynamic = "force-dynamic"

export default async function ManagerVenuesPage() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/events/login?next=/manager/venues")

  // Fetch venues
  const { data: venues, error } = await supabase
    .from("event_venues")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-destructive">{error.message}</p>
      </div>
    )
  }

  const activeVenues = venues?.filter((v) => v.is_active) || []
  const inactiveVenues = venues?.filter((v) => !v.is_active) || []

  return (
    <div className="space-y-6 bg-white dark:bg-zinc-950">
      <PageHeader
        title="Venue Management"
        description="Manage your event venues and spaces"
        crumbs={[{ label: "Lydia's Lechon" }, { label: "Manager" }, { label: "Venues" }]}
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
            <Link href="/manager/venues/new">
              <Button size="sm" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                <Plus className="size-4 mr-2" />
                Add Venue
              </Button>
            </Link>
          </>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Venues"
          value={(venues?.length || 0).toString()}
          icon={Building2}
          accent="blue"
          subtitle="all locations"
        />
        <StatCard
          label="Active"
          value={activeVenues.length.toString()}
          icon={ToggleRight}
          accent="emerald"
          subtitle="available now"
        />
        <StatCard
          label="Inactive"
          value={inactiveVenues.length.toString()}
          icon={ToggleLeft}
          accent="rose"
          subtitle="not available"
        />
      </div>

      {/* Active Venues */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Active Venues</h2>

        {activeVenues.length === 0 ? (
          <div className="text-center py-16 border rounded-2xl bg-muted/30">
            <Building2 className="size-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No active venues</h3>
            <p className="text-muted-foreground mb-6">
              Add your first venue to start accepting bookings
            </p>
            <Link href="/manager/venues/new">
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                <Plus className="size-4 mr-2" />
                Add Your First Venue
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:gap-8">
            {activeVenues.map((venue) => (
              <div
                key={venue.id}
                className="p-6 rounded-xl border-2 bg-card shadow-md hover:shadow-xl hover:border-amber-300 transition-all duration-300 hover:-translate-y-2"
              >
                {/* Venue Image */}
                {venue.photos && venue.photos.length > 0 && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img
                      src={venue.photos[0]}
                      alt={venue.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                {/* Venue Info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">{venue.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="size-4" />
                        <span>{venue.location}</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600">
                      Active
                    </span>
                  </div>

                  {venue.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {venue.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Capacity
                      </p>
                      <div className="flex items-center gap-1">
                        <Users className="size-4 text-amber-600" />
                        <span className="font-semibold text-sm">
                          {venue.capacity_min}-{venue.capacity_max}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Base Rate
                      </p>
                      <div className="flex items-center gap-1">
                        <DollarSign className="size-4 text-amber-600" />
                        <span className="font-semibold text-sm">
                          ₱{Number(venue.base_rate).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  {venue.amenities && venue.amenities.length > 0 && (
                    <div className="pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-2">
                        Amenities
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {venue.amenities.slice(0, 4).map((amenity: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-full text-xs bg-muted"
                          >
                            {amenity}
                          </span>
                        ))}
                        {venue.amenities.length > 4 && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-muted">
                            +{venue.amenities.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3">
                    <Link
                      href={`/events/venues/${venue.id}`}
                      className="flex-1"
                      target="_blank"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="size-4 mr-2" />
                        View Public
                      </Button>
                    </Link>
                    <Link
                      href={`/manager/venues/${venue.id}/edit`}
                      className="flex-1"
                    >
                      <Button size="sm" className="w-full">
                        <Edit className="size-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inactive Venues */}
      {inactiveVenues.length > 0 && (
        <details className="space-y-4">
          <summary className="cursor-pointer text-lg font-bold hover:text-amber-600">
            Inactive Venues ({inactiveVenues.length})
          </summary>

          <div className="grid gap-6 lg:grid-cols-2 xl:gap-8 mt-4">
            {inactiveVenues.map((venue) => (
              <div
                key={venue.id}
                className="p-6 rounded-xl border-2 bg-card shadow-md opacity-60 hover:opacity-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">{venue.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="size-4" />
                        <span>{venue.location}</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-900/30 text-gray-600">
                      Inactive
                    </span>
                  </div>

                  <div className="flex gap-2 pt-3 border-t">
                    <Link
                      href={`/manager/venues/${venue.id}/edit`}
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="size-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}
