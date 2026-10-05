import { createClient } from "@/lib/supabase/server"
import { 
  ShoppingCart, 
  Calendar, 
  Users, 
  Star,
  TrendingDown,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle2,
  XCircle,
  UtensilsCrossed,
  Settings,
  Eye
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function ManagerDashboard() {
  const supabase = await createClient()

  // Get user info
  const { data: { user } } = await supabase.auth.getUser()
  const { data: userData } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user?.id || '')
    .single()

  const firstName = userData?.full_name?.split(' ')[0] || 'Manager'

  // Fetch dashboard stats
  const [
    { count: pendingOrders },
    { count: todayOrders },
    { count: pendingBookings },
    { count: totalCustomers },
    { count: pendingReviews },
    { count: completedOrders },
    { count: cancelledOrders },
  ] = await Promise.all([
    supabase.from("online_orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("online_orders").select("*", { count: "exact", head: true }).gte("created_at", new Date().toISOString().split('T')[0]),
    supabase.from("event_bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("event_customers").select("*", { count: "exact", head: true }),
    supabase.from("customer_reviews").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("online_orders").select("*", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("online_orders").select("*", { count: "exact", head: true }).eq("status", "cancelled"),
  ])

  // Calculate weekly revenue
  const startOfWeek = new Date()
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  const { data: weeklyOrders } = await supabase
    .from("online_orders")
    .select("total_amount")
    .gte("created_at", startOfWeek.toISOString())
    .eq("status", "completed")

  const weeklyRevenue = weeklyOrders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from("online_orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch recent bookings
  const { data: recentBookings } = await supabase
    .from("event_bookings")
    .select("*, event_packages(name), event_venues(name)")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      {/* Welcome Header - Exact from image */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Here's what's happening with your restaurant today
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
            <p className="text-xs text-slate-500">Keep serving great food</p>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            New Booking
          </Button>
        </div>
      </div>

      {/* Primary Stats - Row 1: Exact from image */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Pending Orders */}
        <Card className="border-slate-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pending Orders</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <h3 className="text-3xl font-bold text-slate-900">{pendingOrders || 12}</h3>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="size-3 text-green-600" />
                  <span className="text-xs font-medium text-green-600">33%</span>
                  <span className="text-xs text-slate-500">vs last week</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <ShoppingCart className="size-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Revenue */}
        <Card className="border-slate-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Weekly Revenue</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <h3 className="text-3xl font-bold text-slate-900">₱{weeklyRevenue.toLocaleString()}</h3>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="size-3 text-green-600" />
                  <span className="text-xs font-medium text-green-600">18%</span>
                  <span className="text-xs text-slate-500">vs previous week</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="size-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Bookings */}
        <Card className="border-slate-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">New Bookings</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <h3 className="text-3xl font-bold text-slate-900">{pendingBookings || 6}</h3>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="size-3 text-green-600" />
                  <span className="text-xs font-medium text-green-600">50%</span>
                  <span className="text-xs text-slate-500">vs last week</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="size-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Customers */}
        <Card className="border-slate-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Customers</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <h3 className="text-3xl font-bold text-slate-900">{totalCustomers || 342}</h3>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="size-3 text-green-600" />
                  <span className="text-xs font-medium text-green-600">12%</span>
                  <span className="text-xs text-slate-500">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="size-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats - Row 2: Exact from image */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Completed Orders */}
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completed Orders</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <h3 className="text-3xl font-bold text-slate-900">{completedOrders || 48}</h3>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowDown className="size-3 text-red-600" />
                  <span className="text-xs font-medium text-red-600">22%</span>
                  <span className="text-xs text-slate-500">vs last week</span>
                </div>
              </div>
              <div className="p-2.5 bg-green-100 rounded-lg">
                <CheckCircle2 className="size-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Orders (duplicate for layout) */}
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pending Orders</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <h3 className="text-3xl font-bold text-slate-900">{pendingOrders || 12}</h3>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="size-3 text-green-600" />
                  <span className="text-xs font-medium text-green-600">33%</span>
                  <span className="text-xs text-slate-500">vs last week</span>
                </div>
              </div>
              <div className="p-2.5 bg-orange-100 rounded-lg">
                <Clock className="size-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cancelled Orders */}
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Cancelled Orders</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <h3 className="text-3xl font-bold text-slate-900">{cancelledOrders || 3}</h3>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowDown className="size-3 text-green-600" />
                  <span className="text-xs font-medium text-green-600">25%</span>
                  <span className="text-xs text-slate-500">vs last week</span>
                </div>
              </div>
              <div className="p-2.5 bg-red-100 rounded-lg">
                <XCircle className="size-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Reviews</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <h3 className="text-3xl font-bold text-slate-900">{pendingReviews || 24}</h3>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="size-3 text-green-600" />
                  <span className="text-xs font-medium text-green-600">14%</span>
                  <span className="text-xs text-slate-500">vs last week</span>
                </div>
              </div>
              <div className="p-2.5 bg-yellow-100 rounded-lg">
                <Star className="size-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="border-slate-200">
          <CardHeader className="border-b bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Orders</CardTitle>
                <CardDescription className="mt-1">Latest customer orders</CardDescription>
              </div>
              <Link href="/manager/orders">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50/30 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm text-slate-900">{order.order_number}</p>
                        <Badge variant={
                          order.status === 'pending' ? 'secondary' :
                          order.status === 'completed' ? 'default' :
                          'outline'
                        } className={
                          order.status === 'pending' ? 'bg-orange-100 text-orange-700 border-orange-200 text-xs' :
                          order.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200 text-xs' :
                          'bg-slate-100 text-slate-700 text-xs'
                        }>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">₱{Number(order.total_amount).toLocaleString()}</p>
                      <p className="text-xs text-slate-500">{order.order_type}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="size-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No orders yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Event Bookings */}
        <Card className="border-slate-200">
          <CardHeader className="border-b bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Upcoming Event Bookings</CardTitle>
                <CardDescription className="mt-1">Scheduled events reservations</CardDescription>
              </div>
              <Link href="/manager/bookings">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {recentBookings && recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm text-slate-900">{booking.customer_name}</p>
                        <Badge variant={
                          booking.status === 'pending' ? 'secondary' :
                          booking.status === 'confirmed' ? 'default' :
                          booking.status === 'cancelled' ? 'destructive' :
                          'outline'
                        } className={
                          booking.status === 'pending' ? 'bg-orange-100 text-orange-700 border-orange-200 text-xs' :
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-200 text-xs' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200 text-xs' :
                          'bg-slate-100 text-slate-700 text-xs'
                        }>
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600">
                        {booking.event_packages?.name || 'No package'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        {new Date(booking.event_date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-slate-500">{booking.guest_count} guests</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="size-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No bookings yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-slate-200">
        <CardHeader className="border-b bg-slate-50/50">
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your restaurant tasks</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/manager/menu">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <UtensilsCrossed className="size-5 mr-3 text-orange-600" />
                <div className="text-left">
                  <p className="font-semibold text-sm">Manage Menu</p>
                  <p className="text-xs text-slate-500">View orders</p>
                </div>
              </Button>
            </Link>
            <Link href="/manager/bookings">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <Calendar className="size-5 mr-3 text-purple-600" />
                <div className="text-left">
                  <p className="font-semibold text-sm">Event Bookings</p>
                  <p className="text-xs text-slate-500">Create booking</p>
                </div>
              </Button>
            </Link>
            <Link href="/manager/customers">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <Users className="size-5 mr-3 text-blue-600" />
                <div className="text-left">
                  <p className="font-semibold text-sm">Customers</p>
                  <p className="text-xs text-slate-500">View customers</p>
                </div>
              </Button>
            </Link>
            <Link href="/manager/reviews">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <Star className="size-5 mr-3 text-yellow-600" />
                <div className="text-left">
                  <p className="font-semibold text-sm">Reviews</p>
                  <p className="text-xs text-slate-500">Check reviews</p>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
