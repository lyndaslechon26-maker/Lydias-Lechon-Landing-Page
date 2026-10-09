import { Skeleton } from "@/components/ui/skeleton"
import { PageHeaderSkeleton, CardSkeleton } from "@/components/skeleton-loader"

export default function Loading() {
  return (
    <div className="space-y-6 bg-white dark:bg-zinc-950">
      <PageHeaderSkeleton />
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
