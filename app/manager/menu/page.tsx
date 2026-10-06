import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { UtensilsCrossed, DollarSign, Package, Plus, RefreshCw, Download } from "lucide-react"
import { MenuItemsTable } from "@/components/manager/menu-items-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function MenuItemsPage() {
  const supabase = await createClient()

  // Fetch menu items from event_packages (since event_menu_items doesn't exist)
  const { data: menuItems, error } = await supabase
    .from("event_packages")
    .select("*")
    .order("created_at", { ascending: false })

  // Calculate stats
  const totalItems = menuItems?.length || 0
  const activeItems = menuItems?.filter(m => m.is_active)?.length || 0
  const avgPrice = menuItems?.length
    ? (menuItems.reduce((sum, m) => sum + Number(m.base_price), 0) / menuItems.length)
    : 0

  return (
    <div className="space-y-6 bg-white dark:bg-zinc-950">
      <PageHeader
        title="Menu Items"
        description="Manage event menu items and packages"
        crumbs={[{ label: "Lydia's Lechon" }, { label: "Manager" }, { label: "Menu" }]}
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
              <Link href="/manager/menu/new">
                <Plus className="mr-2 size-4" />
                Add New Item
              </Link>
            </Button>
          </>
        }
      />

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total Menu Items"
          value={totalItems.toString()}
          icon={UtensilsCrossed}
          accent="blue"
          subtitle="all items"
        />
        <StatCard
          label="Active Items"
          value={activeItems.toString()}
          icon={Package}
          accent="emerald"
          subtitle="currently available"
        />
        <StatCard
          label="Average Price"
          value={`₱${avgPrice.toLocaleString()}`}
          icon={DollarSign}
          accent="purple"
          subtitle="per item"
        />
      </div>

      {/* Menu Items Table */}
      <Card className="transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-semibold">All Menu Items</CardTitle>
            <CardDescription className="mt-1">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} total
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
          {error ? (
            <EmptyState
              icon={<UtensilsCrossed className="size-8" />}
              title="Error loading menu items"
              description={error.message}
            />
          ) : menuItems && menuItems.length > 0 ? (
            <MenuItemsTable items={menuItems} />
          ) : (
            <EmptyState
              icon={<UtensilsCrossed className="size-8" />}
              title="No menu items yet"
              description="Add your first menu item to get started"
              action={
                <Button asChild>
                  <Link href="/manager/menu/new">
                    <Plus className="mr-2 size-4" />
                    Add Menu Item
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
