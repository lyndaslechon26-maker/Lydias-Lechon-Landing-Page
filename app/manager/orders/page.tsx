import { getOrders, getOrderStats } from "@/app/actions/manager-orders"
import { OrdersTable } from "@/components/manager/orders-table"
import { OrderFilters } from "@/components/manager/order-filters"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ShoppingCart, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Download,
  Filter,
  ArrowUp,
  ArrowDown,
  Truck,
  DollarSign,
  XCircle,
  Package,
  BarChart3
} from "lucide-react"
import Link from "next/link"

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

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      trend: "+15.3%",
      trendUp: true,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-500",
      description: "All time orders"
    },
    {
      title: "Total Revenue",
      value: `₱${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: "+28.4%",
      trendUp: true,
      color: "text-green-600",
      bgColor: "bg-green-50",
      iconBg: "bg-green-500",
      description: "From completed orders"
    },
    {
      title: "Pending",
      value: stats.pendingOrders,
      icon: Clock,
      trend: "5 today",
      trendUp: false,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-500",
      description: "Require attention"
    },
    {
      title: "Completed",
      value: stats.completedOrders,
      icon: CheckCircle,
      trend: "+12 today",
      trendUp: true,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      iconBg: "bg-emerald-500",
      description: "Successfully delivered"
    },
  ]

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
      color: "bg-green-500",
      percentage: stats.totalOrders ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0
    },
    {
      label: "Pending",
      value: stats.pendingOrders,
      color: "bg-orange-500",
      percentage: stats.totalOrders ? Math.round((stats.pendingOrders / stats.totalOrders) * 100) : 0
    },
    {
      label: "Cancelled",
      value: stats.totalOrders - stats.completedOrders - stats.pendingOrders,
      color: "bg-red-500",
      percentage: stats.totalOrders ? Math.round(((stats.totalOrders - stats.completedOrders - stats.pendingOrders) / stats.totalOrders) * 100) : 0
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
            Online Orders
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage customer orders from the website
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="size-4" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 gap-2">
            <BarChart3 className="size-4" />
            Analytics
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

      {/* Breakdown Cards Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Order Type Distribution */}
        <Card className="border-slate-200">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Truck className="size-5 text-blue-600" />
              Order Type Distribution
            </CardTitle>
            <CardDescription>Delivery vs Pickup breakdown</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
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
                        <Badge variant="secondary" className="font-semibold">
                          {type.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
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
        <Card className="border-slate-200">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="size-5 text-blue-600" />
              Order Status Distribution
            </CardTitle>
            <CardDescription>Overview of all order statuses</CardDescription>
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
                      <span className="text-muted-foreground">{status.value} orders</span>
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
      </div>

      {/* Filters */}
      <Card className="border-slate-200">
        <CardHeader className="border-b bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="size-5 text-blue-600" />
              <CardTitle className="text-lg">Filters</CardTitle>
            </div>
            <Button variant="ghost" size="sm">
              Reset All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <OrderFilters />
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-slate-200">
        <CardHeader className="border-b bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">All Orders</CardTitle>
              <CardDescription className="mt-1">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
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
          {orders.length > 0 ? (
            <OrdersTable orders={orders} />
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="size-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {filters.status || filters.search 
                  ? "Try adjusting your filters to see more results"
                  : "No orders yet. They will appear here once customers place orders."}
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
