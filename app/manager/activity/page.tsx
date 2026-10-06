import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileText, Activity, Clock, RefreshCw, Download } from "lucide-react"
import { ActivityLogTable } from "@/components/manager/activity-log-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function ActivityLogPage() {
  const supabase = await createClient()

  // Fetch activity logs
  const { data: logs, error } = await supabase
    .from("content_updates_log")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(100)

  // Calculate stats
  const totalLogs = logs?.length || 0
  const todayLogs = logs?.filter(l => {
    const today = new Date().toDateString()
    const logDate = new Date(l.created_at).toDateString()
    return today === logDate
  })?.length || 0

  const recentActivity = logs?.[0]
    ? new Date(logs[0].created_at).toLocaleString()
    : "No activity"

  return (
    <div className="space-y-6 bg-white dark:bg-zinc-950">
      <PageHeader
        title="Activity Log"
        description="View all content updates and changes"
        crumbs={[{ label: "Lydia's Lechon" }, { label: "Manager" }, { label: "Activity" }]}
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
          label="Total Activities" 
          value={totalLogs.toString()} 
          icon={Activity} 
          accent="blue" 
          subtitle="all time" 
        />
        <StatCard 
          label="Today's Activities" 
          value={todayLogs.toString()} 
          icon={Clock} 
          accent="emerald" 
          subtitle="last 24 hours" 
        />
        <StatCard 
          label="Last Activity" 
          value={recentActivity} 
          icon={FileText} 
          accent="purple" 
          subtitle="most recent" 
        />
      </div>

      <Card className="transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-semibold">Recent Activities</CardTitle>
            <CardDescription className="mt-1">Last {Math.min(100, totalLogs)} activities</CardDescription>
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
              icon={<Activity className="size-8" />} 
              title="Error loading activity" 
              description={error.message} 
            />
          ) : logs && logs.length > 0 ? (
            <ActivityLogTable logs={logs} />
          ) : (
            <EmptyState
              icon={<Activity className="size-8" />}
              title="No activity yet"
              description="Activity logs will appear here as actions are performed"
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
