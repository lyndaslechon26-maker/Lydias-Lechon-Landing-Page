import { createClient } from "@/lib/supabase/server"
import { 
  ShoppingCart, 
  Calendar, 
  Users, 
  Star,
  DollarSign,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  UtensilsCrossed,
  Download,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

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

  const todayLabel = new Date().toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="space-y-6 bg-white dark:bg-zinc-950">
      <PageHeader
        title="Manager Dashboard"
        description={`Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, ${firstName} • ${todayLabel}`}
        crumbs={[{ label: "Lydia's Lechon", href: "/" }, { label: "Manager" }, { label: "Dashboard" }]}
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
            <Button size="sm" asChild>
              <Link href="/manager/bookings">
                <Calendar className="mr-2 size-4" />
                New Booking
              </Link>
            </Button>
          </>
        }
      />

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Weekly Revenue"
          value={`₱${weeklyRevenue.toLocaleString()}`}
          icon={DollarSign}
          accent="emerald"
          trend="+18%"
          trendUp
          subtitle="vs. last week"
        />
        <StatCard
          label="Pending Orders"
          value={(pendingOrders || 0).toString()}
          icon={ShoppingCart}
          accent="amber"
          trend="+33%"
          trendUp
          subtitle="needs attention"
        />
        <StatCard
          label="Event Bookings"
          value={(pendingBookings || 0).toString()}
          icon={Calendar}
          accent="purple"
          trend="+50%"
          trendUp
          subtitle="new this week"
        />
        <StatCard
          label="Total Customers"
          value={(totalCustomers || 0).toString()}
          icon={Users}
          accent="blue"
          trend="+12%"
          trendUp
          subtitle="all time"
        />
      </div>

      {/* Operations strip */}
      <Card className="transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)_inset,0_1px_0_rgba(255,255,255,0.1)_inset] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.2)_inset]">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm font-medium">Operations live</span>
              <span className="text-xs text-muted-foreground">All systems normal</span>
            </div>
            <div className="hidden h-6 w-px bg-border md:block" />
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <PillStat icon={Clock} label="Pending" value={pendingOrders || 0} tone="amber" />
              <PillStat icon={CheckCircle2} label="Completed" value={completedOrders || 0} tone="emerald" />
              <PillStat icon={XCircle} label="Cancelled" value={cancelledOrders || 0} tone="rose" />
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/manager/orders">
              Go to orders
              <ArrowUpRight className="ml-1 size-3.5" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Alerts */}
      {(pendingOrders || 0) > 5 && (
        <Card className="border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(245,158,11,0.3),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(245,158,11,0.15),0_0_0_1px_rgba(245,158,11,0.1)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">Operations Alert</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {pendingOrders} orders pending — prioritize fulfillment
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/manager/orders">Review</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders — spans 2 cols */}
        <Card className="lg:col-span-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)_inset,0_1px_0_rgba(255,255,255,0.1)_inset] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.2)_inset]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/manager/orders">
                View all
                <ArrowUpRight className="ml-1 size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-2">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href="/manager/orders"
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
                        #{order.order_number.toString().slice(-4)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium">{order.customer_name}</span>
                          <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                            {order.status}
                          </Badge>
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {order.order_type}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold tabular-nums">
                      ₱{Number(order.total_amount).toLocaleString()}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState icon={<ShoppingCart className="size-8" />} title="No orders yet" description="Orders will appear here" />
            )}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)_inset,0_1px_0_rgba(255,255,255,0.1)_inset] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.2)_inset]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base font-semibold">Event Bookings</CardTitle>
              <CardDescription>Upcoming events</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/manager/bookings">
                View all
                <ArrowUpRight className="ml-1 size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentBookings && recentBookings.length > 0 ? (
              <ul className="space-y-3">
                {recentBookings.map((booking) => (
                  <li key={booking.id} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-purple-500/10 text-xs font-semibold text-purple-600">
                      <Calendar className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{booking.customer_name}</div>
                      <div className="text-xs text-muted-foreground">{booking.guest_count} guests</div>
                    </div>
                    <div className="text-sm font-semibold tabular-nums">
                      {new Date(booking.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon={<Calendar className="size-8" />} title="No bookings" description="Event bookings will appear here" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Quick Actions</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/manager/menu", title: "Manage Menu", description: "Update menu items", icon: UtensilsCrossed, color: "emerald" },
            { href: "/manager/bookings", title: "Event Bookings", description: "Manage reservations", icon: Calendar, color: "purple" },
            { href: "/manager/customers", title: "Customers", description: "View customer list", icon: Users, color: "blue" },
            { href: "/manager/reviews", title: "Reviews", description: "Check customer feedback", icon: Star, color: "amber" },
          ].map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="group flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-2 hover:border-foreground/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]"
            >
              <div className={`flex size-10 shrink-0 items-center justify-center rounded-md bg-${q.color}-500/10 text-${q.color}-600`}>
                <q.icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">{q.title}</h4>
                  <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{q.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function PillStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Clock
  label: string
  value: number
  tone: "amber" | "emerald" | "rose"
}) {
  const toneClass = {
    amber: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    rose: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
  }[tone]
  return (
    <div className="flex items-center gap-2">
      <span className={`flex size-7 items-center justify-center rounded-md ${toneClass}`}>
        <Icon className="size-3.5" />
      </span>
      <div className="leading-tight">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold tabular-nums">{value}</div>
      </div>
    </div>
  )
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="mb-3 text-muted-foreground">{icon}</div>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
