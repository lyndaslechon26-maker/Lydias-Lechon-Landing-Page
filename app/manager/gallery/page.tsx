import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Image as ImageIcon, FolderOpen, TrendingUp, Plus, RefreshCw, Download, Upload } from "lucide-react"
import { GalleryGrid } from "@/components/manager/gallery-grid"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function GalleryPage() {
  const supabase = await createClient()

  // Fetch gallery images
  const { data: gallery, error } = await supabase
    .from("event_gallery")
    .select("*")
    .order("created_at", { ascending: false })

  // Calculate stats
  const totalImages = gallery?.length || 0
  const activeImages = gallery?.filter(g => g.is_active)?.length || 0
  const categories = [...new Set(gallery?.map(g => g.category) || [])].length

  return (
    <div className="space-y-6 bg-white dark:bg-zinc-950">
      <PageHeader
        title="Gallery"
        description="Manage event photos and gallery images"
        crumbs={[{ label: "Lydia's Lechon" }, { label: "Manager" }, { label: "Gallery" }]}
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
              <Link href="/manager/gallery/upload">
                <Upload className="mr-2 size-4" />
                Upload Images
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard 
          label="Total Images" 
          value={totalImages.toString()} 
          icon={ImageIcon} 
          accent="blue" 
          subtitle="all photos" 
        />
        <StatCard 
          label="Active Images" 
          value={activeImages.toString()} 
          icon={TrendingUp} 
          accent="emerald" 
          subtitle="displayed" 
        />
        <StatCard 
          label="Categories" 
          value={categories.toString()} 
          icon={FolderOpen} 
          accent="purple" 
          subtitle="collections" 
        />
      </div>

      <Card className="transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base font-semibold">All Images</CardTitle>
            <CardDescription className="mt-1">{totalImages} {totalImages === 1 ? 'image' : 'images'} total</CardDescription>
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
              icon={<ImageIcon className="size-8" />} 
              title="Error loading images" 
              description={error.message} 
            />
          ) : gallery && gallery.length > 0 ? (
            <GalleryGrid images={gallery} />
          ) : (
            <EmptyState
              icon={<ImageIcon className="size-8" />}
              title="No images yet"
              description="Upload your first image to get started"
              action={
                <Button asChild>
                  <Link href="/manager/gallery/upload">
                    <Upload className="mr-2 size-4" />
                    Upload Images
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
