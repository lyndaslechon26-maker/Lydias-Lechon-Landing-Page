import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Star, MessageSquare, CheckCircle, XCircle, RefreshCw, Download } from "lucide-react"
import { ReviewsTable } from "@/components/manager/reviews-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const statusFilter = params.status as string | undefined

  const supabase = await createClient()

  // Fetch reviews
  let query = supabase
    .from("customer_reviews")
    .select("*")
    .order("created_at", { ascending: false })

  if (statusFilter) {
    query = query.eq("status", statusFilter)
  }

  const { data: reviews, error } = await query

  // Calculate stats
  const totalReviews = reviews?.length || 0
  const pendingReviews = reviews?.filter(r => r.status === 'pending')?.length || 0
  const approvedReviews = reviews?.filter(r => r.status === 'approved')?.length || 0
  const avgRating = reviews?.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0"

  return (
    <div className="space-y-6 bg-white dark:bg-zinc-950">
      <PageHeader
        title="Customer Reviews"
        description="Manage and moderate customer feedback"
        crumbs={[{ label: "Lydia's Lechon" }, { label: "Manager" }, { label: "Reviews" }]}
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard 
          label="Total Reviews" 
          value={totalReviews.toString()} 
          icon={MessageSquare} 
          accent="blue" 
          subtitle="all feedback" 
        />
        <StatCard 
          label="Average Rating" 
          value={avgRating} 
          icon={Star} 
          accent="amber" 
          subtitle="out of 5.0" 
        />
        <StatCard 
          label="Pending" 
          value={pendingReviews.toString()} 
          icon={XCircle} 
          accent="rose" 
          subtitle="awaiting review" 
        />
        <StatCard 
          label="Approved" 
          value={approvedReviews.toString()} 
          icon={CheckCircle} 
          accent="emerald" 
          subtitle="published" 
        />
      </div>

      <Card className="transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-semibold">All Reviews</CardTitle>
            <CardDescription className="mt-1">{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'} total</CardDescription>
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
              icon={<MessageSquare className="size-8" />} 
              title="Error loading reviews" 
              description={error.message} 
            />
          ) : reviews && reviews.length > 0 ? (
            <ReviewsTable reviews={reviews} />
          ) : (
            <EmptyState
              icon={<MessageSquare className="size-8" />}
              title="No reviews yet"
              description="Customer reviews will appear here"
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
