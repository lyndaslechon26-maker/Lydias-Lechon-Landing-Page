import { createClient } from "@/lib/supabase/server"
import { 
  ShoppingCart, 
  Calendar, 
  Users, 
  Star,
  TrendingUp,
  Package,
  MessageSquare,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function ManagerDashboard() {
  const supabase = await createClient()

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

  // Calculate total revenue (this week)
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

  const stats = [
    {
      title: "Pending Orders",
      value: pendingOrders || 0,
      icon: Clock,
      trend: "+12%",
      trendUp: true,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-500",
      href: "/manager/orders?status=pending",
      description: "Require attention"
    },
    {
      title: "Weekly Revenue",
      value: `₱${weeklyRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: "+23.5%",
      trendUp: true,
      color: "text-green-600",
      bgColor: "bg-green-50",
      iconBg: "bg-green-500",
      href: "/manager/orders",
      description: "From completed orders"
    },
    {
      title: "New Bookings",
      value: pendingBookings || 0,
      icon: Calendar,
      trend: "+8%",
      trendUp: true,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-500",
      href: "/manager/bookings?status=pending",
      description: "Awaiting confirmation"
    },
    {
      title: "Total Customers",
      value: totalCustomers || 0,
      icon: Users,
      trend: "+5.2%",
      trendUp: true,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-500",
      href: "/manager/customers",
      description: "Active customer base"
    },
  ]

  const orderStats = [
    {
      label: "Completed",
      value: completedOrders || 0,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      label: "Pending",
      value: pendingOrders || 0,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      label: "Cancelled",
      value: cancelledOrders || 0,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      label: "Reviews",
      value: pendingReviews || 0,
      icon: MessageSquare,
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your restaurant today.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
          <TrendingUp className="size-4 mr-2" />
          View Full Report
        </Button>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-slate-200 overflow-hidden relative">
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
                    <div className={`flex items-center gap-1 text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trendUp ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
                      {stat.trend}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {orderStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`size-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="border-slate-200">
          <CardHeader className="border-b bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="size-5 text-orange-600" />
                  Recent Orders
                </CardTitle>
                <CardDescription className="mt-1">Latest customer orders</CardDescription>
              </div>
              <Link href="/manager/orders">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-900">{order.order_number}</p>
                        <Badge variant={
                          order.status === 'pending' ? 'secondary' :
                          order.status === 'completed' ? 'default' :
                          'outline'
                        } className={
                          order.status === 'pending' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                          order.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                          'bg-slate-100 text-slate-700'
                        }>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">₱{Number(order.total_amount).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{order.order_type}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="size-12 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-muted-foreground">No orders yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="border-slate-200">
          <CardHeader className="border-b bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="size-5 text-purple-600" />
                  Event Bookings
                </CardTitle>
                <CardDescription className="mt-1">Upcoming event reservations</CardDescription>
              </div>
              <Link href="/manager/bookings">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {recentBookings && recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-900">{booking.customer_name}</p>
                        <Badge variant={
                          booking.status === 'pending' ? 'secondary' :
                          booking.status === 'confirmed' ? 'default' :
                          booking.status === 'cancelled' ? 'destructive' :
                          'outline'
                        } className={
                          booking.status === 'pending' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-200' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                          'bg-slate-100 text-slate-700'
                        }>
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {booking.event_packages?.name || 'No package'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {booking.guest_count} guests • {booking.event_type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        {new Date(booking.event_date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {booking.event_time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="size-12 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-muted-foreground">No bookings yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-slate-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/manager/menu">
              <Button variant="outline" className="w-full justify-start h-auto py-4 hover:bg-white hover:shadow-md">
                <UtensilsCrossed className="size-5 mr-3 text-orange-600" />
                <div className="text-left">
                  <p className="font-semibold">Manage Menu</p>
                  <p className="text-xs text-muted-foreground">Add or edit items</p>
                </div>
              </Button>
            </Link>
            <Link href="/manager/venues">
              <Button variant="outline" className="w-full justify-start h-auto py-4 hover:bg-white hover:shadow-md">
                <Package className="size-5 mr-3 text-purple-600" />
                <div className="text-left">
                  <p className="font-semibold">Manage Venues</p>
                  <p className="text-xs text-muted-foreground">Update event spaces</p>
                </div>
              </Button>
            </Link>
            <Link href="/manager/reviews">
              <Button variant="outline" className="w-full justify-start h-auto py-4 hover:bg-white hover:shadow-md">
                <Star className="size-5 mr-3 text-amber-600" />
                <div className="text-left">
                  <p className="font-semibold">Reviews</p>
                  <p className="text-xs text-muted-foreground">Moderate feedback</p>
                </div>
              </Button>
            </Link>
            <Link href="/manager/settings">
              <Button variant="outline" className="w-full justify-start h-auto py-4 hover:bg-white hover:shadow-md">
                <AlertCircle className="size-5 mr-3 text-blue-600" />
                <div className="text-left">
                  <p className="font-semibold">Settings</p>
                  <p className="text-xs text-muted-foreground">Configure system</p>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
