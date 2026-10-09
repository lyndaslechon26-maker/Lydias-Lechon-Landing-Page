import { getBookings, getBookingStats } from "@/app/actions/manager-bookings"
import { BookingsTable } from "@/components/manager/bookings-table"
import { BookingFilters } from "@/components/manager/booking-filters"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  CheckCircle,
  Download,
  Filter,
  RefreshCw,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react"

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  
  const filters = {
    status: params.status as string | undefined,
    venueId: params.venueId as string | undefined,
    dateFrom: params.dateFrom as string | undefined,
    dateTo: params.dateTo as string | undefined,
    search: params.search as string | undefined,
  }

  const [{ bookings }, stats] = await Promise.all([
    getBookings(filters),
    getBookingStats(filters.dateFrom, filters.dateTo)
  ])

  const statusBreakdown = [
    {
      label: "Confirmed",
      value: stats.confirmedBookings,
      color: "bg-emerald-500",
      percentage: stats.totalBookings ? Math.round((stats.confirmedBookings / stats.totalBookings) * 100) : 0
    },
    {
      label: "Pending",
      value: stats.pendingBookings,
      color: "bg-amber-500",
      percentage: stats.totalBookings ? Math.round((stats.pendingBookings / stats.totalBookings) * 100) : 0
    },
    {
      label: "Cancelled",
      value: stats.totalBookings - stats.confirmedBookings - stats.pendingBookings,
      color: "bg-rose-500",
      percentage: stats.totalBookings ? Math.round(((stats.totalBookings - stats.confirmedBookings - stats.pendingBookings) / stats.totalBookings) * 100) : 0
    }
  ]

  return (
    <div className="space-y-6 bg-white dark:bg-zinc-950">
      <PageHeader
        title="Event Bookings"
        description="Manage customer event bookings and reservations"
        crumbs={[{ label: "Lydia's Lechon" }, { label: "Manager" }, { label: "Bookings" }]}
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
            <Button size="sm">
              <Calendar className="mr-2 size-4" />
              Calendar View
            </Button>
          </>
        }
      />

      {/* KPI Row */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Bookings"
          value={stats.totalBookings.toString()}
          icon={Calendar}
          accent="purple"
          trend="+12.5%"
          trendUp
          subtitle="all time"
        />
        <StatCard
          label="Total Revenue"
          value={`₱${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          accent="emerald"
          trend="+23.1%"
          trendUp
          subtitle="from confirmed"
        />
        <StatCard
          label="Pending"
          value={stats.pendingBookings.toString()}
          icon={Clock}
          accent="amber"
          trend="+0%"
          trendUp={false}
          subtitle="awaiting confirmation"
        />
        <StatCard
          label="Confirmed"
          value={stats.confirmedBookings.toString()}
          icon={CheckCircle}
          accent="emerald"
          trend="+8 this week"
          trendUp
          subtitle="ready for event"
        />
      </div>

      {/* Status Breakdown */}
      <Card className="transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)_inset,0_1px_0_rgba(255,255,255,0.1)_inset] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.2)_inset]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="size-5 text-purple-600" />
              Booking Status Distribution
            </CardTitle>
            <CardDescription>Overview of all booking statuses</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusBreakdown.map((status) => (
              <div key={status.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`size-3 rounded-full ${status.color}`} />
                    <span className="font-medium">{status.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{status.value} bookings</span>
                    <Badge variant="secondary" className="font-semibold tabular-nums">
                      {status.percentage}%
                    </Badge>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${status.color} transition-all duration-500`}
                    style={{ width: `${status.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <Filter className="size-5 text-purple-600" />
            <CardTitle className="text-base font-semibold">Filters</CardTitle>
          </div>
          <Button variant="ghost" size="sm">
            Reset All
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <BookingFilters />
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base font-semibold">All Bookings</CardTitle>
            <CardDescription className="mt-1">
              {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} found
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Live Updates
          </Badge>
        </CardHeader>
        <CardContent className="pt-6">
          {bookings.length > 0 ? (
            <BookingsTable bookings={bookings} />
          ) : (
            <EmptyState
              icon={<Calendar className="size-8" />}
              title="No bookings found"
              description={
                filters.status || filters.search 
                  ? "Try adjusting your filters to see more results"
                  : "No event bookings yet. They will appear here once customers make reservations."
              }
              action={
                (filters.status || filters.search) && (
                  <Button variant="outline" size="sm">
                    Clear Filters
                  </Button>
                )
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function EmptyState({ icon, title, description, action }: { 
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-muted-foreground">{icon}</div>
      <h3 className="text-base font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">{description}</p>
      {action}
    </div>
  )
}
