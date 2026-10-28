import { getAllTableReservations, getTableReservationsStats } from "@/app/actions/manager-table-reservations"
import { Calendar, Clock, Users, Phone, Mail, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ReservationsList } from "./reservations-list"

export const metadata = {
  title: "Table Reservations - Manager",
  description: "Manage restaurant table reservations",
}

export default async function TableReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>
}) {
  const params = await searchParams
  const stats = await getTableReservationsStats()
  const { reservations, error } = await getAllTableReservations({
    status: params.status,
    search: params.search,
  })

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Link href="/manager">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Table Reservations</h1>
          <p className="text-muted-foreground">
            Manage all restaurant table bookings
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 rounded-lg border bg-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Calendar className="size-5 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Total Reservations</p>
          </div>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>

        <div className="p-6 rounded-lg border bg-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Clock className="size-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Today</p>
          </div>
          <p className="text-3xl font-bold">{stats.today}</p>
        </div>

        <div className="p-6 rounded-lg border bg-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Users className="size-5 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
          </div>
          <p className="text-3xl font-bold">{stats.upcoming}</p>
        </div>

        <div className="p-6 rounded-lg border bg-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Filter className="size-5 text-amber-600" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Pending</p>
          </div>
          <p className="text-3xl font-bold">{stats.pending}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            className="pl-10"
            defaultValue={params.search}
          />
        </div>
        <div className="flex gap-2">
          <Link href="/manager/table-reservations">
            <Button variant={!params.status || params.status === "all" ? "default" : "outline"}>
              All
            </Button>
          </Link>
          <Link href="/manager/table-reservations?status=pending">
            <Button variant={params.status === "pending" ? "default" : "outline"}>
              Pending
            </Button>
          </Link>
          <Link href="/manager/table-reservations?status=confirmed">
            <Button variant={params.status === "confirmed" ? "default" : "outline"}>
              Confirmed
            </Button>
          </Link>
          <Link href="/manager/table-reservations?status=completed">
            <Button variant={params.status === "completed" ? "default" : "outline"}>
              Completed
            </Button>
          </Link>
        </div>
      </div>

      {/* Reservations List */}
      <ReservationsList reservations={reservations} />
    </div>
  )
}
