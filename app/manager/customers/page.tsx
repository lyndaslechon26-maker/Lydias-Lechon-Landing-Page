import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, UserCheck, TrendingUp, Plus, RefreshCw, Download } from "lucide-react"
import { CustomersTable } from "@/components/manager/customers-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function CustomersPage() {
  const supabase = await createClient()

  // Fetch all customers
  const { data: customers, error } = await supabase
    .from("event_customers")
    .select("*")
    .order("created_at", { ascending: false })

  // Calculate stats
  const totalCustomers = customers?.length || 0
  const activeCustomers = customers?.filter(c => c.is_active)?.length || 0

  return (
    <div className="space-y-6 bg-white dark:bg-zinc-950">
      <PageHeader
        title="Customers"
        description="View and manage customer accounts"
        crumbs={[{ label: "Lydia's Lechon" }, { label: "Manager" }, { label: "Customers" }]}
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
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard 
          label="Total Customers" 
          value={totalCustomers.toString()} 
          icon={Users} 
          accent="blue" 
          subtitle="all registered" 
        />
        <StatCard 
          label="Active Customers" 
          value={activeCustomers.toString()} 
          icon={UserCheck} 
          accent="emerald" 
          subtitle="currently active" 
        />
        <StatCard 
          label="Growth Rate" 
          value="0%" 
          icon={TrendingUp} 
          accent="purple" 
          subtitle="this month" 
        />
      </div>

      <Card className="transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base font-semibold">All Customers</CardTitle>
            <CardDescription className="mt-1">{totalCustomers} {totalCustomers === 1 ? 'customer' : 'customers'} total</CardDescription>
          </div>
          <Badge variant="outline" className="gap-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Live
          </Badge>
        </CardHeader>
        <CardContent className="pt-6">
          {error ? (
            <EmptyState 
              icon={<Users className="size-8" />} 
              title="Error loading customers" 
              description={error.message} 
            />
          ) : customers && customers.length > 0 ? (
            <CustomersTable customers={customers} />
          ) : (
            <EmptyState
              icon={<Users className="size-8" />}
              title="No customers yet"
              description="Customers will appear here as they register"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function EmptyState({ 
  icon, 
  title, 
  description, 
  action 
}: { 
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
