import { getBookings, getBookingStats } from "@/app/actions/manager-bookings"
import { BookingsTable } from "@/components/manager/bookings-table"
import { BookingFilters } from "@/components/manager/booking-filters"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  XCircle,
  Download,
  Filter,
  ArrowUp,
  ArrowDown,
  Users,
  DollarSign
} from "lucide-react"
import Link from "next/link"

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

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      trend: "+12.5%",
      trendUp: true,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-500",
      description: "All time bookings"
    },
    {
      title: "Total Revenue",
      value: `₱${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: "+23.1%",
      trendUp: true,
      color: "text-green-600",
      bgColor: "bg-green-50",
      iconBg: "bg-green-500",
      description: "From confirmed bookings"
    },
    {
      title: "Pending",
      value: stats.pendingBookings,
      icon: Clock,
      trend: "3 today",
      trendUp: false,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-500",
      description: "Awaiting confirmation"
    },
    {
      title: "Confirmed",
      value: stats.confirmedBookings,
      icon: CheckCircle,
      trend: "+8 this week",
      trendUp: true,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      iconBg: "bg-emerald-500",
      description: "Ready for event"
    },
  ]

  const statusBreakdown = [
    {
      label: "Confirmed",
      value: stats.confirmedBookings,
      color: "bg-green-500",
      percentage: stats.totalBookings ? Math.round((stats.confirmedBookings / stats.totalBookings) * 100) : 0
    },
    {
      label: "Pending",
      value: stats.pendingBookings,
      color: "bg-orange-500",
      percentage: stats.totalBookings ? Math.round((stats.pendingBookings / stats.totalBookings) * 100) : 0
    },
    {
      label: "Cancelled",
      value: stats.totalBookings - stats.confirmedBookings - stats.pendingBookings,
      color: "bg-red-500",
      percentage: stats.totalBookings ? Math.round(((stats.totalBookings - stats.confirmedBookings - stats.pendingBookings) / stats.totalBookings) * 100) : 0
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-900 to-purple-700 bg-clip-text text-transparent">
            Event Bookings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage customer event bookings and reservations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="size-4" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 gap-2">
            <Calendar className="size-4" />
            Calendar View
          </Button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-slate-200 overflow-hidden relative">
              <div className={`absolute inset-0 ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                <div>
                  <CardTitle className="text-sm font-medium text-slate-600">
                    {stat.title}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {stat.description}
                  </CardDescription>
                </div>
                <div className={`p-3 rounded-xl ${stat.iconBg} shadow-lg`}>
                  <Icon className="size-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  {stat.trendUp !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-slate-600'}`}>
                      {stat.trendUp && <ArrowUp className="size-4" />}
                      {stat.trend}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Status Breakdown */}
      <Card className="border-slate-200">
        <CardHeader className="border-b bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="size-5 text-purple-600" />
            Booking Status Distribution
          </CardTitle>
          <CardDescription>Overview of all booking statuses</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
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
                    <Badge variant="secondary" className="font-semibold">
                      {status.percentage}%
                    </Badge>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
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
      <Card className="border-slate-200">
        <CardHeader className="border-b bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="size-5 text-purple-600" />
              <CardTitle className="text-lg">Filters</CardTitle>
            </div>
            <Button variant="ghost" size="sm">
              Reset All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <BookingFilters />
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="border-slate-200">
        <CardHeader className="border-b bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">All Bookings</CardTitle>
              <CardDescription className="mt-1">
                {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} found
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <span className="size-2 bg-green-500 rounded-full animate-pulse" />
                Live Updates
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {bookings.length > 0 ? (
            <BookingsTable bookings={bookings} />
          ) : (
            <div className="text-center py-12">
              <Calendar className="size-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {filters.status || filters.search 
                  ? "Try adjusting your filters to see more results"
                  : "No event bookings yet. They will appear here once customers make reservations."}
              </p>
              {(filters.status || filters.search) && (
                <Button variant="outline" size="sm">
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
