import { requireAuth } from "@/lib/auth/customer-auth"
import { getCustomerBookings, getCustomerTableReservations } from "@/app/actions/events"
import { getCustomerOnlineOrders } from "@/app/actions/online-orders"
import Link from "next/link"
import { 
  Calendar, 
  Package, 
  User, 
  FileText, 
  CreditCard,
  ChevronRight,
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
  UtensilsCrossed,
  ShoppingBag
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReserveTableButton } from "@/components/events/reserve-table-button"

export const metadata = {
  title: "Dashboard - Event Venue",
  description: "Manage your event bookings and profile",
}

export default async function DashboardPage() {
  const customer = await requireAuth()
  const { bookings } = await getCustomerBookings()
  const { reservations } = await getCustomerTableReservations()
  const { orders } = await getCustomerOnlineOrders()

  // Calculate stats - include both event bookings and table reservations
  const totalEventBookings = bookings?.length || 0
  const totalTableReservations = reservations?.length || 0
  const totalBookings = totalEventBookings + totalTableReservations
  
  const pendingBookings = (bookings?.filter(b => b.status === "pending").length || 0) + 
                          (reservations?.filter(r => r.status === "pending").length || 0)
  const confirmedBookings = (bookings?.filter(b => b.status === "confirmed" || b.status === "paid").length || 0) +
                            (reservations?.filter(r => r.status === "confirmed").length || 0)
  const totalSpent = bookings?.reduce((sum, b) => sum + Number(b.total_paid || 0), 0) || 0

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <section className="py-8 sm:py-12 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-rose-950/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                Welcome back, {customer.full_name}!
              </h1>
              <p className="text-muted-foreground">
                Manage your event bookings and account settings
              </p>
            </div>
            <Link href="/events/book">
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                <Calendar className="size-4 mr-2" />
                New Booking
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-8 -mt-6">
        <div className="container mx-auto px-4">
          {/* Mobile: 2x2 Grid */}
          <div className="grid grid-cols-2 gap-3 lg:hidden">
            {/* Total Bookings */}
            <div className="p-4 rounded-xl border bg-card shadow-md">
              <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2">
                <CalendarCheck className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-xl font-bold mb-0.5">{totalBookings}</p>
              <p className="text-xs text-muted-foreground">Total Bookings</p>
            </div>

            {/* Pending */}
            <div className="p-4 rounded-xl border bg-card shadow-md">
              <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 mb-2">
                <Clock className="size-5 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-xl font-bold mb-0.5">{pendingBookings}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>

            {/* Confirmed */}
            <div className="p-4 rounded-xl border bg-card shadow-md">
              <div className="flex size-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
                <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xl font-bold mb-0.5">{confirmedBookings}</p>
              <p className="text-xs text-muted-foreground">Confirmed</p>
            </div>

            {/* Total Spent */}
            <div className="p-4 rounded-xl border bg-card shadow-md">
              <div className="flex size-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 mb-2">
                <CreditCard className="size-5 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-xl font-bold mb-0.5">₱{totalSpent.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </div>
          </div>

          {/* Desktop: 4 Column Grid */}
          <div className="hidden lg:grid gap-6 grid-cols-4">
            {/* Total Bookings */}
            <div className="p-6 rounded-2xl border bg-card shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <CalendarCheck className="size-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-2xl font-bold mb-1">{totalBookings}</p>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </div>

            {/* Pending */}
            <div className="p-6 rounded-2xl border bg-card shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <Clock className="size-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <p className="text-2xl font-bold mb-1">{pendingBookings}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>

            {/* Confirmed */}
            <div className="p-6 rounded-2xl border bg-card shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="size-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-2xl font-bold mb-1">{confirmedBookings}</p>
              <p className="text-sm text-muted-foreground">Confirmed</p>
            </div>

            {/* Total Spent */}
            <div className="p-6 rounded-2xl border bg-card shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <CreditCard className="size-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-2xl font-bold mb-1">₱{totalSpent.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <Link href="/events/dashboard/bookings">
              <div className="group p-6 rounded-xl border bg-card hover:shadow-lg hover:border-amber-600 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-600 dark:group-hover:bg-blue-600 transition-colors">
                    <FileText className="size-6 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-semibold mb-1">My Bookings</h3>
                <p className="text-sm text-muted-foreground">View and manage your event bookings</p>
              </div>
            </Link>

            <Link href="/events/book">
              <div className="group p-6 rounded-xl border bg-card hover:shadow-lg hover:border-amber-600 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 group-hover:bg-amber-600 dark:group-hover:bg-amber-600 transition-colors">
                    <Calendar className="size-6 text-amber-600 dark:text-amber-400 group-hover:text-white transition-colors" />
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-semibold mb-1">Reserve a Venue</h3>
                <p className="text-sm text-muted-foreground">Book a venue for your event</p>
              </div>
            </Link>

            <div className="group p-6 rounded-xl border bg-card hover:shadow-lg hover:border-amber-600 transition-all cursor-pointer">
              <ReserveTableButton variant="card" />
            </div>

            <Link href="/events/menu">
              <div className="group p-6 rounded-xl border bg-card hover:shadow-lg hover:border-amber-600 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 group-hover:bg-green-600 dark:group-hover:bg-green-600 transition-colors">
                    <ShoppingBag className="size-6 text-green-600 dark:text-green-400 group-hover:text-white transition-colors" />
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-semibold mb-1">Order Online</h3>
                <p className="text-sm text-muted-foreground">Order food for delivery or pickup</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Bookings */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-0 lg:divide-x border rounded-xl overflow-hidden">
            {/* Event Bookings Column */}
            <div className="lg:pr-6 lg:pl-6 py-6">
              <div className="mb-6 pb-4 border-b-2 border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-bold flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <Calendar className="size-5" />
                  Venue Bookings
                </h3>
                {bookings && bookings.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
                  </p>
                )}
              </div>

              {bookings && bookings.length > 0 ? (
                <div className="space-y-3">
                  {bookings.slice(0, 3).map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/events/dashboard/bookings/${booking.id}`}
                      className="block p-4 rounded-lg border bg-card hover:shadow-md hover:border-blue-600 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-sm line-clamp-1">
                          {booking.event_name || `${booking.event_type} Event`}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                          booking.status === "confirmed" || booking.status === "paid"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            : booking.status === "pending"
                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                            : "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400"
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground mb-2">
                        <div>📅 {new Date(booking.event_date).toLocaleDateString()}</div>
                        <div>🏢 {booking.venue_name}</div>
                      </div>
                      <p className="text-sm font-bold text-blue-600">
                        ₱{Number(booking.total_amount).toLocaleString()}
                      </p>
                    </Link>
                  ))}
                  {bookings.length > 3 && (
                    <Link href="/events/dashboard/bookings" className="block">
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        View All ({bookings.length})
                        <ChevronRight className="size-3 ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-lg bg-muted/30">
                  <Calendar className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No bookings yet</p>
                </div>
              )}
            </div>

            {/* Table Reservations Column */}
            <div className="lg:px-6 py-6">
              <div className="mb-6 pb-4 border-b-2 border-orange-200 dark:border-orange-800">
                <h3 className="text-lg font-bold flex items-center gap-2 text-orange-600 dark:text-orange-400">
                  <UtensilsCrossed className="size-5" />
                  Table Booking
                </h3>
                {reservations && reservations.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {reservations.length} {reservations.length === 1 ? 'reservation' : 'reservations'}
                  </p>
                )}
              </div>

              {reservations && reservations.length > 0 ? (
                <div className="space-y-3">
                  {reservations.slice(0, 3).map((reservation) => {
                    const reservationDate = new Date(reservation.reservation_date)
                    const formatTime12Hour = (time24: string) => {
                      const [hours, minutes] = time24.split(':')
                      const hour = parseInt(hours)
                      const ampm = hour >= 12 ? 'PM' : 'AM'
                      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
                      return `${hour12}:${minutes} ${ampm}`
                    }
                    
                    return (
                      <div
                        key={reservation.id}
                        className="p-4 rounded-lg border bg-card hover:shadow-md hover:border-orange-600 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-sm">Table Reservation</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                            reservation.status === "confirmed"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                              : reservation.status === "pending"
                              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                              : reservation.status === "cancelled"
                              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                              : "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400"
                          }`}>
                            {reservation.status}
                          </span>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground mb-2">
                          <div>📅 {reservationDate.toLocaleDateString()}</div>
                          <div>🕐 {formatTime12Hour(reservation.reservation_time)}</div>
                          <div>👥 {reservation.num_guests} guests</div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {reservationDate >= new Date() && reservation.status !== "cancelled" 
                            ? "Upcoming" 
                            : "Past"}
                        </p>
                      </div>
                    )
                  })}
                  {reservations.length > 3 && (
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      View All ({reservations.length})
                      <ChevronRight className="size-3 ml-1" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-lg bg-muted/30">
                  <UtensilsCrossed className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-3">No reservations yet</p>
                  <ReserveTableButton variant="button" />
                </div>
              )}
            </div>

            {/* Online Orders Column */}
            <div className="lg:pl-6 lg:pr-6 py-6">
              <div className="mb-6 pb-4 border-b-2 border-amber-200 dark:border-amber-800">
                <h3 className="text-lg font-bold flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <ShoppingBag className="size-5" />
                  Order Online
                </h3>
                {orders && orders.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                  </p>
                )}
              </div>

              {orders && orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => {
                    const orderDate = new Date(order.created_at)
                    const itemCount = order.items?.length || 0
                    
                    return (
                      <Link
                        key={order.id}
                        href={`/events/orders/${order.id}`}
                        className="block p-4 rounded-lg border bg-card hover:shadow-md hover:border-amber-600 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-sm line-clamp-1">
                            Order #{order.order_number.split('-').pop()}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                            order.status === "completed"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                              : order.status === "pending" || order.status === "confirmed"
                              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                              : order.status === "cancelled"
                              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          }`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground mb-2">
                          <div>📅 {orderDate.toLocaleDateString()}</div>
                          <div>🍽️ {itemCount} {itemCount === 1 ? 'item' : 'items'}</div>
                          <div>{order.order_type === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}</div>
                        </div>
                        <p className="text-sm font-bold text-amber-600">
                          ₱{Number(order.total_amount).toLocaleString()}
                        </p>
                      </Link>
                    )
                  })}
                  {orders.length > 3 && (
                    <Link href="/events/menu" className="block">
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        View All ({orders.length})
                        <ChevronRight className="size-3 ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-lg bg-muted/30">
                  <ShoppingBag className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-3">No orders yet</p>
                  <Link href="/events/menu">
                    <Button variant="outline" size="sm" className="text-xs">
                      <ShoppingBag className="size-3 mr-2" />
                      Order Now
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
