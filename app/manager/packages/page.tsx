import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Package, DollarSign, TrendingUp, Plus, RefreshCw, Download } from "lucide-react"
import { PackagesTable } from "@/components/manager/packages-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function PackagesPage() {
  const supabase = await createClient()

  // Fetch event packages
  const { data: packages, error } = await supabase
    .from("event_packages")
    .select("*")
    .order("created_at", { ascending: false })

  // Calculate stats
  const totalPackages = packages?.length || 0
  const activePackages = packages?.filter(p => p.is_active)?.length || 0
  const avgPrice = packages?.length
    ? (packages.reduce((sum, p) => sum + Number(p.base_price), 0) / packages.length)
    : 0

  return (
    <div className="space-y-6 bg-white dark:bg-zinc-950">
      <PageHeader
        title="Event Packages"
        description="Manage event packages and pricing"
        crumbs={[{ label: "Lydia's Lechon" }, { label: "Manager" }, { label: "Packages" }]}
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
              <Link href="/manager/packages/new">
                <Plus className="mr-2 size-4" />
                Add Package
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard 
          label="Total Packages" 
          value={totalPackages.toString()} 
          icon={Package} 
          accent="blue" 
          subtitle="all packages" 
        />
        <StatCard 
          label="Active Packages" 
          value={activePackages.toString()} 
          icon={TrendingUp} 
          accent="emerald" 
          subtitle="available now" 
        />
        <StatCard 
          label="Average Price" 
          value={`₱${avgPrice.toLocaleString()}`} 
          icon={DollarSign} 
          accent="purple" 
          subtitle="per package" 
        />
      </div>

      <Card className="transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-semibold">All Packages</CardTitle>
            <CardDescription className="mt-1">{totalPackages} {totalPackages === 1 ? 'package' : 'packages'} total</CardDescription>
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
              icon={<Package className="size-8" />} 
              title="Error loading packages" 
              description={error.message} 
            />
          ) : packages && packages.length > 0 ? (
            <PackagesTable packages={packages} />
          ) : (
            <EmptyState
              icon={<Package className="size-8" />}
              title="No packages yet"
              description="Add your first event package to get started"
              action={
                <Button asChild>
                  <Link href="/manager/packages/new">
                    <Plus className="mr-2 size-4" />
                    Add Package
                  </Link>
                </Button>
              }
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
