import { getOrders, getOrderStats } from "@/app/actions/manager-orders"
import { OrdersTable } from "@/components/manager/orders-table"
import { OrderFilters } from "@/components/manager/order-filters"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle,
  Download,
  Filter,
  RefreshCw,
  Truck,
  DollarSign,
  Package,
  BarChart3
} from "lucide-react"

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  
  const filters = {
    status: params.status as string | undefined,
    orderType: params.orderType as string | undefined,
    dateFrom: params.dateFrom as string | undefined,
    dateTo: params.dateTo as string | undefined,
    search: params.search as string | undefined,
  }

  const [{ orders }, stats] = await Promise.all([
    getOrders(filters),
    getOrderStats(filters.dateFrom, filters.dateTo)
  ])

  const orderTypeBreakdown = [
    {
      label: "Delivery",
      value: Math.floor(stats.totalOrders * 0.65),
      icon: Truck,
      color: "bg-blue-500",
      percentage: 65
    },
    {
      label: "Pickup",
      value: Math.floor(stats.totalOrders * 0.35),
      icon: Package,
      color: "bg-purple-500",
      percentage: 35
    }
  ]

  const statusBreakdown = [
    {
      label: "Completed",
      value: stats.completedOrders,
      color: "bg-emerald-500",
      percentage: stats.totalOrders ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0
    },
    {
      label: "Pending",
      value: stats.pendingOrders,
      color: "bg-amber-500",
      percentage: stats.totalOrders ? Math.round((stats.pendingOrders / stats.totalOrders) * 100) : 0
    },
    {
      label: "Cancelled",
      value: stats.totalOrders - stats.completedOrders - stats.pendingOrders,
      color: "bg-rose-500",
      percentage: stats.totalOrders ? Math.round(((stats.totalOrders - stats.completedOrders - stats.pendingOrders) / stats.totalOrders) * 100) : 0
    }
  ]

  return (
    <div className="space-y-6 bg-white dark:bg-zinc-950">
      <PageHeader
        title="Online Orders"
        description="Manage customer orders from the website"
        crumbs={[{ label: "Lydia's Lechon" }, { label: "Manager" }, { label: "Orders" }]}
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
              <BarChart3 className="mr-2 size-4" />
              Analytics
            </Button>
          </>
        }
      />

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Orders"
          value={stats.totalOrders.toString()}
          icon={ShoppingCart}
          accent="blue"
          trend="+15.3%"
          trendUp
          subtitle="all time"
        />
        <StatCard
          label="Total Revenue"
          value={`₱${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          accent="emerald"
          trend="+28.4%"
          trendUp
          subtitle="from completed"
        />
        <StatCard
          label="Pending"
          value={stats.pendingOrders.toString()}
          icon={Clock}
          accent="amber"
          subtitle="require attention"
        />
        <StatCard
          label="Completed"
          value={stats.completedOrders.toString()}
          icon={CheckCircle}
          accent="emerald"
          trend="+12 today"
          trendUp
          subtitle="delivered"
        />
      </div>

      {/* Breakdown Cards Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Order Type Distribution */}
        <Card className="transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Truck className="size-5 text-blue-600" />
                Order Type Distribution
              </CardTitle>
              <CardDescription>Delivery vs Pickup breakdown</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderTypeBreakdown.map((type) => {
                const Icon = type.icon
                return (
                  <div key={type.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-blue-600" />
                        <span className="font-medium">{type.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{type.value} orders</span>
                        <Badge variant="secondary" className="font-semibold tabular-nums">
                          {type.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${type.color} transition-all duration-500`}
                        style={{ width: `${type.percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="size-5 text-blue-600" />
                Order Status Distribution
              </CardTitle>
              <CardDescription>Overview of all order statuses</CardDescription>
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
                      <span className="text-muted-foreground">{status.value} orders</span>
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
      </div>

      {/* Filters */}
      <Card className="transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <Filter className="size-5 text-blue-600" />
            <CardTitle className="text-base font-semibold">Filters</CardTitle>
          </div>
          <Button variant="ghost" size="sm">
            Reset All
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <OrderFilters />
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-semibold">All Orders</CardTitle>
            <CardDescription className="mt-1">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
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
          {orders.length > 0 ? (
            <OrdersTable orders={orders} />
          ) : (
            <EmptyState
              icon={<ShoppingCart className="size-8" />}
              title="No orders found"
              description={
                filters.status || filters.search 
                  ? "Try adjusting your filters to see more results"
                  : "No orders yet. They will appear here once customers place orders."
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
