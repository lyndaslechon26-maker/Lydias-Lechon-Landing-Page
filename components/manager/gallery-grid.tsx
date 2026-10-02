'use client'

interface GalleryImage {
  id: string
  url: string
  title?: string
  description?: string
  created_at: string
}

interface GalleryGridProps {
  images?: GalleryImage[]
}

export function GalleryGrid({ images = [] }: GalleryGridProps) {
  if (images.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        No gallery images yet
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.id} className="rounded-md border overflow-hidden group">
          <div className="aspect-square relative">
            <img
              src={image.url}
              alt={image.title || 'Gallery image'}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform"
            />
          </div>
          {image.title && (
            <div className="p-2">
              <p className="text-sm font-medium">{image.title}</p>
              {image.description && (
                <p className="text-xs text-muted-foreground">{image.description}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
